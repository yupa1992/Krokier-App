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
import dotenv from 'dotenv'
import pool, { setupDatabase } from './db.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'krokier-secret-key-change-in-production'

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}))
app.use(express.static(path.join(__dirname, '../public')))

// Multer Setup
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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Nur Bilddateien sind erlaubt'))
    }
  }
})

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

// ============ ADMIN AUTH ROUTES ============

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username])
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }
    
    const user = result.rows[0]
    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }
    
    const token = jwt.sign(
      { username: user.username, id: user.id, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.json({ 
      success: true, 
      token,
      user: { username: user.username, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ success: true })
})

app.get('/api/admin/status', authenticateToken, (req, res) => {
  res.json({ authenticated: true, user: req.user })
})

app.put('/api/admin/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    const result = await pool.query('SELECT * FROM admin_users WHERE id = $1', [req.user.id])
    const user = result.rows[0]
    
    const validPassword = await bcrypt.compare(currentPassword, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Aktuelles Passwort ist falsch' })
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE admin_users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id])
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ SYMBOL MANAGEMENT ROUTES ============

app.get('/api/symbols', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM symbols ORDER BY sort_order, id')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/symbols/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, visible, icon } = req.body
    
    const result = await pool.query(
      'UPDATE symbols SET name = $1, category = $2, visible = $3, icon = COALESCE($4, icon), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, category, visible, icon, id]
    )
    
    res.json({ success: true, symbol: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/symbols/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM symbols WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/symbols', authenticateToken, upload.single('icon'), async (req, res) => {
  try {
    const { name, category } = req.body
    const icon = req.file ? `/uploads/${req.file.filename}` : req.body.icon
    
    const result = await pool.query(
      'INSERT INTO symbols (name, icon, category, visible) VALUES ($1, $2, $3, $4) RETURNING *',
      [name || 'Neues Symbol', icon, category || 'Sonstiges', true]
    )
    
    res.json({ success: true, symbol: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/symbols', authenticateToken, async (req, res) => {
  try {
    const { symbols } = req.body
    
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      
      for (const symbol of symbols) {
        await client.query(
          'UPDATE symbols SET name = $1, category = $2, visible = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
          [symbol.name, symbol.category, symbol.visible, symbol.id]
        )
      }
      
      await client.query('COMMIT')
      res.json({ success: true })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ SETTINGS ROUTES ============

app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM settings')
    const settings = {}
    result.rows.forEach(row => {
      settings[row.key] = row.value
    })
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settings = req.body
    
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
        [key, String(value)]
      )
    }
    
    res.json({ success: true, settings })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/settings/logo', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    const logoPath = `/uploads/${req.file.filename}`
    
    await pool.query(
      'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
      ['logo', logoPath]
    )
    
    res.json({ success: true, logo: logoPath })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ MAP ROUTES ============

app.post('/api/maps/save', async (req, res) => {
  try {
    const { title, ...data } = req.body
    
    const result = await pool.query(
      'INSERT INTO maps (title, data) VALUES ($1, $2) RETURNING *',
      [title || 'Unbenannte Karte', data]
    )
    
    res.json({ success: true, id: result.rows[0].id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/maps', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, created_at FROM maps ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/maps/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM maps WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Karte nicht gefunden' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/maps/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM maps WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Uploads-Ordner bereitstellen
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'postgresql' })
})

// Server starten
const startServer = async () => {
  try {
    // Datenbank initialisieren
    await setupDatabase()
    
    // Server starten
    app.listen(PORT, () => {
      console.log(`\n✅ Backend-Server läuft auf http://localhost:${PORT}`)
      console.log(`💾 Datenbank: Neon PostgreSQL`)
      console.log(`🔐 Admin-Login: admin / admin123\n`)
    })
  } catch (error) {
    console.error('❌ Fehler beim Server-Start:', error)
    process.exit(1)
  }
}

startServer()
