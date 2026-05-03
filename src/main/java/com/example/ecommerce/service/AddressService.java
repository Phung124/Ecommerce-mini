package com.example.ecommerce.service;

import com.example.ecommerce.payload.request.AddressRequest;
import com.example.ecommerce.payload.response.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getMyAddresses(Long userId);
    AddressResponse addAddress(AddressRequest addressRequest, Long userId);
    AddressResponse updateAddress(Long id, AddressRequest addressRequest, Long userId);
    void deleteAddress(Long id, Long userId);
}
