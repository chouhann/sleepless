package com.sleepless.controller;

import com.sleepless.dto.CartItemRequest;
import com.sleepless.model.CartItem;
import com.sleepless.repository.CartItemRepository;
import com.sleepless.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<CartItem> items = cartItemRepository.findByUserId(userPrincipal.getId());
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CartItemRequest cartItemRequest) {

        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndName(
                userPrincipal.getId(), cartItemRequest.getName());

        Map<String, String> response = new HashMap<>();

        if (existingItem.isPresent()) {
            response.put("message", "Already added to cart!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        CartItem cartItem = new CartItem(
                userPrincipal.getId(),
                cartItemRequest.getName(),
                cartItemRequest.getPrice(),
                cartItemRequest.getQuantity(),
                cartItemRequest.getImage()
        );

        cartItemRepository.save(cartItem);
        response.put("message", "Product added to cart!");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("quantity") Integer quantity) {

        return cartItemRepository.findById(id)
                .map(item -> {
                    if (!item.getUserId().equals(userPrincipal.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }
                    item.setQuantity(quantity);
                    cartItemRepository.save(item);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Cart quantity updated!");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartItem(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        return cartItemRepository.findById(id)
                .map(item -> {
                    if (!item.getUserId().equals(userPrincipal.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }
                    cartItemRepository.delete(item);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Item removed from cart!");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        cartItemRepository.deleteByUserId(userPrincipal.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart cleared successfully!");
        return ResponseEntity.ok(response);
    }
}
