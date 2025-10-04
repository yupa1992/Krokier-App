# Deployment Guide - Feuerwehr Krokier-App

## Lokale Entwicklung

### Voraussetzungen
- Node.js 18+ installiert
- npm oder yarn

### Installation & Start
```bash
# Dependencies installieren
npm install

# Development Server starten (Port 3000)
npm run dev

# Production Build erstellen
npm run build

# Production Build lokal testen
npm run preview
```

## Docker Deployment

### Option 1: Docker Compose (Empfohlen)
```bash
# App bauen und starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# App stoppen
docker-compose down
```

Die App ist dann verfügbar unter: `http://localhost:3000`

### Option 2: Docker direkt
```bash
# Image bauen
docker build -t feuerwehr-krokier-app .

# Container starten
docker run -d -p 3000:80 --name feuerwehr-krokier feuerwehr-krokier-app

# Container stoppen
docker stop feuerwehr-krokier
docker rm feuerwehr-krokier
```

## Cloud Deployment

### Vercel (Kostenlos, Empfohlen für schnelles Deployment)

1. **Via Vercel CLI:**
```bash
# Vercel CLI installieren
npm install -g vercel

# Einloggen
vercel login

# Deployen
vercel

# Production Deployment
vercel --prod
```

2. **Via GitHub:**
- Repository auf GitHub pushen
- Auf [vercel.com](https://vercel.com) einloggen
- "New Project" → GitHub Repository auswählen
- Vercel erkennt automatisch Vite und deployt die App

### Netlify (Kostenlos)

1. **Via Netlify CLI:**
```bash
# Netlify CLI installieren
npm install -g netlify-cli

# Einloggen
netlify login

# Deployen
netlify deploy

# Production Deployment
netlify deploy --prod
```

2. **Via Drag & Drop:**
- `npm run build` ausführen
- `dist` Ordner auf [app.netlify.com/drop](https://app.netlify.com/drop) ziehen

3. **Via GitHub:**
- Repository auf GitHub pushen
- Auf [netlify.com](https://netlify.com) einloggen
- "New site from Git" → Repository auswählen
- Build Command: `npm run build`
- Publish directory: `dist`

### Railway (Einfach & Kostenlos)

```bash
# Railway CLI installieren
npm install -g @railway/cli

# Einloggen
railway login

# Projekt initialisieren
railway init

# Deployen
railway up
```

### Render (Kostenlos)

1. Auf [render.com](https://render.com) registrieren
2. "New Static Site" auswählen
3. GitHub Repository verbinden
4. Build Command: `npm run build`
5. Publish Directory: `dist`

## Eigener Server (VPS/Dedicated)

### Mit Nginx

```bash
# App bauen
npm run build

# Dist Ordner auf Server kopieren
scp -r dist/* user@server:/var/www/feuerwehr-krokier/

# Nginx konfigurieren
sudo nano /etc/nginx/sites-available/feuerwehr-krokier
```

Nginx Config:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/feuerwehr-krokier;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Nginx neu laden
sudo ln -s /etc/nginx/sites-available/feuerwehr-krokier /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Mit Apache

```bash
# .htaccess in dist/ Ordner erstellen
cat > dist/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF

# Dist Ordner auf Server kopieren
scp -r dist/* user@server:/var/www/html/feuerwehr-krokier/
```

## Umgebungsvariablen (Optional)

Falls Sie eine Backend-API verwenden möchten, erstellen Sie eine `.env` Datei:

```env
VITE_API_URL=https://your-api.com
VITE_MAP_CENTER_LAT=51.1657
VITE_MAP_CENTER_LNG=10.4515
```

## Performance Optimierung

### Build Optimierung
Die App ist bereits für Production optimiert mit:
- Code Splitting
- Tree Shaking
- Minification
- Gzip Compression (bei Docker/Nginx)

### Caching
Statische Assets werden automatisch für 1 Jahr gecacht.

## Monitoring & Updates

### Updates deployen
```bash
# Code ändern
git add .
git commit -m "Update"
git push

# Bei Vercel/Netlify: Automatisches Deployment
# Bei Docker: Neu bauen
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Port bereits belegt
```bash
# Anderen Port verwenden
docker run -d -p 8080:80 feuerwehr-krokier-app
```

### Build Fehler
```bash
# Node Modules neu installieren
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Karte lädt nicht
- Überprüfen Sie die Internetverbindung (OpenStreetMap Tiles)
- Browser Console auf Fehler prüfen

## Support & Lizenz

Bei Fragen oder Problemen erstellen Sie ein Issue im Repository.

Lizenz: MIT
