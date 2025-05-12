// Tipo base per il coffee mostrato nella lista
export interface Coffee {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo esteso per i dettagli del coffee
export interface CoffeeDetails extends Coffee {
  origin: string;
  roastLevel: string;
  flavor: string[];
  acidity: number;
  body: number;
  price: number;
  packaging: string;
  organic: boolean;
  description: string;
  imageUrl: string;
}

// Tipo per la risposta dall'API
export interface CoffeeDetailResponse {
  success: boolean;
  coffee: CoffeeDetails;
}