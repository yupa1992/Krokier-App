import { forwardRef, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ImageOverlay } from 'react-leaflet'
import { useDrop } from 'react-dnd'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import SimpleMapScreenshoter from 'leaflet-simple-map-screenshoter'
import { X, Edit2, Check, Upload, Plus, Minus, Locate } from 'lucide-react'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Zoom Control Component
const ZoomControl = () => {
  const map = useMap()
  
  const handleZoomIn = () => {
    map.zoomIn()
  }
  
  const handleZoomOut = () => {
    map.zoomOut()
  }
  
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 })
  }
  
  return (
    <div className="absolute top-20 left-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg shadow-lg border-2 border-gray-300 transition-all"
        title="Hineinzoomen"
      >
        <Plus className="w-6 h-6" />
      </button>
      <button
        onClick={handleZoomOut}
        className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg shadow-lg border-2 border-gray-300 transition-all"
        title="Herauszoomen"
      >
        <Minus className="w-6 h-6" />
      </button>
      <button
        onClick={handleLocate}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg border-2 border-blue-700 transition-all"
        title="Meine Position"
      >
        <Locate className="w-6 h-6" />
      </button>
    </div>
  )
}

// Geoman Draw Control - Bessere Zeichenwerkzeuge
const DrawControl = () => {
  const map = useMap()
  const initRef = useRef(false)
  const [currentColor, setCurrentColor] = useState('#EF4444')

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    // Geoman Toolbar VERSTECKEN - wir bauen eigene!
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: false,
      drawMarker: false,
      drawText: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
      rotateMode: false,
    })
    
    // Meter-Anzeige aktivieren
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
      }
    })

    // 🎨 CUSTOM TOOLBAR mit DEINEN Icons!
    const CustomToolbar = L.Control.extend({
      onAdd: function() {
        const container = L.DomUtil.create('div', 'custom-toolbar')
        container.style.cssText = `
          background: white;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 80px;
        `
        
        let currentColor = '#EF4444'
        
        // Tools basierend auf deinen Icons
        const tools = [
          { svg: '<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="18" cy="18" r="2" fill="currentColor"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/></svg>', title: 'Linie', action: 'Line' },
          { svg: '<svg viewBox="0 0 24 24" width="20" height="20"><rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"/></svg>', title: 'Rechteck', action: 'Rectangle' },
          { svg: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2 L22 22 L2 22 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>', title: 'Polygon', action: 'Polygon' },
          { svg: '<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>', title: 'Kreis', action: 'Circle' },
          { svg: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>', title: 'Bearbeiten', action: 'Edit' },
          { svg: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z" fill="currentColor"/></svg>', title: 'Verschieben', action: 'Drag' },
          { svg: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>', title: 'Löschen', action: 'Remove' }
        ]
        
        tools.forEach(tool => {
          const btn = L.DomUtil.create('button', 'tool-btn', container)
          btn.innerHTML = tool.svg
          btn.title = tool.title
          btn.style.cssText = `
            width: 36px;
            height: 36px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            padding: 6px;
          `
          
          L.DomEvent.on(btn, 'click', function(e) {
            L.DomEvent.stopPropagation(e)
            
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
            
            if (!isActive) {
              btn.style.background = '#3B82F6'
              btn.style.borderColor = '#2563EB'
              
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
            width: 36px;
            height: 36px;
            border: ${index === 0 ? '3px' : '2px'} solid ${index === 0 ? '#000' : '#e5e7eb'};
            border-radius: 6px;
            background: ${color};
            cursor: pointer;
            transition: all 0.2s;
          `
          
          L.DomEvent.on(colorBtn, 'click', function(e) {
            L.DomEvent.stopPropagation(e)
            currentColor = color
            
            container.querySelectorAll('.color-btn').forEach(b => {
              b.style.border = '2px solid #e5e7eb'
            })
            colorBtn.style.border = '3px solid #000'
            
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
        
        return container
      }
    })

    const customToolbar = new CustomToolbar({ position: 'topleft' })
    map.addControl(customToolbar)

    // Layer Switcher - Verschiedene Kartenansichten
    const LayerControl = L.Control.extend({
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
        container.style.background = 'white'
        container.style.padding = '10px'
        container.style.borderRadius = '8px'
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 8px; min-width: 140px;">
            <p style="font-size: 12px; font-weight: bold; margin: 0 0 4px 0; text-align: center; color: #334155;">Kartenansicht</p>
            <button id="layer-street" class="layer-btn active" style="padding: 8px 12px; background: #3B82F6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s;">🗺️ Straße</button>
            <button id="layer-satellite" class="layer-btn" style="padding: 8px 12px; background: #E2E8F0; color: #334155; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s;">🛰️ Satellit</button>
            <button id="layer-topo" class="layer-btn" style="padding: 8px 12px; background: #E2E8F0; color: #334155; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s;">⛰️ Topografie</button>
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
            btn.style.background = '#E2E8F0'
            btn.style.color = '#334155'
            btn.classList.remove('active')
          })
          activeBtn.style.background = '#3B82F6'
          activeBtn.style.color = 'white'
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

    // Simple Map Screenshoter - Professionelle Screenshot-Bibliothek
    const screenshoter = new SimpleMapScreenshoter({
      hidden: true, // Verstecke den Button
      preventDownload: true, // Wir machen Download selbst
      hideElementsWithSelectors: ['.leaflet-control-container'], // Versteckt ALLE Controls
      cropImageByInnerWH: true, // Schneide leere Bereiche ab
      mimeType: 'image/png',
      domtoimageOptions: {
        // Wichtig: Verhindert Tile-Grenzen im Screenshot
        style: {
          'image-rendering': 'auto',
          '-webkit-font-smoothing': 'antialiased'
        }
      }
    }).addTo(map)
    
    // Entferne Tile-Grenzen und Marker-Rahmen vor dem Screenshot
    map.on('simpleMapScreenshoter.takeScreen', () => {
      // Entferne alle Tile-Grenzen
      const tiles = document.querySelectorAll('.leaflet-tile')
      tiles.forEach(tile => {
        tile.style.border = 'none'
        tile.style.outline = 'none'
      })
      
      // Entferne ALLE Rahmen und Boxen um Marker
      const markers = document.querySelectorAll('.leaflet-marker-icon, .leaflet-marker-icon > div, .custom-marker, .custom-marker > div')
      markers.forEach(marker => {
        marker.style.border = 'none'
        marker.style.outline = 'none'
        marker.style.boxShadow = 'none'
        marker.style.background = 'transparent'
        
        // Entferne auch alle Child-Divs die Rahmen haben könnten
        const children = marker.querySelectorAll('div')
        children.forEach(child => {
          if (child.style.border || child.style.outline || child.style.background) {
            child.style.border = 'none'
            child.style.outline = 'none'
            child.style.boxShadow = 'none'
            // Nur wenn es NICHT das Icon-Bild ist
            if (!child.querySelector('img')) {
              child.style.background = 'transparent'
            }
          }
        })
      })
    })

    // Mache Screenshoter global verfügbar
    window.mapScreenshoter = screenshoter

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
      
      // ✅ ALLE GEOMAN TOOLS AUTOMATISCH DEAKTIVIEREN!
      try {
        map.pm.disableDraw()
        map.pm.disableGlobalEditMode()
        map.pm.disableGlobalDragMode()
        map.pm.disableGlobalRemovalMode()
        map.pm.disableGlobalCutMode()
        console.log('✅ Alle Zeichen-Tools deaktiviert für Drag & Drop')
      } catch (e) {
        console.warn('⚠️ Konnte Tools nicht deaktivieren:', e)
      }
      
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
  }), [map, isLocked, onAddSymbol])

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
    >
      {/* TileLayer wird jetzt vom Layer-Switcher gesteuert */}
      
      <DrawControl />
      <ZoomControl />
      
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
