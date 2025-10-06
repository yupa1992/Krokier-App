import { useState, useEffect } from 'react'
import { X, Save, Settings as SettingsIcon, Upload } from 'lucide-react'

const AdminPanelPro = ({ onClose, logo, onLogoChange }) => {
  // Settings State (localStorage)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings')
    return saved ? JSON.parse(saved) : {
      appName: 'Krokier App',
      defaultZoom: 13,
      maxZoom: 19,
      minZoom: 1,
      enableGeolocation: true,
      showCoordinates: false,
      measurementUnit: 'metric'
    }
  })

  // Speichere Settings in localStorage
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
  }, [settings])

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
    alert('✅ Einstellungen gespeichert!')
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      onLogoChange(reader.result)
      localStorage.setItem('appLogo', reader.result)
      alert('✅ Logo hochgeladen!')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Einstellungen</h2>
              <p className="text-sm text-gray-500">Allgemeine App-Einstellungen</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">App-Name</label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Standard-Zoom</label>
              <input
                type="number"
                value={settings.defaultZoom}
                onChange={(e) => setSettings({ ...settings, defaultZoom: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
                max="19"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max-Zoom</label>
              <input
                type="number"
                value={settings.maxZoom}
                onChange={(e) => setSettings({ ...settings, maxZoom: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
                max="19"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Min-Zoom</label>
              <input
                type="number"
                value={settings.minZoom}
                onChange={(e) => setSettings({ ...settings, minZoom: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
                max="19"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableGeolocation}
                onChange={(e) => setSettings({ ...settings, enableGeolocation: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Geolocation aktivieren</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showCoordinates}
                onChange={(e) => setSettings({ ...settings, showCoordinates: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Koordinaten anzeigen</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Maßeinheit</label>
            <select
              value={settings.measurementUnit}
              onChange={(e) => setSettings({ ...settings, measurementUnit: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="metric">Metrisch (m, km)</option>
              <option value="imperial">Imperial (ft, mi)</option>
            </select>
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            <span>Einstellungen speichern</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPanelPro
