# xDele1ed Portfolio

## Dev
```bash
npm install
npm run dev
```

## Build & host
```bash
npm run build
# drag dist/ onto netlify.com/drop
```

## Structure
```
src/
  assets.js              ← base64 icons & wallpapers (single source of truth)
  data.js                ← WALLPAPERS, PROJECTS, SKILLS
  main.jsx               ← React entry
  index.css              ← Tailwind + keyframes
  OSPortfolio.jsx        ← main OS shell
  components/
    AppWindow.jsx        ← Clock, AppWindow, AppIcon
    BootIntro.jsx        ← boot + intro screens
    ControlCenter.jsx    ← swipe-down control panel
  apps/
    AboutContent.jsx
    ProjectsContent.jsx
    SkillsContent.jsx
    ContactContent.jsx
    SettingsContent.jsx
    BrowserApp.jsx
    PaintApp.jsx
    ExplorerApp.jsx
    DiscordApp.jsx
    GithubApp.jsx
    InstagramApp.jsx
```
