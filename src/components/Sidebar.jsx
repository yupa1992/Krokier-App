import { useDrag } from 'react-dnd'
import { Library, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getEmptyImage } from 'react-dnd-html5-backend'

const DraggableIcon = ({ icon, name, isLocked }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'SYMBOL',
    item: { icon, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: !isLocked
  }), [isLocked, icon, name])

  // Verstecke das Standard-HTML5-Preview (für Touch wird automatisch ein Preview erstellt)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  return (
    <div
      ref={drag}
      className={`draggable-symbol bg-white p-2 rounded-lg shadow-md hover:shadow-xl active:shadow-2xl transition-all border-2 border-transparent hover:border-blue-400 active:border-blue-500 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-move touch-none select-none'}`}
      title={name}
      style={{ touchAction: 'none' }}
    >
      <img 
        src={icon} 
        alt={name} 
        className="w-16 h-16 object-contain mx-auto pointer-events-none" 
        draggable={false}
      />
      <p className="text-xs text-center mt-1 text-gray-700 font-medium truncate pointer-events-none">{name}</p>
    </div>
  )
}

const Sidebar = ({ isLocked }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [symbols, setSymbols] = useState([])
  
  // Lade Symbole aus localStorage
  const loadSymbols = () => {
    const SYMBOLS_VERSION = '2.0' // Version erhöhen um Cache zu invalidieren
    const savedVersion = localStorage.getItem('symbolsVersion')
    const savedSymbols = localStorage.getItem('symbols')
    
    // Prüfe ob Version aktuell ist
    if (savedSymbols && savedVersion === SYMBOLS_VERSION) {
      setSymbols(JSON.parse(savedSymbols))
    } else {
      // Generiere alle PNG-Symbole aus dem assets/icons Ordner
      const defaultSymbols = []
      for (let i = 1; i <= 147; i++) {
        defaultSymbols.push({
          id: i,
          icon: `/assets/icons/Element ${i}@2x.png`,
          name: `Element ${i}`
        })
      }
      setSymbols(defaultSymbols)
      localStorage.setItem('symbols', JSON.stringify(defaultSymbols))
      localStorage.setItem('symbolsVersion', SYMBOLS_VERSION)
    }
  }

  useEffect(() => {
    loadSymbols()

    // Lausche auf localStorage-Änderungen
    const handleStorageChange = (e) => {
      if (e.key === 'symbols' || e.type === 'storage') {
        loadSymbols()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom Event für lokale Änderungen
    window.addEventListener('symbolsUpdated', loadSymbols)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('symbolsUpdated', loadSymbols)
    }
  }, [])

  const filteredSymbols = symbols.filter(symbol =>
    symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-full w-full bg-slate-100 border-l border-slate-300 flex flex-col shadow-2xl">
      <div className="p-3 md:p-4 bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-2 mb-2">
          <Library className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
          <h2 className="text-base md:text-lg font-bold">Symbole</h2>
        </div>
        <p className="text-xs opacity-90 mb-2">
          {isLocked ? '🔒 Gesperrt' : 'Auf Karte ziehen'}
        </p>
        <input
          type="text"
          placeholder="Suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 md:p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filteredSymbols.map((symbol, index) => (
            <DraggableIcon key={index} icon={symbol.icon} name={symbol.name} isLocked={isLocked} />
          ))}
        </div>
      </div>

      {filteredSymbols.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-base font-medium">Keine Symbole gefunden</p>
            <p className="text-xs mt-1">Anderen Suchbegriff versuchen</p>
          </div>
        </div>
      )}

      <div className="p-3 bg-white border-t border-slate-300 flex-shrink-0">
        <div className="text-xs text-slate-600 text-center">
          <strong>{symbols.length}</strong> Symbole verfügbar
        </div>
      </div>
    </div>
  )
}

export default Sidebar
