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
      {/* Top Part: Opportunities tag */}
      <motion.div 
        className="hero-tag" 
        variants={itemVariants} 
        initial="hidden"
        animate="visible"
        style={{ alignSelf: "center", marginBottom: 0, zIndex: 5 }}
      >
        <span className="pulse-dot" />
        {profileData.tagline}
      </motion.div>

      {/* Middle Part: Reduced Size Video Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          zIndex: 4,
          margin: "1rem 0"
        }}
      >
        <div style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 45px rgba(0,0,0,0.5), 0 0 25px rgba(200,241,53,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(10,10,15,0.6)",
          height: "clamp(220px, 36vh, 320px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
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
              height: "100%",
              width: "auto",
              objectFit: "contain",
              display: bgVideoPlayFailed ? "none" : "block",
            }}
            onError={() => setBgVideoPlayFailed(true)}
          />
          
          {/* Mute/Unmute Overlay Button positioned exactly to cover the Gemini watermark in the bottom-right corner of the video */}
          <button
            onClick={toggleMute}
            style={{
              position: "absolute",
              bottom: "0.75rem",
              right: "0.75rem",
              zIndex: 10,
              background: "#0c0c0e", 
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: isMuted ? "var(--muted)" : "var(--accent)",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0,0,0,0.6)"
            }}
            title={isMuted ? "Unmute Intro Video" : "Mute Intro Video"}
          >
            {isMuted ? (
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"></path>
              </svg>
            ) : (
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </button>
        </div>
      </motion.div>

      {/* Bottom Part: Intro info, new subtitle "Ai Full stack Devloper", and CTA buttons */}
      <motion.div 
        className="hero-inner"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "800px",
          textAlign: "center",
          position: "relative",
          zIndex: 5,
          gap: "1.25rem",
          marginBottom: "2rem"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", width: "100%" }}>
          <motion.h1 
            className="hero-name" 
            variants={itemVariants}
            style={{ fontSize: "clamp(2rem, 5.5vw, 3.8rem)", textAlign: "center", marginBottom: 0 }}
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
              textAlign: "center", 
              margin: "0 auto", 
              maxWidth: "600px",
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

          <motion.div className="hero-cta" variants={itemVariants} style={{ justifyContent: "center", marginTop: "0.5rem" }}>
            <MagneticButton href="#projects" className="btn btn-primary btn-glow">
              View Projects
            </MagneticButton>
            <MagneticButton href={`mailto:${profileData.email}`} className="btn btn-outline">
              Get in Touch
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

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
