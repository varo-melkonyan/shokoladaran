export type ExclusivesProduct ={
  _id: string;
  name: string;
  price: number;
  weight: string;
  collectionType: string;
  brand: string;
  status?: string;
  image: string;
  ingredients?: string[];
  shelfLife?: string;
  nutritionFacts?: { [key: string]: string };
  link: string;
}