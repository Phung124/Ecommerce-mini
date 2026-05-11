package com.example.ecommerce.service.impl;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.payload.request.ProductRequest;
import com.example.ecommerce.payload.response.PageResponse;
import com.example.ecommerce.payload.response.ProductDTO;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.service.ProductService;
import org.modelmapper.ModelMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public PageResponse<ProductDTO> getAllProducts(int page, int size, String sortBy, String sortDir,
                                                  String name, Long categoryId, Double minPrice, Double maxPrice) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> products = productRepository.findWithFilters(name, categoryId, minPrice, maxPrice, pageable);
        
        List<ProductDTO> content = products.getContent().stream()
                .map(product -> {
                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
                    if (product.getCategory() != null) {
                        dto.setCategoryId(product.getCategory().getId());
                        dto.setCategoryName(product.getCategory().getName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        PageResponse<ProductDTO> response = new PageResponse<>();
        response.setContent(content);
        response.setPageNumber(products.getNumber());
        response.setPageSize(products.getSize());
        response.setTotalElements(products.getTotalElements());
        response.setTotalPages(products.getTotalPages());
        response.setLast(products.isLast());

        return response;
    }

    @Override
    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
                    if (product.getCategory() != null) {
                        dto.setCategoryId(product.getCategory().getId());
                        dto.setCategoryName(product.getCategory().getName());
                    }
                    return dto;
                });
    }

    @Override
    public void createProduct(ProductRequest productRequest) {
        Product product = modelMapper.map(productRequest, Product.class);
        product.setId(null); // Đảm bảo luôn tạo mới, không nhầm thành cập nhật
        if (productRequest.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found")));
        }
        productRepository.save(product);
    }
    @Override
    public void createProductany(List<ProductRequest> productRequest) {
       List<Product> products = productRequest.stream().map(req -> {
           Product p = modelMapper.map(req, Product.class);
           p.setId(null);
           if (req.getCategoryId() != null) {
               p.setCategory(categoryRepository.findById(req.getCategoryId()).orElse(null));
           }
           return p;
       }).toList();
       productRepository.saveAll(products);
    }
    @Override
    public boolean updateProduct(Long id, ProductRequest productRequest) {
        return productRepository.findById(id).map(product -> {
            product.setName(productRequest.getName());
            product.setDescription(productRequest.getDescription());
            product.setPrice(productRequest.getPrice());
            product.setStock(productRequest.getStock());
            product.setImageUrl(productRequest.getImageUrl());
            
            if (productRequest.getCategoryId() != null) {
                product.setCategory(categoryRepository.findById(productRequest.getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Category not found")));
            }
            
            productRepository.save(product);
            return true;
        }).orElse(false);
    }

    @Override
    public boolean deleteProduct(Long id) {
        return productRepository.findById(id).map(product -> {
            productRepository.delete(product);
            return true;
        }).orElse(false);
    }
}
