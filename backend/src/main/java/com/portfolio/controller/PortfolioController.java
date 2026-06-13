package com.portfolio.controller;

import com.portfolio.model.*;
import com.portfolio.repository.*;
import com.portfolio.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class PortfolioController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping("/admin/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String passcode = credentials.get("passcode");
        String token = authService.login(passcode);
        if (token != null) {
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid Admin Passcode."));
    }

    private boolean verifyAdminToken(String token) {
        return authService.verifyToken(token);
    }


    /**
     * GET /api/profile - Returns full portfolio information from JPA database.
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {
        Profile profileEntity = profileRepository.findById(1L).orElse(null);
        if (profileEntity == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("fullName", profileEntity.getFullName());
        profile.put("name", profileEntity.getName());
        profile.put("nameLine2", profileEntity.getNameLine2());
        profile.put("tagline", profileEntity.getTagline());
        profile.put("summary", profileEntity.getSummary());
        profile.put("email", profileEntity.getEmail());
        profile.put("phone", profileEntity.getPhone());
        profile.put("location", profileEntity.getLocation());
        profile.put("languages", profileEntity.getLanguages());
        profile.put("github", profileEntity.getGithub());
        profile.put("linkedin", profileEntity.getLinkedin());

        // Skills: group by category
        List<Skill> skills = skillRepository.findAll();
        Map<String, List<String>> skillsByCategory = new LinkedHashMap<>();
        for (Skill skill : skills) {
            skillsByCategory.computeIfAbsent(skill.getCategory(), k -> new ArrayList<>()).add(skill.getName());
        }
        List<Map<String, Object>> skillsList = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : skillsByCategory.entrySet()) {
            Map<String, Object> group = new LinkedHashMap<>();
            group.put("category", entry.getKey());
            group.put("items", entry.getValue());
            skillsList.add(group);
        }
        profile.put("skills", skillsList);

        // Projects
        List<Project> projects = projectRepository.findAll();
        List<Map<String, Object>> projectsList = new ArrayList<>();
        for (Project p : projects) {
            Map<String, Object> proj = new LinkedHashMap<>();
            proj.put("id", p.getId());
            proj.put("number", p.getNumber());
            proj.put("title", p.getTitle());
            proj.put("image", p.getImage());
            if (p.getStack() != null) {
                proj.put("stack", Arrays.asList(p.getStack().split(",")));
            } else {
                proj.put("stack", new ArrayList<>());
            }
            if (p.getBullets() != null) {
                proj.put("bullets", Arrays.asList(p.getBullets().split(";;")));
            } else {
                proj.put("bullets", new ArrayList<>());
            }
            projectsList.add(proj);
        }
        profile.put("projects", projectsList);

        // Experience
        List<Experience> experience = experienceRepository.findAll();
        List<Map<String, Object>> experienceList = new ArrayList<>();
        for (Experience e : experience) {
            Map<String, Object> exp = new LinkedHashMap<>();
            exp.put("id", e.getId());
            exp.put("role", e.getRole());
            exp.put("company", e.getCompany());
            exp.put("period", e.getPeriod());
            if (e.getBullets() != null) {
                exp.put("bullets", Arrays.asList(e.getBullets().split(";;")));
            } else {
                exp.put("bullets", new ArrayList<>());
            }
            experienceList.add(exp);
        }
        profile.put("experience", experienceList);

        // Education
        List<Education> education = educationRepository.findAll();
        List<Map<String, Object>> educationList = new ArrayList<>();
        for (Education ed : education) {
            Map<String, Object> edu = new LinkedHashMap<>();
            edu.put("id", ed.getId());
            edu.put("degree", ed.getDegree());
            edu.put("institution", ed.getInstitution());
            edu.put("period", ed.getPeriod());
            edu.put("cgpa", ed.getCgpa());
            educationList.add(edu);
        }
        profile.put("education", educationList);

        // Certifications
        List<Certification> certifications = certificationRepository.findAll();
        List<Map<String, String>> certificationsList = new ArrayList<>();
        for (Certification c : certifications) {
            Map<String, String> cert = new LinkedHashMap<>();
            cert.put("id", String.valueOf(c.getId()));
            cert.put("name", c.getName());
            cert.put("issuer", c.getIssuer());
            certificationsList.add(cert);
        }
        profile.put("certifications", certificationsList);

        // Publication
        Publication pub = publicationRepository.findById(1L).orElse(null);
        if (pub != null) {
            Map<String, String> pubMap = new LinkedHashMap<>();
            pubMap.put("type", pub.getType());
            pubMap.put("title", pub.getTitle());
            pubMap.put("meta", pub.getMeta());
            pubMap.put("role", pub.getRole());
            profile.put("publication", pubMap);
        }

        return ResponseEntity.ok(profile);
    }



    /**
     * GET /api/admin/messages - Retrieve messages (Admin only)
     */
    @GetMapping("/admin/messages")
    public ResponseEntity<List<ContactMessage>> getMessages(@RequestHeader(value = "Authorization", required = false) String token) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(contactMessageRepository.findAll());
    }

    /**
     * PUT /api/admin/profile - Update main profile attributes.
     */
    @PutMapping("/admin/profile")
    public ResponseEntity<Profile> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Profile updatedProfile) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Profile existing = profileRepository.findById(1L).orElse(new Profile());
        existing.setId(1L);
        existing.setFullName(updatedProfile.getFullName());
        existing.setName(updatedProfile.getName());
        existing.setNameLine2(updatedProfile.getNameLine2());
        existing.setTagline(updatedProfile.getTagline());
        existing.setSummary(updatedProfile.getSummary());
        existing.setEmail(updatedProfile.getEmail());
        existing.setPhone(updatedProfile.getPhone());
        existing.setLocation(updatedProfile.getLocation());
        existing.setLanguages(updatedProfile.getLanguages());
        existing.setGithub(updatedProfile.getGithub());
        existing.setLinkedin(updatedProfile.getLinkedin());

        profileRepository.save(existing);
        return ResponseEntity.ok(existing);
    }

    /**
     * PUT /api/admin/publication - Update publication fields.
     */
    @PutMapping("/admin/publication")
    public ResponseEntity<Publication> updatePublication(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Publication updatedPub) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Publication existing = publicationRepository.findById(1L).orElse(new Publication());
        existing.setId(1L);
        existing.setType(updatedPub.getType());
        existing.setTitle(updatedPub.getTitle());
        existing.setMeta(updatedPub.getMeta());
        existing.setRole(updatedPub.getRole());

        publicationRepository.save(existing);
        return ResponseEntity.ok(existing);
    }

    // --- SKILLS ADMIN ---

    @PostMapping("/admin/skills")
    public ResponseEntity<Skill> addSkill(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Skill skill) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @DeleteMapping("/admin/skills/{id}")
    public ResponseEntity<Void> deleteSkill(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        skillRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- PROJECTS ADMIN ---

    @PostMapping("/admin/projects")
    public ResponseEntity<Project> addProject(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Project project) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @PutMapping("/admin/projects/{id}")
    public ResponseEntity<Project> updateProject(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id,
            @RequestBody Project project) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Project existing = projectRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setNumber(project.getNumber());
        existing.setTitle(project.getTitle());
        existing.setImage(project.getImage());
        existing.setStack(project.getStack());
        existing.setBullets(project.getBullets());
        return ResponseEntity.ok(projectRepository.save(existing));
    }

    @DeleteMapping("/admin/projects/{id}")
    public ResponseEntity<Void> deleteProject(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- EXPERIENCE ADMIN ---

    @PostMapping("/admin/experience")
    public ResponseEntity<Experience> addExperience(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Experience exp) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(experienceRepository.save(exp));
    }

    @PutMapping("/admin/experience/{id}")
    public ResponseEntity<Experience> updateExperience(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id,
            @RequestBody Experience exp) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Experience existing = experienceRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setRole(exp.getRole());
        existing.setCompany(exp.getCompany());
        existing.setPeriod(exp.getPeriod());
        existing.setBullets(exp.getBullets());
        return ResponseEntity.ok(experienceRepository.save(existing));
    }

    @DeleteMapping("/admin/experience/{id}")
    public ResponseEntity<Void> deleteExperience(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        experienceRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- EDUCATION ADMIN ---

    @PostMapping("/admin/education")
    public ResponseEntity<Education> addEducation(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Education edu) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(educationRepository.save(edu));
    }

    @PutMapping("/admin/education/{id}")
    public ResponseEntity<Education> updateEducation(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id,
            @RequestBody Education edu) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Education existing = educationRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setDegree(edu.getDegree());
        existing.setInstitution(edu.getInstitution());
        existing.setPeriod(edu.getPeriod());
        existing.setCgpa(edu.getCgpa());
        return ResponseEntity.ok(educationRepository.save(existing));
    }

    @DeleteMapping("/admin/education/{id}")
    public ResponseEntity<Void> deleteEducation(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        educationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- CERTIFICATIONS ADMIN ---

    @PostMapping("/admin/certifications")
    public ResponseEntity<Certification> addCertification(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Certification cert) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(certificationRepository.save(cert));
    }

    @DeleteMapping("/admin/certifications/{id}")
    public ResponseEntity<Void> deleteCertification(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        if (!verifyAdminToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        certificationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
