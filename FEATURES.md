# Feature-Dokumentation - Feuerwehr Krokier-App

## Übersicht

Die Feuerwehr Krokier-App ist eine vollständige taktische Lagekarten-Anwendung für Feuerwehreinsätze mit allen geforderten Features.

## ✅ Implementierte Features

### 1. Interaktive Karte
- **React-Leaflet Integration** mit OpenStreetMap Tiles
- Zoom, Pan und Vollbild-Navigation
- Responsive Design für alle Bildschirmgrößen
- Standard-Startposition: Mitte Deutschland (konfigurierbar)

### 2. Toolbar (Oben)
- **Live-Uhrzeit**: Aktualisiert sich jede Sekunde mit Datum und Uhrzeit
- **Speichern-Button**: Speichert alle Symbole und Zeichnungen als JSON
- **Laden-Button**: Lädt gespeicherte Lagekarten
- **Export-Menü**: 
  - PNG Export (html2canvas)
  - PDF Export (jsPDF)
  - GeoJSON Export für GIS-Systeme
- **Vollbild-Button**: Toggle für Vollbildmodus

### 3. Farbpalette
- **8 vordefinierte Farben**: Rot, Orange, Gelb, Grün, Blau, Lila, Schwarz, Weiß
- **Custom Color Picker**: Eigene Farben wählbar
- Visuelles Feedback für ausgewählte Farbe
- Positioniert links oben auf der Karte

### 4. Symbol-Bibliothek (Rechte Sidebar)
**12 Feuerwehr-spezifische Symbole:**
- 🚒 Löschfahrzeug
- 🚑 Rettungswagen
- 🔥 Brandstelle
- 💧 Wasserentnahme
- 🏠 Einsatzleitung
- ⚠️ Gefahrenstelle
- 👤 Person
- 🏢 Gebäude
- 🚰 Hydrant
- 🪜 Drehleiter
- 🔗 Schlauchleitung
- 🚧 Absperrung

Alle Icons als SVG im `/public/assets/icons/` Verzeichnis.

### 5. Drag & Drop Funktionalität
- **react-dnd** mit HTML5 Backend
- Symbole aus Sidebar auf Karte ziehen
- Platzierte Symbole sind verschiebbar
- Visuelles Feedback beim Ziehen (Transparenz)
- Hover-Effekte auf Symbolen

### 6. Symbol-Verwaltung
- **Verschieben**: Drag & Drop auf der Karte
- **Beschriften**: Klick auf Symbol → Popup → Beschriftung hinzufügen
- **Löschen**: X-Button im Popup
- **Popup-Informationen**: Name und Label anzeigen

### 7. Zeichenwerkzeuge (Leaflet.Draw)
- **Polyline**: Linien zeichnen (z.B. Schlauchleitung)
- **Polygon**: Flächen zeichnen (z.B. Gefahrenbereich)
- **Rectangle**: Rechtecke zeichnen
- **Circle**: Kreise zeichnen
- **Farbauswahl**: Alle Zeichnungen nutzen die gewählte Farbe
- **Bearbeiten**: Gezeichnete Objekte editieren
- **Löschen**: Zeichnungen entfernen

### 8. Speichern & Laden
**JSON-Format:**
```json
{
  "version": "1.0",
  "timestamp": "2025-10-03T19:57:41.000Z",
  "symbols": [...],
  "drawings": [...]
}
```
- Automatischer Download als `.json` Datei
- Upload via File-Input
- Alle Symbole und Zeichnungen werden gespeichert

### 9. Export-Funktionen
- **PNG**: Screenshot der Karte (html2canvas)
- **PDF**: Karte als PDF-Dokument (jsPDF)
- **GeoJSON**: Standardformat für GIS-Systeme
  - Symbole als Point-Features
  - Mit Eigenschaften (type, icon, label)

### 10. UI/UX Features
- **TailwindCSS**: Modernes, responsives Design
- **Lucide Icons**: Professionelle UI-Icons
- **Farbschema**: Feuerwehr-Rot (#DC2626) als Hauptfarbe
- **Hover-Effekte**: Auf allen interaktiven Elementen
- **Transitions**: Smooth Animationen
- **Tooltips**: Hilfreiche Beschreibungen

### 11. Tastenkürzel (Dokumentiert in Sidebar)
- `Strg+S`: Speichern
- `Strg+O`: Laden
- `F11`: Vollbild
- `Entf`: Löschen

## 🏗️ Technische Architektur

### Frontend-Stack
- **React 18**: Moderne Hooks-basierte Komponenten
- **Vite**: Schneller Build-Tool
- **React-Leaflet 4.2**: Leaflet-Wrapper für React
- **Leaflet-Draw 1.0**: Zeichenwerkzeuge
- **react-dnd 16**: Drag & Drop
- **html2canvas 1.4**: Screenshot-Funktionalität
- **jsPDF 2.5**: PDF-Generierung
- **TailwindCSS 3.3**: Utility-First CSS
- **Lucide React**: Icon-Bibliothek

### Komponenten-Struktur
```
src/
├── App.jsx                 # Haupt-App mit State Management
├── components/
│   ├── MapComponent.jsx    # Leaflet-Karte mit Drag & Drop
│   ├── Toolbar.jsx         # Top-Bar mit Aktionen
│   ├── Sidebar.jsx         # Symbol-Bibliothek
│   └── ColorPalette.jsx    # Farbauswahl
├── main.jsx               # React Entry Point
└── index.css              # Global Styles + Tailwind
```

### State Management
- **useState** für lokalen Component State
- **useRef** für Map-Referenzen
- **Props** für Parent-Child Kommunikation
- Keine externe State Library nötig (Redux, Zustand)

## 🚀 Deployment-Optionen

### Lokal
```bash
npm install
npm run dev
```

### Docker
```bash
docker-compose up -d
```

### Cloud (Zero-Config)
- **Vercel**: `vercel`
- **Netlify**: `netlify deploy`
- **Railway**: `railway up`

Alle Konfigurationsdateien sind vorhanden.

## 📦 Build-Output
- **Optimiert**: Code Splitting, Tree Shaking, Minification
- **Größe**: ~500KB (gzipped)
- **Browser-Support**: Alle modernen Browser (Chrome, Firefox, Safari, Edge)

## 🔧 Erweiterungsmöglichkeiten

### Backend-Integration (Optional)
```javascript
// In App.jsx
const handleSaveToAPI = async () => {
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ symbols, drawings })
  })
}
```

### Zusätzliche Symbole
Einfach neue SVG-Dateien in `/public/assets/icons/` legen und in `Sidebar.jsx` registrieren.

### Geolocation
```javascript
// In MapComponent.jsx
navigator.geolocation.getCurrentPosition((pos) => {
  map.setView([pos.coords.latitude, pos.coords.longitude], 15)
})
```

### Offline-Modus
Service Worker für PWA-Funktionalität hinzufügen.

## 🎯 Verwendung im Einsatz

### Typischer Workflow:
1. **Karte öffnen** → Einsatzort suchen/zoomen
2. **Symbole platzieren** → Fahrzeuge, Gefahrenstellen markieren
3. **Bereiche zeichnen** → Gefahrenzonen, Absperrungen
4. **Beschriften** → Wichtige Informationen hinzufügen
5. **Speichern** → JSON für spätere Verwendung
6. **Exportieren** → PDF für Einsatzbericht

### Best Practices:
- **Farben**: Rot für Gefahren, Blau für Wasser, Gelb für Absperrungen
- **Labels**: Kurz und präzise (z.B. "LF 1", "Hydrant 50m")
- **Speichern**: Regelmäßig während des Einsatzes
- **Export**: PDF für Dokumentation, GeoJSON für Nachbereitung

## 📱 Mobile Nutzung
- Touch-optimiert für Tablets
- Responsive Layout
- Pinch-to-Zoom auf der Karte
- Große Touch-Targets für Buttons

## 🔒 Sicherheit
- Keine Authentifizierung (lokale Nutzung)
- Keine Daten werden an Server gesendet
- Alle Daten bleiben im Browser
- Optional: Backend-Integration für Team-Sharing

## 📄 Lizenz & Credits
- **Lizenz**: MIT
- **Karten**: OpenStreetMap Contributors
- **Icons**: Custom SVG (Feuerwehr-spezifisch)
- **Framework**: React, Leaflet, TailwindCSS
