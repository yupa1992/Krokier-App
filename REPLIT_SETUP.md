# 🚀 Krokier-App auf Replit

## Schnellstart

1. **Projekt importieren**
   - Klicke auf "Create Repl" → "Import from GitHub"
   - Oder: Lade alle Dateien direkt hoch

2. **Automatischer Start**
   - Replit erkennt automatisch die `.replit` Konfiguration
   - Frontend startet auf Port 5173
   - Backend startet auf Port 3001

3. **App öffnen**
   - Klicke auf den "Open in new tab" Button
   - Oder: Nutze die Webview in Replit

## Wichtige Ports

- **Frontend (Vite)**: Port 5173
- **Backend (Express)**: Port 3001

## Befehle

```bash
# Development starten (automatisch)
npm run dev

# Backend separat starten
npm run server

# Production Build
npm run build

# Build Preview
npm run preview
```

## Projektstruktur

```
krokier-app/
├── src/              # React Frontend
│   ├── components/   # UI Komponenten
│   ├── App.jsx       # Haupt-App
│   └── main.jsx      # Entry Point
├── server/           # Express Backend
│   ├── index.js      # API Server
│   └── uploads/      # Hochgeladene Dateien
├── public/           # Statische Assets
│   └── symbols/      # Taktische Symbole
├── .replit           # Replit Konfiguration
├── replit.nix        # Nix Dependencies
└── package.json      # NPM Dependencies
```

## Features

✅ **Frontend**: React + Vite + TailwindCSS  
✅ **Backend**: Express.js für Datei-Uploads  
✅ **Karte**: Leaflet mit OpenStreetMap  
✅ **Symbole**: 147 taktische Symbole  
✅ **Zeichnen**: Freihand, Linien, Formen  
✅ **Speichern**: JSON Export/Import  

## Troubleshooting

### Port bereits belegt
```bash
# Andere Prozesse beenden
pkill -9 node
npm run dev
```

### Dependencies fehlen
```bash
npm install
```

### Build-Fehler
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Deployment auf Replit

1. Klicke auf "Deploy" in Replit
2. Wähle "Autoscale deployment"
3. Fertig! App ist online

## Admin-Zugang

- **Passwort**: `admin123`
- **Funktion**: Logo hochladen, Einstellungen

## Support

Bei Problemen:
1. Console in Replit öffnen
2. Logs prüfen
3. `npm run dev` neu starten

---

**Viel Erfolg! 🎉**
