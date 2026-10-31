<p align="center">
  <img src="public/banner.svg" alt="Pradakshina Tracker Banner" width="100%" />
</p>

# Pradakshina Tracker

> A quiet, privacy-first mobile companion that automatically counts temple circumambulations using browser satellite GPS.

<p align="center">
  <a href="https://pradakshina-tracker.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-C2410C?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  &nbsp;
  <a href="mailto:musukulasricharanreddy@gmail.com">
    <img src="https://img.shields.io/badge/Contact_Me-D97706?style=for-the-badge&logo=maildotru&logoColor=white" alt="Contact Me" />
  </a>
  &nbsp;
  <a href="https://github.com/MusukulaSriCharanReddy">
    <img src="https://img.shields.io/badge/Portfolio-7C2D12?style=for-the-badge&logo=github&logoColor=white" alt="Portfolio" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/MusukulaSriCharanReddy/pradakshina-tracker?style=flat-square&color=D97706" alt="Last Commit" />
  &nbsp;
  <img src="https://img.shields.io/github/stars/MusukulaSriCharanReddy/pradakshina-tracker?style=flat-square&color=D97706" alt="Stars" />
  &nbsp;
  <img src="https://img.shields.io/github/license/MusukulaSriCharanReddy/pradakshina-tracker?style=flat-square&color=D97706" alt="License" />
</p>

---

## About

Counting 108 rounds during pradakshina shouldn't require carrying a notebook, a mechanical tally clicker, or a laptop to a sacred sanctum. Pradakshina Tracker was made to solve a familiar human problem: losing count around round 47 because you were actually immersed in prayer rather than your fingers.

The application runs entirely in your mobile browser. There are no logins, no backend databases, no telemetry, and no advertisements—just satellite coordinates, an offline temple bell chime, and gentle palm vibrations.

Rooted in the sacred saffron traditions of Hindu circumambulation, and built by an engineer drawn to quiet places, clean architecture, and the long-held dream of one day riding a Triumph Street Triple R through the Swiss Alps.

---

## Visual Identity & Heritage

<p align="center">
  <img src="public/devotional-theme.jpg" alt="Sacred Saffron & Golden Mandala Aesthetic" width="560" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(194, 65, 12, 0.2);" />
</p>
<p align="center"><em>Sacred saffron (केसरिया) and golden mandala aesthetic—honoring Hindu devotional circumambulation heritage with warm, tranquil tones.</em></p>

---

## Features

- **Autonomous Counting Invariant**  
  Follows a simple rule: *Start at Point A → Leave Point A (>20m) → Return to Point A (<8m) = Count +1*. Walk in any direction or path; no route validation, calibration, or geometry checks required.

- **Satellite GPS & Hysteresis Filtering**  
  Uses separate departure (20m) and return (8m) thresholds with accuracy filtering (≤15m error) to prevent boundary jitter and false counts.

- **3-2-1 Audio-Haptic Countdown**  
  Gives you 3 seconds to stand still in front of the deity so the device locks accurate starting coordinates before walking starts.

- **Synthesized Offline Temple Bell & Haptics**  
  Pure Web Audio API synthesizes a resonant temple bell harmonic for round completions—zero audio downloads, zero network latency, with rhythmic vibration feedback.

- **Interactive Dev Simulator**  
  Test targets, audio, and state transitions without leaving your desk using built-in virtual departure and return controls.

- **100% Offline & Private**  
  Operates completely client-side. Active sessions and completion logs persist in browser `localStorage`. No data is ever transmitted to an external server.

- **PWA & Screen Wake Lock**  
  Installs to iOS/Android home screens and utilizes the Screen Wake Lock API to prevent the display from sleeping mid-session.

---

## Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind" alt="Technology Stack" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  &nbsp;
  <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5" />
  &nbsp;
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  &nbsp;
  <img src="https://img.shields.io/badge/Web_Audio_API-Native-D97706?style=flat-square" alt="Web Audio API" />
  &nbsp;
  <img src="https://img.shields.io/badge/Geolocation_API-Native-D97706?style=flat-square" alt="Geolocation API" />
</p>

---

## Getting Started

### Prerequisites
- Node.js 20.x or 24.x
- npm 10.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MusukulaSriCharanReddy/pradakshina-tracker.git
   cd pradakshina-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile browser.

### Verification & Testing

- **Run unit test suite** (18 automated tests covering all counting logic, jitter protection, and edge cases):
  ```bash
  npm test
  ```

- **Run code quality checks**:
  ```bash
  npm run lint
  ```

- **Build for production**:
  ```bash
  npm run build
  ```

---

## Work With Me

I design and build clean, reliable, and privacy-first web applications.

### What I Build
- **Mobile-first Web & PWA Applications:** Offline-capable, sensor-driven, and installable web apps.
- **Interactive UI & Design Systems:** Minimalist, accessible interfaces focused on clarity, performance, and typography.
- **Client-Side Architectural Engines:** High-performance mathematical models, geolocation tracking, and state persistence with zero server overhead.

### Let's Connect
- **Email:** [musukulasricharanreddy@gmail.com](mailto:musukulasricharanreddy@gmail.com)
- **GitHub:** [@MusukulaSriCharanReddy](https://github.com/MusukulaSriCharanReddy)

---

## License

This project is licensed under the [MIT License](LICENSE).
