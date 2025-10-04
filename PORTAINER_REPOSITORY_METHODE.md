# 🚀 Portainer Repository-Methode (BESTE LÖSUNG)

## ✨ Warum Repository statt Upload?

Bei **Upload** können Sie nur docker-compose.yml hochladen.
Bei **Repository** baut Portainer automatisch das komplette Image!

---

## 📋 Schritt-für-Schritt Anleitung

### Option A: GitHub/GitLab (EMPFOHLEN)

#### Schritt 1: Repository erstellen
1. Gehen Sie zu https://github.com (oder GitLab)
2. Erstellen Sie ein neues Repository: `krokier-app`
3. **Wichtig:** Machen Sie es **Private** wenn sensible Daten enthalten sind

#### Schritt 2: Code hochladen
```powershell
cd c:\Users\panda\Documents\02_krokier_app_native

# Git initialisieren (falls noch nicht geschehen)
git init
git add .
git commit -m "Initial commit - Krokier App"

# Mit GitHub verbinden
git remote add origin https://github.com/IHR-USERNAME/krokier-app.git
git branch -M main
git push -u origin main
```

#### Schritt 3: In Portainer deployen
1. Portainer → **Stacks** → **Add stack**
2. Name: `krokier-app`
3. Build method: **Repository** ✅
4. Repository URL: `https://github.com/IHR-USERNAME/krokier-app`
5. Repository reference: `refs/heads/main`
6. Compose path: `docker-compose.yml`
7. **Deploy the stack**

**Fertig!** Portainer baut automatisch das Image und startet die App!

---

### Option B: Lokales Git Repository

#### Schritt 1: Projekt auf Server kopieren
Kopieren Sie den kompletten Projektordner auf Ihren Server:
```
/home/user/krokier-app/
```

#### Schritt 2: In Portainer
1. **Stacks** → **Add stack**
2. Name: `krokier-app`
3. Build method: **Repository**
4. Repository URL: `file:///home/user/krokier-app`
5. **Deploy the stack**

---

### Option C: Web Editor (Wenn Repository nicht möglich)

#### Schritt 1: docker-compose.yml mit Build
Verwenden Sie den **Web editor** in Portainer und fügen Sie ein:

```yaml
version: '3.8'

services:
  krokier-app:
    build:
      context: https://github.com/IHR-USERNAME/krokier-app.git
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    restart: unless-stopped
    container_name: krokier-app
```

---

## 🎯 Einfachste Methode OHNE Git

### Wenn Sie KEIN Git verwenden möchten:

#### Schritt 1: Alle Dateien auf Server kopieren
Kopieren Sie den kompletten Projektordner auf Ihren Server:
```
/opt/krokier-app/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── package-lock.json
├── vite.config.js
├── index.html
├── src/ (kompletter Ordner)
└── public/ (kompletter Ordner)
```

#### Schritt 2: SSH auf Server
```bash
ssh user@server
cd /opt/krokier-app
docker-compose up -d --build
```

**Fertig!** Container läuft auf Port 3000.

---

## 🔄 Welche Dateien braucht Portainer?

### Für Repository-Build:
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

### NICHT nötig:
```
❌ node_modules/
❌ dist/
❌ .git/
❌ *.md (Readme-Dateien)
```

---

## 📊 Vergleich der Methoden

| Methode | Einfachheit | Automatisch | Updates |
|---------|-------------|-------------|---------|
| **Repository (GitHub)** | ⭐⭐⭐⭐⭐ | ✅ Ja | ✅ Git pull |
| **Upload** | ⭐⭐ | ❌ Nein | ❌ Manuell |
| **SSH + docker-compose** | ⭐⭐⭐ | ✅ Ja | ✅ Git pull |

---

## 🆘 Probleme?

### "Repository not found"
- Prüfen Sie ob Repository public ist
- Oder fügen Sie Git-Credentials hinzu in Portainer

### "Build failed"
- Schauen Sie in Portainer Logs
- Prüfen Sie ob alle Dateien im Repository sind

### "Keine Git-Kenntnisse"
- Verwenden Sie GitHub Desktop (GUI)
- Oder kopieren Sie Dateien direkt auf Server

---

## ✅ Empfehlung

**Beste Methode:**
1. ✅ Projekt auf GitHub hochladen (kostenlos, private Repos möglich)
2. ✅ In Portainer: Repository-Methode verwenden
3. ✅ Automatischer Build + Deploy
4. ✅ Updates mit einem Git-Push

**Alternativ:**
- Projekt auf Server kopieren
- SSH: `docker-compose up -d --build`
- Kein Portainer UI nötig

---

**Wählen Sie die Methode die für Sie am besten passt! 🚀**
