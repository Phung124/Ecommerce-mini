package com.example.ecommerce.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        // ----- OrderItem -> OrderItemResponse -----
        mapper.addMappings(new org.modelmapper.PropertyMap<com.example.ecommerce.model.OrderItem, com.example.ecommerce.payload.response.OrderItemResponse>() {
            @Override
            protected void configure() {
                map().setProductId(source.getProduct().getId());
                map().setProductName(source.getProduct().getName());
            }
        });

        // ----- Product -> ProductDTO -----
        mapper.addMappings(new org.modelmapper.PropertyMap<com.example.ecommerce.model.Product, com.example.ecommerce.payload.response.ProductDTO>() {
            @Override
            protected void configure() {
                map().setCategoryId(source.getCategory().getId());
                map().setCategoryName(source.getCategory().getName());
            }
        });

        return mapper;
    }
}
