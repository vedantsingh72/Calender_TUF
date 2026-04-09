# Frontend Engineering Challenge - Interactive Wall Calendar

A polished, responsive wall-calendar inspired React/Next.js component with:

- Physical wall-calendar visual style with top hero image
- Interactive day range selection (start, end, in-between states)
- Integrated notes (monthly notes + notes attached to selected ranges)
- Mobile-first responsive behavior (single-column stack on smaller screens)
- Creative extras: weekend highlighting, current-day marker, and Paper/Night theme toggle
- Client-only persistence with `localStorage` (no backend)

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- CSS Modules

## Run Locally

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Product/UX Decisions

- **Range selection UX:** first click sets start, second click sets end, third click begins a new range
- **Range correction:** selecting a date before the start automatically swaps start/end for expected behavior
- **Notes model:** monthly notes are keyed by `YYYY-MM`; range notes are keyed by `start_end` date keys
- **Persistence scope:** all notes persist per browser via `localStorage`
- **Touch support:** large day hit-targets and vertically stacked notes on mobile

## Deployment
 
 - **Vercel:** The product is deployed on vercel - [https://calender-tuf-red.vercel.app/](https://calender-tuf-red.vercel.app/)