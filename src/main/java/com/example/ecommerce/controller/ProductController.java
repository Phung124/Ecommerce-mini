package com.example.ecommerce.controller;

import com.example.ecommerce.payload.request.ProductRequest;
import com.example.ecommerce.payload.response.MessageResponse;
import com.example.ecommerce.payload.response.PageResponse;
import com.example.ecommerce.payload.response.ProductDTO;
import com.example.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<PageResponse<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return ResponseEntity.ok(productService.getAllProducts(page, size, sortBy, sortDir, name, categoryId, minPrice, maxPrice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest productRequests) {
        productService.createProduct(productRequests);
        return ResponseEntity.ok(new MessageResponse("Product created successfully!"));
    }
    @PostMapping("/bulk-create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProductany(@Valid @RequestBody List<ProductRequest> productRequest) {
        productService.createProductany(productRequest);
        return ResponseEntity.ok(new MessageResponse("Products created successfully!"));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest productRequest) {
        boolean updated = productService.updateProduct(id, productRequest);
        if (updated) {
            return ResponseEntity.ok(new MessageResponse("Product updated successfully!"));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            return ResponseEntity.ok(new MessageResponse("Product deleted successfully!"));
        }
        return ResponseEntity.notFound().build();
    }
}
