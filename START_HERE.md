# 🔥 START HERE - Feuerwehr Krokier-App

## ✅ Projekt ist vollständig und einsatzbereit!

Alle Features wurden implementiert und getestet. Die App kann sofort gestartet werden.

---

## 🚀 Schnellstart (3 Schritte)

### Schritt 1: Dependencies installieren
```bash
npm install
```
⏱️ Dauer: ~30-60 Sekunden

### Schritt 2: Development Server starten
```bash
npm run dev
```
⏱️ Browser öffnet automatisch auf http://localhost:3000

### Schritt 3: App nutzen!
- Symbole aus rechter Sidebar auf Karte ziehen
- Farbe wählen und zeichnen
- Speichern & Exportieren

---

## 📚 Dokumentation (Leseempfehlung)

### Für Einsteiger
1. **QUICKSTART.md** ⭐ - Erste Schritte & Bedienung
2. **FEATURES.md** - Was kann die App?
3. **INSTALLATION.md** - Detaillierte Installation & Tests

### Für Entwickler
4. **PROJECT_SUMMARY.md** - Vollständige Übersicht
5. **PROJECT_STRUCTURE.txt** - Dateistruktur
6. **DEPLOYMENT.md** - Deployment-Optionen

### Für Spezialfälle
7. **EXISTING_SYMBOLS.md** - PNG-Symbole integrieren
8. **README.md** - Projekt-Übersicht

---

## ✨ Was ist implementiert?

### Karten-Features
- ✅ Interaktive Karte (React-Leaflet + OpenStreetMap)
- ✅ Zoom, Pan, Vollbild
- ✅ Responsive Design

### Symbole
- ✅ 12 Feuerwehr-Symbole (SVG)
- ✅ Drag & Drop aus Sidebar
- ✅ Verschieben auf Karte
- ✅ Beschriften
- ✅ Löschen

### Zeichnen
- ✅ Linien, Polygone, Rechtecke, Kreise
- ✅ 8 Farben + Custom Picker
- ✅ Bearbeiten & Löschen

### Speichern & Export
- ✅ Speichern als JSON
- ✅ Laden von JSON
- ✅ Export als PNG (Screenshot)
- ✅ Export als PDF
- ✅ Export als GeoJSON

### UI/UX
- ✅ Live-Uhrzeit in Toolbar
- ✅ Moderne UI (TailwindCSS)
- ✅ Professionelle Icons (Lucide)
- ✅ Hover-Effekte & Transitions

---

## 🎯 Typischer Workflow

```
1. App starten (npm run dev)
   ↓
2. Zum Einsatzort navigieren
   ↓
3. Fahrzeuge platzieren (Drag & Drop)
   ↓
4. Gefahrenstellen markieren
   ↓
5. Bereiche zeichnen (Absperrung, etc.)
   ↓
6. Alles beschriften
   ↓
7. Speichern (JSON) + Export (PDF)
```

---

## 🛠️ Tech-Stack

- **React 18** + **Vite** (schneller als CRA)
- **React-Leaflet** + **Leaflet-Draw**
- **TailwindCSS** (modernes Styling)
- **react-dnd** (Drag & Drop)
- **html2canvas + jsPDF** (Export)

---

## 📦 Verfügbare Symbole

| Icon | Name | Verwendung |
|------|------|-----------|
| 🚒 | Löschfahrzeug | Feuerwehrfahrzeuge |
| 🚑 | Rettungswagen | RTW/NEF |
| 🔥 | Brandstelle | Feuer/Brandherd |
| 💧 | Wasserentnahme | Offene Wasserentnahme |
| 🏠 | Einsatzleitung | ELW/Kommandostand |
| ⚠️ | Gefahrenstelle | Gefahren |
| 👤 | Person | Personen/Verletzte |
| 🏢 | Gebäude | Gebäude |
| 🚰 | Hydrant | Hydranten |
| 🪜 | Drehleiter | DLK |
| 🔗 | Schlauchleitung | Schläuche |
| 🚧 | Absperrung | Absperrungen |

Alle als SVG in `/public/assets/icons/`

---

## 🐳 Deployment-Optionen

### Lokal (Entwicklung)
```bash
npm run dev
```

### Docker (Production)
```bash
docker-compose up -d
```

### Cloud (Kostenlos)
```bash
# Vercel
vercel

# Netlify
netlify deploy

# Railway
railway up
```

Alle Config-Dateien sind vorhanden!

---

## 🎨 Anpassungen

### Startposition ändern
```javascript
// In src/components/MapComponent.jsx, Zeile 154
<MapContainer
  center={[51.1657, 10.4515]}  // Ihre Koordinaten hier
  zoom={13}
```

### Weitere Symbole hinzufügen
1. SVG in `/public/assets/icons/` legen
2. In `src/components/Sidebar.jsx` registrieren

### Farben anpassen
```javascript
// In tailwind.config.js
theme: {
  extend: {
    colors: {
      fire: {
        red: '#DC2626',    // Ihre Farbe
        orange: '#EA580C',
        yellow: '#FACC15'
      }
    }
  }
}
```

---

## 🔍 Troubleshooting

### Port 3000 belegt?
```javascript
// In vite.config.js
server: {
  port: 3001  // Anderen Port verwenden
}
```

### Karte lädt nicht?
- Internetverbindung prüfen (OpenStreetMap)
- Browser-Cache leeren (Strg + F5)
- Browser Console prüfen (F12)

### Dependencies-Fehler?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Browser-Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ IE11 (nicht unterstützt)

---

## 🎓 Tastenkürzel

- `Strg + S` - Speichern
- `Strg + O` - Laden
- `F11` - Vollbild
- `Entf` - Löschen

---

## 📊 Projekt-Status

| Feature | Status |
|---------|--------|
| Karte | ✅ Vollständig |
| Symbole | ✅ 12 Icons |
| Drag & Drop | ✅ Funktioniert |
| Zeichnen | ✅ 4 Tools |
| Speichern | ✅ JSON |
| Export | ✅ PNG/PDF/GeoJSON |
| UI | ✅ Modern |
| Docs | ✅ Umfangreich |
| Deployment | ✅ Ready |

**Gesamtstatus: 🟢 PRODUCTION READY**

---

## 🎯 Nächste Schritte

### Jetzt sofort:
```bash
npm install
npm run dev
```

### Dann:
1. QUICKSTART.md lesen
2. App testen
3. Eigene Symbole platzieren
4. Speichern/Laden ausprobieren

### Später:
1. Eigene Symbole hinzufügen
2. Startposition anpassen
3. Deployen (Docker/Vercel/Netlify)

---

## 💡 Tipps

- **Regelmäßig speichern** während des Einsatzes
- **Farben nutzen**: Rot=Gefahr, Blau=Wasser, Gelb=Absperrung
- **Labels kurz halten**: "LF 1", "Hydrant 50m"
- **PDF exportieren** für Einsatzbericht

---

## 📞 Support

Bei Fragen:
1. Dokumentation lesen (siehe oben)
2. Browser Console prüfen (F12)
3. INSTALLATION.md → Troubleshooting
4. Issue im Repository erstellen

---

## 📄 Lizenz

MIT License - Frei verwendbar für kommerzielle und private Zwecke

---

## 🎉 Los geht's!

```bash
npm install && npm run dev
```

**Die App öffnet automatisch im Browser!**

Viel Erfolg beim Einsatz! 🔥🚒

---

**Erstellt mit ❤️ für die Feuerwehr**
