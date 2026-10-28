# The Tortured Poets Dashboard

> *"A little order for a restless mind."*

A To-Do List Life Dashboard with an elegant, literary aesthetic inspired by Taylor Swift's *The Tortured Poets Department* era. Built as a RevoU Coding Camp mini project.

**Live demo:** [GitHub Pages link — add yours here after deploying]

---

## Features

| Feature | Details |
|---|---|
| **Greeting & Clock** | Live 12-hour clock with date, time-of-day greeting, and a saveable name |
| **Focus Timer** | Pomodoro timer (default 25 min), custom duration, SVG progress ring, single-interval guard |
| **To-Do List** | Add, edit, delete, complete/incomplete, filter (All / Active / Done), duplicate detection, localStorage persistence |
| **Quick Links** | Add named bookmarks with URL validation (http/https only), opens in new tab, localStorage persistence |
| **Light / Dark Mode** | Full TTPD-aesthetic dark theme, OS preference detection, localStorage persistence |

---

## Tech Stack

- **HTML** — semantic structure
- **Tailwind CSS v3** — utility-first styling, compiled to a single CSS file
- **Vanilla JavaScript** — no frameworks
- **localStorage** — client-side data persistence
- **GitHub Pages** — static hosting (no backend required)

---

## Project Structure

```
├── index.html          # Application entry point
├── css/
│   └── style.css       # ✅ Compiled Tailwind CSS (committed — required for GitHub Pages)
├── js/
│   └── script.js       # Application JavaScript
├── src/
│   └── input.css       # Tailwind source (base directives + custom styles)
├── tailwind.config.js  # Tailwind theme config (TTPD color palette, fonts)
├── package.json        # Dev dependencies and build scripts
├── .gitignore
└── README.md
```

> **`css/style.css`** is the compiled output and must be committed to the repository so GitHub Pages can serve it without a CI build step.  
> **`src/input.css`** is the source — edit this file, then run the build command to regenerate `css/style.css`.

---

## Setup & Development

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18 or later (LTS recommended)
- npm (bundled with Node.js)

### 2. Install dependencies

```bash
npm install
```

This installs Tailwind CSS v3 locally inside `node_modules/` (not committed to Git).

### 3. Build the CSS

```bash
npm run build
```

This compiles `src/input.css` → `css/style.css` (minified). Run this whenever you change `src/input.css` or `tailwind.config.js`.

### 4. Watch mode (development)

```bash
npm run dev
```

Tailwind watches for changes in `index.html` and `js/script.js` and auto-rebuilds `css/style.css`. Keep this running while developing.

### 5. Preview locally

Open `index.html` directly in your browser, **or** use a simple local server for a more accurate preview:

```bash
# Option A — VS Code Live Server extension (right-click index.html → Open with Live Server)
# Option B — Python (if installed)
python -m http.server 8080
# then open http://localhost:8080
```

No backend or Node server is required to run the app.

---

## Deploying to GitHub Pages

1. **Commit everything** (including `css/style.css`):

   ```bash
   git add .
   git commit -m "Initial build: Tortured Poets Dashboard"
   git push origin main
   ```

2. **Enable GitHub Pages** in your repository:
   - Go to **Settings → Pages**
   - Under *Source*, select **Deploy from a branch**
   - Choose branch **`main`** and folder **`/ (root)`**
   - Click **Save**

3. GitHub Pages will serve `index.html` from the root. Your site will be live at:  
   `https://<your-username>.github.io/<repo-name>/`

> Because `css/style.css` is committed to the repo, GitHub Pages can serve the compiled CSS without any build step. No CI/CD pipeline is required.

---

## Manual Testing Checklist

### Theme
- [ ] Toggle button switches between light and dark mode
- [ ] Theme persists after page reload
- [ ] All text, borders, and inputs remain readable in both modes

### Greeting & Clock
- [ ] Clock updates every second (check AM/PM, seconds tick)
- [ ] Date line shows correct weekday, month, and year
- [ ] Greeting changes based on time of day (morning / afternoon / evening / night)
- [ ] Entering a name and clicking Save updates the greeting immediately
- [ ] Name persists after page reload
- [ ] Submitting an empty name shows an error

### Focus Timer
- [ ] Timer starts from 25:00 by default
- [ ] Start begins the countdown; display ticks down
- [ ] Stop pauses the timer; Start resumes from the paused position
- [ ] Reset returns to the full duration
- [ ] Clicking Start multiple times does NOT accelerate the timer
- [ ] Timer reaches 00:00 and shows the finished banner
- [ ] Custom duration (e.g. 5 minutes) is applied via the Set button
- [ ] Invalid custom durations (0, letters, >90) show an error

### To-Do List
- [ ] Adding a task appends it to the list
- [ ] Adding an empty task shows an error
- [ ] Adding a duplicate task (case-insensitive) shows an error
- [ ] Checking a task marks it complete with strikethrough
- [ ] Unchecking restores it
- [ ] Edit button opens the modal; saving updates the task
- [ ] Editing to a duplicate name shows an error
- [ ] Delete button removes the task
- [ ] All / Active / Done filters work correctly
- [ ] Tasks persist after page reload
- [ ] Empty state message appears when no tasks match the filter

### Quick Links
- [ ] Adding a valid link (https://example.com) saves and displays it
- [ ] Link opens in a new tab
- [ ] Empty name or URL shows an error
- [ ] Invalid URL (e.g. "not-a-url") shows an error
- [ ] Non-http/https protocol (e.g. ftp://) is rejected
- [ ] Delete button removes the link
- [ ] Links persist after page reload
- [ ] Empty state message appears when no links are saved

### Accessibility
- [ ] All interactive elements are reachable and activatable via keyboard (Tab, Enter, Space)
- [ ] Focus rings are visible in both themes
- [ ] Skip-to-main-content link appears on first Tab keypress
- [ ] Edit modal traps focus (Tab cycles within modal)
- [ ] Pressing Escape closes the edit modal
- [ ] Error messages are announced (role="alert")

### Responsive
- [ ] Layout stacks correctly on a narrow phone screen (≤ 375 px)
- [ ] Two-column layout appears on tablet/desktop
- [ ] No horizontal scroll at any viewport width

---

## Color Palette

| Name | Hex |
|---|---|
| Ivory paper | `#F3EEE5` |
| Warm parchment | `#D9CCB9` |
| Dusty taupe | `#A99A8A` |
| Muted brown | `#655B55` |
| Charcoal ink | `#373431` |
| Ash grey | `#B9B8B1` |

Dark mode surfaces: `#1E1C1A` (bg), `#2A2724` (card), `#3D3833` (border), `#E8E0D3` (text)

---

*Built by Ananda Balqis — RevoU Coding Camp*
