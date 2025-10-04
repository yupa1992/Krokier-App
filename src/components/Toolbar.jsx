import { useState, useEffect } from 'react'
import { Clock, Maximize, Minimize, Save, Upload, Lock, Unlock, Settings, Download, Menu, X } from 'lucide-react'
import domtoimage from 'dom-to-image-more'
import jsPDF from 'jspdf'

const Toolbar = ({ onSave, onLoad, onToggleFullscreen, isFullscreen, mapRef, isMapLocked, onToggleLock, onShowAdmin, logo }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [einsatzort, setEinsatzort] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleExportPNG = async () => {
    setShowExportMenu(false)
    
    try {
      // Verwende leaflet-simple-map-screenshoter (professionelle Bibliothek)
      if (window.mapScreenshoter) {
        const format = 'png'
        const overridedPluginOptions = {
          mimeType: 'image/png',
          caption: (map) => {
            const now = new Date()
            const datum = formatDate(now)
            const zeit = formatTime(now)
            const ort = einsatzort || 'Einsatzort nicht angegeben'
            return `${ort} | ${datum} ${zeit}`
          },
          captionFontSize: 16,
          captionFont: 'Arial, sans-serif',
          captionColor: 'white',
          captionBgColor: 'rgba(0, 0, 0, 0.7)',
          captionOffset: 10
        }
        
        window.mapScreenshoter.takeScreen(format, overridedPluginOptions).then(blob => {
          const link = document.createElement('a')
          const date = new Date().toISOString().split('T')[0]
          const filename = einsatzort ? `${einsatzort.replace(/\s+/g, '_')}-${date}.png` : `karte-${date}.png`
          link.download = filename
          link.href = URL.createObjectURL(blob)
          link.click()
        }).catch(e => {
          console.error('Screenshot Fehler:', e)
          alert('Export fehlgeschlagen: ' + e.message)
        })
      } else {
        alert('Export-Funktion nicht verfügbar. Bitte warten Sie bis die Karte geladen ist.')
      }
    } catch (error) {
      console.error('PNG Export Fehler:', error)
      alert('PNG Export fehlgeschlagen: ' + error.message)
    }
  }

  const handleExportPDF = async () => {
    setShowExportMenu(false)
    
    try {
      // Für PDF verwenden wir auch leaflet-easyprint
      // Es kann direkt PNG exportieren, für PDF nutzen wir den PNG-Export
      alert('PDF Export: Bitte verwenden Sie PNG Export und konvertieren Sie es zu PDF, oder nutzen Sie die Browser-Druckfunktion.')
    } catch (error) {
      console.error('PDF-Export-Fehler:', error)
      alert('Fehler beim PDF-Export: ' + error.message)
    }
  }

  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg z-[1000] border-b-4 border-blue-500">
      {/* Desktop View */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3">
        {/* Logo und Titel */}
        <div className="flex items-center space-x-4">
          {logo && (
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Krokier App</h1>
            <p className="text-xs text-slate-300">Einsatzplanung & Kartierung</p>
          </div>
        </div>

        {/* Einsatzort & Uhrzeit */}
        <div className="flex items-center space-x-6">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={einsatzort}
              onChange={(e) => setEinsatzort(e.target.value)}
              placeholder="Einsatzort eingeben..."
              className="px-4 py-2 bg-slate-700 text-white border-2 border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 font-semibold"
            />
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-mono font-bold">{formatTime(currentTime)}</span>
            </div>
            <p className="text-sm text-slate-300">{formatDate(currentTime)}</p>
          </div>

          {/* Aktionen */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSave}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
              title="Speichern"
            >
              <Save className="w-5 h-5" />
              <span>Speichern</span>
            </button>

            <button
              onClick={onLoad}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
              title="Laden"
            >
              <Upload className="w-5 h-5" />
              <span>Laden</span>
            </button>

            {/* Export Button mit Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
                title="Export"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>

              {showExportMenu && (
                <div className="absolute top-full mt-2 right-0 bg-white text-slate-800 rounded-lg shadow-xl border-2 border-slate-200 min-w-[200px] z-[2000]">
                  <button
                    onClick={handleExportPNG}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-200"
                  >
                    <span className="text-2xl">📷</span>
                    <div>
                      <p className="font-semibold">PNG Bild</p>
                      <p className="text-xs text-slate-500">Hohe Qualität</p>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                  >
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-semibold">PDF Dokument</p>
                      <p className="text-xs text-slate-500">Druckfertig</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onToggleLock}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-semibold shadow-md ${
                isMapLocked
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
              title={isMapLocked ? 'Entsperren' : 'Sperren'}
            >
              {isMapLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              <span>{isMapLocked ? 'Gesperrt' : 'Entsperrt'}</span>
            </button>

            <button
              onClick={onShowAdmin}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
              title="Einstellungen"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleFullscreen}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
              title={isFullscreen ? 'Vollbild verlassen' : 'Vollbild'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            {logo && (
              <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
            )}
            <h1 className="text-lg font-bold">Krokier App</h1>
          </div>

          {/* Time */}
          <div className="text-sm font-mono">{formatTime(currentTime)}</div>

          {/* Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 bg-slate-700 rounded-lg"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-2">
            <input
              type="text"
              value={einsatzort}
              onChange={(e) => setEinsatzort(e.target.value)}
              placeholder="Einsatzort..."
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg text-sm"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { onSave(); setShowMobileMenu(false); }}
                className="flex items-center justify-center space-x-2 bg-green-600 px-3 py-2 rounded-lg text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Speichern</span>
              </button>

              <button
                onClick={() => { onLoad(); setShowMobileMenu(false); }}
                className="flex items-center justify-center space-x-2 bg-blue-600 px-3 py-2 rounded-lg text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Laden</span>
              </button>

              <button
                onClick={() => { setShowExportMenu(!showExportMenu); }}
                className="flex items-center justify-center space-x-2 bg-orange-600 px-3 py-2 rounded-lg text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={() => { onToggleLock(); setShowMobileMenu(false); }}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                  isMapLocked ? 'bg-red-600' : 'bg-yellow-600'
                }`}
              >
                {isMapLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{isMapLocked ? 'Gesperrt' : 'Entsperrt'}</span>
              </button>

              <button
                onClick={() => { onShowAdmin(); setShowMobileMenu(false); }}
                className="flex items-center justify-center space-x-2 bg-purple-600 px-3 py-2 rounded-lg text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => { onToggleFullscreen(); setShowMobileMenu(false); }}
                className="flex items-center justify-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg text-sm"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                <span>Vollbild</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Toolbar
