package com.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "publications")
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String title;
    private String meta;
    
    @Column(length = 1000)
    private String role;

    public Publication() {}

    public Publication(String type, String title, String meta, String role) {
        this.type = type;
        this.title = title;
        this.meta = meta;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMeta() { return meta; }
    public void setMeta(String meta) { this.meta = meta; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
