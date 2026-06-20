package com.sleepless.controller;

import com.sleepless.model.Product;
import com.sleepless.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "limit", required = false) Integer limit) {

        List<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(search.trim());
        } else {
            products = productRepository.findAll();
        }

        // Apply reverse chronological order by default (latest added first)
        List<Product> sortedProducts = products.stream()
                .sorted((p1, p2) -> p2.getId().compareTo(p1.getId()))
                .collect(Collectors.toList());

        if (limit != null && limit > 0 && limit < sortedProducts.size()) {
            sortedProducts = sortedProducts.subList(0, limit);
        }

        return ResponseEntity.ok(sortedProducts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
