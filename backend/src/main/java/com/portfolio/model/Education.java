package com.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "educations")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String degree;
    private String institution;
    private String period;
    private String cgpa;

    public Education() {}

    public Education(String degree, String institution, String period, String cgpa) {
        this.degree = degree;
        this.institution = institution;
        this.period = period;
        this.cgpa = cgpa;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getCgpa() { return cgpa; }
    public void setCgpa(String cgpa) { this.cgpa = cgpa; }
}
