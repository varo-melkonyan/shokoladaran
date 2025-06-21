export type NewsProduct = {
  _id: string;
  name: string;
  image: string;
  price: number;
  weight: string;
  discount?: number;
  collectionType: string;
  brand: string;
  status: "in_stock" | "out_of_stock";
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