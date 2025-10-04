# 🚀 Einfache Installation für Portainer

## Option 1: Direkt auf dem Server bauen (EINFACHSTE METHODE)

### Schritt 1: Projekt auf den Server kopieren
Kopieren Sie den kompletten Ordner `02_krokier_app_native` auf Ihren Server:
- Per USB-Stick
- Per Netzwerkfreigabe
- Per FTP/SCP

### Schritt 2: In Portainer Stack erstellen
1. Öffnen Sie Portainer: `http://[SERVER-IP]:9000`
2. Gehen Sie zu **Stacks** → **Add stack**
3. Name: `krokier-app`
4. **Build method:** Wählen Sie **Upload**

### Schritt 3: Dateien hochladen
Laden Sie diese Dateien/Ordner hoch:
```
📁 Projekt-Root
├── 📄 Dockerfile
├── 📄 docker-compose.yml
├── 📄 nginx.conf
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 vite.config.js
├── 📄 index.html
├── 📄 tailwind.config.js
├── 📄 postcss.config.js
├── 📁 src/ (kompletter Ordner)
└── 📁 public/ (kompletter Ordner)
```

### Schritt 4: Deploy
- Klicken Sie auf **Deploy the stack**
- Warten Sie 2-5 Minuten (Build läuft)
- Fertig!

### Schritt 5: Zugriff
Öffnen Sie: `http://[SERVER-IP]:3000`

---

## Option 2: Docker Desktop installieren (für .tar Export)

### Schritt 1: Docker Desktop installieren
1. Download: https://www.docker.com/products/docker-desktop
2. Installieren und starten
3. Warten bis Docker läuft (Wal-Icon in Taskleiste)

### Schritt 2: Image bauen
Öffnen Sie PowerShell im Projektordner:
```powershell
cd c:\Users\panda\Documents\02_krokier_app_native
docker build -t krokier-app:latest .
```

### Schritt 3: Image exportieren
```powershell
docker save krokier-app:latest -o krokier-app.tar
```

### Schritt 4: .tar Datei auf Server kopieren
Die Datei `krokier-app.tar` ist jetzt im Projektordner.
Kopieren Sie sie auf Ihren Server.

### Schritt 5: In Portainer importieren
1. Portainer → **Images** → **Import**
2. Laden Sie `krokier-app.tar` hoch
3. Warten Sie bis Import fertig ist

### Schritt 6: Container erstellen
1. **Containers** → **Add container**
2. Name: `krokier-app`
3. Image: `krokier-app:latest`
4. Port mapping: `3000:80`
5. **Deploy the container**

---

## Option 3: Direkt auf dem Server (ohne Portainer UI)

### Wenn Sie SSH-Zugriff auf den Server haben:

```bash
# 1. Projekt auf Server kopieren
scp -r c:\Users\panda\Documents\02_krokier_app_native user@server:/home/user/

# 2. Auf Server einloggen
ssh user@server

# 3. Zum Projektordner
cd /home/user/02_krokier_app_native

# 4. Container starten
docker-compose up -d

# 5. Status prüfen
docker ps
```

---

## ⚡ SCHNELLSTE Methode (EMPFOHLEN)

### Verwenden Sie Portainer's Git Integration:

1. Laden Sie Ihr Projekt auf GitHub/GitLab hoch
2. In Portainer → **Stacks** → **Add stack**
3. Wählen Sie **Git Repository**
4. Repository URL eingeben
5. **Deploy the stack**

**Fertig!** Portainer baut das Image automatisch.

---

## 🔍 Welche Methode ist für Sie am besten?

| Methode | Vorteile | Nachteile |
|---------|----------|-----------|
| **Option 1: Upload in Portainer** | ✅ Kein Docker auf PC nötig<br>✅ Sehr einfach | ⚠️ Alle Dateien hochladen |
| **Option 2: .tar Export** | ✅ Nur eine Datei<br>✅ Schneller Upload | ⚠️ Docker Desktop nötig |
| **Option 3: SSH** | ✅ Sehr schnell<br>✅ Professionell | ⚠️ SSH-Kenntnisse nötig |
| **Git Integration** | ✅ Am einfachsten<br>✅ Automatische Updates | ⚠️ Git-Repository nötig |

---

## 📦 Dateien die Sie brauchen

### Minimal (müssen hochgeladen werden):
```
✅ Dockerfile
✅ docker-compose.yml
✅ nginx.conf
✅ package.json
✅ package-lock.json
✅ vite.config.js
✅ index.html
✅ tailwind.config.js
✅ postcss.config.js
✅ src/ (ganzer Ordner)
✅ public/ (ganzer Ordner)
```

### NICHT hochladen:
```
❌ node_modules/
❌ dist/
❌ .git/
❌ .vscode/
❌ *.md (Readme-Dateien)
```

---

## 🆘 Hilfe

### "Ich habe keinen Server"
- Installieren Sie Docker Desktop auf Ihrem PC
- Starten Sie mit: `docker-compose up`
- Öffnen Sie: `http://localhost:3000`

### "Upload dauert zu lange"
- Komprimieren Sie den `src/` Ordner als ZIP
- Oder verwenden Sie Git-Integration

### "Build schlägt fehl"
- Prüfen Sie ob alle Dateien hochgeladen wurden
- Schauen Sie in Portainer → Logs

---

## ✅ Checkliste

- [ ] Projekt-Ordner bereit
- [ ] Portainer läuft auf Server
- [ ] Methode gewählt (Upload/Git/SSH)
- [ ] Dateien hochgeladen/kopiert
- [ ] Stack deployed
- [ ] App läuft auf Port 3000
- [ ] Im Browser getestet

---

**Empfehlung:** Verwenden Sie **Option 1 (Upload in Portainer)** - am einfachsten ohne Docker auf Ihrem PC! 🚀
