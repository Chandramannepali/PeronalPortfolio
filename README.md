# Modern Cinematic Portfolio

A premium, full-stack personal portfolio application featuring a highly interactive React frontend with a dynamic video background, motion animations, and a Spring Boot backend API with a secure administrative dashboard.

---

## 🌟 Key Features

*   **Cinematic Hero Section**: Full-screen auto-playing video background with a custom-engineered floating audio toggle control (auto-mutes on navigation).
*   **Custom Admin Panel**: Dedicated `/admin` route to manage profile settings, skills, experience, projects, education, and message requests.
*   **Dynamic Data Fetching**: Retrieves real-time content from the Spring Boot API, falling back automatically to a local static configuration context if the backend is offline.
*   **Micro-Animations**: Custom cursor tracking, interactive text scrambling, and card tilting built with Framer Motion.
*   **System Design**: Styled entirely using modern Vanilla CSS tokens, clean responsive layouts, and automatic dark/light mode detection.

---

## 🛠️ Tech Stack

### Frontend
*   **Core**: React 19, Vite, ES6+ JavaScript
*   **Animations**: Framer Motion
*   **Icons**: React Icons (Feather / Heroicons)
*   **Routing & State**: React Context API, custom hooks

### Backend
*   **Framework**: Spring Boot 3.3.0
*   **Language**: Java 17
*   **Database & JPA**: Hibernate, Spring Data JPA, H2 Database (In-Memory / Persistent)
*   **Security**: CORS Configuration, Custom Admin Authentications

---

## 📂 Project Structure

```text
├── backend/                  # Java Spring Boot API
│   ├── src/main/java/        # Source code (Controllers, Models, Repositories)
│   └── pom.xml               # Maven dependencies
│
└── portfolio/                # React 19 Frontend
    ├── src/
    │   ├── assets/           # Video and image files
    │   ├── components/       # UI Components (Hero, Projects, Admin, etc.)
    │   ├── context/          # React Context API
    │   └── index.css         # Styling and design system variables
    └── package.json          # Node dependencies
```

---

## 🚀 Setup & Execution Instructions

### 1. Backend API (Spring Boot)

#### Prerequisites
*   Java Development Kit (JDK) 17 or higher
*   Maven 3.x

#### Running Locally
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```
3. The server will launch at: `http://localhost:8080`
4. The database console is accessible at: `http://localhost:8080/h2-console`

---

### 2. Frontend App (React + Vite)

#### Prerequisites
*   Node.js (v18.x or higher)
*   npm (v9.x or higher)

#### Running Locally
1. Navigate into the portfolio directory:
   ```bash
   cd portfolio
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to: `http://localhost:5173`
