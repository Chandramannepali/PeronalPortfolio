import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiSun, FiMoon } from "react-icons/fi";
import { usePortfolio } from "../context/PortfolioDataContext";

const links = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { profileData } = usePortfolio();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    const container = document.querySelector(".snap-container");
    if (el && container) {
      // Temporarily disable scroll snapping to allow smooth scroll animation
      container.style.scrollSnapType = "none";
      el.scrollIntoView({ behavior: "smooth" });
      
      const handleScrollEnd = () => {
        container.style.scrollSnapType = "y mandatory";
        container.removeEventListener("scrollend", handleScrollEnd);
      };
      
      if ("onscrollend" in window) {
        container.addEventListener("scrollend", handleScrollEnd);
      } else {
        setTimeout(() => {
          container.style.scrollSnapType = "y mandatory";
        }, 1000);
      }
      
      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const scrollContainer = document.querySelector(".snap-container");
      if (!scrollContainer) return;

      let lastY = 0;
      const onScroll = () => {
        const y = scrollContainer.scrollTop;
        setHidden(y > 80 && y > lastY);
        lastY = y;

        // Calculate scroll progress
        const totalScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        if (totalScroll > 0) {
          setScrollProgress(y / totalScroll);
        }

        // determine active section
        const sections = links.map((l) => l.href.slice(1));
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < 200) {
              setActive(sections[i]);
              break;
            }
          }
        }
      };

      scrollContainer.addEventListener("scroll", onScroll, { passive: true });
      onScroll(); // run once on mount

      return () => {
        scrollContainer.removeEventListener("scroll", onScroll);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.nav
        className={`navbar ${hidden ? "hidden" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <a 
          href="#" 
          className="nav-logo"
          onClick={(e) => handleNavClick(e, "hero")}
        >
          {profileData.fullName.split(" ").map(w => w[0]).join("")}/
        </a>
        <ul className="nav-links" style={{ alignItems: "center" }}>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={active === l.href.slice(1) ? "active" : ""}
                onClick={(e) => handleNavClick(e, l.href.slice(1))}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                fontSize: "0.9rem",
                padding: "0 0.5rem",
                transition: "color 0.2s",
              }}
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} color="var(--accent)" />}
            </button>
          </li>
        </ul>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        {/* Scroll Progress Bar */}
        <div 
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: `${scrollProgress * 100}%`,
            height: "2px",
            background: "var(--gradient-accent)",
            transition: "width 0.1s ease",
          }}
        />
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 49,
              background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "2rem",
            }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  setMobileOpen(false);
                  handleNavClick(e, l.href.slice(1));
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 700,
                  fontSize: "1.5rem", color: "var(--text)",
                  textDecoration: "none", letterSpacing: "-0.02em",
                }}
              >
                {l.label}
              </motion.a>
            ))}

            <button
              onClick={toggleTheme}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                marginTop: "1rem",
              }}
            >
              {theme === "light" ? <><FiMoon /> Dark Mode</> : <><FiSun color="var(--accent)" /> Light Mode</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
