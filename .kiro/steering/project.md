---
inclusion: always
---

# Project: The Tortured Poets Dashboard

## Overview
A TTPD-inspired To-Do List Life Dashboard. Static HTML/CSS/JS site. No frameworks, no backend.

## Tech Stack
- HTML (semantic, accessible)
- CSS: hand-authored stylesheet at `css/style.css` using CSS custom properties
- Tailwind CSS v3 for future builds: `src/input.css` → compile to `css/style.css` via `npm run build`
- Vanilla JavaScript: `js/script.js` (one file, IIFE modules)
- localStorage for all persistence

## File Structure
- `index.html` — single page app
- `css/style.css` — compiled stylesheet (committed to repo)
- `src/input.css` — Tailwind source (edit this, then run `npm run build`)
- `js/script.js` — all application logic
- `tailwind.config.js` — Tailwind theme (TTPD palette, Playfair Display + Inter fonts)
- `package.json` — `npm run build` and `npm run dev` scripts

## TTPD Color Palette (CSS vars)
- `--color-ivory`: #F3EEE5 (light bg)
- `--color-parchment`: #D9CCB9 (borders, accents)
- `--color-taupe`: #A99A8A (secondary text, icons)
- `--color-muted`: #655B55 (body text)
- `--color-charcoal`: #373431 (primary text, buttons)
- `--color-ash`: #B9B8B1 (disabled, placeholder)
- Dark mode: `--color-dark-bg`, `--color-dark-surface`, `--color-dark-border`, `--color-dark-text`, `--color-dark-muted`

## Dark Mode
Applied by adding `.dark` class to `<body>` and `<html>`. All dark styles use `body.dark .component` selectors.

## JS Module Pattern
Each feature is an IIFE returning `{ init }`. localStorage keys: `ttpd-theme`, `ttpd-name`, `ttpd-todos`, `ttpd-links`.

## Build Commands
```
npm install       # install Tailwind CLI (one time)
npm run build     # compile src/input.css → css/style.css (minified)
npm run dev       # watch mode for development
```

## GitHub Pages
Deploy from branch `main`, root `/`. The `css/style.css` must be committed.
