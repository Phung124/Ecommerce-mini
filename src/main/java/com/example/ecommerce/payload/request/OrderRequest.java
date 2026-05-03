package com.example.ecommerce.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
    // Nếu có addressId thì dùng địa chỉ lưu sẵn
    private Long addressId;

    // Nếu không có addressId thì dùng thông tin nhập tay (vãng lai)
    private String shippingStreet;
    private String shippingCity;
    private String shippingState;
    private String shippingZipCode;
    private String shippingPhoneNumber;
}
