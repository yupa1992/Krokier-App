// Symbol-Mapping basierend auf Lageskizze-Signaturen
export const symbolCategories = [
  {
    category: "Rettungen",
    color: "#FFD700",
    symbols: [
      { id: 1, name: "Rettungen (Mensch/Tier)", icon: "/assets/icons/Element 1@2x.png" }
    ]
  },
  {
    category: "Feuer/Brandherd",
    color: "#DC2626",
    symbols: [
      { id: 2, name: "Feuer/Brandherd", icon: "/assets/icons/Element 2@2x.png" }
    ]
  },
  {
    category: "Unfall",
    color: "#10B981",
    symbols: [
      { id: 3, name: "Unfall (Fahrzeug, Arbeit)", icon: "/assets/icons/Element 3@2x.png" }
    ]
  },
  {
    category: "Gefährliche Stoffe",
    color: "#F59E0B",
    symbols: [
      { id: 4, name: "Gefährliche Stoffe", icon: "/assets/icons/Element 4@2x.png" }
    ]
  },
  {
    category: "Wasser",
    color: "#3B82F6",
    symbols: [
      { id: 5, name: "Wasser (Schaden, Überschwemmung)", icon: "/assets/icons/Element 5@2x.png" }
    ]
  },
  {
    category: "Rauch",
    color: "#6B7280",
    symbols: [
      { id: 6, name: "Rauch", icon: "/assets/icons/Element 6@2x.png" }
    ]
  },
  {
    category: "Entwicklung",
    color: "#EF4444",
    symbols: [
      { id: 7, name: "Horizontale Entwicklung", icon: "/assets/icons/Element 7@2x.png" },
      { id: 8, name: "Entwicklungsgrenze", icon: "/assets/icons/Element 8@2x.png" },
      { id: 9, name: "Vertikale Entwicklung", icon: "/assets/icons/Element 9@2x.png" }
    ]
  },
  {
    category: "Gebäude",
    color: "#000000",
    symbols: [
      { id: 10, name: "Umfassungswände", icon: "/assets/icons/Element 10@2x.png" },
      { id: 11, name: "Anzahl Geschosse", icon: "/assets/icons/Element 11@2x.png" },
      { id: 12, name: "Eingang mit Hausnummer", icon: "/assets/icons/Element 12@2x.png" },
      { id: 13, name: "Treppen", icon: "/assets/icons/Element 13@2x.png" }
    ]
  },
  {
    category: "Brandschutz",
    color: "#DC2626",
    symbols: [
      { id: 14, name: "Brandabschnittsbildende Wand EI 30", icon: "/assets/icons/Element 14@2x.png" },
      { id: 15, name: "Brandabschnittsbildende Wand EI 60", icon: "/assets/icons/Element 15@2x.png" },
      { id: 16, name: "Brandabschnittsbildende Wand EI 180", icon: "/assets/icons/Element 16@2x.png" },
      { id: 17, name: "Brandschutztüren z.B. EI 30", icon: "/assets/icons/Element 17@2x.png" },
      { id: 18, name: "Schieber z.B. Gas", icon: "/assets/icons/Element 18@2x.png" },
      { id: 19, name: "Elektrotableau", icon: "/assets/icons/Element 19@2x.png" },
      { id: 20, name: "Kamin", icon: "/assets/icons/Element 20@2x.png" },
      { id: 21, name: "Rauch- und Wärmeabzug", icon: "/assets/icons/Element 21@2x.png" },
      { id: 22, name: "Aufzug/Lift", icon: "/assets/icons/Element 22@2x.png" },
      { id: 23, name: "Sprinklerzentrale", icon: "/assets/icons/Element 23@2x.png" }
    ]
  },
  {
    category: "Infrastruktur",
    color: "#000000",
    symbols: [
      { id: 24, name: "Brandmeldezentrale", icon: "/assets/icons/Element 24@2x.png" },
      { id: 25, name: "Fernsignaltableau", icon: "/assets/icons/Element 25@2x.png" },
      { id: 26, name: "Schlüsseldepot", icon: "/assets/icons/Element 26@2x.png" },
      { id: 27, name: "Nordrichtung", icon: "/assets/icons/Element 27@2x.png" },
      { id: 28, name: "Windrichtung", icon: "/assets/icons/Element 28@2x.png" },
      { id: 29, name: "Massstab 1:500", icon: "/assets/icons/Element 29@2x.png" },
      { id: 30, name: "Strasse", icon: "/assets/icons/Element 30@2x.png" },
      { id: 31, name: "Anfahrt der Feuerwehr", icon: "/assets/icons/Element 31@2x.png" },
      { id: 32, name: "Brücke", icon: "/assets/icons/Element 32@2x.png" }
    ]
  },
  {
    category: "Bahnanlagen",
    color: "#000000",
    symbols: [
      { id: 33, name: "Bahnlinie mit Strassenunterführung", icon: "/assets/icons/Element 33@2x.png" },
      { id: 34, name: "Bahnlinie mit Strassenüberführung", icon: "/assets/icons/Element 34@2x.png" }
    ]
  },
  {
    category: "Leitungen",
    color: "#3B82F6",
    symbols: [
      { id: 35, name: "Leitungsdrähte mit Spannungsangabe", icon: "/assets/icons/Element 35@2x.png" }
    ]
  },
  {
    category: "Wasserversorgung",
    color: "#3B82F6",
    symbols: [
      { id: 36, name: "Reservoir", icon: "/assets/icons/Element 36@2x.png" },
      { id: 37, name: "Überflurhydrant", icon: "/assets/icons/Element 37@2x.png" },
      { id: 38, name: "Unterflurhydrant", icon: "/assets/icons/Element 38@2x.png" },
      { id: 39, name: "Innenhydrant mit Storzanschluss", icon: "/assets/icons/Element 39@2x.png" },
      { id: 40, name: "Wasserlöschposten", icon: "/assets/icons/Element 40@2x.png" },
      { id: 41, name: "Offener Wasserverlauf", icon: "/assets/icons/Element 41@2x.png" },
      { id: 42, name: "Stehendes Gewässer", icon: "/assets/icons/Element 42@2x.png" },
      { id: 43, name: "Möglicher Wasserbezugsort", icon: "/assets/icons/Element 43@2x.png" },
      { id: 44, name: "Wasserleitung Ø 150 mm", icon: "/assets/icons/Element 44@2x.png" },
      { id: 45, name: "Wasserversorgung 2.5 Bar", icon: "/assets/icons/Element 45@2x.png" }
    ]
  },
  {
    category: "Einsatzleitung",
    color: "#3B82F6",
    symbols: [
      { id: 46, name: "Einsatzleitung", icon: "/assets/icons/Element 46@2x.png" },
      { id: 47, name: "Offizier", icon: "/assets/icons/Element 47@2x.png" },
      { id: 48, name: "Absperrung / Überwachung", icon: "/assets/icons/Element 48@2x.png" },
      { id: 49, name: "Anstell-/Schiebeleiter", icon: "/assets/icons/Element 49@2x.png" },
      { id: 50, name: "Strebeleiter/Schiebeleiter mit Stützen", icon: "/assets/icons/Element 50@2x.png" },
      { id: 51, name: "Anhängeleiter", icon: "/assets/icons/Element 51@2x.png" },
      { id: 52, name: "Sprungretter/Sprungpolster", icon: "/assets/icons/Element 52@2x.png" }
    ]
  },
  {
    category: "Fahrzeuge",
    color: "#3B82F6",
    symbols: [
      { id: 53, name: "TLF Tanklöschfahrzeug", icon: "/assets/icons/Element 53@2x.png" },
      { id: 54, name: "ADL Autodrehleiter/motorisierte Leiter", icon: "/assets/icons/Element 54@2x.png" },
      { id: 55, name: "HRF Hubrettungsfahrzeug", icon: "/assets/icons/Element 55@2x.png" },
      { id: 56, name: "Funk (z.B. Kanal 1)", icon: "/assets/icons/Element 56@2x.png" },
      { id: 57, name: "Abschnitt", icon: "/assets/icons/Element 57@2x.png" }
    ]
  },
  {
    category: "Spezialeinheiten",
    color: "#3B82F6",
    symbols: [
      { id: 58, name: "MS Motorspritze", icon: "/assets/icons/Element 58@2x.png" },
      { id: 59, name: "S Sammelplatz", icon: "/assets/icons/Element 59@2x.png" },
      { id: 60, name: "M Materialdepot", icon: "/assets/icons/Element 60@2x.png" },
      { id: 61, name: "Transportleitung mit Teilstück", icon: "/assets/icons/Element 61@2x.png" },
      { id: 62, name: "Druckleitung ab Hydrant", icon: "/assets/icons/Element 62@2x.png" },
      { id: 63, name: "1. Druckleitung", icon: "/assets/icons/Element 63@2x.png" },
      { id: 64, name: "2. Druckleitung im 2. Stockwerk", icon: "/assets/icons/Element 64@2x.png" },
      { id: 65, name: "S für Schaumrohr", icon: "/assets/icons/Element 65@2x.png" },
      { id: 66, name: "W für Wasserwerfer", icon: "/assets/icons/Element 66@2x.png" },
      { id: 67, name: "H für Hydroschild", icon: "/assets/icons/Element 67@2x.png" },
      { id: 68, name: "P für Pulverpistole", icon: "/assets/icons/Element 68@2x.png" },
      { id: 69, name: "Kleinlöschgerät", icon: "/assets/icons/Element 69@2x.png" },
      { id: 70, name: "Lüfter", icon: "/assets/icons/Element 70@2x.png" },
      { id: 71, name: "Entrauchung", icon: "/assets/icons/Element 71@2x.png" }
    ]
  },
  {
    category: "Beobachtungsposten",
    color: "#DC2626",
    symbols: [
      { id: 72, name: "Beobachtungsposten Feuerwehr", icon: "/assets/icons/Element 72@2x.png" },
      { id: 73, name: "Feuerwehr", icon: "/assets/icons/Element 73@2x.png" },
      { id: 74, name: "Chemiewehr", icon: "/assets/icons/Element 74@2x.png" }
    ]
  },
  {
    category: "Organisationen",
    color: "#3B82F6",
    symbols: [
      { id: 75, name: "Informationszentrum", icon: "/assets/icons/Element 75@2x.png" },
      { id: 76, name: "Medienkontaktstelle", icon: "/assets/icons/Element 76@2x.png" },
      { id: 77, name: "Kontrollstelle", icon: "/assets/icons/Element 77@2x.png" },
      { id: 78, name: "Patientensammelstelle", icon: "/assets/icons/Element 78@2x.png" },
      { id: 79, name: "Sanitätshilfsstelle San Hist", icon: "/assets/icons/Element 79@2x.png" },
      { id: 80, name: "Unverletzte", icon: "/assets/icons/Element 80@2x.png" },
      { id: 81, name: "Totensammelstelle", icon: "/assets/icons/Element 81@2x.png" },
      { id: 82, name: "Helikopterlandeplatz", icon: "/assets/icons/Element 82@2x.png" },
      { id: 83, name: "Polizei", icon: "/assets/icons/Element 83@2x.png" },
      { id: 84, name: "Sanität", icon: "/assets/icons/Element 84@2x.png" }
    ]
  },
  {
    category: "Militär",
    color: "#3B82F6",
    symbols: [
      { id: 85, name: "Armee", icon: "/assets/icons/Element 85@2x.png" },
      { id: 86, name: "Zivilschutz", icon: "/assets/icons/Element 86@2x.png" },
      { id: 87, name: "KP Front", icon: "/assets/icons/Element 87@2x.png" },
      { id: 88, name: "KP Rückwärtiges", icon: "/assets/icons/Element 88@2x.png" },
      { id: 89, name: "x = mobil", icon: "/assets/icons/Element 89@2x.png" }
    ]
  },
  {
    category: "Gefahren",
    color: "#F59E0B",
    symbols: [
      { id: 90, name: "Achtung! (Pneulager, Schacht)", icon: "/assets/icons/Element 90@2x.png" },
      { id: 91, name: "Explosion", icon: "/assets/icons/Element 91@2x.png" },
      { id: 92, name: "Gas", icon: "/assets/icons/Element 92@2x.png" },
      { id: 93, name: "Chemikalien (Gefahrentafel)", icon: "/assets/icons/Element 93@2x.png" },
      { id: 94, name: "Radioaktive Stoffe", icon: "/assets/icons/Element 94@2x.png" },
      { id: 95, name: "Biologische Stoffe (GE HB)", icon: "/assets/icons/Element 95@2x.png" },
      { id: 96, name: "Elektrizität", icon: "/assets/icons/Element 96@2x.png" },
      { id: 97, name: "Gefahr durch Löschen mit Wasser", icon: "/assets/icons/Element 97@2x.png" }
    ]
  },
  {
    category: "Schäden",
    color: "#DC2626",
    symbols: [
      { id: 98, name: "Beschädigung", icon: "/assets/icons/Element 98@2x.png" },
      { id: 99, name: "Teilzerstörung", icon: "/assets/icons/Element 99@2x.png" },
      { id: 100, name: "Totalzerstörung", icon: "/assets/icons/Element 100@2x.png" }
    ]
  },
  {
    category: "Sonstiges",
    color: "#6B7280",
    symbols: [
      { id: 101, name: "Retten mit Leitern unmöglich", icon: "/assets/icons/Element 101@2x.png" },
      { id: 102, name: "Überschwemmung", icon: "/assets/icons/Element 102@2x.png" },
      { id: 103, name: "Rutschgebiet", icon: "/assets/icons/Element 103@2x.png" },
      { id: 104, name: "Warteraum", icon: "/assets/icons/Element 104@2x.png" },
      { id: 105, name: "Rettungsachsen (Symbole FE GE)", icon: "/assets/icons/Element 105@2x.png" }
    ]
  },
  {
    category: "Weitere Symbole",
    color: "#6B7280",
    symbols: Array.from({ length: 42 }, (_, i) => ({
      id: 106 + i,
      name: `Element ${106 + i}`,
      icon: `/assets/icons/Element ${106 + i}@2x.png`
    }))
  }
]

// Funktion zum Abrufen aller Symbole in der richtigen Reihenfolge
export function getAllSymbols() {
  const allSymbols = []
  symbolCategories.forEach(category => {
    category.symbols.forEach(symbol => {
      allSymbols.push({
        ...symbol,
        category: category.category,
        categoryColor: category.color
      })
    })
  })
  return allSymbols
}

// Funktion zum Abrufen von Symbolen nach Kategorie
export function getSymbolsByCategory(categoryName) {
  const category = symbolCategories.find(cat => cat.category === categoryName)
  return category ? category.symbols : []
}
