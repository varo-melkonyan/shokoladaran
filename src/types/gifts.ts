export type Gift = {
  _id: string;
  name_en: string;
  name_hy: string;
  name_ru: string;
  images: string[];
  price: number;
  discount?: number;
  brand?: string;
  collectionType?: string;
  link?: string;
  status?: string;
  weight?: number;
};