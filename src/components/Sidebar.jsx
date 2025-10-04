import { useDrag } from 'react-dnd'
import { Library, ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { symbolCategories, getAllSymbols } from '../symbolMapping'

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
  const [expandedCategories, setExpandedCategories] = useState({})
  const [allSymbols] = useState(getAllSymbols())

  // Alle Kategorien standardmäßig aufklappen
  useEffect(() => {
    const expanded = {}
    symbolCategories.forEach(cat => {
      expanded[cat.category] = true
    })
    setExpandedCategories(expanded)
  }, [])

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  // Filter-Logik
  const getFilteredCategories = () => {
    if (!searchTerm) return symbolCategories
    
    return symbolCategories.map(category => ({
      ...category,
      symbols: category.symbols.filter(symbol =>
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.symbols.length > 0)
  }

  const filteredCategories = getFilteredCategories()
  const totalSymbols = allSymbols.length

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

      <div className="flex-1 overflow-y-auto">
        {filteredCategories.map((category) => (
          <div key={category.category} className="border-b border-slate-300">
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full px-3 py-2 bg-slate-200 hover:bg-slate-300 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-semibold text-slate-800">{category.category}</span>
                <span className="text-xs text-slate-600">({category.symbols.length})</span>
              </div>
              {expandedCategories[category.category] ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
            </button>
            
            {expandedCategories[category.category] && (
              <div className="p-2 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {category.symbols.map((symbol) => (
                    <DraggableIcon 
                      key={symbol.id} 
                      icon={symbol.icon} 
                      name={symbol.name} 
                      isLocked={isLocked} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center p-4">
            <p className="text-base font-medium">Keine Symbole gefunden</p>
            <p className="text-xs mt-1">Anderen Suchbegriff versuchen</p>
          </div>
        </div>
      )}

      <div className="p-3 bg-white border-t border-slate-300 flex-shrink-0">
        <div className="text-xs text-slate-600 text-center">
          <strong>{totalSymbols}</strong> Symbole verfügbar
        </div>
      </div>
    </div>
  )
}

export default Sidebar
