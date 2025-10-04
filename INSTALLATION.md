# Installation & Testing Guide

## Systemvoraussetzungen

### Minimum
- **Node.js**: Version 18.0 oder höher
- **npm**: Version 9.0 oder höher
- **Browser**: Chrome, Firefox, Safari oder Edge (modern)
- **RAM**: 4 GB
- **Festplatte**: 500 MB freier Speicher

### Empfohlen
- **Node.js**: Version 20.x LTS
- **npm**: Version 10.x
- **RAM**: 8 GB
- **Internet**: Für OpenStreetMap Tiles

## Installation

### Schritt 1: Node.js prüfen

```bash
# Node.js Version prüfen
node --version
# Sollte v18.0.0 oder höher sein

# npm Version prüfen
npm --version
# Sollte 9.0.0 oder höher sein
```

Falls Node.js nicht installiert ist:
- Download: https://nodejs.org/
- Empfohlen: LTS Version

### Schritt 2: Dependencies installieren

```bash
# Im Projektordner:
cd c:\Users\panda\Documents\02_krokier_app_native

# Dependencies installieren
npm install
```

**Erwartete Ausgabe:**
```
added 234 packages, and audited 235 packages in 45s

89 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**Installationszeit:** ~30-60 Sekunden (abhängig von Internetgeschwindigkeit)

### Schritt 3: Development Server starten

```bash
npm run dev
```

**Erwartete Ausgabe:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Browser sollte automatisch öffnen auf `http://localhost:3000`

## Erste Tests

### Test 1: Karte lädt
- ✅ Karte wird angezeigt
- ✅ OpenStreetMap Tiles laden
- ✅ Zoom funktioniert (+/- Buttons)
- ✅ Pan funktioniert (Karte ziehen)

### Test 2: Toolbar
- ✅ Live-Uhrzeit aktualisiert sich
- ✅ Alle Buttons sind sichtbar
- ✅ Hover-Effekte funktionieren

### Test 3: Symbole platzieren
1. Symbol aus rechter Sidebar nehmen
2. Auf Karte ziehen
3. Loslassen
- ✅ Symbol erscheint auf Karte
- ✅ Symbol ist verschiebbar

### Test 4: Symbol beschriften
1. Auf Symbol klicken
2. "Beschriften" Button klicken
3. Text eingeben
4. "Speichern" klicken
- ✅ Label wird gespeichert
- ✅ Label wird angezeigt

### Test 5: Zeichnen
1. Farbe in Palette wählen
2. Zeichenwerkzeug wählen (links auf Karte)
3. Auf Karte klicken
- ✅ Linie/Polygon wird gezeichnet
- ✅ Farbe ist korrekt

### Test 6: Speichern & Laden
1. Symbole platzieren
2. "Speichern" Button klicken
- ✅ JSON-Datei wird heruntergeladen

3. "Laden" Button klicken
4. JSON-Datei auswählen
- ✅ Symbole werden geladen

### Test 7: Export
1. "Export" Menü öffnen
2. "Als PNG" wählen
- ✅ PNG-Datei wird heruntergeladen

3. "Als PDF" wählen
- ✅ PDF-Datei wird heruntergeladen

4. "Als GeoJSON" wählen
- ✅ GeoJSON-Datei wird heruntergeladen

## Troubleshooting

### Problem: npm install schlägt fehl

**Fehler:** `EACCES: permission denied`
```bash
# Lösung: npm Cache löschen
npm cache clean --force
npm install
```

**Fehler:** `ERESOLVE unable to resolve dependency tree`
```bash
# Lösung: Legacy Peer Dependencies
npm install --legacy-peer-deps
```

### Problem: Port 3000 bereits belegt

**Fehler:** `Port 3000 is already in use`

**Lösung 1:** Anderen Port verwenden
```bash
# In vite.config.js ändern:
server: {
  port: 3001
}
```

**Lösung 2:** Prozess beenden
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: Karte lädt nicht

**Symptom:** Graue Kacheln statt Karte

**Ursachen & Lösungen:**
1. **Keine Internetverbindung**
   - OpenStreetMap benötigt Internet
   - Verbindung prüfen

2. **Browser-Cache**
   - Cache leeren: Strg + Shift + Delete
   - Hard Reload: Strg + F5

3. **Firewall/Proxy**
   - OpenStreetMap Tiles erlauben
   - Proxy-Einstellungen prüfen

### Problem: Symbole werden nicht angezeigt

**Lösung:** Browser Console prüfen
```bash
# Browser öffnen
# F12 drücken
# Console Tab öffnen
# Nach Fehlern suchen
```

Häufige Fehler:
- `404 Not Found` → Datei fehlt
- `CORS Error` → Pfad falsch

### Problem: Drag & Drop funktioniert nicht

**Lösung:** Browser-Kompatibilität
- Chrome: ✅ Vollständig unterstützt
- Firefox: ✅ Vollständig unterstützt
- Safari: ✅ Vollständig unterstützt
- Edge: ✅ Vollständig unterstützt
- IE11: ❌ Nicht unterstützt

### Problem: Export funktioniert nicht

**PNG/PDF Export schlägt fehl:**
```bash
# Browser Console prüfen
# Häufig: CORS-Probleme mit externen Bildern
```

**Lösung:**
- Lokale Symbole verwenden (bereits implementiert)
- Browser-Erweiterungen deaktivieren (AdBlocker)

## Performance-Tests

### Ladezeit messen
```bash
# Production Build erstellen
npm run build

# Build testen
npm run preview
```

**Erwartete Werte:**
- Initial Load: < 2 Sekunden
- Time to Interactive: < 3 Sekunden
- Bundle Size: ~500 KB (gzipped)

### Speicher-Verbrauch
- **Idle**: ~50-100 MB
- **Mit 50 Symbolen**: ~150-200 MB
- **Mit 200 Symbolen**: ~300-400 MB

### FPS (Frames per Second)
- **Erwartung**: 60 FPS
- **Minimum**: 30 FPS

**FPS messen:**
1. Browser DevTools öffnen (F12)
2. Performance Tab
3. "Record" klicken
4. Karte bewegen/zoomen
5. "Stop" klicken
6. FPS-Graph prüfen

## Browser-Kompatibilität

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Vollständig |
| Firefox | 88+ | ✅ Vollständig |
| Safari | 14+ | ✅ Vollständig |
| Edge | 90+ | ✅ Vollständig |
| Opera | 76+ | ✅ Vollständig |
| IE11 | - | ❌ Nicht unterstützt |

## Production Build

### Build erstellen
```bash
npm run build
```

**Erwartete Ausgabe:**
```
vite v5.0.8 building for production...
✓ 234 modules transformed.
dist/index.html                   0.56 kB │ gzip:  0.34 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.45 kB
dist/assets/index-def456.js     345.67 kB │ gzip: 98.76 kB
✓ built in 12.34s
```

### Build testen
```bash
npm run preview
```

Browser öffnet auf `http://localhost:4173`

### Build-Ordner prüfen
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── icons/
└── fire-icon.svg
```

## Docker-Installation

### Docker prüfen
```bash
docker --version
# Docker version 24.0.0 oder höher

docker-compose --version
# Docker Compose version v2.20.0 oder höher
```

### Docker Build
```bash
# Image bauen
docker-compose build

# Container starten
docker-compose up -d

# Logs prüfen
docker-compose logs -f

# Status prüfen
docker-compose ps
```

**Erwartete Ausgabe:**
```
NAME                    STATUS    PORTS
feuerwehr-krokier-app   running   0.0.0.0:3000->80/tcp
```

Browser öffnen: `http://localhost:3000`

### Docker stoppen
```bash
docker-compose down
```

## Automatisierte Tests (Optional)

### Unit Tests hinzufügen
```bash
# Vitest installieren
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Test-Script in package.json:
"scripts": {
  "test": "vitest"
}

# Tests ausführen
npm test
```

### E2E Tests (Playwright)
```bash
# Playwright installieren
npm install -D @playwright/test

# Tests ausführen
npx playwright test
```

## Checkliste vor Deployment

- [ ] `npm install` erfolgreich
- [ ] `npm run dev` startet ohne Fehler
- [ ] Alle Features getestet (siehe oben)
- [ ] `npm run build` erfolgreich
- [ ] `npm run preview` funktioniert
- [ ] Browser Console ohne Fehler
- [ ] Keine 404-Fehler
- [ ] Alle Symbole laden
- [ ] Export funktioniert (PNG, PDF, GeoJSON)
- [ ] Speichern/Laden funktioniert
- [ ] Performance akzeptabel (< 3s Ladezeit)

## Support & Hilfe

### Logs sammeln
```bash
# Development Logs
npm run dev > dev.log 2>&1

# Build Logs
npm run build > build.log 2>&1
```

### Browser Console exportieren
1. F12 drücken
2. Console Tab
3. Rechtsklick → "Save as..."

### System-Informationen
```bash
# Node.js Version
node --version

# npm Version
npm --version

# Betriebssystem
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

# Installierte Packages
npm list --depth=0
```

## Nächste Schritte

Nach erfolgreicher Installation:

1. **Dokumentation lesen:**
   - QUICKSTART.md
   - FEATURES.md
   - DEPLOYMENT.md

2. **App testen:**
   - Alle Features durchgehen
   - Eigene Symbole platzieren
   - Speichern/Laden testen

3. **Anpassen:**
   - Eigene Symbole hinzufügen
   - Startposition ändern
   - Farben anpassen

4. **Deployen:**
   - Docker, Vercel oder Netlify
   - Siehe DEPLOYMENT.md

## Kontakt

Bei Problemen:
- Browser Console prüfen (F12)
- Logs sammeln (siehe oben)
- Issue im Repository erstellen

---

**Installation erfolgreich? → Siehe QUICKSTART.md für erste Schritte!**
