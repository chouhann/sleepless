package com.sleepless.controller;

import com.sleepless.dto.OrderRequest;
import com.sleepless.model.CartItem;
import com.sleepless.model.Order;
import com.sleepless.repository.CartItemRepository;
import com.sleepless.repository.OrderRepository;
import com.sleepless.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Order> orders = orderRepository.findByUserId(userPrincipal.getId());
        // Reverse chronological order
        orders.sort((o1, o2) -> o2.getId().compareTo(o1.getId()));
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> placeOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OrderRequest orderRequest) {

        List<CartItem> cartItems = cartItemRepository.findByUserId(userPrincipal.getId());
        Map<String, String> response = new HashMap<>();

        if (cartItems.isEmpty()) {
            response.put("message", "Your cart is empty!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Aggregate product details and calculate total price
        int totalPrice = 0;
        List<String> productStrings = new ArrayList<>();
        for (CartItem item : cartItems) {
            productStrings.add(item.getName() + " (" + item.getQuantity() + ")");
            totalPrice += item.getPrice() * item.getQuantity();
        }

        String totalProducts = String.join(", ", productStrings);

        // Concatenate address details
        String address = "flat no. " + orderRequest.getFlat() + ", "
                + orderRequest.getStreet() + ", "
                + orderRequest.getCity() + ", "
                + orderRequest.getState() + " - "
                + orderRequest.getPinCode();

        // Format dates as dd-MMM-yyyy (e.g. 19-Jun-2026)
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);
        String placedOn = dateFormat.format(new Date());

        // Check if exact order was already placed to prevent duplicate submissions
        List<Order> existingOrders = orderRepository.findByUserId(userPrincipal.getId());
        boolean isDuplicate = false;
        for (Order order : existingOrders) {
            if (order.getName().equalsIgnoreCase(orderRequest.getName())
                    && order.getNumber().equals(orderRequest.getNumber())
                    && order.getEmail().equalsIgnoreCase(orderRequest.getEmail())
                    && order.getMethod().equalsIgnoreCase(orderRequest.getMethod())
                    && order.getAddress().equalsIgnoreCase(address)
                    && order.getTotalProducts().equalsIgnoreCase(totalProducts)
                    && order.getTotalPrice().equals(totalPrice)) {
                isDuplicate = true;
                break;
            }
        }

        if (isDuplicate) {
            response.put("message", "Order already placed!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Order order = new Order(
                userPrincipal.getId(),
                orderRequest.getName(),
                orderRequest.getNumber(),
                orderRequest.getEmail(),
                orderRequest.getMethod(),
                address,
                totalProducts,
                totalPrice,
                placedOn
        );

        orderRepository.save(order);

        // Clear cart
        cartItemRepository.deleteByUserId(userPrincipal.getId());

        response.put("message", "Order placed successfully!");
        return ResponseEntity.ok(response);
    }
}
