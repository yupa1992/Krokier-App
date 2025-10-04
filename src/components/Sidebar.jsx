import { useDrag } from 'react-dnd'
import { Library, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'

const DraggableIcon = ({ icon, name, isLocked }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SYMBOL',
    item: { icon, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: !isLocked
  }), [isLocked])

  return (
    <div
      ref={drag}
      className={`draggable-symbol bg-white p-2 rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-move'}`}
      title={name}
    >
      <img src={icon} alt={name} className="w-16 h-16 object-contain mx-auto" />
      <p className="text-xs text-center mt-1 text-gray-700 font-medium truncate">{name}</p>
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
    <div className="w-96 bg-slate-100 border-l border-slate-300 overflow-y-auto shadow-2xl">
      <div className="p-5 bg-gradient-to-r from-slate-700 to-slate-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Library className="w-7 h-7 text-blue-400" />
          <h2 className="text-xl font-bold">Symbol-Bibliothek</h2>
        </div>
        <p className="text-sm opacity-90 mb-3">
          {isLocked ? '🔒 Karte ist gesperrt' : 'Symbole auf Karte ziehen'}
        </p>
        <input
          type="text"
          placeholder="Symbole suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="p-4 grid grid-cols-3 gap-3">
        {filteredSymbols.map((symbol, index) => (
          <DraggableIcon key={index} icon={symbol.icon} name={symbol.name} isLocked={isLocked} />
        ))}
      </div>

      {filteredSymbols.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">Keine Symbole gefunden</p>
          <p className="text-sm">Versuchen Sie einen anderen Suchbegriff</p>
        </div>
      )}

      <div className="p-5 bg-white border-t border-slate-300 mt-4 sticky bottom-0">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Tastenkürzel</h3>
        <div className="space-y-2 text-sm text-slate-700">
          <p><kbd className="px-3 py-1 bg-slate-200 rounded font-mono">Strg+S</kbd> Speichern</p>
          <p><kbd className="px-3 py-1 bg-slate-200 rounded font-mono">Strg+O</kbd> Laden</p>
          <p><kbd className="px-3 py-1 bg-slate-200 rounded font-mono">F11</kbd> Vollbild</p>
          <p><kbd className="px-3 py-1 bg-slate-200 rounded font-mono">Entf</kbd> Löschen</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            <strong>{symbols.length}</strong> Symbole verfügbar
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
