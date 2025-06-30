export type NutritionFacts = {
  energy: string;
  fat: string;
  carbohydrates: string;
  protein: string;
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  weight: string;
  discount?: number;
  collectionType: string;
  brand: string;
  status: "in_stock" | "out_of_stock" | "pre_order";
  readyAfter: string | undefined;
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