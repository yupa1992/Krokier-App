# Krokier App - Portainer Installation

## Methode 1: Docker Compose in Portainer (Empfohlen)

### Schritt 1: Stack erstellen
1. Öffnen Sie Portainer
2. Gehen Sie zu **Stacks** → **Add stack**
3. Name: `krokier-app`

### Schritt 2: Docker Compose einfügen
Kopieren Sie folgenden Code in das Web Editor Feld:

```yaml
version: '3.8'

services:
  krokier-app:
    image: krokier-app:latest
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    restart: unless-stopped
    container_name: krokier-app
    environment:
      - NODE_ENV=production
```

### Schritt 3: Repository hochladen
**Option A: Git Repository**
- Wählen Sie "Git Repository"
- Repository URL: `[Ihre Git URL]`
- Branch: `main`

**Option B: Upload**
- Wählen Sie "Upload"
- Laden Sie alle Dateien hoch (außer node_modules)

### Schritt 4: Deploy
- Klicken Sie auf **Deploy the stack**
- Warten Sie bis der Build abgeschlossen ist

---

## Methode 2: Manueller Build & Deploy

### Schritt 1: Image bauen (auf Ihrem PC)
```bash
cd c:/Users/panda/Documents/02_krokier_app_native
docker build -t krokier-app:latest .
```

### Schritt 2: Image speichern
```bash
docker save krokier-app:latest -o krokier-app.tar
```

### Schritt 3: Image in Portainer importieren
1. Portainer → **Images** → **Import**
2. Laden Sie `krokier-app.tar` hoch

### Schritt 4: Container erstellen
1. Portainer → **Containers** → **Add container**
2. Name: `krokier-app`
3. Image: `krokier-app:latest`
4. Port mapping: `3000:80`
5. Restart policy: `Unless stopped`
6. **Deploy the container**

---

## Methode 3: Docker Registry (Professionell)

### Schritt 1: Image taggen
```bash
docker tag krokier-app:latest localhost:5000/krokier-app:latest
```

### Schritt 2: In Registry pushen
```bash
docker push localhost:5000/krokier-app:latest
```

### Schritt 3: In Portainer deployen
1. Portainer → **Stacks** → **Add stack**
2. Name: `krokier-app`
3. Web editor:

```yaml
version: '3.8'

services:
  krokier-app:
    image: localhost:5000/krokier-app:latest
    ports:
      - "3000:80"
    restart: unless-stopped
```

---

## Zugriff auf die App

Nach dem Deployment:
- **URL:** `http://[SERVER-IP]:3000`
- **Beispiel:** `http://192.168.1.100:3000`

---

## Wichtige Dateien

Stellen Sie sicher, dass folgende Dateien im Projekt sind:

- ✅ `Dockerfile` - Build-Anweisungen
- ✅ `nginx.conf` - Nginx-Konfiguration
- ✅ `docker-compose.yml` - Container-Konfiguration
- ✅ `.dockerignore` - Ausgeschlossene Dateien

---

## Umgebungsvariablen (Optional)

Fügen Sie in Portainer unter **Environment variables** hinzu:

```
NODE_ENV=production
PORT=80
```

---

## Volumes (Optional - für Persistenz)

Wenn Sie Daten persistent speichern möchten:

```yaml
volumes:
  - krokier-data:/app/data

volumes:
  krokier-data:
```

---

## Troubleshooting

### Container startet nicht
```bash
# Logs anschauen in Portainer:
Containers → krokier-app → Logs
```

### Port bereits belegt
Ändern Sie den Port in docker-compose.yml:
```yaml
ports:
  - "8080:80"  # Statt 3000
```

### Build-Fehler
Prüfen Sie ob alle Dependencies installiert sind:
```bash
npm install
```

---

## Update der App

### Methode 1: Stack neu deployen
1. Portainer → Stacks → krokier-app
2. **Pull and redeploy**

### Methode 2: Manuell
```bash
# Neues Image bauen
docker build -t krokier-app:latest .

# Container stoppen und entfernen
docker stop krokier-app
docker rm krokier-app

# Neu starten
docker-compose up -d
```

---

## Ressourcen-Limits (Optional)

Fügen Sie in docker-compose.yml hinzu:

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

---

## Backup

### Daten sichern
```bash
docker exec krokier-app tar czf /tmp/backup.tar.gz /app/data
docker cp krokier-app:/tmp/backup.tar.gz ./backup.tar.gz
```

---

## Support

Bei Problemen:
1. Logs prüfen in Portainer
2. Container neu starten
3. Image neu bauen

**Viel Erfolg! 🚀**
