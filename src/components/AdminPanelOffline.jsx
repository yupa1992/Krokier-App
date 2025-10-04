import { useState, useEffect } from 'react'
import { X, Save, Plus, Trash2, Edit2, Eye, EyeOff, Settings, Package, Grid, RefreshCw, Upload, Search, Key } from 'lucide-react'

const AdminPanelOffline = ({ onClose, logo, onLogoChange }) => {
  // Auth State (Lokal)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Tab State
  const [activeTab, setActiveTab] = useState('symbols')

  // Symbol State
  const [symbols, setSymbols] = useState([])
  const [filteredSymbols, setFilteredSymbols] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSymbol, setEditingSymbol] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Settings State
  const [settings, setSettings] = useState({
    appName: 'Krokier App',
    defaultZoom: 13,
    adminPassword: 'admin123'
  })

  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Categories
  const categories = [
    'Rettungen', 'Feuer/Brandherd', 'Unfall', 'Gefährliche Stoffe',
    'Wasser', 'Rauch', 'Entwicklung', 'Gebäude', 'Brandschutz',
    'Infrastruktur', 'Wasserversorgung', 'Einsatzleitung', 'Fahrzeuge',
    'Organisationen', 'Gefahren', 'Schäden', 'Sonstiges'
  ]

  // Load data on mount
  useEffect(() => {
    loadSymbols()
    loadSettings()
  }, [])

  // Filter symbols
  useEffect(() => {
    let filtered = symbols

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }

    setFilteredSymbols(filtered)
  }, [symbols, searchTerm, selectedCategory])

  const loadSymbols = () => {
    const SYMBOLS_VERSION = '2.0'
    const savedVersion = localStorage.getItem('symbolsVersion')
    const savedSymbols = localStorage.getItem('symbols')
    
    if (savedSymbols && savedVersion === SYMBOLS_VERSION) {
      setSymbols(JSON.parse(savedSymbols))
    } else {
      // Standard-Symbole laden
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
      setSymbols(defaultSymbols)
      saveSymbols(defaultSymbols)
    }
  }

  const loadSettings = () => {
    const saved = localStorage.getItem('adminSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }

  const saveSymbols = (symbolsToSave) => {
    localStorage.setItem('symbols', JSON.stringify(symbolsToSave))
    localStorage.setItem('symbolsVersion', '2.0')
    
    // Event auslösen für Sidebar-Update
    window.dispatchEvent(new Event('symbolsUpdated'))
  }

  const saveSettings = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    
    if (password === settings.adminPassword) {
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Falsches Passwort')
    }
  }

  const handleUpdateSymbol = (id, updates) => {
    const updated = symbols.map(s => s.id === id ? { ...s, ...updates } : s)
    setSymbols(updated)
    saveSymbols(updated)
    setEditingSymbol(null)
    alert('✅ Symbol aktualisiert!')
  }

  const handleDeleteSymbol = (id) => {
    if (!confirm('⚠️ Symbol wirklich löschen?')) return

    const updated = symbols.filter(s => s.id !== id)
    setSymbols(updated)
    saveSymbols(updated)
    alert('✅ Symbol gelöscht!')
  }

  const handleToggleVisibility = (symbol) => {
    handleUpdateSymbol(symbol.id, { visible: !symbol.visible })
  }

  const handleSaveSettings = () => {
    saveSettings()
    alert('✅ Einstellungen gespeichert!')
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('❌ Passwörter stimmen nicht überein')
      return
    }
    
    if (newPassword.length < 6) {
      alert('❌ Passwort muss mindestens 6 Zeichen lang sein')
      return
    }

    setSettings({ ...settings, adminPassword: newPassword })
    saveSettings()
    setShowPasswordChange(false)
    setNewPassword('')
    setConfirmPassword('')
    alert('✅ Passwort geändert!')
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      onLogoChange(event.target.result)
      alert('✅ Logo hochgeladen!')
    }
    reader.readAsDataURL(file)
  }

  const handleBulkCategoryUpdate = (category) => {
    const symbolsToUpdate = symbols.map(s => 
      filteredSymbols.find(fs => fs.id === s.id) 
        ? { ...s, category }
        : s
    )

    if (!confirm(`⚠️ ${filteredSymbols.length} Symbole zu "${category}" verschieben?`)) return

    setSymbols(symbolsToUpdate)
    saveSymbols(symbolsToUpdate)
    alert('✅ Symbole aktualisiert!')
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Offline-Modus</strong><br/>
              Alle Änderungen werden lokal gespeichert.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main Admin Panel
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin-Panel</h2>
              <p className="text-sm text-gray-500">Offline-Modus • Lokale Speicherung</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          <button
            onClick={() => setActiveTab('symbols')}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'symbols'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Symbole</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{symbols.length}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Kategorien</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Einstellungen</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Symbols Tab */}
          {activeTab === 'symbols' && (
            <div className="h-full flex flex-col">
              {/* Toolbar */}
              <div className="p-4 border-b bg-gray-50 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Symbole suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Alle Kategorien</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => loadSymbols()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Aktualisieren</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{filteredSymbols.length} von {symbols.length} Symbolen</span>
                  {selectedCategory !== 'all' && filteredSymbols.length > 0 && (
                    <select
                      onChange={(e) => e.target.value && handleBulkCategoryUpdate(e.target.value)}
                      className="text-xs px-2 py-1 border rounded"
                      defaultValue=""
                    >
                      <option value="">Kategorie ändern...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Symbol List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSymbols.map(symbol => (
                    <div
                      key={symbol.id}
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={symbol.icon}
                          alt={symbol.name}
                          className="w-16 h-16 object-contain border rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{symbol.name}</h3>
                          <p className="text-xs text-gray-500">{symbol.category || 'Sonstiges'}</p>
                          <p className="text-xs text-gray-400">ID: {symbol.id}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={() => setEditingSymbol(symbol)}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Bearbeiten</span>
                        </button>

                        <button
                          onClick={() => handleToggleVisibility(symbol)}
                          className={`px-3 py-1.5 rounded text-sm ${
                            symbol.visible
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-50 text-gray-400'
                          }`}
                        >
                          {symbol.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleDeleteSymbol(symbol.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredSymbols.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Keine Symbole gefunden</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="p-6 overflow-y-auto h-full">
              <h3 className="text-lg font-semibold mb-4">Kategorien verwalten</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(category => {
                  const count = symbols.filter(s => s.category === category).length
                  return (
                    <div key={category} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="font-semibold">{category}</div>
                      <div className="text-sm text-gray-500">{count} Symbole</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">App-Einstellungen</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">App-Name</label>
                      <input
                        type="text"
                        value={settings.appName || ''}
                        onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Logo</label>
                      <div className="flex items-center space-x-4">
                        {logo && (
                          <img src={logo} alt="Logo" className="h-16 w-auto border rounded" />
                        )}
                        <label className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
                          <Upload className="w-4 h-4" />
                          <span>Logo hochladen</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Standard-Zoom</label>
                      <input
                        type="number"
                        value={settings.defaultZoom || 13}
                        onChange={(e) => setSettings({ ...settings, defaultZoom: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border rounded-lg"
                        min="1"
                        max="18"
                      />
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4" />
                      <span>Einstellungen speichern</span>
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>Passwort ändern</span>
                  </h3>
                  
                  {!showPasswordChange ? (
                    <button
                      onClick={() => setShowPasswordChange(true)}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Passwort ändern
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Neues Passwort</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Mindestens 6 Zeichen"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Passwort bestätigen</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Passwort wiederholen"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={handlePasswordChange}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Passwort speichern
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordChange(false)
                            setNewPassword('')
                            setConfirmPassword('')
                          }}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSymbol && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[3000] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Symbol bearbeiten</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editingSymbol.name}
                  onChange={(e) => setEditingSymbol({ ...editingSymbol, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kategorie</label>
                <select
                  value={editingSymbol.category || 'Sonstiges'}
                  onChange={(e) => setEditingSymbol({ ...editingSymbol, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingSymbol.visible !== false}
                  onChange={(e) => setEditingSymbol({ ...editingSymbol, visible: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm">Sichtbar</label>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateSymbol(editingSymbol.id, editingSymbol)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Speichern
                </button>
                <button
                  onClick={() => setEditingSymbol(null)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanelOffline
