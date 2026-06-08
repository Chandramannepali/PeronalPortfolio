# Poorna Chandra Rao — Personal Portfolio
A production-grade React 18 + Tailwind CSS 3 portfolio website.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start

# 3. Build for production
npm run build
```

## Deploy to Netlify (30 seconds)
```bash
npm run build
# Drag the build/ folder to https://app.netlify.com/drop
```

## Project Structure
```
src/
├── App.jsx              # Root: cursor animation, scroll-reveal, active section
├── index.css            # Tailwind + global styles + animations
├── index.js             # React entry
└── components/
    ├── Navbar.jsx       # Fixed nav, active highlight, mobile hamburger
    ├── Hero.jsx         # Landing: animated stats card, tagline, CTAs
    ├── About.jsx        # Story bio + side info cards
    ├── Skills.jsx       # 6-category skill grid with hover effects
    ├── Projects.jsx     # Split-layout project cards with code visuals
    ├── Experience.jsx   # Timeline internship display
    ├── Publication.jsx  # Research paper card + achievement strip
    ├── Extras.jsx       # Strengths / Currently Learning / Looking For
    ├── Education.jsx    # Education grid + certification badges
    ├── Contact.jsx      # Dark section with functional form
    └── Footer.jsx       # Minimal dark footer
```

## Tech Stack
- React 18
- Tailwind CSS 3
- Google Fonts: Syne + Crimson Pro + JetBrains Mono
- No other dependencies

## Customise Content
Edit the data arrays at the top of each component:
- **Hero.jsx** → `techPills`, `stats`
- **Projects.jsx** → `projects` array
- **Skills.jsx** → `skillCategories` array
- **Experience.jsx** → `experiences` array
- **Contact.jsx** → `contactItems` array

## Change Colours
Edit `tailwind.config.js` under `theme.extend.colors`.
All colours use plain hex — no special syntax needed.

## Add Your Links
Replace `href="#"` placeholders in:
- `Footer.jsx` — GitHub, LinkedIn links
- `Contact.jsx` — contactItems array
- `Projects.jsx` — project GitHub / Live Demo hrefs
