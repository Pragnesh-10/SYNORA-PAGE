# 🏎️ SYNORA 2026 — F1 Telemetry Loading Screen & Freshers Hackathon

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESNext-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla_Motorsport_Theme-1572B6?logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A motorsport-engineered web application for the **SYNORA Freshers Hackathon 2026**, featuring an **F1-inspired circular tachometer loading animation**, live telemetry checklists, dynamic 16,000 RPM physics, and audio synchronization with genuine F1 V6 turbo hybrid racing engine acoustics.

---

## 🌟 Key Features

### 1. 🏁 F1 Motorsports Telemetry Loading Experience
- **16,000 RPM Circular Tachometer**:
  - Precision 270° SVG dial with major divisions from 0 to 16,000 RPM.
  - Smooth spring-lerp needle physics that dynamically tracks real resource loading.
  - **Redline Sector (11,000 – 16,000 RPM)** with glowing crimson SVG arc and procedural harmonic needle vibration.
  - Center digital readout displaying real-time tabular RPM, loading percentage, and capsule progress bar.
- **Left Telemetry Card (`SRM AP INDIA`)**:
  - Vector F1 racetrack layout outline with glowing cyan/red gradient stroke and start/finish line indicator.
  - Live parameter monitors (`LAP 01`, `DRS READY`, `ERS CHARGING`, `TYRE SOFT`).
- **Right Telemetry Card (`SYSTEMS CHECK`)**:
  - Sequential diagnostics checklist (`ENGINE ✓`, `SYSTEMS ✓`, `NETWORK ✓`, `ASSETS ✓`, and `TRACK READY ◯`).
  - Animated spinning loader for track readiness.
- **Cinematic Wet Pitlane F1 Backdrop**:
  - Atmospheric dark pit garage with rear-view F1 race car, `SYNORA` rear wing livery, pulsating central FIA rain light, and wet asphalt reflections.

### 2. 🔊 Authentic F1 Racing Car Audio Integration
- Real F1 racing car acoustic track (`wings_of_freedom-f1-racing-car-sound-430459.mp3`).
- **Dynamic RPM Synchronization**: Playback rate and pitch scale smoothly alongside the tachometer's RPM curve from idle to redline.
- **Audio Controls & Autoplay**: Autoplay unlock on first user gesture and interactive `AUDIO FX: ON/OFF` toggle buttons.

### 3. 🚀 SYNORA Freshers Hackathon 2026 Portal
- **Hero Cockpit**: Real-time speed/RPM gauges, countdown clock to Green Flag, and registration CTAs.
- **6 Flagship Technical Tracks**: AI/ML Turbo, Web3/DeFi Aero, Full Stack Kinetic, IoT Telemetry, Cyber Defense, and Open Innovation Pitlane.
- **36-Hour Race Schedule**: Lap 1 to Lap 5 timeline from check-in to podium presentations.
- **₹1,50,000+ Prize Podium**: Grand Champion (P1), 1st Runner Up (P2), 2nd Runner Up (P3), and special category bounties.
- **Interactive Features**: Floating HUD bar, "REPLAY F1 LAUNCH" trigger, and team registration modal.

---

## 🛠️ Project Structure

```
synora/
├── index.html                  # Main entry point with F1 loading screen & Synora Portal
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Production build configuration
├── public/
│   ├── favicon.svg             # F1 checkered flag vector favicon
│   ├── site.webmanifest        # PWA / Mobile web manifest
│   ├── robots.txt              # Search engine crawling rules
│   ├── sitemap.xml             # XML sitemap
│   ├── f1_engine_sound.mp3     # Official F1 racing car audio track
│   └── f1_pitlane_bg.jpg       # Cinematic F1 wet pitlane backdrop image
└── src/
    ├── css/
    │   ├── reset.css           # CSS reset & design tokens
    │   ├── carbon-theme.css    # Procedural carbon weave textures & HUD frames
    │   ├── loader.css          # F1 tachometer, cards, and reference UI styles
    │   └── synora-portal.css   # Hackathon landing page styles
    └── js/
        ├── loader/
        │   ├── tachometer.js   # 16k RPM circular gauge & needle physics
        │   ├── telemetry.js    # Systems check & circuit telemetry manager
        │   ├── audioEngine.js  # F1 engine audio controller & rate scaling
        │   └── loadingManager.js # Real asset tracking & launch transition
        ├── portal/
        │   ├── portal.js       # Countdown timer, track filters, and modal
        │   └── hudControls.js  # Floating HUD & launch replay controls
        └── main.js             # Application coordinator
```

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm` (included with Node.js)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/synora.git
cd synora

# Install dependencies
npm install
```

### Development Server
```bash
# Start local Vite development server
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build
```bash
# Compile and optimize for production
npm run build

# Preview the production build locally
npm run preview
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🚀 Deployment

### Deploying to Vercel
```bash
npx vercel --prod
```

### Deploying to Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Deploying to GitHub Pages
1. Build the production bundle: `npm run build`
2. Push the contents of the `dist/` folder to the `gh-pages` branch.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
