# 🔐 Environment Variables Setup

## ⚠️ WICHTIG: Manuelle .env Erstellung erforderlich!

Die `.env` Datei enthält sensible Daten und wird NICHT auf GitHub gepusht.

### Schritt 1: `.env` Datei erstellen

Erstelle eine neue Datei `.env` im Projekt-Root:

```bash
# Windows
notepad .env

# Mac/Linux
nano .env
```

### Schritt 2: Folgende Zeilen einfügen:

```env
# PostgreSQL Connection String (Neon)
DATABASE_URL=postgresql://neondb_owner:DEIN_NEUES_PASSWORT@ep-dark-shadow-aek7xu2c-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret
JWT_SECRET=krokier-secret-key-change-in-production-2024

# Server Port
PORT=3001

# Frontend URL (für CORS)
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Schritt 3: Passwort eintragen

Ersetze `DEIN_NEUES_PASSWORT` mit deinem Neon-Passwort.

### Schritt 4: Speichern & Backend starten

```bash
npm run server
```

---

## 🔒 Sicherheit

- ✅ Die `.env` ist in `.gitignore` und wird nie auf GitHub gepusht
- ✅ Jeder Entwickler muss seine eigene `.env` lokal erstellen
- ✅ Für Produktion: Environment Variables direkt auf Render.com setzen

---

## 📝 Für Render.com Deployment

Setze die Environment Variables direkt im Render.com Dashboard:

1. Gehe zu deinem Service
2. **Environment** → **Add Environment Variable**
3. Füge alle Variablen aus der `.env` hinzu
4. Deploy!
