import { useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { usePortfolio } from "../context/PortfolioDataContext";
import { useInView } from "../hooks/useInView";
import MagneticButton from "./MagneticButton";

const API_BASE = "http://localhost:8080/api";

export default function Contact() {
  const { profileData } = usePortfolio();
  const [ref, inView] = useInView(0.1);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setSending(false);
  };

  return (
    <section id="contact" className="contact-section" style={{ position: "relative" }}>
      <div className="section-inner" ref={ref}>
        <motion.p className="section-label" style={{ textAlign: "center" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >Get in touch</motion.p>
        <motion.h2 className="section-title" style={{ textAlign: "center", marginBottom: "1rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >Let's Work Together</motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", marginTop: "3rem", textAlign: "left" }}>
          
          {/* Contact Details Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: "700" }}>Contact Info</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <a href={`mailto:${profileData.email}`} style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text)", textDecoration: "none" }} className="contact-item-link">
                <div style={{ color: "var(--accent)", background: "rgba(200,241,53,0.08)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyValue: "center", justifyContent: "center" }}>
                  <FiMail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Email Me</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "400" }}>{profileData.email}</div>
                </div>
              </a>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text)" }}>
                <div style={{ color: "var(--accent)", background: "rgba(200,241,53,0.08)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyValue: "center", justifyContent: "center" }}>
                  <FiPhone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Call Me</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "400" }}>{profileData.phone}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text)" }}>
                <div style={{ color: "var(--accent)", background: "rgba(200,241,53,0.08)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyValue: "center", justifyContent: "center" }}>
                  <FiMapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)" }}>Location</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "400" }}>{profileData.location}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <MagneticButton href={profileData.github} className="btn btn-outline" target="_blank" rel="noreferrer">
                <FiGithub style={{ marginRight: "0.5rem", verticalAlign: "middle" }} /> GitHub
              </MagneticButton>
              <MagneticButton href={profileData.linkedin} className="btn btn-outline" target="_blank" rel="noreferrer">
                <FiLinkedin style={{ marginRight: "0.5rem", verticalAlign: "middle" }} /> LinkedIn
              </MagneticButton>
            </div>
          </motion.div>

          {/* Form Submission Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <form className="contact-form" onSubmit={handleSubmit} style={{ margin: 0, maxWidth: "100%" }}>
              <div className="form-group">
                <label htmlFor="cf-name">Your Name</label>
                <input id="cf-name" type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="cf-email">Your Email</label>
                <input id="cf-email" type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="cf-message">Message</label>
                <textarea id="cf-message" rows={4} required value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              
              <div style={{ marginTop: "0.5rem" }}>
                <MagneticButton type="submit" disabled={sending} className="btn btn-primary btn-glow form-submit" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  {sending ? "Sending..." : <>Send Message <FiSend size={12} /></>}
                </MagneticButton>
              </div>

              {status === "success" && (
                <div className="form-status success" style={{ marginTop: "1rem" }}>✓ Message sent successfully!</div>
              )}
              {status === "error" && (
                <div className="form-status error" style={{ marginTop: "1rem" }}>✕ Failed to send. Please try again or email directly.</div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
