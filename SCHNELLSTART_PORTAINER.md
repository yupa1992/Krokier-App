# 🚀 Schnellstart: Krokier App in Portainer

## ⚡ Schnellste Methode (5 Minuten)

### 1. Image lokal bauen
Öffnen Sie PowerShell im Projektordner:
```powershell
cd c:\Users\panda\Documents\02_krokier_app_native
docker build -t krokier-app:latest .
```

### 2. Image als Datei exportieren
```powershell
docker save krokier-app:latest -o krokier-app.tar
```

### 3. In Portainer importieren
1. Öffnen Sie Portainer: `http://[SERVER-IP]:9000`
2. Wählen Sie Ihr Environment
3. Gehen Sie zu **Images** → **Import**
4. Laden Sie `krokier-app.tar` hoch
5. Warten Sie bis Import fertig ist

### 4. Container erstellen
1. Gehen Sie zu **Containers** → **Add container**
2. Füllen Sie aus:
   - **Name:** `krokier-app`
   - **Image:** `krokier-app:latest`
3. Unter **Manual network port publishing**:
   - **host:** `3000`
   - **container:** `80`
4. Unter **Restart policy:** `Unless stopped`
5. Klicken Sie **Deploy the container**

### 5. Fertig! 🎉
Öffnen Sie: `http://[SERVER-IP]:3000`

---

## 📦 Alternative: Docker Compose Stack

### 1. In Portainer
1. **Stacks** → **Add stack**
2. **Name:** `krokier-app`
3. **Build method:** Upload

### 2. Dateien hochladen
Laden Sie diese Dateien hoch:
- `docker-compose.yml`
- `Dockerfile`
- `nginx.conf`
- `package.json`
- `package-lock.json`
- Alle Dateien aus `src/`
- Alle Dateien aus `public/`

### 3. Deploy
Klicken Sie **Deploy the stack**

---

## 🔄 App aktualisieren

### Neue Version deployen:
```powershell
# 1. Neues Image bauen
docker build -t krokier-app:latest .

# 2. Image exportieren
docker save krokier-app:latest -o krokier-app-v2.tar

# 3. In Portainer:
# - Container stoppen
# - Images → Import (neue Version)
# - Container → Recreate
```

---

## ⚙️ Konfiguration

### Port ändern
In Portainer → Container → Duplicate/Edit:
- Port `3000` → `8080` (oder beliebig)

### Ressourcen begrenzen
In Portainer → Container → Duplicate/Edit → Resources:
- **Memory limit:** 512 MB
- **CPU limit:** 1.0

---

## 🐛 Probleme lösen

### Container startet nicht
1. Portainer → Containers → krokier-app
2. Klicken Sie auf **Logs**
3. Suchen Sie nach Fehlermeldungen

### Port bereits belegt
Ändern Sie den Host-Port:
- Statt `3000:80` → `8080:80`

### App lädt nicht
1. Prüfen Sie ob Container läuft (grüner Status)
2. Prüfen Sie Firewall-Regeln
3. Testen Sie: `http://localhost:3000` direkt auf dem Server

---

## 📊 Monitoring

In Portainer sehen Sie:
- **CPU Usage** - Prozessorauslastung
- **Memory Usage** - RAM-Verbrauch
- **Network** - Netzwerk-Traffic
- **Logs** - Echtzeit-Logs

---

## 🔐 Sicherheit

### Reverse Proxy (Optional)
Verwenden Sie Nginx Proxy Manager oder Traefik:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.krokier.rule=Host(`krokier.example.com`)"
```

### HTTPS (Optional)
Verwenden Sie Let's Encrypt mit Nginx Proxy Manager

---

## 💾 Backup

### Manuelles Backup
```powershell
# Image sichern
docker save krokier-app:latest -o backup-$(Get-Date -Format 'yyyy-MM-dd').tar

# Container-Daten sichern (falls Volumes verwendet)
docker cp krokier-app:/app/data ./backup-data
```

---

## 📝 Checkliste

- ✅ Docker ist installiert
- ✅ Portainer läuft
- ✅ Port 3000 ist frei
- ✅ Alle Projektdateien vorhanden
- ✅ Image erfolgreich gebaut
- ✅ Container läuft (grüner Status)
- ✅ App ist erreichbar

---

## 🆘 Support

**Logs anschauen:**
```powershell
docker logs krokier-app
```

**Container neu starten:**
```powershell
docker restart krokier-app
```

**Container komplett neu bauen:**
```powershell
docker-compose down
docker-compose up -d --build
```

---

**Viel Erfolg! Bei Fragen einfach melden! 🚀**
