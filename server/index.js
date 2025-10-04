import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.static(path.join(__dirname, '../public')))

// Multer Setup für Datei-Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Nur Bilddateien sind erlaubt'))
    }
  }
})

// Datenbank-Ersatz (in Produktion: echte Datenbank verwenden)
const dataFile = path.join(__dirname, 'data.json')

const loadData = () => {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
    }
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error)
  }
  return {
    maps: [],
    settings: {
      logo: null,
      adminPassword: 'admin123'
    }
  }
}

const saveData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error)
  }
}

// Routes

// Karten speichern
app.post('/api/maps/save', (req, res) => {
  try {
    const data = loadData()
    const mapData = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    }
    data.maps.push(mapData)
    saveData(data)
    res.json({ success: true, id: mapData.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Karten laden
app.get('/api/maps', (req, res) => {
  try {
    const data = loadData()
    res.json(data.maps)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Spezifische Karte laden
app.get('/api/maps/:id', (req, res) => {
  try {
    const data = loadData()
    const map = data.maps.find(m => m.id === parseInt(req.params.id))
    if (map) {
      res.json(map)
    } else {
      res.status(404).json({ error: 'Karte nicht gefunden' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Karte löschen
app.delete('/api/maps/:id', (req, res) => {
  try {
    const data = loadData()
    data.maps = data.maps.filter(m => m.id !== parseInt(req.params.id))
    saveData(data)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Logo hochladen
app.post('/api/settings/logo', upload.single('logo'), (req, res) => {
  try {
    const data = loadData()
    data.settings.logo = `/uploads/${req.file.filename}`
    saveData(data)
    res.json({ success: true, logo: data.settings.logo })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Einstellungen abrufen
app.get('/api/settings', (req, res) => {
  try {
    const data = loadData()
    res.json(data.settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Einstellungen aktualisieren
app.put('/api/settings', (req, res) => {
  try {
    const data = loadData()
    data.settings = { ...data.settings, ...req.body }
    saveData(data)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Bild hochladen
app.post('/api/upload/image', upload.single('image'), (req, res) => {
  try {
    res.json({ 
      success: true, 
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Uploads-Ordner bereitstellen
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Backend-Server läuft auf http://localhost:${PORT}`)
  console.log(`📁 Daten werden gespeichert in: ${dataFile}`)
})
