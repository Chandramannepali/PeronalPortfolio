import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioDataContext";
import { useInView } from "../hooks/useInView";
import TiltCard from "./TiltCard";

// Import beautiful developer icons
import { 
  FaPython, FaJava, FaReact, FaHtml5, FaCss3Alt, FaGitAlt, FaGithub, FaDatabase,
  FaMicrophone, FaVolumeUp, FaVolumeMute, FaChartLine
} from "react-icons/fa";
import { 
  SiJavascript, SiSupabase, SiStreamlit, SiHuggingface, SiOpenai 
} from "react-icons/si";

// Helper to map skill name to icon component
const getSkillIcon = (name) => {
  const normName = name.toLowerCase().trim();
  switch (normName) {
    case "python": return <FaPython color="#3776AB" />;
    case "java": return <FaJava color="#007396" />;
    case "html": return <FaHtml5 color="#E34F26" />;
    case "css": return <FaCss3Alt color="#1572B6" />;
    case "javascript": return <SiJavascript color="#F7DF1E" style={{ background: "#000" }} />;
    case "react": return <FaReact color="#61DAFB" />;
    case "supabase": return <SiSupabase color="#3ECF8E" />;
    case "streamlit": return <SiStreamlit color="#FF4B4B" />;
    case "git": return <FaGitAlt color="#F05032" />;
    case "github": return <FaGithub color="#FFF" />;
    case "sql": return <FaDatabase color="#003B57" />;
    case "speechrecognition": return <FaMicrophone color="#4af0c4" />;
    case "pyaudio": return <FaVolumeUp color="#c8f135" />;
    case "pyttsx3": return <FaVolumeMute color="#FF6F61" />;
    case "tokenization analysis": return <FaChartLine color="#4af0c4" />;
    case "vs code": return <SiOpenai color="#007ACC" />;
    case "gpt-2": return <SiOpenai color="#412991" />;
    case "llama": return <SiOpenai color="#04d9ff" />;
    case "t5": return <SiOpenai color="#c8f135" />;
    case "hugging face": return <SiHuggingface color="#FFD21E" />;
    default: return <FaDatabase color="#c8f135" />;
  }
};

const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemV = {
  hidden: { opacity: 0, y: 40, scale: 0.9, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Skills() {
  const { skillsData } = usePortfolio();
  const [ref, inView] = useInView(0.1);

  return (
    <section id="skills" className="skills-section">
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
          {skillsData.map((group) => (
            <motion.div variants={itemV} key={group.category}>
              <TiltCard className="skill-cell" style={{ position: "relative", overflow: "hidden" }}>
                <div className="skill-category">{group.category}</div>
                <div className="skill-items" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  {group.items.map((item, j) => (
                    <motion.span 
                      className="skill-tag" 
                      key={item}
                      whileHover={{ scale: 1.1, borderColor: "rgba(200,241,53,0.5)", color: "#c8f135", backgroundColor: "rgba(200,241,53,0.05)" }}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      {getSkillIcon(item)}
                      {item}
                    </motion.span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
