package com.portfolio.service;

import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private static class TokenBucket {
        double tokens;
        long lastRefillTime;
        
        TokenBucket(double maxTokens) {
            this.tokens = maxTokens;
            this.lastRefillTime = Instant.now().getEpochSecond();
        }
    }

    private final Map<String, TokenBucket> ipBuckets = new ConcurrentHashMap<>();
    
    private static final double MAX_TOKENS = 5.0; // Max 5 submissions burst
    private static final double REFILL_RATE = 1.0 / 60.0; // 1 token refill per 60 seconds (1 message per minute)

    public synchronized boolean tryConsume(String ipAddress) {
        long now = Instant.now().getEpochSecond();
        TokenBucket bucket = ipBuckets.computeIfAbsent(ipAddress, k -> new TokenBucket(MAX_TOKENS));
        
        long elapsedTime = now - bucket.lastRefillTime;
        if (elapsedTime > 0) {
            bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + (elapsedTime * REFILL_RATE));
            bucket.lastRefillTime = now;
        }
        
        if (bucket.tokens >= 1.0) {
            bucket.tokens -= 1.0;
            return true;
        }
        return false;
    }
}
