# ✅ Replit Upload Checklist

## 📦 Dateien bereit für Upload

### ✅ Hauptdateien
- [x] `package.json` - Dependencies
- [x] `package-lock.json` - Locked versions
- [x] `README.md` - Dokumentation
- [x] `REPLIT_SETUP.md` - Replit-spezifische Anleitung
- [x] `.replit` - Replit Konfiguration
- [x] `replit.nix` - Nix Dependencies

### ✅ Frontend
- [x] `index.html` - Entry HTML
- [x] `vite.config.js` - Vite Config
- [x] `tailwind.config.js` - Tailwind Config
- [x] `postcss.config.js` - PostCSS Config
- [x] `src/` - React Source Code
  - [x] `main.jsx` - Entry Point
  - [x] `App.jsx` - Haupt-App
  - [x] `index.css` - Styles
  - [x] `components/` - React Komponenten

### ✅ Backend
- [x] `server/` - Express Backend
  - [x] `index.js` - API Server

### ✅ Assets
- [x] `public/` - Statische Dateien
  - [x] `fire-icon.svg` - Logo
  - [x] `assets/icons/` - Symbole

### ✅ Config
- [x] `.eslintrc.cjs` - ESLint Config
- [x] `.gitignore` - Git Ignore

## 🗑️ Archivierte Dateien (nicht hochladen)

Alle folgenden Dateien wurden nach `_archive/` verschoben:

### Docker-Dateien (nicht für Replit)
- Dockerfile
- docker-compose.yml
- nginx.conf
- .dockerignore

### Alte Dokumentation
- 26 Markdown-Dateien (CHANGELOG, DEPLOYMENT, etc.)
- PROJECT_STRUCTURE.txt

### Deployment-Configs (nicht für Replit)
- netlify.toml
- vercel.json
- start.bat

### Alte Komponenten
- AdminPanelNew.jsx
- MapComponent_OLD.jsx
- Toolbar_BROKEN.jsx
- Toolbar_USER.jsx

### Alte Ordner
- Kroki_Symbole/
- Krokier-App/

## 🚀 Upload-Schritte

1. **Auf Replit gehen**: https://replit.com
2. **Neues Repl erstellen**: "Create Repl"
3. **Import wählen**: 
   - Option A: "Import from GitHub" (wenn auf GitHub)
   - Option B: Dateien manuell hochladen
4. **Alle Dateien hochladen** (außer `_archive/` und `node_modules/`)
5. **Replit startet automatisch** mit `.replit` Config
6. **Fertig!** App läuft auf Port 5173

## 📊 Projekt-Statistik

- **Hauptdateien**: ~15 Dateien
- **React Komponenten**: 5 Komponenten
- **Dependencies**: ~35 Packages
- **Symbole**: 147 taktische Symbole
- **Größe (ohne node_modules)**: ~350 KB

## ⚡ Nach dem Upload

```bash
# Automatisch ausgeführt von Replit:
npm install
npm run dev
```

## 🔗 Wichtige Links

- Frontend: `https://[dein-repl].replit.app`
- Backend API: `https://[dein-repl].replit.app:3001`

---

**Alles bereit für Replit! 🎉**
