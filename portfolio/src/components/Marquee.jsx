import { marqueeItems } from "../data/portfolioData";
import { FaPython, FaJava, FaReact, FaGitAlt, FaHtml5, FaCss3Alt, FaBrain } from "react-icons/fa";
import { SiSupabase, SiStreamlit, SiHuggingface, SiPostgresql, SiOpenai, SiArduino } from "react-icons/si";

const skillIcons = {
  "Python": <FaPython />,
  "Java": <FaJava />,
  "React": <FaReact />,
  "Supabase": <SiSupabase />,
  "Streamlit": <SiStreamlit />,
  "Hugging Face": <SiHuggingface />,
  "SQL": <SiPostgresql />,
  "Git": <FaGitAlt />,
  "HTML & CSS": <span style={{ display: "inline-flex", gap: "0.2rem" }}><FaHtml5 /><FaCss3Alt /></span>,
  "LLM Tooling": <FaBrain />,
  "AI / ML": <SiOpenai />,
  "IoT": <SiArduino />,
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
