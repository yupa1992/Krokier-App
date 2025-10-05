import { useState, useRef, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { MouseTransition, TouchTransition, MultiBackend } from 'react-dnd-multi-backend'
import MapComponent from './components/MapComponent'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import AdminPanelPro from './components/AdminPanelPro'

// Multi-Backend Konfiguration für Touch und Mouse
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
}

function App() {
  const [symbols, setSymbols] = useState([])
  const [drawings, setDrawings] = useState([])
  const [images, setImages] = useState([])
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [selectedTool, setSelectedTool] = useState(null)
  const [brushSize, setBrushSize] = useState(3)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMapLocked, setIsMapLocked] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [logo, setLogo] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const mapRef = useRef(null)

  // Auto-Save: Lade gespeicherte Daten beim Start
  useEffect(() => {
    const savedData = localStorage.getItem('krokierAppData')
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        if (data.symbols) setSymbols(data.symbols)
        if (data.drawings) setDrawings(data.drawings)
        if (data.images) setImages(data.images)
        if (data.logo) setLogo(data.logo)
        console.log('✅ Gespeicherte Daten geladen')
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error)
      }
    }
  }, [])

  // Auto-Save: Speichere Änderungen automatisch
  useEffect(() => {
    const data = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      symbols,
      drawings,
      images,
      logo
    }
    localStorage.setItem('krokierAppData', JSON.stringify(data))
  }, [symbols, drawings, images, logo])

  // Synchronisiere Symbol-Namen mit localStorage
  useEffect(() => {
    const updateSymbolNames = () => {
      const savedSymbols = localStorage.getItem('symbols')
      if (savedSymbols) {
        const symbolLibrary = JSON.parse(savedSymbols)
        setSymbols(prevSymbols => 
          prevSymbols.map(mapSymbol => {
            const librarySymbol = symbolLibrary.find(s => s.icon === mapSymbol.icon)
            if (librarySymbol && librarySymbol.name !== mapSymbol.name) {
              return { ...mapSymbol, name: librarySymbol.name }
            }
            return mapSymbol
          })
        )
      }
    }

    window.addEventListener('symbolsUpdated', updateSymbolNames)
    return () => window.removeEventListener('symbolsUpdated', updateSymbolNames)
  }, [])

  // Geolocation tracking - DEAKTIVIERT (verursacht nur Fehler)
  // useEffect(() => {
  //   // Geolocation temporär deaktiviert
  // }, [])

  const handleAddSymbol = (symbol) => {
    if (isMapLocked) return
    const newSymbol = { ...symbol, id: Date.now() + Math.random() }
    setSymbols(prevSymbols => [...prevSymbols, newSymbol])
  }

  const handleUpdateSymbol = (id, updates) => {
    if (isMapLocked) return
    setSymbols(symbols.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const handleDeleteSymbol = (id) => {
    if (isMapLocked) return
    setSymbols(symbols.filter(s => s.id !== id))
  }

  const handleAddImage = (image) => {
    if (isMapLocked) return
    setImages([...images, { ...image, id: Date.now() }])
  }

  const handleDeleteImage = (id) => {
    if (isMapLocked) return
    setImages(images.filter(img => img.id !== id))
  }

  // Neue Zeichnung beginnen
  const handleNewDrawing = () => {
    const confirmed = window.confirm(
      '⚠️ Möchten Sie wirklich eine neue Zeichnung beginnen?\n\nAlle aktuellen Symbole, Zeichnungen und Bilder werden gelöscht.\n\nDiese Aktion kann nicht rückgängig gemacht werden!'
    )
    
    if (confirmed) {
      setSymbols([])
      setDrawings([])
      setImages([])
      localStorage.removeItem('krokierAppData')
      console.log('🗑️ Neue Zeichnung gestartet - alle Daten gelöscht')
    }
  }

  const handleLoad = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        setSymbols(data.symbols || [])
        setDrawings(data.drawings || [])
        setImages(data.images || [])
        setLogo(data.logo || null)
      } catch (error) {
        alert('Fehler beim Laden der Datei: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="flex flex-col h-screen bg-slate-50">
        <Toolbar
          onNewDrawing={handleNewDrawing}
          onLoad={handleLoad}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          mapRef={mapRef}
          symbols={symbols}
          drawings={drawings}
          images={images}
          isMapLocked={isMapLocked}
          onToggleLock={() => setIsMapLocked(!isMapLocked)}
          onShowAdmin={() => setShowAdmin(true)}
          logo={logo}
        />
        
        <div className="flex flex-row flex-1 overflow-hidden">
          <div className="flex-1 relative">
            <MapComponent
              ref={mapRef}
              symbols={symbols}
              images={images}
              onAddSymbol={handleAddSymbol}
              onUpdateSymbol={handleUpdateSymbol}
              onDeleteSymbol={handleDeleteSymbol}
              onAddImage={handleAddImage}
              onDeleteImage={handleDeleteImage}
              selectedColor={selectedColor}
              selectedTool={selectedTool}
              brushSize={brushSize}
              drawings={drawings}
              setDrawings={setDrawings}
              isLocked={isMapLocked}
              userLocation={userLocation}
            />
          </div>
          
          <div className="w-80 md:w-96 overflow-y-auto">
            <Sidebar isLocked={isMapLocked} />
          </div>
        </div>

        {showAdmin && (
          <AdminPanelPro
            onClose={() => setShowAdmin(false)}
            logo={logo}
            onLogoChange={setLogo}
          />
        )}
      </div>
    </DndProvider>
  )
}

export default App
