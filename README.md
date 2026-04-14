# Cost Per Mile Calculator

A fast, beautiful cost-per-mile calculator for road-trippers and owner-operators. Live results, dark mode, mobile-first, runs fully in the browser.

**Live demo →** https://vardst.github.io/calculator_oil/

## Features

- **Two modes**
  - **Trip · Simple** — distance, MPG, fuel price, vehicle type, payload, driving conditions, A/C, passengers (split cost), round-trip, EV path with kWh inputs.
  - **Trucking · Pro** — fixed monthly costs, variable per-mile costs, labor, deadhead %, profit target → break-even rate & suggested rate per mile.
- **Live calculation** as you type, with animated number tweens.
- **Cost breakdown** bar showing where every dollar goes.
- **Unit toggle** (mi/gal ↔ km/L) and currency selector ($ / € / £).
- **Dark mode by default**, light mode toggle, respects `prefers-reduced-motion`.
- **Mobile-first responsive** layout — single column on phones, sticky results pane on desktop.
- **Persists** all inputs, mode, theme, and units to `localStorage`.
- **Copy results** to clipboard for sharing.
- **Zero backend** — all calculations run locally, no data leaves your device.

## Tech stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4
- Radix UI primitives (Tabs, Tooltip, Switch, Collapsible)
- `motion` for animations
- `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build locally
```

## Deployment

Deploys to GitHub Pages automatically on push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). To enable for a fresh repo:

1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` — the workflow builds and publishes `dist/`.

`vite.config.ts` uses `base: './'` so the bundle works at any sub-path (no edits needed if you rename the repo or fork it).

## Project structure

```
src/
├── App.tsx                   # tabs, theme/unit/currency toggles, layout
├── components/
│   ├── SimpleCalculator.tsx
│   ├── ProCalculator.tsx
│   ├── ResultsCard.tsx       # animated stats + breakdown
│   ├── CostBreakdownChart.tsx
│   ├── NumberInput.tsx
│   ├── ThemeToggle.tsx
│   ├── UnitToggle.tsx
│   └── ui/                   # Button, Card, Input, Tabs, Switch, Tooltip, Collapsible
├── lib/
│   ├── calc.ts               # pure calcSimple / calcPro
│   ├── units.ts              # mi↔km, gal↔L, MPG↔L/100km
│   ├── storage.ts            # useLocalStorage hook
│   └── utils.ts              # cn() helper
└── types.ts
```

## License

MIT
