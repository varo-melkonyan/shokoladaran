export type NutritionFacts = {
  energy: string; // e.g. "550 kcal"
  fat: string; // e.g. "35g"
  carbohydrates: string; // e.g. "50g"
  protein: string; // e.g. "6g"
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  weight: string;
  discount?: number;
  collectionType: string;
  brand: string;
  status: "in_stock" | "out_of_stock";
  image?: string;
  ingredients?: string[];
  shelfLife?: string;
  nutritionFacts?: {
    energy?: string;
    fat?: string;
    carbohydrates?: string;
    protein?: string;
  };
  link?: string;
};