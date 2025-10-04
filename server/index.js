import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import session from 'express-session'
import cookieParser from 'cookie-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001
const JWT_SECRET = process.env.JWT_SECRET || 'krokier-secret-key-change-in-production'

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 24h
}))
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
const symbolsFile = path.join(__dirname, 'symbols.json')

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
    admin: {
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10), // Gehashtes Passwort
      email: 'admin@krokier.local'
    },
    settings: {
      logo: null,
      appName: 'Krokier App',
      defaultZoom: 13,
      defaultCenter: [51.1657, 10.4515]
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

const loadSymbols = () => {
  try {
    if (fs.existsSync(symbolsFile)) {
      return JSON.parse(fs.readFileSync(symbolsFile, 'utf8'))
    }
  } catch (error) {
    console.error('Fehler beim Laden der Symbole:', error)
  }
  // Standard-Symbole
  const defaultSymbols = []
  for (let i = 1; i <= 147; i++) {
    defaultSymbols.push({
      id: i,
      name: `Element ${i}`,
      icon: `/assets/icons/Element ${i}@2x.png`,
      category: 'Sonstiges',
      visible: true
    })
  }
  return defaultSymbols
}

const saveSymbols = (symbols) => {
  try {
    fs.writeFileSync(symbolsFile, JSON.stringify(symbols, null, 2))
  } catch (error) {
    console.error('Fehler beim Speichern der Symbole:', error)
  }
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Nicht autorisiert' })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Token ungültig' })
  }
}

// Routes

// ============ ADMIN AUTH ROUTES ============

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const data = loadData()
    
    if (username !== data.admin.username) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }
    
    const validPassword = await bcrypt.compare(password, data.admin.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }
    
    const token = jwt.sign(
      { username: data.admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.json({ 
      success: true, 
      token,
      user: { username: data.admin.username, email: data.admin.email }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ success: true })
})

// Admin Status prüfen
app.get('/api/admin/status', authenticateToken, (req, res) => {
  res.json({ authenticated: true, user: req.user })
})

// Admin Passwort ändern
app.put('/api/admin/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const data = loadData()
    
    const validPassword = await bcrypt.compare(currentPassword, data.admin.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Aktuelles Passwort ist falsch' })
    }
    
    data.admin.password = await bcrypt.hash(newPassword, 10)
    saveData(data)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ SYMBOL MANAGEMENT ROUTES ============

// Alle Symbole abrufen
app.get('/api/symbols', (req, res) => {
  try {
    const symbols = loadSymbols()
    res.json(symbols)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Symbol aktualisieren (Admin only)
app.put('/api/symbols/:id', authenticateToken, (req, res) => {
  try {
    const symbols = loadSymbols()
    const index = symbols.findIndex(s => s.id === parseInt(req.params.id))
    
    if (index === -1) {
      return res.status(404).json({ error: 'Symbol nicht gefunden' })
    }
    
    symbols[index] = { ...symbols[index], ...req.body }
    saveSymbols(symbols)
    
    res.json({ success: true, symbol: symbols[index] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Symbol löschen (Admin only)
app.delete('/api/symbols/:id', authenticateToken, (req, res) => {
  try {
    let symbols = loadSymbols()
    symbols = symbols.filter(s => s.id !== parseInt(req.params.id))
    saveSymbols(symbols)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Neues Symbol hinzufügen (Admin only)
app.post('/api/symbols', authenticateToken, upload.single('icon'), (req, res) => {
  try {
    const symbols = loadSymbols()
    const newSymbol = {
      id: Math.max(...symbols.map(s => s.id), 0) + 1,
      name: req.body.name || 'Neues Symbol',
      icon: req.file ? `/uploads/${req.file.filename}` : req.body.icon,
      category: req.body.category || 'Sonstiges',
      visible: true
    }
    
    symbols.push(newSymbol)
    saveSymbols(symbols)
    
    res.json({ success: true, symbol: newSymbol })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Bulk-Update für Symbole (Admin only)
app.put('/api/symbols', authenticateToken, (req, res) => {
  try {
    const { symbols } = req.body
    saveSymbols(symbols)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ SETTINGS ROUTES ============

// Globale Einstellungen abrufen
app.get('/api/settings', (req, res) => {
  try {
    const data = loadData()
    res.json(data.settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Globale Einstellungen aktualisieren (Admin only)
app.put('/api/settings', authenticateToken, (req, res) => {
  try {
    const data = loadData()
    data.settings = { ...data.settings, ...req.body }
    saveData(data)
    res.json({ success: true, settings: data.settings })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ MAP ROUTES ============

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

// Logo hochladen (Admin only)
app.post('/api/settings/logo', authenticateToken, upload.single('logo'), (req, res) => {
  try {
    const data = loadData()
    data.settings.logo = `/uploads/${req.file.filename}`
    saveData(data)
    res.json({ success: true, logo: data.settings.logo })
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
