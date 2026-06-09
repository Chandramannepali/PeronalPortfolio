import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioDataContext";
import TextScramble from "./TextScramble";
import MagneticButton from "./MagneticButton";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

export default function Hero() {
  const { profileData } = usePortfolio();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const [videoPlayFailed, setVideoPlayFailed] = useState(false);
  const [bgVideoPlayFailed, setBgVideoPlayFailed] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    const startVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.log("Avatar video play pending user interaction:", err);
        });
      }
      if (bgVideoRef.current) {
        bgVideoRef.current.play().catch((err) => {
          console.log("Background video play pending user interaction:", err);
        });
      }
    };

    // Try playing immediately
    startVideo();

    // Fallback: unlock playback on first user touch/click (standard for mobile browser autoplay policies)
    const handleInteraction = () => {
      startVideo();
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("touchstart", handleInteraction, { passive: true });
    document.addEventListener("click", handleInteraction, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector(".snap-container");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      if (scrollTop > 200) {
        if (videoRef.current && !videoRef.current.muted) {
          videoRef.current.muted = true;
          setIsMuted(true);
        }
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
    <section className="hero" id="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      {/* Background Video */}
      <video 
        ref={bgVideoRef}
        src="/assets/name_chandra_role_AI_full_s.mp4" 
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          display: bgVideoPlayFailed ? "none" : "block"
        }}
        onError={() => setBgVideoPlayFailed(true)}
      />
      {/* Dark overlay for readability */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, rgba(10, 10, 15, 0.7) 0%, rgba(10, 10, 15, 0.85) 100%)",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />

      <div className="hero-grid-bg" style={{ zIndex: 1 }} />
      <div className="hero-glow" style={{ zIndex: 1 }} />
      <div className="hero-orb hero-orb-1" style={{ zIndex: 1 }} />
      <div className="hero-orb hero-orb-2" style={{ zIndex: 1 }} />
      <div className="aurora" style={{ zIndex: 1 }} />

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
          textAlign: "left",
          position: "relative",
          zIndex: 2
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
            <video 
              ref={videoRef}
              src="/assets/name_chandra_role_AI_full_s.mp4" 
              autoPlay
              loop
              muted={isMuted}
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "inherit",
                display: videoPlayFailed ? "none" : "block"
              }}
              onError={() => setVideoPlayFailed(true)}
            />
            <img 
              src="/assets/poorna.png" 
              alt={profileData.fullName}
              onError={(e) => {
                // If user hasn't added poorna.png yet, show a stunning animated SVG avatar
                e.target.style.display = 'none';
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = 'flex';
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "inherit",
                display: videoPlayFailed ? "block" : "none"
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

          {/* Mute/Unmute floating trigger button */}
          <button
            onClick={toggleMute}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "20px",
              background: "rgba(10, 10, 15, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: videoPlayFailed ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              cursor: "pointer",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              transition: "transform 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.background = "var(--accent)";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "rgba(10, 10, 15, 0.75)";
              e.currentTarget.style.color = "#fff";
            }}
          >
            {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
          </button>

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
