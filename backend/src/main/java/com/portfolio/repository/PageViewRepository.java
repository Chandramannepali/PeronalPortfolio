package com.portfolio.repository;

import com.portfolio.model.PageView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PageViewRepository extends JpaRepository<PageView, Long> {
    long countByPage(String page);
}
