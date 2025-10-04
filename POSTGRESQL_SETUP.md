# 🐘 PostgreSQL Backend Setup (Neon)

## ✅ Was wurde erstellt:

### 1. **Datenbank-Struktur**
- `admin_users` - Admin-Benutzer
- `symbols` - Alle Symbole (147 Standard-Symbole)
- `settings` - App-Einstellungen
- `maps` - Gespeicherte Karten

### 2. **Backend-Dateien**
- `server/db.js` - PostgreSQL Connection & Setup
- `server/index-postgres.js` - Express Server mit PostgreSQL
- `.env` - Datenbank-Verbindung (SICHER!)

### 3. **Features**
- ✅ Zentrale Symbol-Speicherung
- ✅ Admin-Authentifizierung
- ✅ Symbol-Management (umbenennen, löschen, hinzufügen)
- ✅ Einstellungen zentral verwalten
- ✅ Alle Nutzer sehen gleiche Symbole

---

## 🚀 Backend LOKAL testen:

### 1. **Backend starten**
```bash
npm run server
```

**Du solltest sehen:**
```
🔧 Erstelle Datenbank-Tabellen...
✅ Standard-Admin erstellt (admin/admin123)
📦 Erstelle Standard-Symbole...
✅ 147 Standard-Symbole erstellt
✅ Standard-Einstellungen erstellt
✅ Datenbank-Setup abgeschlossen!

✅ Backend-Server läuft auf http://localhost:3001
💾 Datenbank: Neon PostgreSQL
🔐 Admin-Login: admin / admin123
```

### 2. **Frontend starten**
Öffne ein **ZWEITES Terminal**:
```bash
npm run dev
```

### 3. **Testen**
1. Öffne http://localhost:5173
2. Klicke auf **⚙️ Einstellungen**
3. Login: **admin** / **admin123**
4. Symbole umbenennen
5. Seite neu laden
6. **Symbole bleiben umbenannt!** ✅

---

## 🌐 Backend auf Render.com deployen:

### Schritt 1: Repository vorbereiten
```bash
git add .
git commit -m "PostgreSQL Backend ready"
git push
```

### Schritt 2: Render.com Setup

1. **Gehe zu [render.com](https://render.com)** und melde dich an

2. **Neuer Web Service**
   - Click "New +" → "Web Service"
   - Connect dein GitHub Repository
   - Name: `krokier-backend`

3. **Build & Start Settings**
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
   - **Branch:** `main`

4. **Environment Variables** (WICHTIG!)
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_IOL8v6fYbkti@ep-dark-shadow-aek7xu2c-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   
   JWT_SECRET = krokier-secret-key-change-in-production-2024
   
   PORT = 3001
   
   FRONTEND_URL = https://your-netlify-app.netlify.app
   ```

5. **Deploy** klicken!

### Schritt 3: Frontend verbinden

Nach dem Deployment bekommst du eine URL wie:
```
https://krokier-backend.onrender.com
```

**Erstelle `.env` im Frontend:**
```bash
VITE_API_URL=https://krokier-backend.onrender.com/api
```

**Rebuild & Deploy auf Netlify:**
```bash
git add .env
git commit -m "Connect to Render backend"
git push
```

---

## 🔐 Sicherheit:

### ⚠️ WICHTIG:
1. **Passwort ändern** nach erstem Login!
2. **JWT_SECRET** in Produktion ändern
3. **DATABASE_URL** niemals in Code committen
4. **`.env` ist in .gitignore** ✅

---

## 📊 Datenbank-Struktur:

### `admin_users`
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- password (VARCHAR - gehashed)
- email (VARCHAR)
- created_at (TIMESTAMP)
```

### `symbols`
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- icon (VARCHAR - Pfad zum Bild)
- category (VARCHAR)
- visible (BOOLEAN)
- sort_order (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `settings`
```sql
- id (SERIAL PRIMARY KEY)
- key (VARCHAR UNIQUE)
- value (TEXT)
- updated_at (TIMESTAMP)
```

### `maps`
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- data (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🐛 Troubleshooting:

### Problem: "Connection refused"
- Prüfe ob Neon-Datenbank aktiv ist
- Prüfe DATABASE_URL in .env

### Problem: "Password authentication failed"
- Prüfe DATABASE_URL (korrektes Passwort?)
- Kopiere Connection String neu von Neon

### Problem: "SSL required"
- Neon benötigt SSL, ist bereits in db.js konfiguriert

### Problem: Backend startet nicht
```bash
# Dependencies installieren
npm install

# .env prüfen
cat .env

# Backend mit Debug starten
node server/index-postgres.js
```

---

## ✨ Vorteile dieser Lösung:

✅ **Zentrale Verwaltung**
- Admin ändert Symbole → ALLE Nutzer sehen sie

✅ **Skalierbar**
- Unbegrenzt Nutzer
- Professionelle Datenbank

✅ **Kostenlos**
- Neon: 0.5 GB kostenlos
- Render.com: 750h/Monat kostenlos

✅ **Sicher**
- JWT-Auth
- Gehashte Passwörter
- SSL-Verbindung

---

## 📝 Nächste Schritte:

1. ✅ Backend lokal testen (`npm run server`)
2. ✅ Admin-Panel testen
3. ✅ Symbole umbenennen
4. ✅ Auf Render.com deployen
5. ✅ Frontend mit Backend verbinden

---

## 🆘 Support:

Bei Problemen:
1. Prüfe `.env` File
2. Prüfe Neon-Datenbank (ist sie aktiv?)
3. Prüfe Backend-Logs
4. Teste Verbindung: `curl http://localhost:3001/health`
