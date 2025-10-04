# Krokier-App - Version 2.0

Eine moderne React-Anwendung für taktische Lagekarten mit umfangreichen Zeichen- und Verwaltungsfunktionen.

## ✨ Features

- 🗺️ **Interaktive Karte** mit OpenStreetMap (React-Leaflet)
- 🎨 **Zeichenwerkzeuge** - Pinsel, Radiergummi, Linien, Rechtecke, Kreise
- 📦 **147 Symbole** aus Kroki_Symbole Ordner
- 🖱️ **Drag & Drop** zum Platzieren von Symbolen
- 🏷️ **Beschriftung** von Symbolen
- 🖼️ **Bilder hochladen** als Overlay auf der Karte
- 🔒 **Karten-Sperre** zum Schutz vor versehentlichen Änderungen
- 📍 **Geolocation** - Aktuelle Position anzeigen
- 💾 **Speichern/Laden** als JSON
- 🔧 **Admin-Bereich** mit Logo-Upload
- ⏰ **Große, lesbare Uhrzeit** (36px, Roboto Mono)
- 🎨 **Modernes Design** (Slate-Farbschema, Inter Font)
- 🖥️ **Vollbild-Modus**

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build erstellen
npm run build

# Production Preview
npm run preview
```

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker
```bash
docker build -t feuerwehr-krokier-app .
docker run -p 3000:3000 feuerwehr-krokier-app
```

## 🎯 Verwendung

### Symbole platzieren
1. Symbol aus rechter Sidebar auswählen (147 verfügbar)
2. Auf Karte ziehen und loslassen
3. Symbol verschieben durch Drag & Drop
4. Klicken → "Beschriften" für Label

### Zeichnen
1. Zeichenleiste öffnen (links oben, verschiebbar)
2. Werkzeug wählen: Pinsel, Radiergummi, Linie, Rechteck, Kreis
3. Farbe auswählen (8 Farben + Custom)
4. Pinselgröße einstellen (1-20px)
5. Auf Karte zeichnen

### Bilder hochladen
1. Rechtsklick auf Karte
2. "Bild hochladen" bestätigen
3. Bild auswählen (PNG, JPG, etc.)
4. Wird als Overlay eingefügt

### Karte sperren
1. Lock-Button in Toolbar (Grün = Entsperrt, Rot = Gesperrt)
2. Gesperrte Karte verhindert Änderungen
3. Nochmal klicken zum Entsperren

### Meine Position
1. "Meine Position" Button klicken
2. GPS-Berechtigung erlauben
3. Karte zentriert sich automatisch

### Admin-Bereich
1. "Admin" Button klicken
2. Passwort: `admin123`
3. Logo hochladen
4. Einstellungen verwalten

## Technologie-Stack

- **React 18** mit Vite
- **React-Leaflet** für Kartendarstellung
- **Leaflet.Draw** für Zeichenwerkzeuge
- **TailwindCSS** für modernes Styling
- **react-dnd** für Drag & Drop
- **html2canvas + jsPDF** für Exporte
- **Lucide React** für UI-Icons

## Lizenz

MIT
