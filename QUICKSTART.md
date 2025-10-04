# 🚀 Quick Start Guide

## Schnellstart (Windows)

### Option 1: Doppelklick (Einfachste Methode)
1. Doppelklick auf `start.bat`
2. Warten bis Dependencies installiert sind
3. Browser öffnet automatisch auf `http://localhost:3000`

### Option 2: Kommandozeile
```bash
# Im Projektordner:
npm install
npm run dev
```

## Erste Schritte

### 1. Karte navigieren
- **Zoomen**: Mausrad oder +/- Buttons
- **Verschieben**: Karte mit Maus ziehen
- **Vollbild**: Button oben rechts

### 2. Symbole platzieren
1. Symbol aus rechter Sidebar auswählen
2. Auf Karte ziehen und loslassen
3. Symbol ist jetzt platziert und verschiebbar

### 3. Symbol beschriften
1. Auf Symbol klicken
2. "Beschriften" Button im Popup
3. Text eingeben und speichern

### 4. Zeichnen
1. Farbe in der Farbpalette (links oben) wählen
2. Zeichenwerkzeug in der Karte wählen (links)
3. Auf Karte klicken um zu zeichnen
4. Doppelklick zum Beenden

### 5. Speichern
- **Speichern**: Button oben → JSON-Datei wird heruntergeladen
- **Laden**: "Laden" Button → JSON-Datei auswählen
- **Export**: "Export" Menü → PNG, PDF oder GeoJSON

## Verfügbare Symbole

| Symbol | Verwendung |
|--------|-----------|
| 🚒 Löschfahrzeug | Feuerwehrfahrzeuge markieren |
| 🚑 Rettungswagen | RTW/NEF Position |
| 🔥 Brandstelle | Feuer/Brandherd |
| 💧 Wasserentnahme | Offene Wasserentnahme |
| 🏠 Einsatzleitung | ELW/Kommandostand |
| ⚠️ Gefahrenstelle | Gefahren markieren |
| 👤 Person | Personen/Verletzte |
| 🏢 Gebäude | Gebäude markieren |
| 🚰 Hydrant | Hydranten |
| 🪜 Drehleiter | DLK Position |
| 🔗 Schlauchleitung | Schläuche |
| 🚧 Absperrung | Absperrungen |

## Farben für Zeichnungen

- **Rot**: Gefahrenbereiche, Feuer
- **Orange**: Warnbereiche
- **Gelb**: Absperrungen
- **Grün**: Sichere Bereiche
- **Blau**: Wasser, Löschwasserversorgung
- **Schwarz**: Allgemeine Markierungen

## Tastenkürzel

- `Strg + S`: Speichern
- `Strg + O`: Laden
- `F11`: Vollbild
- `Entf`: Ausgewähltes löschen

## Typischer Einsatz-Workflow

```
1. Karte öffnen
   ↓
2. Zum Einsatzort navigieren (Zoom/Pan)
   ↓
3. Fahrzeuge platzieren (Löschfahrzeug, RTW, etc.)
   ↓
4. Gefahrenstellen markieren (Feuer, Gefahren)
   ↓
5. Bereiche zeichnen (Absperrung, Gefahrenzone)
   ↓
6. Wasserversorgung einzeichnen (Hydrant, Schlauch)
   ↓
7. Alles beschriften
   ↓
8. Speichern (JSON) + Export (PDF für Bericht)
```

## Troubleshooting

### Karte lädt nicht
- Internetverbindung prüfen (OpenStreetMap benötigt Internet)
- Browser-Console öffnen (F12) und Fehler prüfen

### Symbole werden nicht angezeigt
- Sicherstellen dass `/public/assets/icons/` Ordner existiert
- Browser-Cache leeren (Strg + F5)

### Port 3000 bereits belegt
```bash
# In vite.config.js Port ändern:
server: {
  port: 3001  // Anderen Port verwenden
}
```

### Dependencies-Fehler
```bash
# Node Modules neu installieren:
rm -rf node_modules package-lock.json
npm install
```

## Weitere Hilfe

- **README.md**: Allgemeine Projektinfo
- **FEATURES.md**: Detaillierte Feature-Liste
- **DEPLOYMENT.md**: Deployment-Optionen

## Support

Bei Problemen:
1. Browser-Console prüfen (F12)
2. `npm run dev` Ausgabe prüfen
3. Issue im Repository erstellen

---

**Viel Erfolg beim Einsatz! 🔥🚒**
