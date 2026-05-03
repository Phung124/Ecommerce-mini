package com.example.ecommerce.service.impl;

import com.example.ecommerce.model.Address;
import com.example.ecommerce.model.User;
import com.example.ecommerce.payload.request.AddressRequest;
import com.example.ecommerce.payload.response.AddressResponse;
import com.example.ecommerce.repository.AddressRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<AddressResponse> getMyAddresses(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(address -> modelMapper.map(address, AddressResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse addAddress(AddressRequest addressRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = modelMapper.map(addressRequest, Address.class);
        address.setUser(user);

        // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ cũ
        if (address.isDefault()) {
            resetDefaultAddress(userId);
        }

        return modelMapper.map(addressRepository.save(address), AddressResponse.class);
    }

    @Override
    public AddressResponse updateAddress(Long id, AddressRequest addressRequest, Long userId) {
        Address address = addressRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Address not found or unauthorized"));

        if (addressRequest.isDefault() && !address.isDefault()) {
            resetDefaultAddress(userId);
        }

        address.setStreet(addressRequest.getStreet());
        address.setCity(addressRequest.getCity());
        address.setState(addressRequest.getState());
        address.setZipCode(addressRequest.getZipCode());
        address.setPhoneNumber(addressRequest.getPhoneNumber());
        address.setDefault(addressRequest.isDefault());

        return modelMapper.map(addressRepository.save(address), AddressResponse.class);
    }

    @Override
    public void deleteAddress(Long id, Long userId) {
        Address address = addressRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Address not found or unauthorized"));

        addressRepository.delete(address);
    }

    private void resetDefaultAddress(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        for (Address a : addresses) {
            if (a.isDefault()) {
                a.setDefault(false);
                addressRepository.save(a);
            }
        }
    }
}
