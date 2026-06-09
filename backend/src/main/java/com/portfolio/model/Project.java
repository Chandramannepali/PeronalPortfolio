package com.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String number;
    private String title;
    private String image;

    @Column(length = 1000)
    private String stack;

    @Column(length = 2000)
    private String bullets;

    public Project() {}

    public Project(String number, String title, String stack, String bullets) {
        this.number = number;
        this.title = title;
        this.stack = stack;
        this.bullets = bullets;
    }

    public Project(String number, String title, String image, String stack, String bullets) {
        this.number = number;
        this.title = title;
        this.image = image;
        this.stack = stack;
        this.bullets = bullets;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getStack() { return stack; }
    public void setStack(String stack) { this.stack = stack; }

    public String getBullets() { return bullets; }
    public void setBullets(String bullets) { this.bullets = bullets; }
}
