import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextScramble from "./TextScramble";

const sectionTitles = {
  skills: "TECHNICAL SKILLS",
  projects: "CREATIVE PROJECTS",
  experience: "WORK EXPERIENCE",
  education: "EDUCATION & TIMELINE",
  publication: "RESEARCH & PUBLICATIONS",
  contact: "GET IN TOUCH",
  hero: "HOME",
};

export default function PageTransition() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initial load transition
  useEffect(() => {
    setDisplayText("M POORNA CHANDRA RAO");
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setIsInitialLoad(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);



  // Framer Motion Variants for Staggered Panels
  const panel1Variants = {
    hidden: { y: "100%" },
    visible: { 
      y: "0%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
    },
    exit: { 
      y: "-100%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: 0.1 }
    }
  };

  const panel2Variants = {
    hidden: { y: "100%" },
    visible: { 
      y: "0%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: 0.05 }
    },
    exit: { 
      y: "-100%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: 0.05 }
    }
  };

  const panel3Variants = {
    hidden: { y: "100%" },
    visible: { 
      y: "0%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: 0.1 }
    },
    exit: { 
      y: "-100%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <AnimatePresence>
      {isAnimating && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990, // Positioned right under the custom cursor (9999)
            pointerEvents: "auto",
            overflow: "hidden"
          }}
        >
          {/* Background Panel (Layer 1) */}
          <motion.div 
            variants={panel1Variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--border)",
              zIndex: 1
            }}
          />

          {/* Mid Panel (Layer 2) */}
          <motion.div 
            variants={panel2Variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--surface)",
              zIndex: 2
            }}
          />

          {/* Foreground Panel (Layer 3) */}
          <motion.div 
            variants={panel3Variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--bg)",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Tech grid aesthetic overlay */}
            <div className="hero-grid-bg" style={{ opacity: 0.5 }} />

            <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
              <div 
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: "var(--accent2)",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem"
                }}
              >
                // SYSTEM LOAD
              </div>

              <h2 
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                  margin: 0
                }}
              >
                <TextScramble text={displayText} duration={700} />
              </h2>

              {/* Progress bar line */}
              <div 
                style={{
                  width: "160px",
                  height: "2px",
                  background: "var(--gradient-accent)",
                  margin: "1.5rem auto 0",
                  position: "relative",
                  borderRadius: "2px",
                  overflow: "hidden"
                }}
              >
                <motion.div 
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "50%",
                    background: "rgba(255,255,255,0.7)"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
