# 🚀 Von GitHub zu Replit

## Option 1: Direkt von GitHub importieren (EMPFOHLEN)

### Schritt 1: Auf GitHub hochladen
```bash
# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen (außer .gitignore)
git add .

# Commit erstellen
git commit -m "Initial commit - Krokier App für Replit"

# GitHub Repository erstellen und pushen
git remote add origin https://github.com/DEIN-USERNAME/krokier-app.git
git branch -M main
git push -u origin main
```

### Schritt 2: In Replit importieren
1. Gehe zu https://replit.com
2. Klicke auf **"Create Repl"**
3. Wähle **"Import from GitHub"**
4. Gib deine Repository-URL ein: `https://github.com/DEIN-USERNAME/krokier-app`
5. Klicke auf **"Import from GitHub"**
6. Fertig! Replit startet automatisch

---

## Option 2: Manueller Upload auf Replit

### Schritt 1: ZIP erstellen
```powershell
# Komprimiere das Projekt (ohne node_modules und _archive)
Compress-Archive -Path @(
    'src',
    'server',
    'public',
    'package.json',
    'package-lock.json',
    'index.html',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    '.replit',
    'replit.nix',
    '.replitignore',
    '.eslintrc.cjs',
    'README.md',
    'REPLIT_SETUP.md'
) -DestinationPath 'krokier-app-replit.zip' -Force
```

### Schritt 2: Auf Replit hochladen
1. Gehe zu https://replit.com
2. Klicke auf **"Create Repl"**
3. Wähle **"Import from GitHub"** → **"Upload a .zip file"**
4. Lade `krokier-app-replit.zip` hoch
5. Fertig!

---

## Was wird hochgeladen?

### ✅ Enthalten (590 KB)
- `src/` - React Frontend (5 Komponenten)
- `server/` - Express Backend
- `public/` - Assets & 147 Symbole
- `package.json` - Dependencies
- Alle Config-Dateien
- Dokumentation

### ❌ Nicht enthalten (ignoriert)
- `node_modules/` - Wird auf Replit neu installiert
- `_archive/` - Alte Dateien
- `.git/` - Git History

---

## Nach dem Import

Replit führt automatisch aus:
```bash
npm install
npm run dev
```

Die App läuft dann auf:
- **Frontend**: Port 5173
- **Backend**: Port 3001

---

## Troubleshooting

### "npm install" schlägt fehl
```bash
# In Replit Shell:
rm -rf node_modules package-lock.json
npm install
```

### Port-Probleme
```bash
# Andere Prozesse beenden
pkill -9 node
npm run dev
```

### Symbole werden nicht angezeigt
- Prüfe ob `public/assets/icons/` 147 Dateien enthält
- Falls nicht: Lade Symbole manuell hoch

---

## 🎯 Empfohlener Workflow

1. ✅ Projekt auf GitHub pushen
2. ✅ Von GitHub zu Replit importieren
3. ✅ Automatischer Start
4. ✅ App ist live!

**Vorteil**: Änderungen können einfach via Git synchronisiert werden.

---

**Viel Erfolg! 🚀**
