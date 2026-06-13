package com.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Value("${app.admin.passcode-hash:240eb518562d989f6d482594689cdcc9cf1445b2067746de54203df4807436d4}")
    private String adminPasscodeHash;

    private final Map<String, LocalDateTime> activeSessions = new ConcurrentHashMap<>();

    public String login(String passcode) {
        if (passcode == null) {
            return null;
        }
        String hashed = hashSHA256(passcode);
        if (adminPasscodeHash.equalsIgnoreCase(hashed)) {
            String token = UUID.randomUUID().toString();
            activeSessions.put(token, LocalDateTime.now().plusHours(2));
            return token;
        }
        return null;
    }

    public boolean verifyToken(String token) {
        if (token == null) {
            return false;
        }
        LocalDateTime expiry = activeSessions.get(token);
        if (expiry == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(expiry)) {
            activeSessions.remove(token);
            return false;
        }
        // Refresh token expiry on active use
        activeSessions.put(token, LocalDateTime.now().plusHours(2));
        return true;
    }

    private String hashSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
