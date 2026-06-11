export const profileData = {
  name: "Poorna",
  nameLine2: "Chandra Rao",
  fullName: "M Poorna Chandra Rao",
  tagline: "Available for Opportunities · 2026 Graduate",
  summary:
    "Aspiring software engineer building scalable, real-world solutions with Python, Java, and AI/ML — from LLM tooling to full-stack marketplaces.",
  email: "chandramannepalli239@gmail.com",
  phone: "+91 97036 52569",
  location: "Nellore, Andhra Pradesh",
  languages: "Telugu · English · Tamil",
  github: "https://github.com/Chandramannepali",
  linkedin: "https://www.linkedin.com/in/poorna-chandra-rao-mannepalli-44b101259",
};

export const marqueeItems = [
  "Python", "Java", "React", "Supabase", "Streamlit",
  "Hugging Face", "SQL", "Git", "HTML & CSS",
  "LLM Tooling", "AI / ML", "IoT",
];

export const skillsData = [
  { category: "Programming", items: ["Python", "Java"] },
  { category: "Web", items: ["HTML", "CSS", "JavaScript", "React"] },
  { category: "AI / ML", items: ["SpeechRecognition", "PyAudio", "Pyttsx3", "Tokenization Analysis"] },
  { category: "Database", items: ["SQL", "Supabase"] },
  { category: "Tools", items: ["Git", "GitHub", "VS Code", "Streamlit"] },
  { category: "LLMs", items: ["GPT-2", "LLaMA", "T5", "Hugging Face"] },
];

export const projectsData = [
  {
    number: "01",
    title: "LLM Tokenization Visual Explorer",
    image: "/assets/tokenization.png",
    stack: ["Python", "Streamlit", "Hugging Face"],
    bullets: [
      "Built an interactive tool to visualize and compare tokenization behavior across LLMs including GPT-2, LLaMA, and T5.",
      "Analyzed token splits, token IDs, and total token counts to demonstrate cost impact caused by prompt variations.",
      "Implemented tokenizer comparison and prompt mutation analysis to support cost-aware prompt optimization.",
    ],
  },
  {
    number: "02",
    title: "FarmLink — Farm-to-Consumer Marketplace",
    image: "/assets/farmlink.png",
    stack: ["React", "Supabase", "CSS"],
    bullets: [
      "Built a full-stack marketplace with role-based portals for Farmers, Consumers, and Admins, eliminating middlemen and ensuring fair pricing.",
      "Integrated AI Quality Scan grading crop images across freshness, color uniformity, size consistency, and surface quality using computer vision.",
      "Developed AI Price Intelligence engine providing market-driven crop price predictions with trend analysis and confidence scores.",
      "Designed command-handling logic to accurately map spoken input to media actions, improving reliability and user experience.",
    ],
  },
  {
    number: "03",
    title: "Amma's Pickles (E-Commerce)",
    image: "/assets/ammas_pickles.png",
    stack: ["MERN Stack", "Razorpay", "Cloudinary", "JWT Auth"],
    bullets: [
      "Built a production-ready e-commerce application with a comprehensive admin dashboard, product catalog management, and stock control.",
      "Integrated secure payment processing via Razorpay gateway and automatic image resizing and upload via Cloudinary API.",
      "Implemented JWT-based authentication and resolved real-world MongoDB Atlas DNS/routing issues in production.",
    ],
  },
  {
    number: "04",
    title: "Abhay Dental Care Website",
    image: "/assets/abhay_dental.png",
    stack: ["HTML", "CSS", "JavaScript"],
    bullets: [
      "Designed and developed a fully responsive patient-facing website for a dental clinic, improving new client conversion rates.",
      "Implemented an interactive appointment contact form and custom service catalog pages.",
      "Optimized load times and SEO performance, ensuring high ranking in local Google Search results.",
    ],
  },
];

export const experienceData = [
  {
    role: "Web Development Intern",
    company: "CodSoft — Remote",
    period: "Jun 2024 – Aug 2024",
    bullets: [
      "Developed responsive web pages including a portfolio, landing page, and calculator using HTML, CSS, and JavaScript.",
      "Collaborated with team members to incorporate feedback and improve UI usability.",
      "Utilized Git and GitHub to manage version control and streamline team workflows.",
    ],
  },
];

export const publicationData = {
  type: "Peer-Reviewed Journal Article",
  title: '"Enhancing Agricultural Productivity Through the Integration of AI and IoT"',
  meta: "International Journal of All Research Education and Scientific Methods (IJARESM) · Volume 12 · August 2024",
  role: "Led the project from idea generation to final publication, coordinating research activities, ensuring quality, and managing timelines.",
  link: "https://www.ijaresm.com/uploaded_files/document_file/Prof._Rajakumar_._B,_ermA.pdf",
};

export const educationData = [
  {
    degree: "B.Tech — Artificial Intelligence & Data Science",
    institution: "J.N.N Institute of Engineering",
    period: "2022 – 2026",
    cgpa: "CGPA: 7.39",
  },
  {
    degree: "Intermediate (Class XII)",
    institution: "MJPAP BCWR Junior College",
    period: "2020 – 2022",
    cgpa: "CGPA: 8.34",
  },
  {
    degree: "Secondary School Certificate (Class X)",
    institution: "MJPAP BCWR School",
    period: "2019 – 2020",
    cgpa: "CGPA: 9.0",
  },
];

export const certificationsData = [
  { name: "Project Management Fundamentals", issuer: "IBM" },
  { name: "Introduction to Internet of Things", issuer: "NPTEL" },
  { name: "Introduction to Generative AI", issuer: "Google Cloud" },
];
