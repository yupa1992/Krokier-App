import pkg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pkg
dotenv.config()

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon benötigt SSL
  }
})

// Test Connection
pool.on('connect', () => {
  console.log('✅ PostgreSQL verbunden')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Fehler:', err)
})

// Database Setup - Tabellen erstellen
export const setupDatabase = async () => {
  const client = await pool.connect()
  
  try {
    console.log('🔧 Erstelle Datenbank-Tabellen...')
    
    // Admin Users Tabelle
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Symbols Tabelle
    await client.query(`
      CREATE TABLE IF NOT EXISTS symbols (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(500) NOT NULL,
        category VARCHAR(100) DEFAULT 'Sonstiges',
        visible BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Settings Tabelle
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Maps Tabelle
    await client.query(`
      CREATE TABLE IF NOT EXISTS maps (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Prüfen ob Admin existiert
    const adminCheck = await client.query('SELECT * FROM admin_users WHERE username = $1', ['admin'])
    
    if (adminCheck.rows.length === 0) {
      // Standard-Admin erstellen (Passwort wird beim ersten Start gehasht)
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.default.hash('admin123', 10)
      
      await client.query(
        'INSERT INTO admin_users (username, password, email) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, 'admin@krokier.local']
      )
      console.log('✅ Standard-Admin erstellt (admin/admin123)')
    }
    
    // Prüfen ob Symbole existieren
    const symbolsCheck = await client.query('SELECT COUNT(*) FROM symbols')
    const symbolCount = parseInt(symbolsCheck.rows[0].count)
    
    if (symbolCount === 0) {
      console.log('📦 Erstelle Standard-Symbole...')
      // Standard-Symbole erstellen
      for (let i = 1; i <= 147; i++) {
        await client.query(
          'INSERT INTO symbols (id, name, icon, category, visible, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
          [i, `Element ${i}`, `/assets/icons/Element ${i}@2x.png`, 'Sonstiges', true, i]
        )
      }
      console.log('✅ 147 Standard-Symbole erstellt')
    }
    
    // Standard-Einstellungen
    const settingsCheck = await client.query('SELECT * FROM settings WHERE key = $1', ['appName'])
    if (settingsCheck.rows.length === 0) {
      await client.query('INSERT INTO settings (key, value) VALUES ($1, $2)', ['appName', 'Krokier App'])
      await client.query('INSERT INTO settings (key, value) VALUES ($1, $2)', ['defaultZoom', '13'])
      await client.query('INSERT INTO settings (key, value) VALUES ($1, $2)', ['defaultCenter', '51.1657,10.4515'])
      console.log('✅ Standard-Einstellungen erstellt')
    }
    
    console.log('✅ Datenbank-Setup abgeschlossen!')
    
  } catch (error) {
    console.error('❌ Fehler beim Datenbank-Setup:', error)
    throw error
  } finally {
    client.release()
  }
}

export default pool
