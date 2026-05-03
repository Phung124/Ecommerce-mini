package com.example.ecommerce.service.impl;

import com.example.ecommerce.model.*;
import com.example.ecommerce.payload.request.OrderRequest;
import com.example.ecommerce.payload.response.OrderItemResponse;
import com.example.ecommerce.payload.response.OrderResponse;
import com.example.ecommerce.payload.response.PageResponse;
import com.example.ecommerce.repository.*;
import com.example.ecommerce.service.EmailService;
import com.example.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    @Override
    public PageResponse<OrderResponse> getMyOrders(boolean isAdmin, Long userId, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Order> orders = isAdmin ? orderRepository.findAll(pageable)
                : orderRepository.findByUserId(userId, pageable);

        List<OrderResponse> content = orders.stream().map(this::toOrderResponse).collect(Collectors.toList());

        PageResponse<OrderResponse> response = new PageResponse<>();
        response.setContent(content);
        response.setPageNumber(orders.getNumber());
        response.setPageSize(orders.getSize());
        response.setTotalElements(orders.getTotalElements());
        response.setTotalPages(orders.getTotalPages());
        response.setLast(orders.isLast());

        return response;
    }

    private OrderResponse toOrderResponse(Order order) {
        OrderResponse dto = modelMapper.map(order, OrderResponse.class);
        List<OrderItemResponse> items = order.getItems().stream().map(item -> {
            OrderItemResponse i = new OrderItemResponse();
            i.setProductId(item.getProduct().getId());
            i.setProductName(item.getProduct().getName());
            i.setQuantity(item.getQuantity());
            i.setPrice(item.getPrice());
            return i;
        }).collect(Collectors.toList());
        dto.setItems(items);
        dto.setStatus(order.getStatus().name());
        return dto;
    }

    @Override
    public void placeOrder(OrderRequest orderRequest, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        // 1. Lấy Giỏ hàng
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        // 2. Xử lý Địa chỉ giao hàng
        handleShippingAddress(order, orderRequest, userId);

        // 3. Xử lý Items và Kiểm tra tồn kho (Lần 2)
        List<OrderItem> orderItems = new ArrayList<>();
        double totalPrice = 0.0;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            // Re-check stock right before saving order
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Product " + product.getName() + " is out of stock!");
            }

            // Trừ kho
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            totalPrice += product.getPrice() * cartItem.getQuantity();
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        
        // 4. Lưu đơn hàng
        orderRepository.save(order);

        // 5. Gửi Email thông báo (Bất đồng bộ)
        emailService.sendOrderReceipt(order, user.getEmail());

        // 6. Làm sạch giỏ hàng
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private void handleShippingAddress(Order order, OrderRequest request, Long userId) {
        if (request.getAddressId() != null) {
            // Dùng địa chỉ đã lưu
            Address address = addressRepository.findById(request.getAddressId())
                    .filter(a -> a.getUser().getId().equals(userId))
                    .orElseThrow(() -> new RuntimeException("Address not found or unauthorized"));
            
            order.setShippingStreet(address.getStreet());
            order.setShippingCity(address.getCity());
            order.setShippingState(address.getState());
            order.setShippingZipCode(address.getZipCode());
            order.setShippingPhoneNumber(address.getPhoneNumber());
        } else {
            // Dùng địa chỉ nhập tay (vãng lai)
            if (request.getShippingStreet() == null || request.getShippingStreet().isBlank()) {
                throw new RuntimeException("Shipping address is required!");
            }
            order.setShippingStreet(request.getShippingStreet());
            order.setShippingCity(request.getShippingCity());
            order.setShippingState(request.getShippingState());
            order.setShippingZipCode(request.getShippingZipCode());
            order.setShippingPhoneNumber(request.getShippingPhoneNumber());
        }
    }

    @Override
    public boolean updateOrderStatus(Long id, OrderStatus status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            orderRepository.save(order);
            return true;
        }).orElse(false);
    }
}
