# Integration bestehender Symbole

## Vorhandene Symbole

Im Ordner `Kroki_Symbole/2x/` befinden sich bereits PNG-Symbole (Element 10@2x.png bis Element 140@2x.png).

## Integration in die App

### Option 1: PNG-Symbole direkt verwenden

1. **Symbole nach public kopieren:**
```bash
# PowerShell
Copy-Item -Path "Kroki_Symbole/2x/*" -Destination "public/assets/icons/png/" -Recurse
```

2. **Sidebar.jsx anpassen:**
```javascript
const symbols = [
  // Bestehende SVG-Symbole
  { icon: '/assets/icons/fire-truck.svg', name: 'Löschfahrzeug' },
  
  // PNG-Symbole hinzufügen
  { icon: '/assets/icons/png/Element 10@2x.png', name: 'Element 10' },
  { icon: '/assets/icons/png/Element 11@2x.png', name: 'Element 11' },
  // ... weitere Symbole
]
```

### Option 2: PNG zu SVG konvertieren (Empfohlen)

Für bessere Skalierbarkeit können PNG-Symbole zu SVG konvertiert werden:

**Online-Tools:**
- [Convertio](https://convertio.co/de/png-svg/)
- [Online-Convert](https://image.online-convert.com/de/convert-to-svg)
- [Vectorizer](https://www.vectorizer.io/)

**Lokale Tools:**
- [Inkscape](https://inkscape.org/) - Trace Bitmap Feature
- [ImageMagick](https://imagemagick.org/) - CLI Tool

### Option 3: Beide Formate parallel nutzen

Die App unterstützt beide Formate gleichzeitig:

```javascript
const symbols = [
  // SVG (vektorbasiert, skalierbar)
  { icon: '/assets/icons/fire-truck.svg', name: 'Löschfahrzeug', type: 'svg' },
  
  // PNG (pixelbasiert, hochauflösend)
  { icon: '/assets/icons/png/Element 10@2x.png', name: 'Element 10', type: 'png' },
]
```

## Automatische Integration

Erstellen Sie ein Script um alle PNG-Symbole automatisch zu registrieren:

```javascript
// src/utils/loadSymbols.js
export const loadPngSymbols = () => {
  const symbols = []
  for (let i = 10; i <= 140; i++) {
    symbols.push({
      icon: `/assets/icons/png/Element ${i}@2x.png`,
      name: `Element ${i}`,
      type: 'png'
    })
  }
  return symbols
}

// In Sidebar.jsx verwenden:
import { loadPngSymbols } from '../utils/loadSymbols'

const Sidebar = () => {
  const svgSymbols = [
    { icon: '/assets/icons/fire-truck.svg', name: 'Löschfahrzeug' },
    // ... weitere SVG-Symbole
  ]
  
  const pngSymbols = loadPngSymbols()
  const allSymbols = [...svgSymbols, ...pngSymbols]
  
  return (
    // ... Sidebar mit allSymbols
  )
}
```

## Kategorisierung

Für bessere Übersicht können Symbole kategorisiert werden:

```javascript
const symbolCategories = {
  'Fahrzeuge': [
    { icon: '/assets/icons/fire-truck.svg', name: 'Löschfahrzeug' },
    { icon: '/assets/icons/ambulance.svg', name: 'Rettungswagen' },
  ],
  'Gefahren': [
    { icon: '/assets/icons/fire.svg', name: 'Brandstelle' },
    { icon: '/assets/icons/danger.svg', name: 'Gefahrenstelle' },
  ],
  'Weitere': loadPngSymbols()
}
```

## Empfehlung

1. **Kurzfristig**: PNG-Symbole direkt verwenden (schnell)
2. **Mittelfristig**: PNG zu SVG konvertieren (bessere Qualität)
3. **Langfristig**: Eigene SVG-Symbole erstellen (volle Kontrolle)

Die aktuell implementierten SVG-Symbole sind bereits einsatzbereit und können als Vorlage dienen.
