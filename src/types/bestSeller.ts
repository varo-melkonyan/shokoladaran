export type BestSeller = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  weight: string;
  discount?: number;
  collectionType: string;
  brand: string;
  image?: string;
  link?: string;
  ingredients?: string[];
  shelfLife?: string;
  nutritionFacts?: {
    [key: string]: string;
  };
  status?: string;
};