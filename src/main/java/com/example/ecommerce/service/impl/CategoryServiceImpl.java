package com.example.ecommerce.service.impl;

import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.payload.request.CategoryRequest;
import com.example.ecommerce.payload.response.CategoryResponse;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> modelMapper.map(category, CategoryResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return modelMapper.map(category, CategoryResponse.class);
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        if (categoryRepository.findByName(categoryRequest.getName()).isPresent()) {
            throw new RuntimeException("Category name already exists!");
        }
        Category category = modelMapper.map(categoryRequest, Category.class);
        return modelMapper.map(categoryRepository.save(category), CategoryResponse.class);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());

        return modelMapper.map(categoryRepository.save(category), CategoryResponse.class);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Ở đây ta sẽ gán category_id của các sản phẩm này về null (Uncategorized)
        List<Product> products = productRepository.findAll().stream()
                .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(id))
                .collect(Collectors.toList());

        for (Product product : products) {
            product.setCategory(null);
        }
        productRepository.saveAll(products);

        categoryRepository.delete(category);
    }
}
