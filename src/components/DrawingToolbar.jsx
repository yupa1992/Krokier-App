import { useState } from 'react'
import { Minus, Square, Circle, Trash2, ChevronDown, ChevronUp, GripVertical, Hand, Pentagon } from 'lucide-react'
import Draggable from 'react-draggable'

const DrawingToolbar = ({ selectedColor, onColorChange, selectedTool, onToolChange, brushSize, onBrushSizeChange, onClear, isLocked }) => {
  const [isMinimized, setIsMinimized] = useState(false)

  const colors = [
    { name: 'Blau', value: '#3B82F6' },
    { name: 'Rot', value: '#EF4444' },
    { name: 'Grün', value: '#10B981' },
    { name: 'Gelb', value: '#F59E0B' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Lila', value: '#8B5CF6' },
    { name: 'Schwarz', value: '#000000' },
    { name: 'Weiß', value: '#FFFFFF' }
  ]

  const tools = [
    { id: 'hand', name: 'Hand (Karte verschieben)', icon: Hand },
    { id: 'line', name: 'Linie', icon: Minus },
    { id: 'polygon', name: 'Polygon', icon: Pentagon },
    { id: 'rectangle', name: 'Rechteck', icon: Square },
    { id: 'circle', name: 'Kreis', icon: Circle }
  ]

  if (isMinimized) {
    return (
      <Draggable handle=".drag-handle">
        <div className="absolute top-20 left-4 z-[1000] bg-white rounded-lg shadow-2xl border-2 border-slate-300">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-t-lg cursor-move drag-handle">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4" />
              <span className="text-sm font-bold">Zeichenwerkzeuge</span>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Draggable>
    )
  }

  return (
    <Draggable handle=".drag-handle">
      <div className="absolute top-20 left-4 z-[1000] bg-white rounded-xl shadow-2xl border-2 border-slate-300 w-80">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-t-xl cursor-move drag-handle">
          <div className="flex items-center space-x-2">
            <GripVertical className="w-5 h-5" />
            <Paintbrush className="w-5 h-5" />
            <span className="font-bold">Zeichenwerkzeuge</span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Werkzeuge */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Werkzeug</label>
            <div className="grid grid-cols-3 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolChange(selectedTool === tool.id ? null : tool.id)}
                    disabled={isLocked}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTool === tool.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                    title={tool.name}
                  >
                    <Icon className="w-5 h-5 mx-auto" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Farbauswahl */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Farbe</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onColorChange(color.value)}
                  disabled={isLocked}
                  className={`w-full h-12 rounded-lg border-3 transition-all ${
                    selectedColor === color.value
                      ? 'ring-4 ring-blue-500 ring-offset-2 scale-110'
                      : 'border-slate-300 hover:scale-105'
                  } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
                  style={{ backgroundColor: color.value, borderColor: color.value === '#FFFFFF' ? '#E5E7EB' : color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-slate-600 font-medium">Eigene Farbe:</label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => onColorChange(e.target.value)}
                disabled={isLocked}
                className="w-full h-10 rounded-lg cursor-pointer border-2 border-slate-300"
              />
            </div>
          </div>

          {/* Aktionen */}
          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={onClear}
              disabled={isLocked}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <Trash2 className="w-5 h-5" />
              <span>Alle Zeichnungen löschen</span>
            </button>
          </div>

          {isLocked && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 font-medium text-center">
                🔒 Karte ist gesperrt
              </p>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  )
}

export default DrawingToolbar
