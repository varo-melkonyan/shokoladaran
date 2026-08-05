// Last repository-backed catalog snapshot from before the MongoDB migration.
// It keeps the storefront useful if Atlas is temporarily unavailable.
export const fallbackProducts = [
  {
    _id: "MC4xMjA5MTMz",
    name_en: "New",
    name_hy: "New",
    name_ru: "New",
    price: 3223,
    weight: "32g",
    discount: 23,
    collectionType: "Milk Chocolate",
    brand: "Amorre",
    images: ["/assets/uploads/amorre_milk_chocolate_hero.png"],
    quantityType: "piece",
  },
  {
    _id: "MC41MzQ4MTI0",
    name_en: "new 21",
    name_hy: "new 21",
    name_ru: "new 21",
    price: 23,
    weight: "4",
    collectionType: "Milk Chocolate",
    brand: "Amorre",
    images: ["/assets/uploads/amorre_milk_chocolate_belgian2.png"],
    quantityType: "piece",
  },
  {
    _id: "MC43NDY0OTgy",
    name_en: "wrwr",
    name_hy: "wrwr",
    name_ru: "wrwr",
    price: 2322323,
    weight: "323g",
    collectionType: "Varung",
    brand: "Amorre",
    images: ["/assets/uploads/amorre_varung_news2.png"],
    quantityType: "piece",
  },
  {
    _id: "MC4xMTA3MTQ2",
    name_en: "awf",
    name_hy: "awf",
    name_ru: "awf",
    price: 32332,
    weight: "113g",
    discount: 3,
    collectionType: "baby",
    brand: "Amorre",
    images: ["/assets/uploads/amorre_baby_news1.png"],
    quantityType: "piece",
  },
  {
    _id: "MC43Nzk5NzE5",
    name_en: "waf",
    name_hy: "waf",
    name_ru: "waf",
    price: 2122,
    weight: "33g",
    collectionType: "Milk Chocolate",
    brand: "Amorre",
    status: "in_stock",
    images: ["/assets/uploads/amorre_milk_chocolate_a74d474a-f5c6-4fb7-b2a4-3dc24108d5d5.png"],
    ingredients: ["323"],
    shelfLife: "f22",
    nutritionFacts: { energy: "32", fat: "32", saturatedFat: "1", carbohydrates: "1", sugars: "23", protein: "34", salt: "3333" },
    quantityType: "piece",
  },
  {
    _id: "MC4yNzc2MTEx",
    name_en: "Queen",
    name_hy: "Queen",
    name_ru: "Queen",
    price: 2000,
    weight: "100g",
    collectionType: "Milk Chocolate",
    brand: "Amorre",
    status: "in_stock",
    images: ["/assets/uploads/amorre_milk_chocolate_exclusive-rose.png"],
    ingredients: ["pnduk", "ax", "max"],
    shelfLife: "6 mounts",
    nutritionFacts: { energy: "230g", fat: "4g", carbohydrates: "33g", protein: "23g" },
    quantityType: "piece",
  },
  {
    _id: "MC45MDk1MTQ0",
    name_en: "EEe",
    name_hy: "EEe",
    name_ru: "EEe",
    price: 2221,
    weight: "2323g",
    collectionType: "Varung",
    brand: "Ba3",
    status: "in_stock",
    images: ["/assets/uploads/ba3_varung_news2.png"],
    ingredients: ["34"],
    shelfLife: "43",
    nutritionFacts: { energy: "43", fat: "43", carbohydrates: "4", protein: "4" },
    quantityType: "piece",
  },
] as const;

export const fallbackBestSellers = fallbackProducts.filter((product) =>
  ["MC4yNzc2MTEx", "MC41MzQ4MTI0"].includes(product._id),
);

export const fallbackNewsProducts = fallbackProducts.filter(
  (product) => product._id === "MC4yNzc2MTEx",
);

export const fallbackExclusivesProducts = fallbackNewsProducts;

export const fallbackBrands = [
  { _id: "27457dd3-d958-4bd1-8b4b-a119e48cb1d0", name_en: "Amorre", name_hy: "Amorre", name_ru: "Amorre", image: "", description: "High-quality chocolate products.", website: "https://amorre.com" },
  { _id: "c4f8c7ce-f943-49b9-aafb-b52f65b3137c", name_en: "Ba3", name_hy: "Ba3", name_ru: "Ba3" },
];

export const fallbackCollectionTypes = [
  { _id: "8ec65a95-1add-4a1f-985d-4a5670ce8c01", name_en: "Milk Chocolate", name_hy: "Կաթնային շոկոլադ", name_ru: "Молочный шоколад", type: "collection" },
  { _id: "1e934d2a-6095-49e2-8cca-1b2c006cf463", name_en: "Varung", name_hy: "Varung", name_ru: "Varung", type: "dietary" },
  { _id: "3246c1b8-fa7b-4a5b-9b66-e0f35490608c", name_en: "baby", name_hy: "Մանկական", name_ru: "Детское", type: "children" },
];
