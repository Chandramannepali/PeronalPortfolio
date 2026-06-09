import { createContext, useContext, useState, useEffect } from "react";
import * as staticData from "../data/portfolioData";

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState({
    profileData: staticData.profileData,
    marqueeItems: staticData.marqueeItems,
    skillsData: staticData.skillsData,
    projectsData: staticData.projectsData,
    experienceData: staticData.experienceData,
    educationData: staticData.educationData,
    certificationsData: staticData.certificationsData,
    publicationData: staticData.publicationData,
    isLoading: true,
    isLive: false,
  });

  const fetchLiveData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/profile");
      if (!response.ok) {
        throw new Error("Failed to load live profile");
      }
      const live = await response.json();

      // Dynamically split fullName into name & nameLine2 for the visual Hero animation
      const parts = (live.name || "").split(" ");
      let name = parts[0] || "";
      let nameLine2 = parts.slice(1).join(" ");
      if (name.length <= 2 && parts.length > 2) {
        name = parts[1];
        nameLine2 = parts.slice(2).join(" ");
      }

      const profileMapped = {
        name,
        nameLine2,
        fullName: live.name,
        tagline: live.tagline,
        summary: live.summary,
        email: live.email,
        phone: live.phone,
        location: live.location,
        languages: live.languages,
        github: live.github,
        linkedin: live.linkedin,
      };

      setData({
        profileData: profileMapped,
        marqueeItems: staticData.marqueeItems, // Marquee is visual, keep static
        skillsData: live.skills || staticData.skillsData,
        projectsData: (live.projects || []).map((p, index) => ({
          number: p.number,
          title: p.title,
          stack: p.stack,
          bullets: p.bullets,
          image: staticData.projectsData[index]?.image || "", // map image assets locally
          link: staticData.projectsData[index]?.link || "#",
        })),
        experienceData: live.experience || staticData.experienceData,
        educationData: live.education || staticData.educationData,
        certificationsData: live.certifications || staticData.certificationsData,
        publicationData: live.publication || staticData.publicationData,
        isLoading: false,
        isLive: true,
      });
      console.log(">>> Portfolio successfully hydrated with dynamic backend data.");
    } catch (err) {
      console.warn(">>> Live portfolio API offline. Using local static data.");
      setData((prev) => ({ ...prev, isLoading: false, isLive: false }));
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  return (
    <PortfolioDataContext.Provider value={{ ...data, refreshData: fetchLiveData }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioDataProvider");
  }
  return context;
}
