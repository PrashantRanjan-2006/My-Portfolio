# My Portfolio — Prashant Ranjan

Personal portfolio website (3D / interactive front-end) showing projects, skills and contact information.

Live demo: https://PrashantRanjan-2006.github.io/My-Portfolio (if GitHub Pages enabled)

## What this repo contains
- index.html — single-page responsive site (interactive 3D / canvas sections)
- style.css — site styling and themes (light / dark)
- main.js — site interactions: 3D canvas, particles, timers, audio/video helpers
- assets/ — images used by the site (avatar-formal.jpg, avatar-stylish.jpg, nature-cover.jpg, video-creator.jpg)

## Stack
- Languages: HTML5, CSS3, JavaScript (vanilla)
- Features used: Canvas 2D for custom visuals, CSS gradients, responsive layout

## Notable files / features
- index.html: the complete single-page site with sections for Hero, About, Projects, Skills, Contact and footer.
- main.js: initializes the 3D/canvas scenes, particle systems, responsive camera, and handles user interactions (mouse move, clicks, audio/video integration, animations).
- style.css: theme variables, responsive layout rules, and many utility classes used across the site.
- assets/: contains avatars and cover images referenced by the page.

## How to run locally
1. Clone the repository
   git clone https://github.com/PrashantRanjan-2006/My-Portfolio.git
2. Open the project folder
   cd My-Portfolio
3. Open the site
   - Double-click `index.html` to open in a browser, or run a small static server:
     python -m http.server 8000
     Then open http://localhost:8000

Notes: the site is static — no build step is required.

## Customize
- Edit `index.html` to change content (name, intro, sections).
- Update `style.css` to change colors, theme variables and layout.
- Update `main.js` to modify canvas/3D behavior, particle settings, or to add new interactive sections.
- Replace images in `assets/` with your own (keep filenames or update references in index.html).

## Deployment (GitHub Pages)
1. Push your code to the default branch (e.g., `main`).
2. In the repository Settings → Pages, select the branch and root folder.
3. After a minute the site will be available at: `https://PrashantRanjan-2006.github.io/My-Portfolio`

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/name`
3. Commit and push your changes, then open a Pull Request

## Additions I noticed you may want
- Badges (license, pages, build)
- A screenshot or animated GIF in the README (assets/nature-cover.jpg or a cropped screenshot)
- A LICENSE file (MIT) if you want to open-source explicitly

## Contact / Links
- GitHub: https://github.com/PrashantRanjan-2006
- Repo: https://github.com/PrashantRanjan-2006/My-Portfolio

---

If you'd like I can: add a screenshot to the README, create a LICENSE (MIT), and open a PR that also adds a GitHub Pages workflow to publish automatically.
