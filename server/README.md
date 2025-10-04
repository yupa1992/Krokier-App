# 🔐 Krokier App - Admin Backend

## Übersicht

Vollständiges Backend mit Admin-Authentifizierung und Symbol-Management.

## Features

### 🔐 Admin-Authentifizierung
- **JWT-basierte Auth** mit HttpOnly Cookies
- **Bcrypt** Password-Hashing
- **Session-Management**
- **Token-Validierung**

### 📦 Symbol-Management
- **Symbole abrufen** (öffentlich)
- **Symbole umbenennen** (Admin only)
- **Symbole löschen** (Admin only)
- **Symbole hinzufügen** (Admin only)
- **Bulk-Update** (Admin only)
- **Kategorien verwalten**

### ⚙️ Globale Einstellungen
- **App-Name**
- **Logo**
- **Standard-Zoom & Center**
- **Weitere Einstellungen**

### 🗺️ Karten-Verwaltung
- **Karten speichern**
- **Karten laden**
- **Karten löschen**

## API Endpoints

### Admin Auth

#### POST `/api/admin/login`
Login für Admin
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### POST `/api/admin/logout`
Logout (Token wird gelöscht)

#### GET `/api/admin/status`
Prüft ob Admin eingeloggt ist (Auth required)

#### PUT `/api/admin/password`
Passwort ändern (Auth required)
```json
{
  "currentPassword": "admin123",
  "newPassword": "neuesPasswort"
}
```

### Symbol Management

#### GET `/api/symbols`
Alle Symbole abrufen (öffentlich)

#### PUT `/api/symbols/:id`
Symbol aktualisieren (Auth required)
```json
{
  "name": "Neuer Name",
  "category": "Rettungen",
  "visible": true
}
```

#### DELETE `/api/symbols/:id`
Symbol löschen (Auth required)

#### POST `/api/symbols`
Neues Symbol hinzufügen (Auth required)
- Multipart/form-data mit `icon` File
- Oder JSON mit `icon` URL

#### PUT `/api/symbols`
Bulk-Update (Auth required)
```json
{
  "symbols": [...]
}
```

### Settings

#### GET `/api/settings`
Globale Einstellungen abrufen (öffentlich)

#### PUT `/api/settings`
Einstellungen aktualisieren (Auth required)
```json
{
  "appName": "Meine Krokier App",
  "defaultZoom": 15
}
```

#### POST `/api/settings/logo`
Logo hochladen (Auth required)
- Multipart/form-data mit `logo` File

### Maps

#### POST `/api/maps/save`
Karte speichern

#### GET `/api/maps`
Alle Karten abrufen

#### GET `/api/maps/:id`
Spezifische Karte laden

#### DELETE `/api/maps/:id`
Karte löschen

## Standard-Zugangsdaten

```
Username: admin
Password: admin123
```

**⚠️ WICHTIG: Ändern Sie das Passwort nach dem ersten Login!**

## Datenbank

Das Backend verwendet JSON-Files als einfache Datenbank:

- `server/data.json` - Admin-Daten, Einstellungen, Karten
- `server/symbols.json` - Symbol-Definitionen

### Beispiel `data.json`:
```json
{
  "admin": {
    "username": "admin",
    "password": "$2a$10$...",
    "email": "admin@krokier.local"
  },
  "settings": {
    "logo": null,
    "appName": "Krokier App",
    "defaultZoom": 13,
    "defaultCenter": [51.1657, 10.4515]
  },
  "maps": []
}
```

### Beispiel `symbols.json`:
```json
[
  {
    "id": 1,
    "name": "Rettungen (Mensch/Tier)",
    "icon": "/assets/icons/Element 1@2x.png",
    "category": "Rettungen",
    "visible": true
  }
]
```

## Sicherheit

### JWT Secret
Standard: `krokier-secret-key-change-in-production`

**⚠️ In Produktion ändern:**
```bash
export JWT_SECRET="dein-sicherer-secret-key"
```

### Password Hashing
- Bcrypt mit 10 Rounds
- Passwörter werden nie im Klartext gespeichert

### Auth Middleware
- Token-Validierung für alle Admin-Routen
- HttpOnly Cookies gegen XSS
- 24h Token-Gültigkeit

## Server starten

```bash
# Development
npm run server

# Mit Custom Port
PORT=3001 npm run server

# Mit Custom JWT Secret
JWT_SECRET="mein-secret" npm run server
```

## Verwendung im Frontend

### Login
```javascript
const response = await fetch('http://localhost:3001/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
})
const data = await response.json()
// Token wird automatisch als Cookie gesetzt
```

### Authentifizierte Requests
```javascript
const response = await fetch('http://localhost:3001/api/symbols/1', {
  method: 'PUT',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Optional, Cookie reicht
  },
  credentials: 'include',
  body: JSON.stringify({ name: 'Neuer Name' })
})
```

## Nächste Schritte

1. **Admin-Panel Frontend** erstellen
2. **Symbol-Editor** implementieren
3. **Kategorie-Management** hinzufügen
4. **User-Management** für Multi-User
5. **PostgreSQL/MongoDB** für Produktion

## Lizenz

MIT
