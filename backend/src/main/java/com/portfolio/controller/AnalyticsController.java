package com.portfolio.controller;

import com.portfolio.model.PageView;
import com.portfolio.repository.PageViewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AnalyticsController {

    private final PageViewRepository viewRepo;

    public AnalyticsController(PageViewRepository viewRepo) {
        this.viewRepo = viewRepo;
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
}
