package com.portfolio.controller;

import com.portfolio.model.ContactMessage;
import com.portfolio.repository.ContactMessageRepository;
import com.portfolio.service.AuthService;
import com.portfolio.service.RateLimitingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactMessageRepository contactRepo;
    private final AuthService authService;
    private final RateLimitingService rateLimiter;

    public ContactController(ContactMessageRepository contactRepo, AuthService authService, RateLimitingService rateLimiter) {
        this.contactRepo = contactRepo;
        this.authService = authService;
        this.rateLimiter = rateLimiter;
    }

    /**
     * POST /api/contact — Receive a contact form submission from the React frontend with rate limiting.
     */
    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submitContact(
            @Valid @RequestBody ContactMessage msg,
            jakarta.servlet.http.HttpServletRequest request) {
        
        String ipAddress = request.getRemoteAddr();
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            ipAddress = xForwardedFor.split(",")[0].trim();
        }

        if (!rateLimiter.tryConsume(ipAddress)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("status", "error", "message", "Too many messages. Please try again later."));
        }

        contactRepo.save(msg);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "message", "Thank you for reaching out!"));
    }

    /**
     * GET /api/contact — Retrieve all contact messages (admin use, secured).
     */
    @GetMapping("/contact")
    public ResponseEntity<List<ContactMessage>> getAllMessages(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (!authService.verifyToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(contactRepo.findAllByOrderByCreatedAtDesc());
    }

    /**
     * GET /api/contact/count — Get count of unread messages (admin use, secured).
     */
    @GetMapping("/contact/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (!authService.verifyToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(Map.of("unread", contactRepo.countByReadFalse()));
    }
}
