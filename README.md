<p align="center">
  <img src="public/banner.jpg" alt="Pradakshina — Lord Ganesha circumambulating Lord Shiva and Mata Parvati at Mount Kailash" width="100%" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(61, 53, 45, 0.15);" />
</p>

# Pradakshina Tracker

> A quiet, privacy-first mobile web companion that automatically counts temple circumambulations using browser satellite GPS.

<p align="center">
  <a href="https://pradakshina-tracker.vercel.app">
    <img src="https://img.shields.io/badge/LIVE_DEMO-C47737?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  &nbsp;
  <a href="mailto:musukulasricharanreddy@gmail.com">
    <img src="https://img.shields.io/badge/@_CONTACT_ME-D97706?style=for-the-badge&logo=maildotru&logoColor=white" alt="Contact Me" />
  </a>
  &nbsp;
  <a href="https://github.com/MusukulaSriCharanReddy">
    <img src="https://img.shields.io/badge/PORTFOLIO-3D352D?style=for-the-badge&logo=github&logoColor=white" alt="Portfolio" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/MusukulaSriCharanReddy/pradakshina-tracker?style=flat-square&color=C47737&labelColor=555555" alt="Last Commit" />
  &nbsp;
  <img src="https://img.shields.io/github/stars/MusukulaSriCharanReddy/pradakshina-tracker?style=flat-square&color=C47737&labelColor=555555" alt="Stars" />
  &nbsp;
  <img src="https://img.shields.io/github/license/MusukulaSriCharanReddy/pradakshina-tracker?style=flat-square&color=C47737&labelColor=555555" alt="License" />
</p>

---

## About

In Hindu tradition, when Lord Shiva and Mata Parvati offered the fruit of supreme wisdom to whoever first circled the cosmos, Lord Kartikeya flew across the heavens on his peacock. Lord Ganesha calmly walked around his parents at Mount Kailash, saying: *"My parents contain the entire universe."* Pleased by his wisdom and devotion, they blessed him—illuminating the sacred practice of *pradakshina*.

Pradakshina Tracker brings this mindfulness to modern temple visits. Counting 108 rounds shouldn't require carrying a notebook or mechanical clicker into a sanctum. The app automatically tracks rounds in your mobile browser with zero logins, zero ads, and zero external servers—just satellite coordinates, an offline temple bell chime, and subtle palm vibrations.

### Core Rule

$$\text{Start at Point A} \longrightarrow \text{Leave Point A (>20m)} \longrightarrow \text{Return to Point A (<8m)} = \text{Count } + 1$$

Walk any path, direction, or speed. No route calibration or geometric shape validation required.

---

## Features

- **Autonomous GPS Counter:** Automatically counts rounds upon departure and return to Point A without manual tapping.
- **GPS Jitter & Hysteresis Protection:** Distinct departure (>20m) and return (<8m) thresholds with accuracy filtering (≤15m error) prevent false increments.
- **3-2-1 Audio-Haptic Countdown:** Grants 3 seconds of stillness before the walk starts to lock accurate satellite coordinates.
- **Synthesized Temple Bell & Haptics:** Offline Web Audio harmonic chime and gentle vibration feedback on round completions.
- **Interactive Dev Simulator:** Test counting logic, sound chimes, and target goals directly from your desk without walking outside.
- **100% Client-Side & Private:** Active sessions and history persist locally in browser `localStorage`. No location data is ever transmitted to a backend.
- **PWA & Screen Wake Lock:** Installable to mobile home screens with wake lock enabled to keep the display active while walking.

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
  <img src="https://img.shields.io/badge/Web_Audio_API-Native-C47737?style=flat-square" alt="Web Audio API" />
  &nbsp;
  <img src="https://img.shields.io/badge/Geolocation_API-Native-C47737?style=flat-square" alt="Geolocation API" />
</p>

---

## Getting Started

### Prerequisites
- Node.js 20.x or 24.x
- npm 10.x or higher

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/MusukulaSriCharanReddy/pradakshina-tracker.git
cd pradakshina-tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile browser.

### Verification & Testing

```bash
# Run unit test suite (18 automated tests covering engine and edge cases)
npm test

# Run code linter
npm run lint

# Build optimized production bundle
npm run build
```

---

## License

This project is licensed under the [MIT License](LICENSE).
