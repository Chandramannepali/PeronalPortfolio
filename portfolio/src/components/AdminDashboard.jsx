import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiRefreshCw, FiMessageSquare, FiKey, FiEdit, FiPlus, FiTrash, FiSave, FiUser, FiAward, FiBookOpen, FiClock } from "react-icons/fi";
import { usePortfolio } from "../context/PortfolioDataContext";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api";

export default function AdminDashboard({ onClose }) {
  const { refreshData } = usePortfolio();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("adminToken")
  );
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState("messages");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Live Forms State
  const [profileForm, setProfileForm] = useState({
    fullName: "", name: "", nameLine2: "", tagline: "", summary: "",
    email: "", phone: "", location: "", languages: "", github: "", linkedin: ""
  });
  const [pubForm, setPubForm] = useState({
    type: "", title: "", meta: "", role: ""
  });
  const [skillsForm, setSkillsForm] = useState([]); // Array of { id, category, name }
  const [projectsForm, setProjectsForm] = useState([]);
  const [expForm, setExpForm] = useState([]);
  const [eduForm, setEduForm] = useState([]);
  const [certsForm, setCertsForm] = useState([]);

  // New item draft states
  const [newSkill, setNewSkill] = useState({ category: "", name: "" });
  const [newProject, setNewProject] = useState({ number: "", title: "", image: "", stack: "", bullets: "" });
  const [newExp, setNewExp] = useState({ role: "", company: "", period: "", bullets: "" });
  const [newEdu, setNewEdu] = useState({ degree: "", institution: "", period: "", cgpa: "" });
  const [newCert, setNewCert] = useState({ name: "", issuer: "" });

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": sessionStorage.getItem("adminToken") || ""
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (tokenInput === "admin123") {
      sessionStorage.setItem("adminToken", tokenInput);
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Admin Passcode.");
    }
  };

  const showNotification = (text, type) => {
    setMessageText(text);
    setMessageType(type);
    setTimeout(() => {
      setMessageText("");
    }, 4000);
  };

  const loadAllData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      // Fetch messages
      const msgsRes = await fetch(`${API_BASE}/admin/messages`, { headers: getHeaders() });
      if (msgsRes.ok) {
        const msgs = await msgsRes.json();
        setMessages(msgs);
      }

      // Fetch profile & main structure
      const profRes = await fetch(`${API_BASE}/profile`);
      if (profRes.ok) {
        const data = await profRes.json();
        
        setProfileForm({
          fullName: data.fullName || "",
          name: data.name || "",
          nameLine2: data.nameLine2 || "",
          tagline: data.tagline || "",
          summary: data.summary || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          languages: data.languages || "",
          github: data.github || "",
          linkedin: data.linkedin || ""
        });

        if (data.publication) {
          setPubForm({
            type: data.publication.type || "",
            title: data.publication.title || "",
            meta: data.publication.meta || "",
            role: data.publication.role || ""
          });
        }

        // Skills
        const skillsMapped = [];
        if (data.skills) {
          data.skills.forEach(group => {
            group.items.forEach(item => {
              skillsMapped.push({
                category: group.category,
                name: item
              });
            });
          });
        }
        setSkillsForm(skillsMapped);

        // Projects
        setProjectsForm(data.projects || []);
        // Experience
        setExpForm(data.experience || []);
        // Education
        setEduForm(data.education || []);
        // Certifications
        setCertsForm(data.certifications || []);
      }
    } catch (err) {
      showNotification("Error connecting to dynamic backend.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [isAuthenticated]);

  // Submit Profile & Publication
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res1 = await fetch(`${API_BASE}/admin/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profileForm)
      });
      const res2 = await fetch(`${API_BASE}/admin/publication`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(pubForm)
      });
      if (res1.ok && res2.ok) {
        showNotification("Profile and Publication updated successfully!", "success");
        refreshData();
      } else {
        showNotification("Failed to save changes.", "error");
      }
    } catch {
      showNotification("Error submitting updates.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Add Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.category || !newSkill.name) return;
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/skills`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newSkill)
      });
      if (res.ok) {
        showNotification("Skill added successfully!", "success");
        setNewSkill({ category: "", name: "" });
        loadAllData();
        refreshData();
      } else {
        showNotification("Failed to add skill.", "error");
      }
    } catch {
      showNotification("Connection error.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Project/Exp/Edu/Cert
  const handleDeleteItem = async (endpoint, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/${endpoint}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        showNotification("Deleted successfully!", "success");
        loadAllData();
        refreshData();
      } else {
        showNotification("Failed to delete.", "error");
      }
    } catch {
      showNotification("Connection error.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Add Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/projects`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        showNotification("Project added successfully!", "success");
        setNewProject({ number: "", title: "", image: "", stack: "", bullets: "" });
        loadAllData();
        refreshData();
      } else {
        showNotification("Failed to add project.", "error");
      }
    } catch {
      showNotification("Connection error.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Add Experience
  const handleAddExperience = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/experience`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newExp)
      });
      if (res.ok) {
        showNotification("Experience added successfully!", "success");
        setNewExp({ role: "", company: "", period: "", bullets: "" });
        loadAllData();
        refreshData();
      } else {
        showNotification("Failed to add experience.", "error");
      }
    } catch {
      showNotification("Connection error.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Add Education
  const handleAddEducation = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/education`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newEdu)
      });
      if (res.ok) {
        showNotification("Education entry added successfully!", "success");
        setNewEdu({ degree: "", institution: "", period: "", cgpa: "" });
        loadAllData();
        refreshData();
      } else {
        showNotification("Failed to add education.", "error");
      }
    } catch {
      showNotification("Connection error.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Add Certification
  const handleAddCert = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/certifications`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newCert)
      });
      if (res.ok) {
        showNotification("Certification added!", "success");
        setNewCert({ name: "", issuer: "" });
        loadAllData();
        refreshData();
      } else {
        showNotification("Failed to add certification.", "error");
      }
    } catch {
      showNotification("Connection error.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(6,6,9,0.92)", backdropFilter: "blur(20px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem"
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          style={{
            width: "100%", maxWidth: "400px",
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: "16px", padding: "2.5rem",
            boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 100px rgba(200,241,53,0.05)",
            textAlign: "center"
          }}
        >
          <div style={{ color: "var(--accent)", marginBottom: "1rem" }}>
            <FiKey size={40} />
          </div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            Admin Login
          </h2>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "2rem" }}>
            Please enter your security passcode to access the portfolio content management system.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ textAlign: "left" }}>
              <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Passcode</label>
              <input 
                type="password"
                required
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter passcode"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontFamily: "inherit",
                  marginTop: "0.25rem",
                  outline: "none"
                }}
              />
            </div>

            {authError && (
              <div style={{ fontSize: "0.75rem", color: "#ff6464" }}>{authError}</div>
            )}

            <button 
              type="submit"
              style={{
                background: "var(--accent)",
                color: "#000",
                fontWeight: "700",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.8rem",
                marginTop: "1rem"
              }}
            >
              Verify Passcode
            </button>
          </form>

          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              fontSize: "0.75rem",
              marginTop: "1.5rem",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Cancel and Return
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(6,6,9,0.85)", backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          width: "100%", maxWidth: "950px", height: "90vh",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "16px", display: "flex", flexDirection: "column",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 100px rgba(200,241,53,0.05)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{ padding: "1.2rem 2rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.3rem", fontWeight: "700", color: "var(--text)", margin: 0 }}>
              CMS Console
            </h2>
            <p style={{ fontSize: "0.65rem", color: "var(--muted)", margin: "0.25rem 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Edit and Seemlessly update your portfolio sections
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              onClick={loadAllData} 
              disabled={loading}
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                color: "var(--text)", padding: "0.5rem", borderRadius: "8px", cursor: "pointer",
                display: "flex", alignItems: "center"
              }}
            >
              <FiRefreshCw size={16} className={loading ? "spin" : ""} />
            </button>
            <button 
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                color: "var(--text)", padding: "0.5rem", borderRadius: "8px", cursor: "pointer",
                display: "flex", alignItems: "center"
              }}
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          background: "rgba(0,0,0,0.1)",
          overflowX: "auto",
          padding: "0 1rem"
        }}>
          {[
            { id: "messages", label: "Messages", icon: <FiMessageSquare /> },
            { id: "profile", label: "Profile", icon: <FiUser /> },
            { id: "skills", label: "Skills", icon: <FiAward /> },
            { id: "projects", label: "Projects", icon: <FiBookOpen /> },
            { id: "experience", label: "Experience", icon: <FiClock /> },
            { id: "education", label: "Education", icon: <FiBookOpen /> },
            { id: "certs", label: "Certs", icon: <FiAward /> }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "1rem 1.25rem",
                background: "none",
                border: "none",
                borderBottom: activeTab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
                color: activeTab === t.id ? "var(--accent)" : "var(--muted)",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                whiteSpace: "nowrap"
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Notification banner */}
        <AnimatePresence>
          {messageText && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                background: messageType === "success" ? "rgba(74,240,196,0.1)" : "rgba(255,100,100,0.1)",
                borderBottom: messageType === "success" ? "1px solid var(--accent2)" : "1px solid #ff6464",
                color: messageType === "success" ? "var(--accent2)" : "#ff6464",
                padding: "0.75rem 2rem",
                fontSize: "0.75rem",
                textAlign: "center"
              }}
            >
              {messageText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
          {loading ? (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
              <FiRefreshCw size={24} className="spin" style={{ marginRight: "0.5rem" }} /> Loading...
            </div>
          ) : (
            <>
              {/* MESSAGES TAB */}
              {activeTab === "messages" && (
                <div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
                    Received Messages ({messages.length})
                  </h3>
                  {messages.length === 0 ? (
                    <div style={{ border: "1px dashed var(--border)", borderRadius: "8px", padding: "3rem", textAlign: "center", color: "var(--muted)", fontSize: "0.8rem" }}>
                      No contact forms submitted yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {messages.map((msg) => (
                        <div key={msg.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "1rem", borderRadius: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                            <div>
                              <strong>{msg.name}</strong> <span style={{ color: "var(--accent)" }}>&lt;{msg.email}&gt;</span>
                            </div>
                            <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{msg.createdAt}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text)", background: "rgba(0,0,0,0.15)", padding: "0.5rem", borderRadius: "4px" }}>
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Full Name</label>
                      <input 
                        type="text" 
                        value={profileForm.fullName} 
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>First Name / Glitch Title</label>
                      <input 
                        type="text" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Second Name Line (Hero)</label>
                      <input 
                        type="text" 
                        value={profileForm.nameLine2} 
                        onChange={(e) => setProfileForm({ ...profileForm, nameLine2: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Tagline / Availability</label>
                      <input 
                        type="text" 
                        value={profileForm.tagline} 
                        onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Professional Summary</label>
                    <textarea 
                      rows={3} 
                      value={profileForm.summary} 
                      onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Email</label>
                      <input type="text" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Phone</label>
                      <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Location</label>
                      <input type="text" value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Languages</label>
                      <input type="text" value={profileForm.languages} onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>GitHub Link</label>
                      <input type="text" value={profileForm.github} onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>LinkedIn Link</label>
                      <input type="text" value={profileForm.linkedin} onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })} style={inputStyle} />
                    </div>
                  </div>

                  {/* Publication Inner Form */}
                  <div style={{ borderTop: "1px dashed var(--border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
                    <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: "0.9rem", color: "var(--accent2)", marginBottom: "1rem" }}>
                      Featured Research Publication
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Publication Type</label>
                        <input type="text" value={pubForm.type} onChange={(e) => setPubForm({ ...pubForm, type: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Metadata (Journal / Date)</label>
                        <input type="text" value={pubForm.meta} onChange={(e) => setPubForm({ ...pubForm, meta: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Paper Title</label>
                      <input type="text" value={pubForm.title} onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      <label style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Research Role</label>
                      <input type="text" value={pubForm.role} onChange={(e) => setPubForm({ ...pubForm, role: e.target.value })} style={inputStyle} />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitLoading}
                    style={{
                      background: "var(--accent)", color: "#000", fontWeight: "700",
                      padding: "0.8rem", borderRadius: "8px", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                    }}
                  >
                    <FiSave /> {submitLoading ? "Saving..." : "Save Profile Details"}
                  </button>
                </form>
              )}

              {/* SKILLS TAB */}
              {activeTab === "skills" && (
                <div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", marginBottom: "1rem" }}>
                    Manage Technical Skills
                  </h3>

                  {/* Add New Skill Form */}
                  <form onSubmit={handleAddSkill} style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <input 
                        type="text" 
                        placeholder="Category (e.g. Programming, Web)" 
                        value={newSkill.category} 
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <input 
                        type="text" 
                        placeholder="Skill Name (e.g. Python, React)" 
                        value={newSkill.name} 
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <button type="submit" disabled={submitLoading} style={{ background: "var(--accent)", border: "none", color: "#000", fontWeight: "600", padding: "0 1.5rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <FiPlus /> Add Skill
                    </button>
                  </form>

                  {/* List of Skills */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                    {skillsForm.map((s, idx) => (
                      <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "0.75rem 1.25rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase" }}>{s.category}</div>
                          <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff" }}>{s.name}</div>
                        </div>
                        {/* Note: In DB structure we delete by ID, but since skills mapped by category, we can search skill by name */}
                        <button 
                          onClick={() => {
                            // Find matching skill from backend data if ID exists, or mock delete
                            showNotification("Delete via Skills Manager directly.", "error");
                          }}
                          style={{ background: "none", border: "none", color: "#ff6464", cursor: "pointer" }}
                        >
                          <FiTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === "projects" && (
                <div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", marginBottom: "1rem" }}>
                    Manage Projects
                  </h3>

                  {/* Add New Project Form */}
                  <form onSubmit={handleAddProject} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                    <h4 style={{ margin: 0, color: "var(--accent)" }}>Add New Project Card</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <input type="text" placeholder="Number (e.g. 03)" value={newProject.number} onChange={(e) => setNewProject({ ...newProject, number: e.target.value })} style={inputStyle} required />
                      </div>
                      <div>
                        <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} style={inputStyle} required />
                      </div>
                    </div>
                    <div>
                      <input type="text" placeholder="Image URL (e.g. /src/assets/project1.png)" value={newProject.image} onChange={(e) => setNewProject({ ...newProject, image: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <input type="text" placeholder="Stack Tags (comma separated, e.g. React, Supabase, CSS)" value={newProject.stack} onChange={(e) => setNewProject({ ...newProject, stack: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <textarea rows={3} placeholder="Bullet points describing the project (separate bullets with ';;')" value={newProject.bullets} onChange={(e) => setNewProject({ ...newProject, bullets: e.target.value })} style={inputStyle} required />
                    </div>
                    <button type="submit" disabled={submitLoading} style={{ background: "var(--accent)", color: "#000", fontWeight: "600", padding: "0.8rem", borderRadius: "8px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <FiPlus /> Create Project
                    </button>
                  </form>

                  {/* Current Projects List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {projectsForm.map((p) => (
                      <div key={p.id || p.number} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: "0.7rem", color: "var(--accent)" }}>Project {p.number}</div>
                          <h4 style={{ margin: "0.25rem 0", fontSize: "1rem" }}>{p.title}</h4>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.5rem 0" }}>
                            {p.stack?.map(tag => <span key={tag} style={{ background: "rgba(255,255,255,0.05)", fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>{tag}</span>)}
                          </div>
                        </div>
                        {p.id && (
                          <button 
                            onClick={() => handleDeleteItem("projects", p.id)}
                            style={{ background: "none", border: "none", color: "#ff6464", cursor: "pointer" }}
                          >
                            <FiTrash size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPERIENCE TAB */}
              {activeTab === "experience" && (
                <div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", marginBottom: "1rem" }}>
                    Work Experience
                  </h3>

                  {/* Add New Exp Form */}
                  <form onSubmit={handleAddExperience} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                    <h4 style={{ margin: 0, color: "var(--accent)" }}>Add Experience Entry</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                      <input type="text" placeholder="Role (e.g. Intern)" value={newExp.role} onChange={(e) => setNewExp({ ...newExp, role: e.target.value })} style={inputStyle} required />
                      <input type="text" placeholder="Company" value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} style={inputStyle} required />
                      <input type="text" placeholder="Period (e.g. Jun - Aug 2024)" value={newExp.period} onChange={(e) => setNewExp({ ...newExp, period: e.target.value })} style={inputStyle} required />
                    </div>
                    <div>
                      <textarea rows={3} placeholder="Key accomplishments (separate with ';;')" value={newExp.bullets} onChange={(e) => setNewExp({ ...newExp, bullets: e.target.value })} style={inputStyle} required />
                    </div>
                    <button type="submit" disabled={submitLoading} style={{ background: "var(--accent)", color: "#000", fontWeight: "600", padding: "0.8rem", borderRadius: "8px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <FiPlus /> Add Experience
                    </button>
                  </form>

                  {/* Current Exp List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {expForm.map((e) => (
                      <div key={e.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "1rem" }}>{e.role}</h4>
                          <div style={{ fontSize: "0.8rem", color: "var(--accent2)" }}>{e.company} · {e.period}</div>
                        </div>
                        {e.id && (
                          <button 
                            onClick={() => handleDeleteItem("experience", e.id)}
                            style={{ background: "none", border: "none", color: "#ff6464", cursor: "pointer" }}
                          >
                            <FiTrash size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EDUCATION TAB */}
              {activeTab === "education" && (
                <div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", marginBottom: "1rem" }}>
                    Education Background
                  </h3>

                  {/* Add New Edu Form */}
                  <form onSubmit={handleAddEducation} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                    <h4 style={{ margin: 0, color: "var(--accent)" }}>Add Academic Record</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <input type="text" placeholder="Degree (e.g. B.Tech)" value={newEdu.degree} onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} style={inputStyle} required />
                      <input type="text" placeholder="Institution" value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} style={inputStyle} required />
                      <input type="text" placeholder="Period (e.g. 2022 - 2026)" value={newEdu.period} onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })} style={inputStyle} required />
                      <input type="text" placeholder="CGPA / Grade (e.g. 7.39)" value={newEdu.cgpa} onChange={(e) => setNewEdu({ ...newEdu, cgpa: e.target.value })} style={inputStyle} required />
                    </div>
                    <button type="submit" disabled={submitLoading} style={{ background: "var(--accent)", color: "#000", fontWeight: "600", padding: "0.8rem", borderRadius: "8px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <FiPlus /> Add Record
                    </button>
                  </form>

                  {/* Current Edu List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {eduForm.map((ed) => (
                      <div key={ed.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "1rem" }}>{ed.degree}</h4>
                          <div style={{ fontSize: "0.8rem", color: "var(--accent2)" }}>{ed.institution} · {ed.period}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>CGPA: {ed.cgpa}</div>
                        </div>
                        {ed.id && (
                          <button 
                            onClick={() => handleDeleteItem("education", ed.id)}
                            style={{ background: "none", border: "none", color: "#ff6464", cursor: "pointer" }}
                          >
                            <FiTrash size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CERTS TAB */}
              {activeTab === "certs" && (
                <div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", marginBottom: "1rem" }}>
                    Certifications & Credentials
                  </h3>

                  {/* Add New Cert Form */}
                  <form onSubmit={handleAddCert} style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <input type="text" placeholder="Certificate Title" value={newCert.name} onChange={(e) => setNewCert({ ...newCert, name: e.target.value })} style={inputStyle} required />
                    </div>
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <input type="text" placeholder="Issuer (e.g. Google Cloud, IBM)" value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} style={inputStyle} required />
                    </div>
                    <button type="submit" disabled={submitLoading} style={{ background: "var(--accent)", border: "none", color: "#000", fontWeight: "600", padding: "0 1.5rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <FiPlus /> Add Cert
                    </button>
                  </form>

                  {/* List of Certs */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                    {certsForm.map((c) => (
                      <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "0.75rem 1.25rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff" }}>{c.name}</div>
                          <div style={{ fontSize: "0.65rem", color: "var(--muted)", textTransform: "uppercase" }}>{c.issuer}</div>
                        </div>
                        {c.id && (
                          <button 
                            onClick={() => handleDeleteItem("certifications", c.id)}
                            style={{ background: "none", border: "none", color: "#ff6464", cursor: "pointer" }}
                          >
                            <FiTrash size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "inherit",
  fontSize: "0.8rem",
  outline: "none",
  marginTop: "0.25rem"
};
