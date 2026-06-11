package com.portfolio.config;

import com.portfolio.model.*;
import com.portfolio.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final ProfileRepository profileRepo;
    private final SkillRepository skillRepo;
    private final ProjectRepository projectRepo;
    private final ExperienceRepository experienceRepo;
    private final EducationRepository educationRepo;
    private final CertificationRepository certificationRepo;
    private final PublicationRepository publicationRepo;

    public DataInitializer(
            ProfileRepository profileRepo,
            SkillRepository skillRepo,
            ProjectRepository projectRepo,
            ExperienceRepository experienceRepo,
            EducationRepository educationRepo,
            CertificationRepository certificationRepo,
            PublicationRepository publicationRepo) {
        this.profileRepo = profileRepo;
        this.skillRepo = skillRepo;
        this.projectRepo = projectRepo;
        this.experienceRepo = experienceRepo;
        this.educationRepo = educationRepo;
        this.certificationRepo = certificationRepo;
        this.publicationRepo = publicationRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (profileRepo.count() == 0) {
            // 1. Seed Profile
            Profile profile = new Profile(
                "M Poorna Chandra Rao",
                "Available for Opportunities · 2026 Graduate",
                "Aspiring software engineer building scalable, real-world solutions with Python, Java, and AI/ML — from LLM tooling to full-stack marketplaces.",
                "chandramannepalli239@gmail.com",
                "+91 97036 52569",
                "Nellore, Andhra Pradesh",
                "Telugu · English · Tamil",
                "https://github.com/Chandramannepali",
                "https://www.linkedin.com/in/poorna-chandra-rao-mannepalli-44b101259"
            );
            profile.setName("Poorna");
            profile.setNameLine2("Chandra Rao");
            profileRepo.save(profile);

            // 2. Seed Skills
            skillRepo.save(new Skill("Programming", "Python"));
            skillRepo.save(new Skill("Programming", "Java"));
            skillRepo.save(new Skill("Web", "HTML"));
            skillRepo.save(new Skill("Web", "CSS"));
            skillRepo.save(new Skill("Web", "JavaScript"));
            skillRepo.save(new Skill("Web", "React"));
            skillRepo.save(new Skill("AI / ML", "SpeechRecognition"));
            skillRepo.save(new Skill("AI / ML", "PyAudio"));
            skillRepo.save(new Skill("AI / ML", "Pyttsx3"));
            skillRepo.save(new Skill("AI / ML", "Tokenization Analysis"));
            skillRepo.save(new Skill("Database", "SQL"));
            skillRepo.save(new Skill("Database", "Supabase"));
            skillRepo.save(new Skill("Tools", "Git"));
            skillRepo.save(new Skill("Tools", "GitHub"));
            skillRepo.save(new Skill("Tools", "VS Code"));
            skillRepo.save(new Skill("Tools", "Streamlit"));
            skillRepo.save(new Skill("LLMs", "GPT-2"));
            skillRepo.save(new Skill("LLMs", "LLaMA"));
            skillRepo.save(new Skill("LLMs", "T5"));
            skillRepo.save(new Skill("LLMs", "Hugging Face"));

            // 3. Seed Projects
            projectRepo.save(new Project(
                "01",
                "LLM Tokenization Visual Explorer",
                "/assets/tokenization.png",
                "Python, Streamlit, Hugging Face",
                "Built an interactive tool to visualize and compare tokenization behavior across LLMs including GPT-2, LLaMA, and T5.;;" +
                "Analyzed token splits, token IDs, and total token counts to demonstrate cost impact caused by prompt variations.;;" +
                "Implemented tokenizer comparison and prompt mutation analysis to support cost-aware prompt optimization."
            ));
            projectRepo.save(new Project(
                "02",
                "FarmLink — Farm-to-Consumer Marketplace",
                "/assets/farmlink.png",
                "React, Supabase, CSS",
                "Built a full-stack marketplace with role-based portals for Farmers, Consumers, and Admins.;;" +
                "Integrated AI Quality Scan grading crop images across freshness, color uniformity, size consistency.;;" +
                "Developed AI Price Intelligence engine providing market-driven crop price predictions.;;" +
                "Designed command-handling logic to accurately map spoken input to media actions."
            ));
            projectRepo.save(new Project(
                "03",
                "Amma's Pickles (E-Commerce)",
                "/assets/ammas_pickles.png",
                "MERN Stack, Razorpay, Cloudinary, JWT Auth",
                "Built a production-ready e-commerce application with a comprehensive admin dashboard, product catalog management, and stock control.;;" +
                "Integrated secure payment processing via Razorpay gateway and automatic image resizing and upload via Cloudinary API.;;" +
                "Implemented JWT-based authentication and resolved real-world MongoDB Atlas DNS/routing issues in production."
            ));
            projectRepo.save(new Project(
                "04",
                "Abhay Dental Care Website",
                "/assets/abhay_dental.png",
                "HTML, CSS, JavaScript",
                "Designed and developed a fully responsive patient-facing website for a dental clinic, improving new client conversion rates.;;" +
                "Implemented an interactive appointment contact form and custom service catalog pages.;;" +
                "Optimized load times and SEO performance, ensuring high ranking in local Google Search results."
            ));

            // 4. Seed Experience
            experienceRepo.save(new Experience(
                "Web Development Intern",
                "CodSoft — Remote",
                "Jun 2024 – Aug 2024",
                "Developed responsive web pages including a portfolio, landing page, and calculator using HTML, CSS, and JavaScript.;;" +
                "Collaborated with team members to incorporate feedback and improve UI usability.;;" +
                "Utilized Git and GitHub to manage version control and streamline team workflows."
            ));

            // 5. Seed Education
            educationRepo.save(new Education("B.Tech — AI & Data Science", "J.N.N Institute of Engineering", "2022 – 2026", "7.39"));
            educationRepo.save(new Education("Intermediate (Class XII)", "MJPAP BCWR Junior College", "2020 – 2022", "8.34"));
            educationRepo.save(new Education("SSC (Class X)", "MJPAP BCWR School", "2019 – 2020", "9.0"));

            // 6. Seed Certifications
            certificationRepo.save(new Certification("Project Management Fundamentals", "IBM"));
            certificationRepo.save(new Certification("Introduction to Internet of Things", "NPTEL"));
            certificationRepo.save(new Certification("Introduction to Generative AI", "Google Cloud"));

            // 7. Seed Publication
            publicationRepo.save(new Publication(
                "Peer-Reviewed Journal Article",
                "Enhancing Agricultural Productivity Through the Integration of AI and IoT",
                "IJARESM · Volume 12 · August 2024",
                "Led the project from idea generation to final publication.",
                "https://www.ijaresm.com/uploaded_files/document_file/Prof._Rajakumar_._B,_ermA.pdf"
            ));

            System.out.println(">>> Database successfully seeded with default portfolio data!");
        }
    }
}
