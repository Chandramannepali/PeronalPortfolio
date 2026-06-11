import { marqueeItems } from "../data/portfolioData";
import { FaPython, FaJava, FaReact, FaGitAlt, FaHtml5, FaCss3Alt, FaBrain } from "react-icons/fa";
import { SiSupabase, SiStreamlit, SiHuggingface, SiPostgresql, SiOpenai, SiArduino } from "react-icons/si";

const skillIcons = {
  "Python": <FaPython style={{ color: "#3776AB" }} />,
  "Java": <FaJava style={{ color: "#F89820" }} />,
  "React": <FaReact style={{ color: "#61DAFB" }} />,
  "Supabase": <SiSupabase style={{ color: "#3ECF8E" }} />,
  "Streamlit": <SiStreamlit style={{ color: "#FF4B4B" }} />,
  "Hugging Face": <SiHuggingface style={{ color: "#FFD21E" }} />,
  "SQL": <SiPostgresql style={{ color: "#336791" }} />,
  "Git": <FaGitAlt style={{ color: "#F05032" }} />,
  "HTML & CSS": (
    <span style={{ display: "inline-flex", gap: "0.2rem" }}>
      <FaHtml5 style={{ color: "#E34F26" }} />
      <FaCss3Alt style={{ color: "#1572B6" }} />
    </span>
  ),
  "LLM Tooling": <FaBrain style={{ color: "#FF69B4" }} />,
  "AI / ML": <SiOpenai style={{ color: "#00A67E" }} />,
  "IoT": <SiArduino style={{ color: "#00979D" }} />,
};

export default function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span className="marquee-item-pill" key={i}>
            <span className="marquee-icon">{skillIcons[item] || <FaBrain />}</span>
            <span className="marquee-text">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
