export type BestSellerProduct ={
  _id: string;
  name: string;
  price: number;
  discount?: number;
  weight: string;
  collectionType: string;
  brand: string;
  status?: string;
  readyAfter?: string; // e.g. "2 days"
  image: string;
  ingredients?: string[];
  shelfLife?: string;
  nutritionFacts?: { [key: string]: string };
  link: string;
}