import { usePortfolio } from "../context/PortfolioDataContext";
import { FiKey } from "react-icons/fi";

export default function Footer({ onAdminClick }) {
  const { profileData } = usePortfolio();
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} {profileData.fullName}</span>
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        Built with intention · {profileData.location.split(",")[0]}, AP
        <button 
          onClick={onAdminClick}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "none",
            display: "inline-flex",
            padding: 0,
            verticalAlign: "middle",
          }}
          title="Admin Console"
        >
          <FiKey size={11} style={{ opacity: 0.5 }} />
        </button>
      </span>
    </footer>
  );
}
