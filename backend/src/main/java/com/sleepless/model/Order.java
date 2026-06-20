package com.sleepless.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 12)
    private String number;

    @NotBlank
    @Size(max = 100)
    private String email;

    @NotBlank
    @Size(max = 50)
    private String method;

    @NotBlank
    @Size(max = 500)
    private String address;

    @NotBlank
    @Size(max = 1000)
    @Column(name = "total_products")
    private String totalProducts;

    @NotNull
    @Column(name = "total_price")
    private Integer totalPrice;

    @NotBlank
    @Size(max = 50)
    @Column(name = "placed_on")
    private String placedOn;

    @NotBlank
    @Size(max = 20)
    @Column(name = "payment_status")
    private String paymentStatus = "pending";

    public Order() {
    }

    public Order(Long userId, String name, String number, String email, String method, String address, String totalProducts, Integer totalPrice, String placedOn) {
        this.userId = userId;
        this.name = name;
        this.number = number;
        this.email = email;
        this.method = method;
        this.address = address;
        this.totalProducts = totalProducts;
        this.totalPrice = totalPrice;
        this.placedOn = placedOn;
        this.paymentStatus = "pending";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(String totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Integer getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Integer totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPlacedOn() {
        return placedOn;
    }

    public void setPlacedOn(String placedOn) {
        this.placedOn = placedOn;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
