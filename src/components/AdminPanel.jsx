import { useState, useEffect, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Trash2, Edit, Mail, Users, Database, Key, Save, Plus } from 'lucide-react'

const AdminPanel = ({ onClose, logo, onLogoChange }) => {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('logo')
  // Symbol-Verwaltung
  const [symbols, setSymbols] = useState([])
  const [editingSymbol, setEditingSymbol] = useState(null)
  const [newSymbolName, setNewSymbolName] = useState('')
  const [newSymbolFile, setNewSymbolFile] = useState(null)
  const fileInputRef = useRef(null)

  // Email-Einstellungen
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    username: '',
    password: '',
    fromEmail: ''
  })
  
  // Passwort ändern
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('adminPassword') || 'admin123'
  })

  // Symbole aus assets/icons laden
  useEffect(() => {
    // Versuche gespeicherte Symbole zu laden
    const savedSymbols = localStorage.getItem('symbols')
    if (savedSymbols) {
      setSymbols(JSON.parse(savedSymbols))
    } else {
      const loadedSymbols = []
      for (let i = 1; i <= 147; i++) {
        loadedSymbols.push({
          id: i,
          name: `Element ${i}`,
          icon: `/assets/icons/Element ${i}@2x.png`
        })
      }
      setSymbols(loadedSymbols)
      localStorage.setItem('symbols', JSON.stringify(loadedSymbols))
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Falsches Passwort')
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Bitte nur Bilddateien hochladen')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      onLogoChange(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    onLogoChange(null)
  }

  const handlePasswordChange = () => {
    if (currentPassword !== adminPassword) {
      alert('Aktuelles Passwort ist falsch')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('Passwörter stimmen nicht überein')
      return
    }
    if (newPassword.length < 6) {
      alert('Passwort muss mindestens 6 Zeichen lang sein')
      return
    }
    setAdminPassword(newPassword)
    localStorage.setItem('adminPassword', newPassword)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    alert('Passwort erfolgreich geändert!')
  }

  const handleSymbolEdit = (symbol) => {
    setEditingSymbol(symbol)
    setNewSymbolName(symbol.name)
  }

  const handleSymbolSave = () => {
    const updatedSymbols = symbols.map(s => 
      s.id === editingSymbol.id ? { ...s, name: newSymbolName } : s
    )
    setSymbols(updatedSymbols)
    localStorage.setItem('symbols', JSON.stringify(updatedSymbols))
    window.dispatchEvent(new Event('symbolsUpdated'))
    setEditingSymbol(null)
    setNewSymbolName('')
    alert('Symbol erfolgreich umbenannt!')
  }

  const handleSymbolDelete = (id) => {
    if (window.confirm('Symbol wirklich löschen?')) {
      const updatedSymbols = symbols.filter(s => s.id !== id)
      setSymbols(updatedSymbols)
      localStorage.setItem('symbols', JSON.stringify(updatedSymbols))
      window.dispatchEvent(new Event('symbolsUpdated'))
    }
  }

  const handleSymbolUpload = () => {
    if (!newSymbolName || !newSymbolFile) {
      alert('Bitte Name und Datei angeben')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const newSymbol = {
        id: Date.now(),
        name: newSymbolName,
        icon: event.target.result
      }
      const updatedSymbols = [...symbols, newSymbol]
      setSymbols(updatedSymbols)
      localStorage.setItem('symbols', JSON.stringify(updatedSymbols))
      window.dispatchEvent(new Event('symbolsUpdated'))
      setNewSymbolName('')
      setNewSymbolFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      alert('Symbol erfolgreich hochgeladen!')
    }
    reader.readAsDataURL(newSymbolFile)
  }

  const handleEmailSettingsSave = () => {
    // In Produktion: An Backend senden
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings))
    alert('Email-Einstellungen gespeichert!')
  }

  const handleBackup = () => {
    const backup = {
      symbols,
      emailSettings,
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRestore = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result)
        setSymbols(backup.symbols || [])
        setEmailSettings(backup.emailSettings || emailSettings)
        alert('Backup erfolgreich wiederhergestellt!')
      } catch (error) {
        alert('Fehler beim Wiederherstellen: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800">Admin-Bereich</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Passwort eingeben..."
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-700 to-slate-600 text-white">
          <h2 className="text-2xl font-bold">Admin-Bereich</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'logo'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Logo</span>
          </button>
          <button
            onClick={() => setActiveTab('symbols')}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'symbols'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Edit className="w-5 h-5" />
            <span>Symbole</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'email'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>Email</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'password'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Key className="w-5 h-5" />
            <span>Passwort</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'backup'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Backup</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Logo Tab */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Logo-Verwaltung</h3>
              
              {logo ? (
                <div className="space-y-4">
                  <div className="bg-slate-100 p-6 rounded-lg border-2 border-slate-300">
                    <img
                      src={logo}
                      alt="Logo"
                      className="max-h-48 mx-auto object-contain"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <label className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer font-semibold">
                      <Upload className="w-5 h-5" />
                      <span>Logo ändern</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={handleRemoveLogo}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Entfernen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center space-y-3 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-12 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                  <Upload className="w-16 h-16 text-slate-400" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      Logo hochladen
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG oder SVG (max. 2MB) - Empfohlen: 200x60px
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Symbole Tab */}
          {activeTab === 'symbols' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Symbol-Verwaltung ({symbols.length} Symbole)</h3>
              </div>

              {/* Neues Symbol hochladen */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Neues Symbol hinzufügen</h4>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newSymbolName}
                    onChange={(e) => setNewSymbolName(e.target.value)}
                    placeholder="Symbol-Name..."
                    className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Datei</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewSymbolFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleSymbolUpload}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Hinzufügen</span>
                  </button>
                </div>
                {newSymbolFile && (
                  <p className="text-sm text-blue-700 mt-2">Datei: {newSymbolFile.name}</p>
                )}
              </div>

              {/* Symbol-Liste */}
              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {symbols.map((symbol) => (
                  <div key={symbol.id} className="bg-white border-2 border-slate-200 rounded-lg p-3 hover:border-blue-400 transition-colors">
                    <img src={symbol.icon} alt={symbol.name} className="w-16 h-16 object-contain mx-auto mb-2" />
                    {editingSymbol?.id === symbol.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newSymbolName}
                          onChange={(e) => setNewSymbolName(e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                        />
                        <button
                          onClick={handleSymbolSave}
                          className="w-full bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Speichern
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-center font-medium text-slate-700 mb-2">{symbol.name}</p>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleSymbolEdit(symbol)}
                            className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            <Edit className="w-3 h-3 mx-auto" />
                          </button>
                          <button
                            onClick={() => handleSymbolDelete(symbol.id)}
                            className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3 mx-auto" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Email-Einstellungen</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SMTP Server</label>
                  <input
                    type="text"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SMTP Port</label>
                  <input
                    type="text"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="587"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Benutzername</label>
                  <input
                    type="text"
                    value={emailSettings.username}
                    onChange={(e) => setEmailSettings({...emailSettings, username: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ihr.email@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Passwort</label>
                  <input
                    type="password"
                    value={emailSettings.password}
                    onChange={(e) => setEmailSettings({...emailSettings, password: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Absender-Email</label>
                  <input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="absender@domain.com"
                  />
                </div>

                <button
                  onClick={handleEmailSettingsSave}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>Einstellungen speichern</span>
                </button>
              </div>
            </div>
          )}

          {/* Passwort Tab */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Passwort ändern</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Aktuelles Passwort</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Neues Passwort</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Passwort bestätigen</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  <Key className="w-5 h-5" />
                  <span>Passwort ändern</span>
                </button>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Backup & Wiederherstellung</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleBackup}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  <Database className="w-5 h-5" />
                  <span>Backup erstellen</span>
                </button>

                <label className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors shadow-lg cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>Backup wiederherstellen</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestore}
                    className="hidden"
                  />
                </label>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Hinweis:</strong> Das Backup enthält alle Symbole und Einstellungen. 
                    Beim Wiederherstellen werden die aktuellen Daten überschrieben.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
