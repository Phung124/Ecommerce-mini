package com.example.ecommerce.service;

import com.example.ecommerce.payload.request.ProductRequest;
import com.example.ecommerce.payload.response.PageResponse;
import com.example.ecommerce.payload.response.ProductDTO;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    PageResponse<ProductDTO> getAllProducts(int page, int size, String sortBy, String sortDir,
                                           String name, Long categoryId, Double minPrice, Double maxPrice);
    Optional<ProductDTO> getProductById(Long id);
    void createProduct(ProductRequest productRequest);
    void createProductany(List<ProductRequest> productRequest);
    boolean updateProduct(Long id, ProductRequest productRequest);
    boolean deleteProduct(Long id);
}
