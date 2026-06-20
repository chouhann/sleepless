package com.sleepless.dto;

public class DashboardSummary {
    private Integer totalPendings;
    private Integer totalIncome;
    private Long orderPlaced;
    private Long dishesAdded;
    private Long users;
    private Long admins;
    private Long totalAccounts;
    private Long newMessages;

    public DashboardSummary() {
    }

    public DashboardSummary(Integer totalPendings, Integer totalIncome, Long orderPlaced, Long dishesAdded, Long users, Long admins, Long totalAccounts, Long newMessages) {
        this.totalPendings = totalPendings;
        this.totalIncome = totalIncome;
        this.orderPlaced = orderPlaced;
        this.dishesAdded = dishesAdded;
        this.users = users;
        this.admins = admins;
        this.totalAccounts = totalAccounts;
        this.newMessages = newMessages;
    }

    public Integer getTotalPendings() {
        return totalPendings;
    }

    public void setTotalPendings(Integer totalPendings) {
        this.totalPendings = totalPendings;
    }

    public Integer getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Integer totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Long getOrderPlaced() {
        return orderPlaced;
    }

    public void setOrderPlaced(Long orderPlaced) {
        this.orderPlaced = orderPlaced;
    }

    public Long getDishesAdded() {
        return dishesAdded;
    }

    public void setDishesAdded(Long dishesAdded) {
        this.dishesAdded = dishesAdded;
    }

    public Long getUsers() {
        return users;
    }

    public void setUsers(Long users) {
        this.users = users;
    }

    public Long getAdmins() {
        return admins;
    }

    public void setAdmins(Long admins) {
        this.admins = admins;
    }

    public Long getTotalAccounts() {
        return totalAccounts;
    }

    public void setTotalAccounts(Long totalAccounts) {
        this.totalAccounts = totalAccounts;
    }

    public Long getNewMessages() {
        return newMessages;
    }

    public void setNewMessages(Long newMessages) {
        this.newMessages = newMessages;
    }
}
