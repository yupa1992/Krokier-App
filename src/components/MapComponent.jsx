import { forwardRef, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ImageOverlay } from 'react-leaflet'
import { useDrop } from 'react-dnd'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
// Export wird jetzt mit html2canvas gemacht
import { X, Edit2, Check, Upload } from 'lucide-react'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Zoom Control entfernt - Leaflet hat eigene Zoom-Controls

// Geoman Draw Control - Bessere Zeichenwerkzeuge
const DrawControl = () => {
  const map = useMap()
  const initRef = useRef(false)
  const [currentColor, setCurrentColor] = useState('#EF4444')

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    // ✨ NEUE PROFESSIONELLE TOOLBAR ✨
    // Geoman OHNE Standard-Toolbar (wir bauen eigene!)
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: false,
      editMode: false,
      dragMode: false,
      removalMode: false,
      drawCircleMarker: false,
      drawMarker: false,
      drawText: false,
      cutPolygon: false,
      rotateMode: false,
    })
    
    // METER-ANZEIGE aktivieren
    map.pm.setGlobalOptions({
      measurements: { 
        measurement: true,
        displayFormat: 'metric',
        showSegmentLength: true,
        showTotalLength: true
      },
      pathOptions: {
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.4,
        weight: 3,
      },
      preferCanvas: true
    })

    // 🎨 NEUE EINHEITLICHE TOOLBAR
    const UnifiedToolbar = L.Control.extend({
      onAdd: function() {
        const container = L.DomUtil.create('div', 'unified-toolbar')
        container.style.cssText = `
          background: white;
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 60px;
        `
        
        let currentColor = '#EF4444'
        
        // Zeichnen-Tools
        const tools = [
          { icon: '✏️', title: 'Linie', action: 'Line' },
          { icon: '▭', title: 'Rechteck', action: 'Rectangle' },
          { icon: '⬟', title: 'Polygon', action: 'Polygon' },
          { icon: '⭕', title: 'Kreis', action: 'Circle' },
          { icon: '✎', title: 'Bearbeiten', action: 'Edit' },
          { icon: '↔', title: 'Verschieben', action: 'Drag' },
          { icon: '🗑️', title: 'Löschen', action: 'Remove' }
        ]
        
        tools.forEach(tool => {
          const btn = L.DomUtil.create('button', 'tool-btn', container)
          btn.innerHTML = tool.icon
          btn.title = tool.title
          btn.style.cssText = `
            width: 44px;
            height: 44px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          `
          
          L.DomEvent.on(btn, 'click', function(e) {
            L.DomEvent.stopPropagation(e)
            
            // Wenn Button bereits aktiv ist, deaktivieren
            const isActive = btn.style.background === 'rgb(59, 130, 246)'
            
            // Alle Tools deaktivieren
            map.pm.disableDraw()
            map.pm.disableGlobalEditMode()
            map.pm.disableGlobalDragMode()
            map.pm.disableGlobalRemovalMode()
            
            // Alle Buttons zurücksetzen
            container.querySelectorAll('.tool-btn').forEach(b => {
              b.style.background = 'white'
              b.style.borderColor = '#e5e7eb'
            })
            
            // Wenn nicht aktiv war, aktivieren
            if (!isActive) {
              btn.style.background = '#3B82F6'
              btn.style.borderColor = '#2563EB'
              
              // Tool aktivieren
              if (tool.action === 'Edit') {
                map.pm.enableGlobalEditMode()
              } else if (tool.action === 'Drag') {
                map.pm.enableGlobalDragMode()
              } else if (tool.action === 'Remove') {
                map.pm.enableGlobalRemovalMode()
              } else {
                map.pm.enableDraw(tool.action, {
                  pathOptions: {
                    color: currentColor,
                    fillColor: currentColor,
                    fillOpacity: 0.4,
                    weight: 3
                  }
                })
              }
            }
          })
          
          L.DomEvent.on(btn, 'mouseenter', function() {
            if (btn.style.background !== 'rgb(59, 130, 246)') {
              btn.style.background = '#f3f4f6'
            }
          })
          
          L.DomEvent.on(btn, 'mouseleave', function() {
            if (btn.style.background !== 'rgb(59, 130, 246)') {
              btn.style.background = 'white'
            }
          })
        })
        
        // Trennlinie
        const divider = L.DomUtil.create('div', '', container)
        divider.style.cssText = 'height: 1px; background: #e5e7eb; margin: 4px 0;'
        
        // Farben
        const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#000000']
        colors.forEach((color, index) => {
          const colorBtn = L.DomUtil.create('button', 'color-btn', container)
          colorBtn.style.cssText = `
            width: 44px;
            height: 44px;
            border: ${index === 0 ? '3px' : '2px'} solid ${index === 0 ? '#000' : '#e5e7eb'};
            border-radius: 8px;
            background: ${color};
            cursor: pointer;
            transition: all 0.2s;
          `
          
          L.DomEvent.on(colorBtn, 'click', function(e) {
            L.DomEvent.stopPropagation(e)
            currentColor = color
            
            // Alle Farb-Buttons zurücksetzen
            container.querySelectorAll('.color-btn').forEach(b => {
              b.style.border = '2px solid #e5e7eb'
            })
            colorBtn.style.border = '3px solid #000'
            
            // Farbe aktualisieren
            map.pm.setGlobalOptions({
              pathOptions: {
                color: color,
                fillColor: color,
                fillOpacity: 0.4,
                weight: 3
              }
            })
          })
        })
        
        // Trennlinie 2
        const divider2 = L.DomUtil.create('div', '', container)
        divider2.style.cssText = 'height: 1px; background: #e5e7eb; margin: 4px 0;'
        
        // Zoom Buttons
        const zoomIn = L.DomUtil.create('button', 'zoom-btn', container)
        zoomIn.innerHTML = '+'
        zoomIn.title = 'Hineinzoomen'
        zoomIn.style.cssText = `
          width: 44px;
          height: 44px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 24px;
          font-weight: bold;
          transition: all 0.2s;
        `
        L.DomEvent.on(zoomIn, 'click', function(e) {
          L.DomEvent.stopPropagation(e)
          map.zoomIn()
        })
        L.DomEvent.on(zoomIn, 'mouseenter', function() {
          zoomIn.style.background = '#f3f4f6'
        })
        L.DomEvent.on(zoomIn, 'mouseleave', function() {
          zoomIn.style.background = 'white'
        })
        
        const zoomOut = L.DomUtil.create('button', 'zoom-btn', container)
        zoomOut.innerHTML = '−'
        zoomOut.title = 'Herauszoomen'
        zoomOut.style.cssText = `
          width: 44px;
          height: 44px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 24px;
          font-weight: bold;
          transition: all 0.2s;
        `
        L.DomEvent.on(zoomOut, 'click', function(e) {
          L.DomEvent.stopPropagation(e)
          map.zoomOut()
        })
        L.DomEvent.on(zoomOut, 'mouseenter', function() {
          zoomOut.style.background = '#f3f4f6'
        })
        L.DomEvent.on(zoomOut, 'mouseleave', function() {
          zoomOut.style.background = 'white'
        })
        
        return container
      }
    })

    const toolbar = new UnifiedToolbar({ position: 'topleft' })
    map.addControl(toolbar)

    // 🗺️ LAYER SWITCHER - Schönes Design
    const LayerControl = L.Control.extend({
      onAdd: function() {
        const container = L.DomUtil.create('div', 'layer-control')
        container.style.cssText = `
          background: white;
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 150px;
        `
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <p style="font-size: 13px; font-weight: 700; margin: 0 0 4px 0; text-align: center; color: #1e293b;">Kartenansicht</p>
            <button id="layer-street" class="layer-btn active" style="padding: 10px 14px; background: #3B82F6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; box-shadow: 0 2px 4px rgba(59,130,246,0.3);">🗺️ Straße</button>
            <button id="layer-satellite" class="layer-btn" style="padding: 10px 14px; background: #f1f5f9; color: #334155; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s;">🛰️ Satellit</button>
            <button id="layer-topo" class="layer-btn" style="padding: 10px 14px; background: #f1f5f9; color: #334155; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s;">⛰️ Topografie</button>
          </div>
        `
        
        // Tile Layers
        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        })
        
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri'
        })
        
        const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenTopoMap'
        })
        
        // Standard: Straße
        let currentLayer = streetLayer
        currentLayer.addTo(map)
        
        // Button Handlers
        const streetBtn = container.querySelector('#layer-street')
        const satelliteBtn = container.querySelector('#layer-satellite')
        const topoBtn = container.querySelector('#layer-topo')
        
        const setActiveButton = (activeBtn) => {
          [streetBtn, satelliteBtn, topoBtn].forEach(btn => {
            btn.style.background = '#f1f5f9'
            btn.style.color = '#334155'
            btn.style.boxShadow = 'none'
            btn.classList.remove('active')
          })
          activeBtn.style.background = '#3B82F6'
          activeBtn.style.color = 'white'
          activeBtn.style.boxShadow = '0 2px 4px rgba(59,130,246,0.3)'
          activeBtn.classList.add('active')
        }
        
        L.DomEvent.on(streetBtn, 'click', function(e) {
          L.DomEvent.stopPropagation(e)
          map.removeLayer(currentLayer)
          currentLayer = streetLayer
          currentLayer.addTo(map)
          setActiveButton(streetBtn)
        })
        
        L.DomEvent.on(satelliteBtn, 'click', function(e) {
          L.DomEvent.stopPropagation(e)
          map.removeLayer(currentLayer)
          currentLayer = satelliteLayer
          currentLayer.addTo(map)
          setActiveButton(satelliteBtn)
        })
        
        L.DomEvent.on(topoBtn, 'click', function(e) {
          L.DomEvent.stopPropagation(e)
          map.removeLayer(currentLayer)
          currentLayer = topoLayer
          currentLayer.addTo(map)
          setActiveButton(topoBtn)
        })
        
        return container
      }
    })

    const layerControl = new LayerControl({ position: 'bottomright' })
    map.addControl(layerControl)

    // Export wird jetzt mit html2canvas in Toolbar.jsx gemacht
    // Keine zusätzliche Bibliothek nötig!

    // Deutsche Übersetzungen
    map.pm.setLang('de', {
      tooltips: {
        placeMarker: 'Klicken um Marker zu platzieren',
        firstVertex: 'Klicken um ersten Punkt zu setzen',
        continueLine: 'Klicken um Linie fortzusetzen',
        finishLine: 'Klicken auf letzten Punkt zum Beenden',
        finishPoly: 'Klicken auf ersten Punkt zum Schließen',
        finishRect: 'Klicken zum Beenden',
        startCircle: 'Klicken um Kreismittelpunkt zu setzen',
        finishCircle: 'Klicken um Kreis zu beenden',
        placeCircleMarker: 'Klicken um Kreis-Marker zu platzieren',
      },
      actions: {
        finish: 'Fertig',
        cancel: 'Abbrechen',
        removeLastVertex: 'Letzten Punkt entfernen',
      },
      buttonTitles: {
        drawMarkerButton: 'Marker zeichnen',
        drawPolyButton: 'Polygon zeichnen',
        drawLineButton: 'Linie zeichnen',
        drawCircleButton: 'Kreis zeichnen',
        drawRectButton: 'Rechteck zeichnen',
        editButton: 'Ebenen bearbeiten',
        dragButton: 'Ebenen verschieben',
        cutButton: 'Ebenen schneiden',
        deleteButton: 'Ebenen löschen',
        drawCircleMarkerButton: 'Kreis-Marker zeichnen',
      },
    }, 'de')

    // Globale Stil-Optionen
    map.pm.setGlobalOptions({
      templineStyle: {
        color: '#3B82F6',
      },
      hintlineStyle: {
        color: '#3B82F6',
        dashArray: [5, 5],
      },
      pathOptions: {
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.4,
        weight: 3,
      },
    })

  }, [map])

  return null
}

const DraggableMarker = ({ symbol, onUpdate, onDelete, isLocked }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(symbol.label || '')
  const [symbolName, setSymbolName] = useState(symbol.name)
  const [rotation, setRotation] = useState(symbol.rotation || 0)
  const [isSelected, setIsSelected] = useState(false)
  const markerRef = useRef(null)

  // Aktualisiere Symbol-Name
  useEffect(() => {
    setSymbolName(symbol.name)
  }, [symbol.name])

  // Aktualisiere Rotation
  useEffect(() => {
    if (symbol.rotation !== undefined) {
      setRotation(symbol.rotation)
    }
  }, [symbol.rotation])

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 64px; height: 64px; background: transparent !important; border: none !important; outline: none !important; box-shadow: none !important;">
        ${isSelected ? `
          <div class="rotation-handle" style="position: absolute; top: -38px; left: 50%; transform: translateX(-50%); width: 32px; height: 32px; background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); border: 3px solid white; border-radius: 50%; cursor: grab; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 1000; display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; font-weight: bold;">⟲</div>
        ` : ''}
        <img src="${symbol.icon}" style="position: relative; z-index: 10; width: 64px; height: 64px; transform: rotate(${rotation}deg); border: none !important; outline: none !important; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 32]  // Zentriert statt unten - Icons bleiben jetzt an der richtigen Position
  })

  const handleDragEnd = (e) => {
    if (isLocked) return
    const { lat, lng } = e.target.getLatLng()
    onUpdate(symbol.id, { position: { lat, lng } })
  }

  const handleSaveLabel = () => {
    onUpdate(symbol.id, { label })
    setIsEditing(false)
  }

  const handleRotationChange = (newRotation) => {
    setRotation(newRotation)
    onUpdate(symbol.id, { rotation: newRotation })
  }

  const handleDelete = () => {
    if (window.confirm(`Symbol "${symbolName}" wirklich löschen?`)) {
      onDelete(symbol.id)
    }
  }

  // Icon neu erstellen wenn sich was ändert
  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current
      marker.setIcon(customIcon)
    }
  }, [rotation, isSelected])

  // Rotation durch Ziehen des Handles
  useEffect(() => {
    if (!isSelected || !markerRef.current) return

    const marker = markerRef.current
    
    const setupRotation = () => {
      const markerElement = marker.getElement()
      if (!markerElement) return

      const rotationHandle = markerElement.querySelector('.rotation-handle')
      if (!rotationHandle) return

      let isDragging = false

      const handleMouseDown = (e) => {
        e.stopPropagation()
        e.preventDefault()
        isDragging = true
        document.body.style.cursor = 'grabbing'
      }

      const handleMouseMove = (e) => {
        if (!isDragging) return
        e.stopPropagation()
        e.preventDefault()

        const markerPos = marker.getLatLng()
        const markerPixel = marker._map.latLngToContainerPoint(markerPos)
        const mapRect = marker._map.getContainer().getBoundingClientRect()
        
        const mouseX = e.clientX - mapRect.left
        const mouseY = e.clientY - mapRect.top

        const dx = mouseX - markerPixel.x
        const dy = mouseY - markerPixel.y
        
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
        if (angle < 0) angle += 360
        
        handleRotationChange(Math.round(angle))
      }

      const handleMouseUp = () => {
        isDragging = false
        document.body.style.cursor = 'default'
      }

      rotationHandle.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        rotationHandle.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = 'default'
      }
    }

    const timer = setTimeout(setupRotation, 100)
    return () => clearTimeout(timer)
  }, [isSelected, rotation])

  return (
    <Marker
      position={[symbol.position.lat, symbol.position.lng]}
      icon={customIcon}
      draggable={!isLocked}
      eventHandlers={{
        dragend: handleDragEnd,
        click: () => setIsSelected(!isSelected)
      }}
      ref={markerRef}
    >
      {isEditing && (
        <Popup closeButton={false} autoClose={false}>
          <div className="min-w-[200px]">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Beschriftung</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Beschriftung eingeben..."
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveLabel}
                  className="flex-1 flex items-center justify-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors font-semibold"
                >
                  <Check className="w-4 h-4" />
                  <span>Speichern</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center justify-center px-3 py-2 bg-slate-300 hover:bg-slate-400 rounded-lg text-sm font-semibold transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </Popup>
      )}
      {!isEditing && !isSelected && (
        <Popup closeButton={false} autoClose={false}>
          <div className="min-w-[200px]">
            {symbol.label && (
              <p className="text-sm text-slate-700 mb-3 font-medium bg-slate-100 px-3 py-2 rounded">{symbol.label}</p>
            )}
            <div className="flex gap-2">
              {!isLocked && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center space-x-1 text-blue-600 hover:bg-blue-50 border-2 border-blue-600 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Beschriften</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center space-x-1 text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                    title="Löschen"
                  >
                    <X className="w-4 h-4" />
                    <span>Löschen</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  )
}

const ImageMarker = ({ image, onDelete, isLocked }) => {
  const bounds = [
    [image.bounds.south, image.bounds.west],
    [image.bounds.north, image.bounds.east]
  ]

  return (
    <>
      <ImageOverlay
        url={image.url}
        bounds={bounds}
        opacity={image.opacity || 0.7}
      />
      <Marker position={[image.center.lat, image.center.lng]}>
        <Popup>
          <div className="min-w-[200px]">
            <h3 className="font-bold text-slate-800 mb-2">Hochgeladenes Bild</h3>
            <img src={image.url} alt="Uploaded" className="w-full h-32 object-cover rounded mb-2" />
            {!isLocked && (
              <button
                onClick={() => onDelete(image.id)}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-semibold"
              >
                <X className="w-4 h-4" />
                <span>Bild entfernen</span>
              </button>
            )}
          </div>
        </Popup>
      </Marker>
    </>
  )
}

const DropZone = ({ onAddSymbol, onAddImage, isLocked }) => {
  const map = useMap()
  const fileInputRef = useRef(null)

  const [, drop] = useDrop(() => ({
    accept: 'SYMBOL',
    drop: (item, monitor) => {
      if (isLocked) return
      const offset = monitor.getClientOffset()
      if (!offset) return

      const mapContainer = map.getContainer()
      const mapRect = mapContainer.getBoundingClientRect()
      
      const x = offset.x - mapRect.left
      const y = offset.y - mapRect.top
      
      const containerPoint = map.containerPointToLatLng([x, y])
      
      onAddSymbol({
        icon: item.icon,
        name: item.name,
        position: { lat: containerPoint.lat, lng: containerPoint.lng }
      })
    }
  }), [map, isLocked])

  useMapEvents({
    click(e) {
      if (isLocked) return
    }
  })

  const handleImageUpload = (e) => {
    if (isLocked) return
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const center = map.getCenter()
      const bounds = map.getBounds()
      
      onAddImage({
        url: event.target.result,
        center: { lat: center.lat, lng: center.lng },
        bounds: {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        }
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div ref={drop} style={{ width: '100%', height: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
    </div>
  )
}

const MapComponent = forwardRef(({ 
  symbols, 
  images,
  onAddSymbol, 
  onUpdateSymbol, 
  onDeleteSymbol,
  onAddImage,
  onDeleteImage,
  selectedColor,
  selectedTool,
  brushSize,
  drawings,
  setDrawings,
  isLocked,
  userLocation
}, ref) => {
  const mapRef = useRef(null)

  const userLocationIcon = L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 30px; height: 30px; background: #3B82F6; border: 4px solid white; border-radius: 50%; box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4); z-index: 2; position: relative;"></div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(59, 130, 246, 0.3); border: 2px solid rgba(59, 130, 246, 0.5); border-radius: 50%; animation: pulse 2s infinite;"></div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; background: rgba(59, 130, 246, 0.15); border-radius: 50%; animation: pulse 2s infinite 0.5s;"></div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30]
  })

  useEffect(() => {
    if (mapRef.current && ref) {
      ref.current = mapRef.current
    }
  }, [ref])

  // Fliege zur User Location beim ersten Mal
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const map = mapRef.current
      const hasFlown = sessionStorage.getItem('hasFlownToLocation')
      if (!hasFlown) {
        console.log('🚀 Fliege zur User Location:', userLocation)
        map.flyTo([userLocation.lat, userLocation.lng], 16, {
          duration: 2
        })
        sessionStorage.setItem('hasFlownToLocation', 'true')
      }
    }
  }, [userLocation])

  // Sperre Karten-Bewegung wenn Zeichenwerkzeug aktiv ist
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current
      if (selectedTool && selectedTool !== 'hand') {
        map.dragging.disable()
      } else {
        map.dragging.enable()
      }
    }
  }, [selectedTool])

  return (
    <MapContainer
      center={[51.1657, 10.4515]}
      zoom={13}
      className="h-full w-full"
      ref={mapRef}
      zoomControl={!isLocked}
      dragging={!isLocked}
      scrollWheelZoom={!isLocked}
      preferCanvas={true}
    >
      {/* TileLayer wird jetzt vom Layer-Switcher gesteuert */}
      
      <DrawControl />
      
      <DropZone onAddSymbol={onAddSymbol} onAddImage={onAddImage} isLocked={isLocked} />

      {symbols.map((symbol) => (
        <DraggableMarker
          key={symbol.id}
          symbol={symbol}
          onUpdate={onUpdateSymbol}
          onDelete={onDeleteSymbol}
          isLocked={isLocked}
        />
      ))}

      {images.map((image) => (
        <ImageMarker
          key={image.id}
          image={image}
          onDelete={onDeleteImage}
          isLocked={isLocked}
        />
      ))}

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userLocationIcon}
        >
          <Popup>
            <div className="text-center">
              <p className="font-bold text-blue-600">📍 Ihre Position</p>
              <p className="text-xs text-slate-600 mt-1">
                {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
})

MapComponent.displayName = 'MapComponent'

export default MapComponent
