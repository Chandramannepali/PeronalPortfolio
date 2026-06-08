package com.portfolio.controller;

import com.portfolio.model.ContactMessage;
import com.portfolio.repository.ContactMessageRepository;
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

    public ContactController(ContactMessageRepository contactRepo) {
        this.contactRepo = contactRepo;
    }

    /**
     * POST /api/contact — Receive a contact form submission from the React frontend.
     */
    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submitContact(@Valid @RequestBody ContactMessage msg) {
        contactRepo.save(msg);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", "success", "message", "Thank you for reaching out!"));
    }

    /**
     * GET /api/contact — Retrieve all contact messages (admin use).
     */
    @GetMapping("/contact")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactRepo.findAllByOrderByCreatedAtDesc());
    }

    /**
     * GET /api/contact/count — Get count of unread messages.
     */
    @GetMapping("/contact/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        return ResponseEntity.ok(Map.of("unread", contactRepo.countByReadFalse()));
    }
}
