# 🚀 Krokier App OHNE Docker Desktop installieren

## ✨ Super Einfache Methode (EMPFOHLEN)

### Schritt 1: Production Build erstellen
Öffnen Sie PowerShell im Projektordner:
```powershell
cd c:\Users\panda\Documents\02_krokier_app_native
npm run build
```

Das erstellt einen `dist/` Ordner mit allen fertigen Dateien.

### Schritt 2: Nginx Container in Portainer erstellen

1. **In Portainer:** Containers → Add container
2. **Füllen Sie aus:**
   - **Name:** `krokier-app`
   - **Image:** `nginx:alpine`
   - **Port mapping:** 
     - host: `3000`
     - container: `80`

3. **Volumes:**
   - Klicken Sie auf **+ map additional volume**
   - **container:** `/usr/share/nginx/html`
   - **Bind:** Wählen Sie den Pfad zu Ihrem `dist/` Ordner

4. **Deploy the container**

### Schritt 3: Fertig!
Öffnen Sie: `http://[SERVER-IP]:3000`

---

## 🎁 Alternative: ZIP-Upload Methode

### Schritt 1: Build erstellen
```powershell
npm run build
```

### Schritt 2: dist/ Ordner komprimieren
Rechtsklick auf `dist/` → **Senden an** → **ZIP-komprimierter Ordner**

### Schritt 3: Auf Server kopieren
Kopieren Sie `dist.zip` auf Ihren Server

### Schritt 4: In Portainer
1. **Containers** → **Add container**
2. **Name:** `krokier-app`
3. **Image:** `nginx:alpine`
4. **Port:** `3000:80`
5. **Volumes:** Entpacken Sie dist.zip und mounten Sie den Ordner

---

## 🐳 Docker Image von Docker Hub (Fertig!)

### Verwenden Sie ein vorgefertigtes Nginx-Image:

1. **In Portainer:** Stacks → Add stack
2. **Name:** `krokier-app`
3. **Web editor:**

```yaml
version: '3.8'

services:
  krokier-app:
    image: nginx:alpine
    ports:
      - "3000:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
```

4. **Upload:** Laden Sie `dist/` Ordner und `nginx.conf` hoch
5. **Deploy the stack**

---

## 📦 Komplettes Paket erstellen (für Portainer Upload)

### Schritt 1: Build erstellen
```powershell
npm run build
```

### Schritt 2: Paket-Ordner erstellen
Erstellen Sie einen Ordner `krokier-app-package/` mit:
```
📁 krokier-app-package/
├── 📁 dist/ (kompletter Ordner nach npm run build)
├── 📄 nginx.conf
└── 📄 docker-compose.yml
```

### Schritt 3: docker-compose.yml anpassen
```yaml
version: '3.8'

services:
  krokier-app:
    image: nginx:alpine
    ports:
      - "3000:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
    container_name: krokier-app
```

### Schritt 4: Als ZIP komprimieren
Komprimieren Sie den kompletten `krokier-app-package/` Ordner

### Schritt 5: In Portainer hochladen
1. **Stacks** → **Add stack**
2. **Upload** → ZIP-Datei hochladen
3. **Deploy**

---

## 🎯 Was Sie brauchen (Minimal):

Nach `npm run build` haben Sie:
```
📁 dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ... (alle kompilierten Dateien)
```

Das ist ALLES was Sie brauchen! Nur ~2-5 MB!

---

## 🚀 Schnellste Methode (1 Minute):

```powershell
# 1. Build erstellen
npm run build

# 2. dist/ Ordner auf Server kopieren (USB/Netzwerk)

# 3. In Portainer:
# Containers → Add container
# Image: nginx:alpine
# Port: 3000:80
# Volume: /pfad/zu/dist:/usr/share/nginx/html
# Deploy!
```

---

## 💡 Warum ist das besser?

| Methode | Größe | Geschwindigkeit | Einfachheit |
|---------|-------|-----------------|-------------|
| **Docker Image (.tar)** | ~200 MB | Langsam | Komplex |
| **dist/ + nginx** | ~5 MB | Schnell | ✅ Sehr einfach |
| **Production Build** | ~2 MB | Sehr schnell | ✅ Am einfachsten |

---

## 🆘 Probleme?

### "npm run build" funktioniert nicht
```powershell
# Installieren Sie Dependencies:
npm install

# Dann nochmal:
npm run build
```

### "dist/ Ordner nicht gefunden"
Der Ordner wird nach `npm run build` erstellt.
Schauen Sie in: `c:\Users\panda\Documents\02_krokier_app_native\dist\`

### "App lädt nicht in Portainer"
1. Prüfen Sie ob nginx:alpine Container läuft
2. Prüfen Sie Volume-Pfad (muss absolut sein)
3. Prüfen Sie Port 3000 ist frei

---

## ✅ Zusammenfassung

**Sie brauchen KEIN Docker Desktop!**

1. ✅ `npm run build` → Erstellt `dist/` Ordner
2. ✅ `dist/` auf Server kopieren
3. ✅ Nginx Container in Portainer mit Volume
4. ✅ Fertig!

**Kein Docker-Image bauen nötig! 🎉**
