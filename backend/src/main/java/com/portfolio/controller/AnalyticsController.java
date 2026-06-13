package com.portfolio.controller;

import com.portfolio.model.PageView;
import com.portfolio.repository.PageViewRepository;
import com.portfolio.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AnalyticsController {

    private final PageViewRepository viewRepo;
    private final AuthService authService;

    public AnalyticsController(PageViewRepository viewRepo, AuthService authService) {
        this.viewRepo = viewRepo;
        this.authService = authService;
    }

    /**
     * POST /api/analytics/view — Track a page view from the frontend.
     */
    @PostMapping("/analytics/view")
    public ResponseEntity<Map<String, String>> trackView(@RequestBody PageView view) {
        viewRepo.save(view);
        return ResponseEntity.ok(Map.of("status", "tracked"));
    }

    /**
     * GET /api/analytics/stats — Get total page views.
     */
    @GetMapping("/analytics/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long total = viewRepo.count();
        long homeViews = viewRepo.countByPage("home");
        return ResponseEntity.ok(Map.of(
                "totalViews", total,
                "homeViews", homeViews
        ));
    }

    /**
     * GET /api/admin/analytics — Retrieve extensive visitor analytics for admin dashboard (secured).
     */
    @GetMapping("/admin/analytics")
    public ResponseEntity<Map<String, Object>> getAdminAnalytics(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (!authService.verifyToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PageView> allViews = viewRepo.findAll();
        
        // Group by Page
        Map<String, Long> pageViews = allViews.stream()
                .filter(v -> v.getPage() != null)
                .collect(java.util.stream.Collectors.groupingBy(PageView::getPage, java.util.stream.Collectors.counting()));

        // Group by Browser/Device type from UserAgent
        Map<String, Long> devices = allViews.stream()
                .map(v -> parseDevice(v.getUserAgent()))
                .collect(java.util.stream.Collectors.groupingBy(d -> d, java.util.stream.Collectors.counting()));

        // Group by Browser from UserAgent
        Map<String, Long> browsers = allViews.stream()
                .map(v -> parseBrowser(v.getUserAgent()))
                .collect(java.util.stream.Collectors.groupingBy(b -> b, java.util.stream.Collectors.counting()));

        // Group by Referrer
        Map<String, Long> referrers = allViews.stream()
                .map(v -> {
                    String ref = v.getReferrer();
                    if (ref == null || ref.trim().isEmpty() || ref.equals("null")) return "Direct / Bookmark";
                    try {
                        java.net.URI uri = new java.net.URI(ref);
                        String host = uri.getHost();
                        return host != null ? host : ref;
                    } catch (Exception e) {
                        return ref;
                    }
                })
                .collect(java.util.stream.Collectors.groupingBy(r -> r, java.util.stream.Collectors.counting()));

        // Last 7 days views activity
        Map<String, Long> dailyViews = new java.util.TreeMap<>();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        
        allViews.stream()
                .filter(v -> v.getViewedAt() != null && v.getViewedAt().isAfter(sevenDaysAgo))
                .forEach(v -> {
                    String dateStr = v.getViewedAt().format(formatter);
                    dailyViews.put(dateStr, dailyViews.getOrDefault(dateStr, 0L) + 1);
                });

        return ResponseEntity.ok(Map.of(
                "totalViews", (long) allViews.size(),
                "pageViews", pageViews,
                "devices", devices,
                "browsers", browsers,
                "referrers", referrers,
                "dailyViews", dailyViews
        ));
    }

    private String parseDevice(String ua) {
        if (ua == null) return "Unknown";
        String lower = ua.toLowerCase();
        if (lower.contains("mobile") || lower.contains("android") || lower.contains("iphone") || lower.contains("ipad")) {
            return "Mobile";
        }
        return "Desktop";
    }

    private String parseBrowser(String ua) {
        if (ua == null) return "Unknown";
        String lower = ua.toLowerCase();
        if (lower.contains("firefox")) return "Firefox";
        if (lower.contains("chrome") && !lower.contains("chromium")) return "Chrome";
        if (lower.contains("safari") && !lower.contains("chrome")) return "Safari";
        if (lower.contains("edge") || lower.contains("edg")) return "Edge";
        return "Other";
    }
}
