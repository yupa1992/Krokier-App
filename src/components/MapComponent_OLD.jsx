import { forwardRef, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ImageOverlay } from 'react-leaflet'
import { useDrop } from 'react-dnd'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-geometryutil'
import { X, Edit2, Check, Upload } from 'lucide-react'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Leaflet Draw Control mit deutschen Texten
const DrawControl = () => {
  const map = useMap()
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    // Deutsche Übersetzungen
    L.drawLocal.draw.toolbar.actions.title = 'Zeichnen abbrechen'
    L.drawLocal.draw.toolbar.actions.text = 'Abbrechen'
    L.drawLocal.draw.toolbar.finish.title = 'Zeichnen beenden'
    L.drawLocal.draw.toolbar.finish.text = 'Fertig'
    L.drawLocal.draw.toolbar.undo.title = 'Letzten Punkt löschen'
    L.drawLocal.draw.toolbar.undo.text = 'Letzten Punkt löschen'
    L.drawLocal.draw.toolbar.buttons.polyline = 'Linie zeichnen'
    L.drawLocal.draw.toolbar.buttons.polygon = 'Polygon zeichnen'
    L.drawLocal.draw.toolbar.buttons.rectangle = 'Rechteck zeichnen'
    L.drawLocal.draw.toolbar.buttons.circle = 'Kreis zeichnen'
    L.drawLocal.draw.toolbar.buttons.marker = 'Marker setzen'
    
    L.drawLocal.draw.handlers.polyline.tooltip.start = 'Klicken Sie, um die Linie zu beginnen'
    L.drawLocal.draw.handlers.polyline.tooltip.cont = 'Klicken Sie, um die Linie fortzusetzen'
    L.drawLocal.draw.handlers.polyline.tooltip.end = 'Klicken Sie auf den letzten Punkt, um zu beenden'
    
    L.drawLocal.draw.handlers.polygon.tooltip.start = 'Klicken Sie, um das Polygon zu beginnen'
    L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Klicken Sie, um das Polygon fortzusetzen'
    L.drawLocal.draw.handlers.polygon.tooltip.end = 'Klicken Sie auf den ersten Punkt, um zu schließen'
    
    L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Klicken und ziehen Sie, um ein Rechteck zu zeichnen'
    L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'Loslassen um zu beenden'
    L.drawLocal.draw.handlers.circle.tooltip.start = 'Klicken und ziehen Sie, um einen Kreis zu zeichnen'
    L.drawLocal.draw.handlers.marker.tooltip.start = 'Klicken Sie auf die Karte, um einen Marker zu platzieren'
    
    L.drawLocal.edit.toolbar.actions.save.title = 'Änderungen speichern'
    L.drawLocal.edit.toolbar.actions.save.text = 'Speichern'
    L.drawLocal.edit.toolbar.actions.cancel.title = 'Bearbeiten abbrechen'
    L.drawLocal.edit.toolbar.actions.cancel.text = 'Abbrechen'
    L.drawLocal.edit.toolbar.actions.clearAll.title = 'Alle Ebenen löschen'
    L.drawLocal.edit.toolbar.actions.clearAll.text = 'Alle löschen'
    L.drawLocal.edit.toolbar.buttons.edit = 'Ebenen bearbeiten'
    L.drawLocal.edit.toolbar.buttons.editDisabled = 'Keine Ebenen zum Bearbeiten'
    L.drawLocal.edit.toolbar.buttons.remove = 'Ebenen löschen'
    L.drawLocal.edit.toolbar.buttons.removeDisabled = 'Keine Ebenen zum Löschen'

    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#3B82F6',
            weight: 5,
            opacity: 0.8
          },
          showLength: true,
          metric: true,
          feet: false,
          repeatMode: false
        },
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.4,
            weight: 3
          },
          showArea: true,
          metric: true,
          repeatMode: false
        },
        rectangle: {
          shapeOptions: {
            color: '#EF4444',
            fillColor: '#EF4444',
            fillOpacity: 0.4,
            weight: 3,
            clickable: true
          },
          showArea: true,
          metric: true,
          repeatMode: false
        },
        circle: {
          shapeOptions: {
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.4,
            weight: 3
          },
          showRadius: true,
          metric: true,
          repeatMode: false
        },
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        edit: {
          selectedPathOptions: {
            maintainColor: true,
            opacity: 0.8,
            dashArray: '10, 10',
            fill: true,
            fillOpacity: 0.5
          }
        },
        remove: true
      }
    })

    map.addControl(drawControl)

    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer
      drawnItems.addLayer(layer)
      
      // Popup mit Info hinzufügen
      if (e.layerType === 'polyline') {
        const length = L.GeometryUtil.length([layer.getLatLngs()])
        layer.bindPopup(`Linie: ${Math.round(length)}m`)
      } else if (e.layerType === 'polygon') {
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])
        layer.bindPopup(`Fläche: ${Math.round(area)}m²`)
      } else if (e.layerType === 'rectangle') {
        const bounds = layer.getBounds()
        const area = L.GeometryUtil.geodesicArea([
          bounds.getNorthWest(),
          bounds.getNorthEast(),
          bounds.getSouthEast(),
          bounds.getSouthWest()
        ])
        layer.bindPopup(`Rechteck: ${Math.round(area)}m²`)
      } else if (e.layerType === 'circle') {
        const radius = layer.getRadius()
        const area = Math.PI * radius * radius
        layer.bindPopup(`Kreis: Radius ${Math.round(radius)}m, Fläche ${Math.round(area)}m²`)
      }
    })
  }, [map])

  return null
}

const DraggableMarker = ({ symbol, onUpdate, onDelete, isLocked }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(symbol.label || '')
  const [symbolName, setSymbolName] = useState(symbol.name)
  const [rotation, setRotation] = useState(symbol.rotation || 0)
  const [isRotating, setIsRotating] = useState(false)
  const [iconKey, setIconKey] = useState(0)
  const [isSelected, setIsSelected] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const markerRef = useRef(null)

  // Aktualisiere Symbol-Name wenn sich das Symbol ändert
  useEffect(() => {
    setSymbolName(symbol.name)
  }, [symbol.name])

  // Aktualisiere Rotation wenn sich das Symbol ändert
  useEffect(() => {
    if (symbol.rotation !== undefined) {
      setRotation(symbol.rotation)
    }
  }, [symbol.rotation])

  // Icon neu erstellen wenn rotation oder isRotating sich ändert
  useEffect(() => {
    setIconKey(prev => prev + 1)
  }, [rotation, isRotating])

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 48px; height: 48px;">
        ${isRotating ? `
          <div class="rotation-handle" style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 14px; height: 14px; background: #8B5CF6; border: 3px solid white; border-radius: 50%; cursor: grab; box-shadow: 0 2px 6px rgba(0,0,0,0.4); z-index: 1000;"></div>
        ` : ''}
        <img src="${symbol.icon}" style="width: 48px; height: 48px; transform: rotate(${rotation}deg); transition: transform 0.1s;" />
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48]
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

  // Rotation durch Ziehen des Handles - IMMER aktiv
  useEffect(() => {
    if (!markerRef.current) return

    const marker = markerRef.current
    const markerElement = marker.getElement()
    if (!markerElement) return

    const rotationHandle = markerElement.querySelector('.rotation-handle')
    if (!rotationHandle) return

    let isDragging = false
    const markerPos = marker.getLatLng()

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

      const markerPixel = marker._map.latLngToContainerPoint(markerPos)
      const mouseX = e.clientX - marker._map.getContainer().getBoundingClientRect().left
      const mouseY = e.clientY - marker._map.getContainer().getBoundingClientRect().top

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
  }, [markerRef, rotation])

  // Berechne Toolbar Position
  useEffect(() => {
    if (isSelected && markerRef.current) {
      const marker = markerRef.current
      const map = marker._map
      if (map) {
        const markerPos = marker.getLatLng()
        const point = map.latLngToContainerPoint(markerPos)
        setToolbarPosition({ x: point.x, y: point.y - 80 })
      }
    }
  }, [isSelected, symbol.position])

  return (
    <Marker
      key={iconKey}
      position={[symbol.position.lat, symbol.position.lng]}
      icon={customIcon}
      draggable={!isLocked}
      eventHandlers={{
        dragend: handleDragEnd,
        click: () => setIsRotating(!isRotating)
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
      {!isEditing && (
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
          ) : (
            <div>
              {symbol.label && (
                <p className="text-sm text-slate-700 mb-3 font-medium bg-slate-100 px-3 py-2 rounded">{symbol.label}</p>
              )}
              <div className="space-y-2">
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
                {!isLocked && (
                  <button
                    onClick={() => setIsRotating(!isRotating)}
                    className={`w-full flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isRotating 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'text-purple-600 hover:bg-purple-50 border-2 border-purple-600'
                    }`}
                  >
                    <span>🔄</span>
                    <span>{isRotating ? 'Drehen beenden' : 'Drehen'} ({rotation}°)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Popup>
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

      // Korrigiere die Position basierend auf dem Map-Container
      const mapContainer = map.getContainer()
      const mapRect = mapContainer.getBoundingClientRect()
      
      // Berechne die relative Position innerhalb der Karte
      const x = offset.x - mapRect.left
      const y = offset.y - mapRect.top
      
      const containerPoint = map.containerPointToLatLng([x, y])
      
      onAddSymbol({
        icon: item.icon,
        name: item.name,
        position: {
          lat: containerPoint.lat,
          lng: containerPoint.lng
        }
      })
    }
  }), [isLocked, map])

  useMapEvents({
    contextmenu: (e) => {
      if (isLocked) return
      if (window.confirm('Möchten Sie an dieser Position ein Bild hochladen?')) {
        fileInputRef.current?.click()
        fileInputRef.current.dataset.lat = e.latlng.lat
        fileInputRef.current.dataset.lng = e.latlng.lng
      }
    }
  })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Bitte nur Bilddateien hochladen')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const lat = parseFloat(fileInputRef.current.dataset.lat)
      const lng = parseFloat(fileInputRef.current.dataset.lng)
      
      // Erstelle Bounds für das Bild (ca. 500m x 500m)
      const latOffset = 0.0045
      const lngOffset = 0.0045

      onAddImage({
        url: event.target.result,
        center: { lat, lng },
        bounds: {
          north: lat + latOffset,
          south: lat - latOffset,
          east: lng + lngOffset,
          west: lng - lngOffset
        },
        opacity: 0.7
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  useEffect(() => {
    const container = map.getContainer()
    drop(container)
  }, [map, drop])

  return (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
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

  // Custom Icon für User Location
  const userLocationIcon = L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="position: relative;">
        <div style="width: 20px; height: 20px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
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
      // Nur beim ersten Mal zur Position fliegen
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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
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

      {/* User Location Marker */}
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
