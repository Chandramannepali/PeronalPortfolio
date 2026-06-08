import { profileData } from "../data/portfolioData";

export default function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} {profileData.fullName}</span>
      <span>Built with intention · {profileData.location.split(",")[0]}, AP</span>
    </footer>
  );
}
