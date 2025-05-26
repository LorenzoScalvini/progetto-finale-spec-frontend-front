export type Coffee = {
    title: string;         // Nome del caffè
    category: string;      // Categoria (es. Arabica, Robusta, Miscela)
    origin: string;        // Paese/regione di origine
    roastLevel: string;    // Livello di tostatura (es. Chiaro, Medio, Scuro)
    flavor: string[];      // Note di sapore (es. ["Cioccolato", "Fruttato", "Nocciola"])
    acidity: number;       // Livello di acidità (1-10)
    body: number;          // Corpo/intensità (1-10)
    price: number;         // Prezzo (in euro)
    packaging: string;     // Tipo di confezione (es. "Grani", "Macinato", "Capsule")
    readonly organic: boolean;  // Certificazione biologica (proprietà read-only)
    description: string;   // Descrizione dettagliata
    imageUrl: string;      // URL dell'immagine
  };