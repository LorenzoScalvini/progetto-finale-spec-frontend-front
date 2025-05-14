// Basic coffee type for the list view
export interface Coffee {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Detailed coffee type for individual view
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

// API response types
export interface CoffeeListResponse {
  success: boolean;
  coffees: Coffee[];
}

export interface CoffeeDetailResponse {
  success: boolean;
  coffee: CoffeeDetails;
}

// Simple price formatter
export function formatPrice(price: number): string {
  return '$' + price.toFixed(2);
}