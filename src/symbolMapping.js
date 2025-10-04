// ✅ Offizielle Lageskizze Symbol-Namen (basierend auf Screenshots)
export const symbolCategories = [
  {
    category: "Rettungen",
    color: "#FFD700",
    symbols: [
      { id: 1, name: "R - Rettungen (Mensch/Tier)", icon: "/assets/icons/Element 1@2x.png" }
    ]
  },
  {
    category: "Feuer/Brandherd",
    color: "#DC2626",
    symbols: [
      { id: 2, name: "F - Feuer/Brandherd", icon: "/assets/icons/Element 2@2x.png" }
    ]
  },
  {
    category: "Unfall",
    color: "#10B981",
    symbols: [
      { id: 3, name: "U - Unfall (Fahrzeugunfall, Arbeitsunfall)", icon: "/assets/icons/Element 3@2x.png" }
    ]
  },
  {
    category: "Gefährliche Stoffe",
    color: "#F59E0B",
    symbols: [
      { id: 4, name: "C - Gefährliche Stoffe", icon: "/assets/icons/Element 4@2x.png" },
      { id: 94, name: "⚠️ Achtung! (Pneulager, Schacht)", icon: "/assets/icons/Element 94@2x.png" },
      { id: 95, name: "⚠️ Ex - Explosion", icon: "/assets/icons/Element 95@2x.png" },
      { id: 96, name: "⚠️ G - Gas", icon: "/assets/icons/Element 96@2x.png" },
      { id: 97, name: "⚠️ C - Chemikalien", icon: "/assets/icons/Element 97@2x.png" },
      { id: 98, name: "☢️ Radioaktive Stoffe", icon: "/assets/icons/Element 98@2x.png" },
      { id: 99, name: "🦠 Biologische Stoffe (GE HB)", icon: "/assets/icons/Element 99@2x.png" },
      { id: 100, name: "⚡ Elektrizität", icon: "/assets/icons/Element 100@2x.png" },
      { id: 101, name: "W~ Gefahr durch Löschen mit Wasser", icon: "/assets/icons/Element 101@2x.png" }
    ]
  },
  {
    category: "Wasser",
    color: "#3B82F6",
    symbols: [
      { id: 5, name: "W - Wasser (Wasserschaden, Überschwemmung)", icon: "/assets/icons/Element 5@2x.png" },
      { id: 86, name: "Überschwemmung", icon: "/assets/icons/Element 86@2x.png" }
    ]
  },
  {
    category: "Rauch",
    color: "#6B7280",
    symbols: [
      { id: 6, name: "Rauch", icon: "/assets/icons/Element 6@2x.png" },
      { id: 21, name: "Rauch- und Wärmeabzug", icon: "/assets/icons/Element 21@2x.png" },
      { id: 71, name: "Entrauchung", icon: "/assets/icons/Element 71@2x.png" }
    ]
  },
  {
    category: "Entwicklung",
    color: "#EF4444",
    symbols: [
      { id: 7, name: "→ Horizontale Entwicklung", icon: "/assets/icons/Element 7@2x.png" },
      { id: 8, name: "⌐ Entwicklungsgrenze", icon: "/assets/icons/Element 8@2x.png" },
      { id: 9, name: "↕ Vertikale Entwicklung", icon: "/assets/icons/Element 9@2x.png" }
    ]
  },
  {
    category: "Gebäude",
    color: "#8B5CF6",
    symbols: [
      { id: 10, name: "Umfassungswände", icon: "/assets/icons/Element 10@2x.png" },
      { id: 11, name: "-1/+3 Anzahl Geschosse", icon: "/assets/icons/Element 11@2x.png" },
      { id: 12, name: "Brandabschnittsbildende Wand EI 30", icon: "/assets/icons/Element 12@2x.png" },
      { id: 13, name: "Brandabschnittsbildende Wand EI 60", icon: "/assets/icons/Element 13@2x.png" },
      { id: 14, name: "Brandabschnittsbildende Wand EI 180", icon: "/assets/icons/Element 14@2x.png" },
      { id: 15, name: "Brandschutztüren (z.B. EI 30)", icon: "/assets/icons/Element 15@2x.png" },
      { id: 16, name: "a/b Eingang mit Hausnummer / Durchgang", icon: "/assets/icons/Element 16@2x.png" },
      { id: 17, name: "Treppen", icon: "/assets/icons/Element 17@2x.png" },
      { id: 20, name: "Kamin", icon: "/assets/icons/Element 20@2x.png" },
      { id: 22, name: "Aufzug / Lift", icon: "/assets/icons/Element 22@2x.png" },
      { id: 32, name: "Brücke", icon: "/assets/icons/Element 32@2x.png" }
    ]
  },
  {
    category: "Brandschutz",
    color: "#DC2626",
    symbols: [
      { id: 18, name: "Schieber (z.B. Gas)", icon: "/assets/icons/Element 18@2x.png" },
      { id: 19, name: "Elektrotableau", icon: "/assets/icons/Element 19@2x.png" },
      { id: 23, name: "Sprinklerzentrale", icon: "/assets/icons/Element 23@2x.png" },
      { id: 24, name: "Brandmeldezentrale", icon: "/assets/icons/Element 24@2x.png" },
      { id: 25, name: "Fernsignaltableau (Brandmelde-/Sprinkleranlage)", icon: "/assets/icons/Element 25@2x.png" },
      { id: 26, name: "🔑 Schlüsseldepot", icon: "/assets/icons/Element 26@2x.png" }
    ]
  },
  {
    category: "Infrastruktur",
    color: "#64748B",
    symbols: [
      { id: 27, name: "↑ Nordrichtung", icon: "/assets/icons/Element 27@2x.png" },
      { id: 28, name: "↗ Windrichtung", icon: "/assets/icons/Element 28@2x.png" },
      { id: 29, name: "1:500 Maßstab", icon: "/assets/icons/Element 29@2x.png" },
      { id: 30, name: "Straße", icon: "/assets/icons/Element 30@2x.png" },
      { id: 31, name: "FEU → Anfahrt der Feuerwehr", icon: "/assets/icons/Element 31@2x.png" },
      { id: 33, name: "Bahnlinie mit Straßen - Niveauübergang", icon: "/assets/icons/Element 33@2x.png" },
      { id: 34, name: "Bahnlinie mit Straßenüberführung", icon: "/assets/icons/Element 34@2x.png" },
      { id: 35, name: "Bahnlinie mit Straßenunterführung", icon: "/assets/icons/Element 35@2x.png" },
      { id: 87, name: "Rutschgebiet", icon: "/assets/icons/Element 87@2x.png" }
    ]
  },
  {
    category: "Wasserversorgung",
    color: "#0EA5E9",
    symbols: [
      { id: 36, name: "● Reservoir", icon: "/assets/icons/Element 36@2x.png" },
      { id: 37, name: "⊙ Überflurhydrant", icon: "/assets/icons/Element 37@2x.png" },
      { id: 38, name: "○ Unterflurhydrant", icon: "/assets/icons/Element 38@2x.png" },
      { id: 39, name: "◐ Innenhydrant mit Storzanschluss (55/75)", icon: "/assets/icons/Element 39@2x.png" },
      { id: 40, name: "Wasserlöschposten", icon: "/assets/icons/Element 40@2x.png" },
      { id: 41, name: "Offener Wasserverlauf (Bach, Fluss)", icon: "/assets/icons/Element 41@2x.png" },
      { id: 42, name: "Stehendes Gewässer (See, Weiher)", icon: "/assets/icons/Element 42@2x.png" },
      { id: 43, name: "Möglicher Wasserbezugsort", icon: "/assets/icons/Element 43@2x.png" },
      { id: 44, name: "Wasserleitung Ø 150 mm", icon: "/assets/icons/Element 44@2x.png" },
      { id: 45, name: "Wasserversorgung (7.5 Bar, 900 l/Min, 6.0 Bar)", icon: "/assets/icons/Element 45@2x.png" }
    ]
  },
  {
    category: "Einsatzleitung",
    color: "#3B82F6",
    symbols: [
      { id: 46, name: "EL Einsatzleiter", icon: "/assets/icons/Element 46@2x.png" },
      { id: 47, name: "EL Einsatzleitung", icon: "/assets/icons/Element 47@2x.png" },
      { id: 48, name: "O Offizier", icon: "/assets/icons/Element 48@2x.png" },
      { id: 49, name: "Absperrung (▽ = Überwachung)", icon: "/assets/icons/Element 49@2x.png" },
      { id: 50, name: "Anstell- / Schiebeleiter", icon: "/assets/icons/Element 50@2x.png" },
      { id: 51, name: "Strebenleiter / Schiebeleiter mit Stützen", icon: "/assets/icons/Element 51@2x.png" },
      { id: 52, name: "Anhängeleiter", icon: "/assets/icons/Element 52@2x.png" },
      { id: 53, name: "Sprungretter / Sprungpolster", icon: "/assets/icons/Element 53@2x.png" }
    ]
  },
  {
    category: "Fahrzeuge",
    color: "#F97316",
    symbols: [
      { id: 54, name: "TLF - Tanklöschfahrzeug", icon: "/assets/icons/Element 54@2x.png" },
      { id: 55, name: "ADL - Autodrehleiter/motorisierte Leiter", icon: "/assets/icons/Element 55@2x.png" },
      { id: 56, name: "HRF - Hubrettungsfahrzeug", icon: "/assets/icons/Element 56@2x.png" },
      { id: 57, name: "📻 Funk (z.B. Kanal 1)", icon: "/assets/icons/Element 57@2x.png" },
      { id: 58, name: "Abschnitt", icon: "/assets/icons/Element 58@2x.png" },
      { id: 59, name: "MS - Motorspritze", icon: "/assets/icons/Element 59@2x.png" }
    ]
  },
  {
    category: "Einsatzkräfte",
    color: "#8B5CF6",
    symbols: [
      { id: 60, name: "S - Sammelplatz", icon: "/assets/icons/Element 60@2x.png" },
      { id: 61, name: "M - Materialdepot", icon: "/assets/icons/Element 61@2x.png" },
      { id: 62, name: "Transportleitung mit Teilstück", icon: "/assets/icons/Element 62@2x.png" },
      { id: 63, name: "Druckleitung ab Hydrant", icon: "/assets/icons/Element 63@2x.png" },
      { id: 64, name: "1. Druckleitung im 2. Stockwerk", icon: "/assets/icons/Element 64@2x.png" },
      { id: 65, name: "S - für Schaumrohr", icon: "/assets/icons/Element 65@2x.png" },
      { id: 66, name: "W - für Wasserwerfer", icon: "/assets/icons/Element 66@2x.png" },
      { id: 67, name: "H - für Hydroschild", icon: "/assets/icons/Element 67@2x.png" },
      { id: 68, name: "P - für Pulverpistole", icon: "/assets/icons/Element 68@2x.png" },
      { id: 69, name: "Kleinlöschgerät", icon: "/assets/icons/Element 69@2x.png" },
      { id: 70, name: "Lüfter", icon: "/assets/icons/Element 70@2x.png" }
    ]
  },
  {
    category: "Organisationen",
    color: "#06B6D4",
    symbols: [
      { id: 72, name: "FW - Beobachtungsposten Feuerwehr", icon: "/assets/icons/Element 72@2x.png" },
      { id: 73, name: "FW - Feuerwehr", icon: "/assets/icons/Element 73@2x.png" },
      { id: 74, name: "CW - Chemiewehr", icon: "/assets/icons/Element 74@2x.png" },
      { id: 82, name: "P - Polizei", icon: "/assets/icons/Element 82@2x.png" },
      { id: 83, name: "SAN - Sanität", icon: "/assets/icons/Element 83@2x.png" },
      { id: 89, name: "A - Armee", icon: "/assets/icons/Element 89@2x.png" },
      { id: 90, name: "ZS - Zivilschutz", icon: "/assets/icons/Element 90@2x.png" },
      { id: 91, name: "F - KP Front", icon: "/assets/icons/Element 91@2x.png" },
      { id: 92, name: "R - KP Rückwärtiges", icon: "/assets/icons/Element 92@2x.png" },
      { id: 93, name: "x = mobil", icon: "/assets/icons/Element 93@2x.png" }
    ]
  },
  {
    category: "Stellen & Zentren",
    color: "#10B981",
    symbols: [
      { id: 75, name: "◇i - Informationszentrum", icon: "/assets/icons/Element 75@2x.png" },
      { id: 76, name: "▭I - Medienkontaktstelle", icon: "/assets/icons/Element 76@2x.png" },
      { id: 77, name: "⦿ Kontrollstelle", icon: "/assets/icons/Element 77@2x.png" },
      { id: 78, name: "⊞ Patientensammelstelle", icon: "/assets/icons/Element 78@2x.png" },
      { id: 79, name: "⊞+ Sanitätshilfsstelle (San Hist)", icon: "/assets/icons/Element 79@2x.png" },
      { id: 80, name: "≡ Unverletzte", icon: "/assets/icons/Element 80@2x.png" },
      { id: 81, name: "✟ Totensammelstelle", icon: "/assets/icons/Element 81@2x.png" },
      { id: 82, name: "∞ Helikopterlandeplatz", icon: "/assets/icons/Element 82@2x.png" },
      { id: 88, name: "W - Warteraum", icon: "/assets/icons/Element 88@2x.png" }
    ]
  },
  {
    category: "Schäden",
    color: "#DC2626",
    symbols: [
      { id: 84, name: "⚠️ Retten mit Leitern unmöglich", icon: "/assets/icons/Element 84@2x.png" },
      { id: 85, name: "🔴 Überschwemmung", icon: "/assets/icons/Element 85@2x.png" },
      { id: 102, name: "✗ Beschädigung", icon: "/assets/icons/Element 102@2x.png" },
      { id: 103, name: "✗✗ Teilzerstörung", icon: "/assets/icons/Element 103@2x.png" },
      { id: 104, name: "✗✗✗ Totalzerstörung", icon: "/assets/icons/Element 104@2x.png" }
    ]
  },
  {
    category: "Rettungsachsen",
    color: "#3B82F6",
    symbols: [
      { id: 105, name: "≋ Rettungsachsen (Symbole FE GE)", icon: "/assets/icons/Element 105@2x.png" }
    ]
  },
  {
    category: "Sonstiges",
    color: "#6B7280",
    symbols: []
  }
]

// Fülle restliche Symbole (106-147) in "Sonstiges"
for (let i = 106; i <= 147; i++) {
  const sonstigesCategory = symbolCategories.find(cat => cat.category === "Sonstiges")
  if (sonstigesCategory) {
    sonstigesCategory.symbols.push({
      id: i,
      name: `Element ${i}`,
      icon: `/assets/icons/Element ${i}@2x.png`
    })
  }
}

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

// Hilfsfunktion: Symbole nach Kategorie filtern
export const getSymbolsByCategory = (categoryName) => {
  const category = symbolCategories.find(cat => cat.category === categoryName)
  return category ? category.symbols : []
}
