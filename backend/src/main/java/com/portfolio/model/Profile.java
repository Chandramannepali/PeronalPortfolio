package com.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String name;
    private String nameLine2;
    private String tagline;
    
    @Column(length = 1000)
    private String summary;
    
    private String email;
    private String phone;
    private String location;
    private String languages;
    private String github;
    private String linkedin;

    public Profile() {}

    public Profile(String fullName, String tagline, String summary, String email, String phone, String location, String languages, String github, String linkedin) {
        this.fullName = fullName;
        this.tagline = tagline;
        this.summary = summary;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.languages = languages;
        this.github = github;
        this.linkedin = linkedin;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameLine2() { return nameLine2; }
    public void setNameLine2(String nameLine2) { this.nameLine2 = nameLine2; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
}
