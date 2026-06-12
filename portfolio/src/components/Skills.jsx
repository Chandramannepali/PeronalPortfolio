import { useState } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioDataContext";
import { useInView } from "../hooks/useInView";
import TiltCard from "./TiltCard";

// Import beautiful developer and category icons
import { 
  FaPython, FaJava, FaReact, FaHtml5, FaCss3Alt, FaGitAlt, FaGithub, FaDatabase,
  FaMicrophone, FaVolumeUp, FaVolumeMute, FaChartLine, FaTerminal, FaLaptopCode,
  FaBrain, FaTools, FaRobot
} from "react-icons/fa";
import { 
  SiJavascript, SiSupabase, SiStreamlit, SiHuggingface, SiOpenai 
} from "react-icons/si";

// Helper to map skill name to icon component with authentic brand colors
const getSkillIcon = (name) => {
  const normName = name.toLowerCase().trim();
  switch (normName) {
    case "python": return <FaPython color="#3776AB" />;
    case "java": return <FaJava color="#F89820" />;
    case "html": return <FaHtml5 color="#E34F26" />;
    case "css": return <FaCss3Alt color="#1572B6" />;
    case "javascript": return <SiJavascript color="#F7DF1E" style={{ background: "#000" }} />;
    case "react": return <FaReact color="#61DAFB" />;
    case "supabase": return <SiSupabase color="#3ECF8E" />;
    case "streamlit": return <SiStreamlit color="#FF4B4B" />;
    case "git": return <FaGitAlt color="#F05032" />;
    case "github": return <FaGithub color="#FFF" />;
    case "sql": return <FaDatabase color="#336791" />;
    case "speechrecognition": return <FaMicrophone color="#00A67E" />;
    case "pyaudio": return <FaVolumeUp color="#3ECF8E" />;
    case "pyttsx3": return <FaVolumeMute color="#FF4B4B" />;
    case "tokenization analysis": return <FaChartLine color="#FFD21E" />;
    case "vs code": return <SiOpenai color="#007ACC" />;
    case "gpt-2": return <SiOpenai color="#00A67E" />;
    case "llama": return <SiOpenai color="#00A67E" />;
    case "t5": return <SiOpenai color="#00A67E" />;
    case "hugging face": return <SiHuggingface color="#FFD21E" />;
    default: return <FaDatabase color="#3ECF8E" />;
  }
};

// Helper to map skill category to card header icon
const getCategoryIcon = (category) => {
  const norm = category.toLowerCase();
  if (norm.includes("programming")) return <FaTerminal color="var(--accent)" />;
  if (norm.includes("web")) return <FaLaptopCode color="#61DAFB" />;
  if (norm.includes("ai")) return <FaBrain color="#00A67E" />;
  if (norm.includes("database")) return <FaDatabase color="#3ECF8E" />;
  if (norm.includes("tools")) return <FaTools color="#F05032" />;
  if (norm.includes("llm")) return <FaRobot color="#FFD21E" />;
  return <FaTerminal color="var(--accent)" />;
};

const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemV = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Skills() {
  const { skillsData } = usePortfolio();
  const [ref, inView] = useInView(0.1);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="skills-section">
      <div className="section-inner" ref={ref}>
        <motion.p className="section-label"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >What I work with</motion.p>
        <motion.h2 className="section-title"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >Technical Skills</motion.h2>
        
        <motion.div className="skills-grid"
          variants={containerV}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {skillsData.map((group, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            
            // Premium Spotlight highlight calculations
            const cardOpacity = isAnyHovered ? (isHovered ? 1 : 0.4) : 1;
            const cardScale = isAnyHovered ? (isHovered ? 1.03 : 0.98) : 1;

            return (
              <motion.div 
                key={group.category}
                variants={itemV}
                style={{ originY: 0.5, originX: 0.5 }}
                animate={{ 
                  opacity: cardOpacity, 
                  scale: cardScale,
                  filter: isAnyHovered && !isHovered ? "blur(1px)" : "blur(0px)"
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <TiltCard className="skill-cell" style={{ position: "relative", overflow: "hidden" }}>
                  <div className="skill-header">
                    <div className="skill-category">{group.category}</div>
                    <div className="skill-cat-icon">{getCategoryIcon(group.category)}</div>
                  </div>
                  <div className="skill-items">
                    {group.items.map((item) => (
                      <motion.span 
                        className="skill-tag" 
                        key={item}
                        whileHover={{ 
                          scale: 1.08, 
                          borderColor: "rgba(200,241,53,0.35)",
                          color: "var(--accent)",
                          backgroundColor: "rgba(200,241,53,0.05)"
                        }}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                      >
                        {getSkillIcon(item)}
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
