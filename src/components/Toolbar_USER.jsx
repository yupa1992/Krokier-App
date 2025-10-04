import { useState, useEffect } from 'react'
import { Clock, Maximize, Minimize, Save, Upload, Lock, Unlock, Settings, Download } from 'lucide-react'
import domtoimage from 'dom-to-image-more'
import jsPDF from 'jspdf'

const Toolbar = ({ onSave, onLoad, onToggleFullscreen, isFullscreen, mapRef, isMapLocked, onToggleLock, onShowAdmin, logo }) => {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

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

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation wird von Ihrem Browser nicht unterstützt')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15)
        }
      },
      (error) => {
        alert('Fehler beim Abrufen der Position: ' + error.message)
      }
    )
  }

  const addWatermarkToCanvas = async (canvas) => {
    const ctx = canvas.getContext('2d')
    
    // Datum und Uhrzeit hinzufügen
    const dateStr = formatDate(currentTime)
    const timeStr = formatTime(currentTime)
    
    // Weißer Hintergrund für Text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(10, canvas.height - 80, 400, 70)
    
    // Datum und Uhrzeit
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 20px Arial'
    ctx.fillText(`${dateStr} - ${timeStr}`, 20, canvas.height - 50)
    
    // Logo hinzufügen wenn vorhanden
    if (logo) {
      try {
        const logoImg = new Image()
        logoImg.src = logo
        await new Promise((resolve) => {
          logoImg.onload = () => {
            ctx.drawImage(logoImg, 20, canvas.height - 40, 100, 30)
            resolve()
          }
        })
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Logos:', error)
      }
    }
    
    return canvas
  }

  const handleExportPNG = async () => {
    setShowExportMenu(false)
    
    try {
      const mapContainer = document.querySelector('.leaflet-container')
      
      if (!mapContainer) {
        alert('Karte nicht gefunden. Bitte warten Sie bis die Karte geladen ist.')
        return
      }

      // Zeige Lade-Nachricht
      const loadingMsg = document.createElement('div')
      loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px 40px; border-radius: 10px; z-index: 10000; font-size: 18px;'
      loadingMsg.textContent = 'Erstelle Export... Bitte warten...'
      loadingMsg.id = 'loading-export'
      document.body.appendChild(loadingMsg)

      // Warte damit alle Tiles geladen sind
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Verwende dom-to-image statt html2canvas (besser für Leaflet)
      const dataUrl = await domtoimage.toPng(mapContainer, {
        quality: 1.0,
        bgcolor: '#ffffff',
        cacheBust: true,
        filter: (node) => {
          // Filtere Leaflet-Controls raus (optional)
          return !node.classList || !node.classList.contains('leaflet-control-container')
        }
      })
      
      const loadingElement = document.getElementById('loading-export')
      if (loadingElement) document.body.removeChild(loadingElement)
      
      const link = document.createElement('a')
      const date = new Date().toISOString().split('T')[0]
      link.download = `karte-${date}.png`
      link.href = dataUrl
      link.click()
      
      console.log('PNG Export erfolgreich!')
    } catch (error) {
      console.error('PNG Export Fehler:', error)
      const loadingElement = document.getElementById('loading-export')
      if (loadingElement) document.body.removeChild(loadingElement)
      alert('PNG Export fehlgeschlagen: ' + error.message)
    }
  }

  const handleExportPDF = async () => {
    setShowExportMenu(false)
    
    try {
      const mapContainer = document.querySelector('.leaflet-container')
      
      if (!mapContainer) {
        alert('Karte nicht gefunden')
        return
      }

      // Zeige Lade-Nachricht
      const loadingMsg = document.createElement('div')
      loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px 40px; border-radius: 10px; z-index: 10000; font-size: 18px;'
      loadingMsg.textContent = 'Erstelle PDF... Bitte warten...'
      loadingMsg.id = 'loading-export-pdf'
      document.body.appendChild(loadingMsg)

      // Warte damit alle Tiles geladen sind
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Verwende dom-to-image
      const dataUrl = await domtoimage.toPng(mapContainer, {
        quality: 1.0,
        bgcolor: '#ffffff',
        cacheBust: true
      })
      
      const loadingElement = document.getElementById('loading-export-pdf')
      if (loadingElement) document.body.removeChild(loadingElement)
      
      // Erstelle PDF
      const img = new Image()
      img.src = dataUrl
      await new Promise(resolve => { img.onload = resolve })
      
      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height]
      })

      pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height)
      const date = new Date().toISOString().split('T')[0]
      pdf.save(`karte-${date}.pdf`)
      
      console.log('PDF Export erfolgreich!')
    } catch (error) {
      console.error('PDF-Export-Fehler:', error)
      const loadingElement = document.getElementById('loading-export-pdf')
      if (loadingElement) document.body.removeChild(loadingElement)
      alert('Fehler beim PDF-Export: ' + error.message)
    }
  }

  const handleSendEmail = async () => {
    if (!emailRecipient) {
      alert('Bitte Email-Adresse eingeben')
      return
    }

    try {
      const mapElement = mapRef.current?.container
      if (!mapElement) {
        alert('Karte nicht gefunden')
        return
      }

      let canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scale: 2
      })

      canvas = await addWatermarkToCanvas(canvas)
      
      const imageData = canvas.toDataURL('image/png')
      
      // Email-Daten vorbereiten
      const emailData = {
        to: emailRecipient,
        subject: `Krokier-Karte vom ${formatDate(currentTime)}`,
        body: `Anbei die Krokier-Karte vom ${formatDate(currentTime)} um ${formatTime(currentTime)}`,
        attachment: imageData
      }

      // In Produktion: An Backend senden
      const emailSettings = JSON.parse(localStorage.getItem('emailSettings') || '{}')
      
      if (!emailSettings.smtpServer) {
        alert('Bitte Email-Einstellungen im Admin-Bereich konfigurieren')
        return
      }

      // Simuliere Email-Versand (in Produktion: Backend-API aufrufen)
      console.log('Email wird gesendet an:', emailRecipient)
      alert(`Email würde gesendet werden an: ${emailRecipient}\n\nBitte Backend-Integration für echten Versand implementieren.`)
      
      setShowEmailDialog(false)
      setEmailRecipient('')
      setShowExportMenu(false)
    } catch (error) {
      alert('Fehler beim Email-Versand: ' + error.message)
    }
  }

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-xl z-[1001]">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
          {logo && (
            <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
          )}
          
          <div className="flex items-center space-x-3 bg-slate-900/40 px-6 py-3 rounded-xl border border-slate-600/30">
            <Clock className="w-7 h-7 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-wide font-mono">{formatTime(currentTime)}</span>
              <span className="text-sm opacity-80 font-medium">{formatDate(currentTime)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleGeolocation}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
            title="Meine Position"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-semibold">Meine Position</span>
          </button>

          <button
            onClick={onToggleLock}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl ${
              isMapLocked 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
            title={isMapLocked ? 'Karte entsperren' : 'Karte sperren'}
          >
            {isMapLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            <span className="text-sm font-semibold">{isMapLocked ? 'Gesperrt' : 'Entsperrt'}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
              title="Exportieren"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm font-semibold">Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-2xl overflow-hidden z-50">
                <button
                  onClick={handleExportPNG}
                  className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                >
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold">Als PNG</div>
                    <div className="text-xs text-gray-500">Mit Logo & Datum</div>
                  </div>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-red-50 transition-colors text-left"
                >
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-sm font-semibold">Als PDF</div>
                    <div className="text-xs text-gray-500">Mit Logo & Datum</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowEmailDialog(true)
                    setShowExportMenu(false)
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-green-50 transition-colors text-left"
                >
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-semibold">Per Email</div>
                    <div className="text-xs text-gray-500">Mit Logo & Datum</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onShowAdmin}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
            title="Admin-Bereich"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-semibold">Admin</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-500 px-4 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
            title="Vollbild"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Email Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Per Email senden</h3>
            <input
              type="email"
              value={emailRecipient}
              onChange={(e) => setEmailRecipient(e.target.value)}
              placeholder="empfaenger@email.com"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSendEmail}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Senden
              </button>
              <button
                onClick={() => {
                  setShowEmailDialog(false)
                  setEmailRecipient('')
                }}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Toolbar
