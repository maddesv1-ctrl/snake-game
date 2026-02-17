# 🐍 Maddes Snake

Ein modernes Snake-Spiel mit TypeScript, modularem Code und GitHub Pages Deployment.

## 🎮 Features

- **Modularer TypeScript-Code** – Trennung von Spiel-Logik, Rendering, Input und Leaderboard
- **Mobile-optimiert** – Touch/Swipe-Steuerung + Desktop (Pfeiltasten, WASD)
- **Leaderboard** – Top 10 Spieler in localStorage
- **3-Video-Belohnung** – Alle 3 Punkte wird ein Video abgespielt
- **21 Unit Tests** – Mit Vitest + jsdom

## 🚀 Technik-Stack

- **Vite** – Dev-Server + Production Build
- **TypeScript** – Strikte Typisierung
- **Vitest** – Unit Testing
- **ESLint + Prettier** – Code-Qualität
- **GitHub Actions** – Automatisches Deployment

## 📁 Projektstruktur

```
src/
├── game/           # GameState, GameLoop, VideoHandler
├── render/         # Renderer (Canvas)
├── input/          # InputHandler (Tastatur, Touch, Swipe)
├── leaderboard/    # Leaderboard (localStorage)
├── types.ts        # Interfaces + Constants
├── main.ts         # Entry Point
└── style.css       # Styling
tests/              # 21 Unit Tests
public/             # Assets (Videos, Musik, Bilder)
```

## 🛠️ Entwicklung

```bash
# Dependencies installieren
pnpm install

# Dev-Server starten
pnpm dev

# Tests ausführen
pnpm test

# Linting
pnpm lint

# Production Build
pnpm build
```

## 🌐 Live

👉 [https://maddesv1-ctrl.github.io/snake-game/](https://maddesv1-ctrl.github.io/snake-game/)

## 📄 Lizenz

MIT