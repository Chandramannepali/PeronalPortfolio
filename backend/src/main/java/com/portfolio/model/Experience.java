package com.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;
    private String company;
    private String period;

    @Column(length = 2000)
    private String bullets;

    public Experience() {}

    public Experience(String role, String company, String period, String bullets) {
        this.role = role;
        this.company = company;
        this.period = period;
        this.bullets = bullets;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getBullets() { return bullets; }
    public void setBullets(String bullets) { this.bullets = bullets; }
}
