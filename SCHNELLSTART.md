# 🚀 Schnellstart-Anleitung

## Installation (einmalig)

```bash
npm install
```

## App starten

```bash
npm run dev
```

Die App öffnet automatisch auf **http://localhost:3000**

## Backend starten (optional)

```bash
npm run server
```

Backend läuft auf **http://localhost:3001**

---

## ⚡ Erste Schritte

### 1. Symbol platzieren
- Sidebar rechts öffnen
- Symbol auswählen
- Auf Karte ziehen
- Fertig! ✅

### 2. Zeichnen
- Zeichenleiste links oben öffnen
- Pinsel auswählen
- Farbe wählen
- Auf Karte malen 🎨

### 3. Bild hochladen
- Rechtsklick auf Karte
- Bild auswählen
- Wird eingefügt 📸

### 4. Karte sperren
- Lock-Button klicken
- Karte ist geschützt 🔒

### 5. Meine Position
- "Meine Position" klicken
- GPS erlauben
- Karte zentriert sich 📍

---

## 🎨 Design-Highlights

- **Große Uhrzeit**: 36px, gut lesbar
- **Moderne Schrift**: Inter (Google Fonts)
- **Dunkles Design**: Slate-Farbschema
- **Verschiebbare Toolbar**: Zeichenleiste kann bewegt werden
- **147 Symbole**: Alle aus Kroki_Symbole Ordner

---

## 🔑 Admin-Zugang

**Passwort**: `admin123`

Im Admin-Bereich können Sie:
- Logo hochladen
- Einstellungen ändern
- Benutzer verwalten

---

## 💡 Tipps

- **Strg+S**: Schnell speichern
- **F11**: Vollbild
- **Rechtsklick**: Bild hochladen
- **Zeichenleiste**: Minimieren mit Pfeil-Button
- **Suche**: Symbole in Sidebar durchsuchen

---

## 🐛 Probleme?

### App startet nicht?
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 3000 belegt?
```bash
# In vite.config.js Port ändern
server: { port: 3001 }
```

### Symbole laden nicht?
- Prüfen Sie ob `/Kroki_Symbole/2x/` existiert
- 147 PNG-Dateien sollten vorhanden sein

---

## ✅ Checkliste

- [ ] `npm install` ausgeführt
- [ ] `npm run dev` gestartet
- [ ] Browser auf localhost:3000 geöffnet
- [ ] Symbol platziert
- [ ] Gezeichnet
- [ ] Gespeichert

**Alles funktioniert? Viel Erfolg! 🎉**
