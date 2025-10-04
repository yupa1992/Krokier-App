import { useState, useRef, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MapComponent from './components/MapComponent'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import AdminPanel from './components/AdminPanel'

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

  // Geolocation tracking
  useEffect(() => {
    let watchId = null
    
    if (navigator.geolocation) {
      // Erste Position sofort abrufen
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('Initiale Position:', latitude, longitude)
          setUserLocation({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error('Geolocation-Fehler:', error.message)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )

      // Dann kontinuierlich überwachen
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('Position Update:', latitude, longitude)
          setUserLocation({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error('Geolocation-Watch-Fehler:', error.message)
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      )
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

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

  const handleSave = () => {
    const data = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      symbols,
      drawings,
      images,
      logo
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `krokier-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
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
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-slate-50">
        <Toolbar
          onSave={handleSave}
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
        
        <div className="flex flex-1 overflow-hidden">
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
          
          <Sidebar isLocked={isMapLocked} />
        </div>

        {showAdmin && (
          <AdminPanel
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
