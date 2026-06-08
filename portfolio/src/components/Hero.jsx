import { motion } from "framer-motion";
import { profileData } from "../data/portfolioData";
import TextScramble from "./TextScramble";
import MagneticButton from "./MagneticButton";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="hero" id="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="hero-grid-bg" />
      <div className="hero-glow" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="aurora" />

      <motion.div 
        className="hero-inner"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "4rem",
          alignItems: "center",
          width: "100%",
          textAlign: "left"
        }}
      >
        {/* Left Side: Avatar Panel */}
        <motion.div 
          variants={itemVariants}
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative"
          }}
        >
          <div className="avatar-frame" style={{
            position: "relative",
            width: "280px",
            height: "280px",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            background: "linear-gradient(135deg, rgba(200,241,53,0.1) 0%, rgba(74,240,196,0.1) 100%)",
            border: "2px solid rgba(200,241,53,0.3)",
            padding: "8px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 50px rgba(200,241,53,0.1)",
            animation: "morphBlob 8s ease-in-out infinite alternate",
            overflow: "hidden"
          }}>
            <img 
              src="/src/assets/poorna.png" 
              alt={profileData.fullName}
              onError={(e) => {
                // If user hasn't added poorna.png yet, show a stunning animated SVG avatar
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "inherit"
              }}
            />
            {/* Fallback Graphic */}
            <div style={{
              display: "none",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #15151f 0%, #1e1e2e 100%)",
              borderRadius: "inherit",
              flexDirection: "column",
              color: "var(--accent)"
            }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ fontSize: "0.65rem", marginTop: "1rem", letterSpacing: "0.15em", color: "var(--muted)", textTransform: "uppercase" }}>
                Add poorna.png
              </span>
            </div>
          </div>

          {/* Decorative tech rings */}
          <div className="avatar-ring-outer" style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            border: "1px dashed rgba(74,240,196,0.2)",
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            animation: "spinSlow 25s linear infinite"
          }} />
        </motion.div>

        {/* Right Side: Introduction Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <motion.div className="hero-tag" variants={itemVariants} style={{ alignSelf: "flex-start", marginBottom: 0 }}>
            <span className="pulse-dot" />
            {profileData.tagline}
          </motion.div>

          <motion.h1 
            className="hero-name" 
            variants={itemVariants}
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", textAlign: "left", marginBottom: 0 }}
          >
            <TextScramble text={profileData.name} className="name-glitch" as="span" />
            <br />
            <motion.span className="line2" style={{ WebkitTextStroke: "1px rgba(232,232,240,0.2)" }}>
              {profileData.nameLine2}
            </motion.span>
          </motion.h1>

          <motion.p 
            className="hero-summary" 
            variants={itemVariants}
            style={{ textAlign: "left", margin: 0 }}
          >
            {profileData.summary}
          </motion.p>

          <motion.div className="hero-cta" variants={itemVariants} style={{ justifyContent: "flex-start" }}>
            <MagneticButton href="#projects" className="btn btn-primary btn-glow">
              View Projects
            </MagneticButton>
            <MagneticButton href={`mailto:${profileData.email}`} className="btn btn-outline">
              Get in Touch
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating background badges */}
      <div className="hero-floaters">
        {["AI/ML", "React", "Java", "Python"].map((t, i) => (
          <motion.span key={t} className="float-badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: 1.2 + i * 0.15, duration: 0.5 },
              scale: { delay: 1.2 + i * 0.15, duration: 0.5 },
              y: { delay: 1.5 + i * 0.15, duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >{t}</motion.span>
        ))}
      </div>

      <motion.div className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <div className="scroll-line" />
        Scroll
      </motion.div>
    </section>
  );
}
