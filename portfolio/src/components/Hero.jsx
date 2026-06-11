import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioDataContext";
import TextScramble from "./TextScramble";
import MagneticButton from "./MagneticButton";
import Marquee from "./Marquee";

export default function Hero() {
  const { profileData } = usePortfolio();
  const heroRef = useRef(null);
  const bgVideoRef = useRef(null);
  const [bgVideoPlayFailed, setBgVideoPlayFailed] = useState(false);
  
  const [isMuted, setIsMuted] = useState(true);
  const [userMuteChoice, setUserMuteChoice] = useState(true);

  // Toggle mute choice and update local player status
  const toggleMute = () => {
    const nextChoice = !userMuteChoice;
    setUserMuteChoice(nextChoice);
    setIsMuted(nextChoice);
  };

  // Sync the video ref property with isMuted state
  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Observer to mute audio automatically when Hero scrolls out of view
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Came back in view: restore user's custom preference
          setIsMuted(userMuteChoice);
        } else {
          // Scrolled away: force mute to keep audio inside Hero only
          setIsMuted(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [userMuteChoice]);

  useEffect(() => {
    const startVideo = () => {
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
    <section 
      ref={heroRef} 
      className="hero" 
      id="hero" 
      style={{ 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "space-between", 
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        padding: "7.5rem 1.5rem 5.5rem",
        boxSizing: "border-box"
      }}
    >
      {/* Background Video (High Quality GPU accelerated) */}
      <video 
        ref={bgVideoRef}
        src="/assets/name_chandra_role_AI_full_s.mp4" 
        autoPlay
        loop
        muted={isMuted}
        playsInline
        webkit-playsinline="true"
        preload="auto"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "70% 10%", // Adjusted from center to 10% to prevent head cut-off
          zIndex: 0,
          pointerEvents: "none",
          display: bgVideoPlayFailed ? "none" : "block",
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          imageRendering: "auto",
          opacity: 0.7
        }}
        onError={() => setBgVideoPlayFailed(true)}
      />
      {/* Lighter overlay for readability while keeping the background video bright and premium */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(10, 10, 15, 0.45)",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />

      {/* Spacer to replace old top tag location in vertical distribution */}
      <div style={{ height: "2rem", zIndex: 5 }} />

      {/* Left-aligned overlay content container */}
      <div style={{
        width: "100%",
        maxWidth: "1100px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        zIndex: 5,
        flex: 1,
        padding: "0 2rem"
      }}>
        {/* Left Side: Name, subtitle, and CTA buttons */}
        <motion.div 
          className="hero-text-side"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1.25rem",
            maxWidth: "650px",
            width: "100%"
          }}
        >
          {/* Opportunities tag left-aligned inside text side */}
          <motion.div 
            className="hero-tag" 
            variants={itemVariants} 
            style={{ alignSelf: "flex-start", marginBottom: "0.5rem" }}
          >
            <span className="pulse-dot" />
            {profileData.tagline}
          </motion.div>

          <motion.h1 
            className="hero-name" 
            variants={itemVariants}
            style={{ 
              fontSize: "clamp(2rem, 5.5vw, 3.8rem)", 
              textAlign: "left", 
              lineHeight: "1.05",
              marginBottom: 0 
            }}
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
            style={{ 
              textAlign: "left", 
              margin: 0, 
              fontFamily: "Outfit, sans-serif",
              fontSize: "1.15rem",
              fontWeight: "600",
              color: "var(--accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            Ai Full stack Devloper
          </motion.p>

          <motion.div className="hero-cta" variants={itemVariants} style={{ justifyContent: "flex-start", marginTop: "0.5rem" }}>
            <MagneticButton href="#projects" className="btn btn-primary btn-glow">
              View Projects
            </MagneticButton>
            <MagneticButton href={`mailto:${profileData.email}`} className="btn btn-outline">
              Get in Touch
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating control button (covers Gemini logo watermark in the bottom-right corner of screen) */}
      <div style={{
        position: "absolute",
        bottom: "5rem",
        right: "2rem",
        zIndex: 10
      }}>
        <button
          onClick={toggleMute}
          style={{
            background: "#0c0c0e", 
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            width: "56px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          title={isMuted ? "Unmute Background Video" : "Mute Background Video"}
        >
          {isMuted ? (
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"></path>
            </svg>
          ) : (
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Absolute Bottom Infinite Skills Bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 3
      }}>
        <Marquee />
      </div>
    </section>
  );
}
