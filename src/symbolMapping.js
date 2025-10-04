// ✅ Offizielle Feuerwehr Lageskizze-Symbole
// Symbol-Namen 1:1 aus Dateinamen

export const symbolCategories = [
  {
    category: "Grundsymbole",
    color: "#DC2626",
    symbols: [
      { id: 1, name: "Rettungen", icon: "/assets/icons/Rettungen.png" },
      { id: 2, name: "Feuer/Brandherd", icon: "/assets/icons/Feuer-Brandherd.png" },
      { id: 3, name: "Unfall", icon: "/assets/icons/Unfall.png" },
      { id: 4, name: "Gefährliche Stoffe", icon: "/assets/icons/Gefährliche Stoffe.png" },
      { id: 5, name: "Wasser", icon: "/assets/icons/Wasser.png" },
      { id: 6, name: "Rauch", icon: "/assets/icons/Rauch.png" }
    ]
  },
  {
    category: "Entwicklung",
    color: "#EF4444",
    symbols: [
      { id: 7, name: "Horizontale Entwicklung", icon: "/assets/icons/Horizonatale-Entwicklung.png" },
      { id: 8, name: "Entwicklungsgrenze", icon: "/assets/icons/Entwicklungsgrenze.png" },
      { id: 9, name: "Vertikale Entwicklung", icon: "/assets/icons/Vertikale Entwicklung.png" },
      { id: 10, name: "Horizontale Entwicklung Chemie", icon: "/assets/icons/Horizontale Entwicklung Chemie.png" },
      { id: 11, name: "Vertikale Entwicklung Chemie", icon: "/assets/icons/Vertikale Entwicklung Chemie.png" }
    ]
  },
  {
    category: "Gebäude & Brandschutz",
    color: "#8B5CF6",
    symbols: [
      { id: 12, name: "Umfassungswände", icon: "/assets/icons/Umfassungswände.png" },
      { id: 13, name: "Anzahl Geschosse", icon: "/assets/icons/Anzahl Geschosse.png" },
      { id: 14, name: "Brandabschnittsbildende Wand", icon: "/assets/icons/Brandabschnittsbildende.png" },
      { id: 15, name: "Brandabschnittsbildende Wand EI 60", icon: "/assets/icons/Brandabschnittsbildende Wand El 60.png" },
      { id: 16, name: "Brandabschnittsbildende Wand EI 180", icon: "/assets/icons/Brandabschnittsbildende Wand El 180.png" },
      { id: 17, name: "Brandschutztüren", icon: "/assets/icons/Brandschutztüren.png" },
      { id: 18, name: "Eingang mit Hausnummer / Durchgang", icon: "/assets/icons/a- Eingang mit Hausnummer b - Durchgang.png" },
      { id: 19, name: "Treppen", icon: "/assets/icons/Treppen.png" },
      { id: 20, name: "Kamin", icon: "/assets/icons/Kamin.png" },
      { id: 21, name: "Rauch- und Wärmeabzug", icon: "/assets/icons/Rauch- und Wärmeabzug.png" },
      { id: 22, name: "Aufzug/Lift", icon: "/assets/icons/Aufzug-Lift.png" },
      { id: 23, name: "Schieber (z.B. Gas)", icon: "/assets/icons/Schieber.png" },
      { id: 24, name: "Elektrotableau", icon: "/assets/icons/Elektrotableau.png" }
    ]
  },
  {
    category: "Brandmelde- & Sprinkleranlagen",
    color: "#DC2626",
    symbols: [
      { id: 25, name: "Brandmeldezentrale", icon: "/assets/icons/Brandmeldeanlage.png" },
      { id: 26, name: "Fernsignaltableau", icon: "/assets/icons/Fernsignaltableu.png" },
      { id: 27, name: "Schlüsseldepot", icon: "/assets/icons/Schlüsseldepot.png" },
      { id: 28, name: "Sprinklerzentrale", icon: "/assets/icons/Sprinklerzentrale.png" }
    ]
  },
  {
    category: "Infrastruktur & Navigation",
    color: "#64748B",
    symbols: [
      { id: 29, name: "Nordrichtung", icon: "/assets/icons/Nordrichtung.png" },
      { id: 30, name: "Windrichtung", icon: "/assets/icons/Windrichtung.png" },
      { id: 31, name: "Maßstab", icon: "/assets/icons/Massstab.png" },
      { id: 32, name: "Straße", icon: "/assets/icons/Strasse.png" },
      { id: 33, name: "Anfahrt der Feuerwehr", icon: "/assets/icons/Anfahrt der Feuerwehr.png" },
      { id: 34, name: "Brücke", icon: "/assets/icons/Brücke.png" },
      { id: 35, name: "Bahnlinie mit Straßen-Niveauüberlagerung", icon: "/assets/icons/Bahnlinie mit Strassen-Niveauüberlagerung.png" },
      { id: 36, name: "Bahnlinie mit Straßenüberführung", icon: "/assets/icons/Bahnlinie mit Straßenüberführung.png" },
      { id: 37, name: "Bahnlinie mit Straßenunterführung", icon: "/assets/icons/Bahnlinie mit Strassenunterführung.png" }
    ]
  },
  {
    category: "Wasserversorgung",
    color: "#0EA5E9",
    symbols: [
      { id: 38, name: "Reservoir", icon: "/assets/icons/Reservoir.png" },
      { id: 39, name: "Überflurhydrant", icon: "/assets/icons/Überflurhydrant.png" },
      { id: 40, name: "Unterflurhydrant", icon: "/assets/icons/Unterflurhydrant.png" },
      { id: 41, name: "Innenhydrant mit Storzanschluss", icon: "/assets/icons/Innenhydrant mit Storzanschluss.png" },
      { id: 42, name: "Wasserlöschposten", icon: "/assets/icons/Wasserlöschposten.png" },
      { id: 43, name: "Offener Wasserverlauf", icon: "/assets/icons/Offener Wasserverlauf.png" },
      { id: 44, name: "Stehende Gewässer", icon: "/assets/icons/Stehende Gewässer.png" },
      { id: 45, name: "Möglicher Wasserbezugsort", icon: "/assets/icons/Möglicher Wasserbezugsort.png" },
      { id: 46, name: "Wasserleitung Ø 150mm", icon: "/assets/icons/Wasserleitung Leitungsdurchmesser 150mm.png" },
      { id: 47, name: "Leitungsdrähte mit Spannungsabgabe", icon: "/assets/icons/Leitungsdrähte mit Spannungsabgabe.png" }
    ]
  },
  {
    category: "Fahrzeuge",
    color: "#F97316",
    symbols: [
      { id: 48, name: "HRF - Hubrettungsfahrzeug", icon: "/assets/icons/HRF (Hubrettungsfahrzeug).png" }
    ]
  },
  {
    category: "Einsatzkräfte & Organisationen",
    color: "#3B82F6",
    symbols: [
      { id: 49, name: "Beobachtungsposten Feuerwehr", icon: "/assets/icons/Beobachtungsposten.png" }
    ]
  },
  {
    category: "Schäden",
    color: "#DC2626",
    symbols: [
      { id: 50, name: "Beschädigung", icon: "/assets/icons/Beschädigung.png" }
    ]
  }
]

// Hilfsfunktion: Alle Symbole als flache Liste
export const getAllSymbols = () => {
  return symbolCategories.flatMap(category => 
    category.symbols.map(symbol => ({
      ...symbol,
      category: category.category,
      visible: true
    }))
  )
}

// Hilfsfunktion: Symbol nach ID finden
export const getSymbolById = (id) => {
  const allSymbols = getAllSymbols()
  return allSymbols.find(symbol => symbol.id === id)
}

// Hilfsfunktion: Symbol nach Namen finden
export const getSymbolByName = (name) => {
  const allSymbols = getAllSymbols()
  return allSymbols.find(symbol => symbol.name === name)
}

// Hilfsfunktion: Symbole nach Kategorie filtern
export const getSymbolsByCategory = (categoryName) => {
  const category = symbolCategories.find(cat => cat.category === categoryName)
  return category ? category.symbols : []
}
