package com.portfolio.controller;

import com.portfolio.model.ContactMessage;
import com.portfolio.repository.ContactMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Serves all the portfolio data as JSON — so the frontend can optionally
 * fetch data from the API instead of static JS files.
 */
@RestController
@RequestMapping("/api")
public class PortfolioController {

    /**
     * GET /api/profile — Returns full profile information.
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("name", "M Poorna Chandra Rao");
        profile.put("tagline", "Available for Opportunities · 2026 Graduate");
        profile.put("summary", "Aspiring software engineer building scalable, real-world solutions with Python, Java, and AI/ML — from LLM tooling to full-stack marketplaces.");
        profile.put("email", "chandramannepalli239@gmail.com");
        profile.put("phone", "+91 97036 52569");
        profile.put("location", "Nellore, Andhra Pradesh");
        profile.put("languages", "Telugu · English · Tamil");
        profile.put("github", "https://github.com");
        profile.put("linkedin", "https://linkedin.com");

        // Skills
        List<Map<String, Object>> skills = List.of(
            Map.of("category", "Programming", "items", List.of("Python", "Java")),
            Map.of("category", "Web", "items", List.of("HTML", "CSS", "JavaScript", "React")),
            Map.of("category", "AI / ML", "items", List.of("SpeechRecognition", "PyAudio", "Pyttsx3", "Tokenization Analysis")),
            Map.of("category", "Database", "items", List.of("SQL", "Supabase")),
            Map.of("category", "Tools", "items", List.of("Git", "GitHub", "VS Code", "Streamlit")),
            Map.of("category", "LLMs", "items", List.of("GPT-2", "LLaMA", "T5", "Hugging Face"))
        );
        profile.put("skills", skills);

        // Projects
        List<Map<String, Object>> projects = List.of(
            Map.of(
                "number", "01",
                "title", "LLM Tokenization Visual Explorer",
                "stack", List.of("Python", "Streamlit", "Hugging Face"),
                "bullets", List.of(
                    "Built an interactive tool to visualize and compare tokenization behavior across LLMs including GPT-2, LLaMA, and T5.",
                    "Analyzed token splits, token IDs, and total token counts to demonstrate cost impact caused by prompt variations.",
                    "Implemented tokenizer comparison and prompt mutation analysis to support cost-aware prompt optimization."
                )
            ),
            Map.of(
                "number", "02",
                "title", "FarmLink — Farm-to-Consumer Marketplace",
                "stack", List.of("React", "Supabase", "CSS"),
                "bullets", List.of(
                    "Built a full-stack marketplace with role-based portals for Farmers, Consumers, and Admins.",
                    "Integrated AI Quality Scan grading crop images across freshness, color uniformity, size consistency.",
                    "Developed AI Price Intelligence engine providing market-driven crop price predictions.",
                    "Designed command-handling logic to accurately map spoken input to media actions."
                )
            )
        );
        profile.put("projects", projects);

        // Experience
        List<Map<String, Object>> experience = List.of(
            Map.of(
                "role", "Web Development Intern",
                "company", "CodSoft — Remote",
                "period", "Jun 2024 – Aug 2024",
                "bullets", List.of(
                    "Developed responsive web pages including a portfolio, landing page, and calculator using HTML, CSS, and JavaScript.",
                    "Collaborated with team members to incorporate feedback and improve UI usability.",
                    "Utilized Git and GitHub to manage version control and streamline team workflows."
                )
            )
        );
        profile.put("experience", experience);

        // Education
        List<Map<String, Object>> education = List.of(
            Map.of("degree", "B.Tech — AI & Data Science", "institution", "J.N.N Institute of Engineering", "period", "2022 – 2026", "cgpa", "7.39"),
            Map.of("degree", "Intermediate (Class XII)", "institution", "MJPAP BCWR Junior College", "period", "2020 – 2022", "cgpa", "8.34"),
            Map.of("degree", "SSC (Class X)", "institution", "MJPAP BCWR School", "period", "2019 – 2020", "cgpa", "9.0")
        );
        profile.put("education", education);

        // Certifications
        List<Map<String, String>> certs = List.of(
            Map.of("name", "Project Management Fundamentals", "issuer", "IBM"),
            Map.of("name", "Introduction to Internet of Things", "issuer", "NPTEL"),
            Map.of("name", "Introduction to Generative AI", "issuer", "Google Cloud")
        );
        profile.put("certifications", certs);

        // Publication
        profile.put("publication", Map.of(
            "type", "Peer-Reviewed Journal Article",
            "title", "Enhancing Agricultural Productivity Through the Integration of AI and IoT",
            "meta", "IJARESM · Volume 12 · August 2024",
            "role", "Led the project from idea generation to final publication."
        ));

        return ResponseEntity.ok(profile);
    }
}
