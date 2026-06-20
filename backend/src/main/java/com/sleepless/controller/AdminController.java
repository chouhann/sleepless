package com.sleepless.controller;

import com.sleepless.dto.DashboardSummary;
import com.sleepless.model.Message;
import com.sleepless.model.Order;
import com.sleepless.model.Product;
import com.sleepless.model.User;
import com.sleepless.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Value("${sleepless.upload-dir}")
    private String uploadDir;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummary> getDashboardSummary() {
        // 1. Calculate pending order prices
        List<Order> pendingOrders = orderRepository.findByPaymentStatus("pending");
        int totalPendings = pendingOrders.stream().mapToInt(Order::getTotalPrice).sum();

        // 2. Calculate completed order prices (total income)
        List<Order> completedOrders = orderRepository.findByPaymentStatus("completed");
        int totalIncome = completedOrders.stream().mapToInt(Order::getTotalPrice).sum();

        // 3. Counter metrics
        long orderPlaced = orderRepository.count();
        long dishesAdded = productRepository.count();
        long users = userRepository.countByUserType("user");
        long admins = userRepository.countByUserType("admin");
        long totalAccounts = userRepository.count();
        long newMessages = messageRepository.count();

        DashboardSummary summary = new DashboardSummary(
                totalPendings,
                totalIncome,
                orderPlaced,
                dishesAdded,
                users,
                admins,
                totalAccounts,
                newMessages
        );

        return ResponseEntity.ok(summary);
    }

    // --- PRODUCT MANAGEMENT ---

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Integer price,
            @RequestParam("image") MultipartFile file) {

        Map<String, String> response = new HashMap<>();

        if (productRepository.existsByName(name)) {
            response.put("message", "Dish name already added");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            String filename = saveImage(file);
            Product product = new Product(name, price, filename);
            productRepository.save(product);

            response.put("message", "Dish added successfully!");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("message", "Could not upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") Integer price,
            @RequestParam(value = "image", required = false) MultipartFile file) {

        Map<String, String> response = new HashMap<>();

        return productRepository.findById(id)
                .map(product -> {
                    product.setName(name);
                    product.setPrice(price);

                    if (file != null && !file.isEmpty()) {
                        try {
                            String oldFilename = product.getImage();
                            String newFilename = saveImage(file);
                            product.setImage(newFilename);
                            deleteImageFile(oldFilename);
                        } catch (IOException e) {
                            response.put("message", "Could not upload new image: " + e.getMessage());
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                        }
                    }

                    productRepository.save(product);
                    response.put("message", "Dish updated successfully!");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();

        return productRepository.findById(id)
                .map(product -> {
                    deleteImageFile(product.getImage());
                    productRepository.delete(product);
                    response.put("message", "Dish deleted successfully!");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- ORDER MANAGEMENT ---

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        // Sort reverse chronological
        orders.sort((o1, o2) -> o2.getId().compareTo(o1.getId()));
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{id}/payment")
    public ResponseEntity<?> updateOrderPaymentStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {

        return orderRepository.findById(id)
                .map(order -> {
                    order.setPaymentStatus(status);
                    orderRepository.save(order);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Payment status has been updated!");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(order -> {
                    orderRepository.delete(order);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Order deleted successfully!");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- USER MANAGEMENT ---

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "User deleted successfully!");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- MESSAGE MANAGEMENT ---

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageRepository.findAll();
        // Sort reverse chronological
        messages.sort((m1, m2) -> m2.getId().compareTo(m1.getId()));
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        return messageRepository.findById(id)
                .map(message -> {
                    messageRepository.delete(message);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Message deleted successfully!");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- FILE UTILS ---

    private String saveImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }
        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        // Unique key using timestamp + random
        String filename = System.currentTimeMillis() + "_" + (int) (Math.random() * 1000) + extension;
        Path targetPath = Paths.get(uploadDir).resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }

    private void deleteImageFile(String filename) {
        if (filename == null || filename.isEmpty()) return;
        try {
            Path targetPath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            // Ignore error deleting old file
        }
    }
}
