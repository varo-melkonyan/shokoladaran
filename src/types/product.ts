export type NutritionFacts = {
  energy: string; // e.g. "550 kcal"
  fat: string; // e.g. "35g"
  carbohydrates: string; // e.g. "50g"
  protein: string; // e.g. "6g"
};

export type Product = {
  id: string;
  name: string;
  price: number;
  weight: string;
  discount?: number;
  collectionType: string;
  brand: string;
  image: string;
  link: string;
  ingredients?: string[];
  shelfLife?: string; // e.g. "12 months" or "2025-12-31"
  nutritionFacts?: NutritionFacts;
  status?: string
};