package com.sleepless.dto;

public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String userType;

    public JwtAuthenticationResponse(String accessToken, Long id, String name, String email, String userType) {
        this.accessToken = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.userType = userType;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
