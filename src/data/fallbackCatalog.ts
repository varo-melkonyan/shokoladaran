// Repository-backed showcase catalog. It keeps all storefront sections complete
// and fast even when the external database is unavailable.
export type DemoProduct = {
  _id: string;
  name_en: string;
  name_hy: string;
  name_ru: string;
  price: number;
  weight: string;
  discount?: number;
  collectionType: string;
  brand: string;
  status: "in_stock" | "out_of_stock" | "pre_order";
  readyAfter?: string;
  images: string[];
  ingredients: string[];
  shelfLife: string;
  nutritionFacts: { energy: string; fat: string; carbohydrates: string; sugars: string; protein: string };
  stockCount: number;
  quantityType: "piece";
  description: string;
  order?: number;
};

type Localized = { en: string; hy: string; ru: string };

const brands: Localized[] = [
  { en: "Ararat Cacao", hy: "Արարատ Կակաո", ru: "Арарат Какао" },
  { en: "Yerevan Chocolatier", hy: "Երևան Շոկոլատիե", ru: "Ереван Шоколатье" },
  { en: "Apricot Gold", hy: "Ծիրանի Ոսկի", ru: "Абрикосовое Золото" },
  { en: "Noir Atelier", hy: "Նուար Ատելիե", ru: "Нуар Ателье" },
  { en: "Silk Road Sweets", hy: "Մետաքսի Ճանապարհ", ru: "Сладости Шёлкового пути" },
  { en: "Alpine Cacao", hy: "Ալպյան Կակաո", ru: "Альпийское Какао" },
  { en: "Cocoa Garden", hy: "Կակաոյի Այգի", ru: "Какао Сад" },
  { en: "Maison Truffle", hy: "Մեզոն Տրյուֆել", ru: "Мезон Трюфель" },
  { en: "Golden Bean", hy: "Ոսկե Հատիկ", ru: "Золотой Боб" },
  { en: "Berry & Cacao", hy: "Հատապտուղ և Կակաո", ru: "Ягода и Какао" },
  { en: "Little Choco", hy: "Փոքրիկ Շոկո", ru: "Литл Чоко" },
  { en: "Velvet Chocolate", hy: "Թավշյա Շոկոլադ", ru: "Бархатный Шоколад" },
];

const collections: Array<Localized & { type: string }> = [
  { en: "Milk Chocolate", hy: "Կաթնային շոկոլադ", ru: "Молочный шоколад", type: "collection" },
  { en: "Dark Chocolate", hy: "Մուգ շոկոլադ", ru: "Тёмный шоколад", type: "collection" },
  { en: "White Chocolate", hy: "Սպիտակ շոկոլադ", ru: "Белый шоколад", type: "collection" },
  { en: "Truffles", hy: "Տրյուֆելներ", ru: "Трюфели", type: "collection" },
  { en: "Pralines", hy: "Պրալինե", ru: "Пралине", type: "collection" },
  { en: "Fruit & Nut", hy: "Մրգեր և ընկույզներ", ru: "Фрукты и орехи", type: "collection" },
  { en: "Gift Boxes", hy: "Նվեր տուփեր", ru: "Подарочные наборы", type: "occasion" },
  { en: "Sugar-Free", hy: "Առանց շաքարի", ru: "Без сахара", type: "dietary" },
  { en: "Caramel", hy: "Կարամելային", ru: "Карамель", type: "collection" },
  { en: "Nut Clusters", hy: "Ընկուզային փնջեր", ru: "Ореховые кластеры", type: "collection" },
  { en: "Filled Bars", hy: "Միջուկով սալիկներ", ru: "Плитки с начинкой", type: "collection" },
  { en: "Chocolate Dragees", hy: "Շոկոլադե դրաժե", ru: "Шоколадное драже", type: "collection" },
  { en: "Vegan Chocolate", hy: "Վեգան շոկոլադ", ru: "Веганский шоколад", type: "dietary" },
  { en: "Kids Animals", hy: "Մանկական կենդանիներ", ru: "Детские зверята", type: "children" },
  { en: "Kids Lollipops", hy: "Մանկական շոկոլադե ձողիկներ", ru: "Детские шоколадные леденцы", type: "children" },
  { en: "Kids Surprise Boxes", hy: "Մանկական անակնկալ տուփեր", ru: "Детские коробки-сюрпризы", type: "children" },
  { en: "Wedding Favors", hy: "Հարսանեկան նվերներ", ru: "Свадебные комплименты", type: "occasion" },
  { en: "Seasonal Collection", hy: "Սեզոնային հավաքածու", ru: "Сезонная коллекция", type: "occasion" },
];

const flavors: Localized[] = [
  { en: "Royal Assorted", hy: "Արքայական տեսականի", ru: "Королевское ассорти" },
  { en: "Roasted Almond", hy: "Բոված նուշ", ru: "Жареный миндаль" },
  { en: "Raspberry Velvet", hy: "Ազնվամորու թավիշ", ru: "Малиновый бархат" },
  { en: "Golden Pistachio", hy: "Ոսկեգույն պիստակ", ru: "Золотая фисташка" },
  { en: "White Berry", hy: "Սպիտակ հատապտուղ", ru: "Белая ягода" },
  { en: "Armenian Apricot", hy: "Հայկական ծիրան", ru: "Армянский абрикос" },
  { en: "Sea Salt Cacao", hy: "Ծովի աղ և կակաո", ru: "Какао с морской солью" },
  { en: "Orange Blossom", hy: "Նարնջի ծաղկունք", ru: "Апельсиновый цвет" },
  { en: "Hazelnut Cream", hy: "Պնդուկի կրեմ", ru: "Ореховый крем" },
  { en: "Salted Caramel", hy: "Աղի կարամել", ru: "Солёная карамель" },
  { en: "Cherry Ganache", hy: "Բալի գանաշ", ru: "Вишнёвый ганаш" },
  { en: "Coffee Praline", hy: "Սուրճի պրալինե", ru: "Кофейное пралине" },
  { en: "Honey Walnut", hy: "Մեղր և ընկույզ", ru: "Мёд и грецкий орех" },
  { en: "Vanilla Strawberry", hy: "Վանիլ և ելակ", ru: "Ваниль и клубника" },
  { en: "Coconut Dream", hy: "Կոկոսի երազանք", ru: "Кокосовая мечта" },
  { en: "Mint Cacao", hy: "Անանուխ և կակաո", ru: "Мятное какао" },
  { en: "Blueberry Silk", hy: "Հապալասի մետաքս", ru: "Черничный шёлк" },
  { en: "Sesame Crunch", hy: "Քունջութի կրիսպ", ru: "Кунжутный хруст" },
  { en: "Peanut Caramel", hy: "Գետնանուշ և կարամել", ru: "Арахис и карамель" },
  { en: "Fig & Cacao", hy: "Թուզ և կակաո", ru: "Инжир и какао" },
  { en: "Lemon Cream", hy: "Կիտրոնի կրեմ", ru: "Лимонный крем" },
  { en: "Cinnamon Truffle", hy: "Դարչինով տրյուֆել", ru: "Трюфель с корицей" },
  { en: "Mango Passion", hy: "Մանգոյի կիրք", ru: "Манговая страсть" },
  { en: "Rose Petal", hy: "Վարդի թերթիկ", ru: "Лепесток розы" },
  { en: "Classic Cacao", hy: "Դասական կակաո", ru: "Классическое какао" },
];

const forms: Localized[] = [
  { en: "Grand Gift Box", hy: "մեծ նվեր տուփ", ru: "большая подарочная коробка" },
  { en: "Artisan Bar", hy: "արհեստագործական սալիկ", ru: "ремесленная плитка" },
  { en: "Truffle Selection", hy: "տրյուֆելների հավաքածու", ru: "коллекция трюфелей" },
  { en: "Praline Collection", hy: "պրալինեի հավաքածու", ru: "коллекция пралине" },
  { en: "Chocolate Bites", hy: "շոկոլադե պատառիկներ", ru: "шоколадные конфеты" },
  { en: "Celebration Pack", hy: "տոնական հավաքածու", ru: "праздничный набор" },
];

const ingredientSets = [
  ["Cocoa mass", "Cocoa butter", "Cane sugar"],
  ["Milk chocolate", "Roasted nuts", "Vanilla"],
  ["Dark chocolate", "Fruit puree", "Cream"],
  ["White chocolate", "Berry pieces", "Cocoa butter"],
  ["Chocolate", "Caramel", "Sea salt"],
  ["Cocoa mass", "Dried fruit", "Honey"],
];

const nutrition = { energy: "528 kcal", fat: "33 g", carbohydrates: "51 g", sugars: "39 g", protein: "7 g" };

function makeProduct(index: number): DemoProduct {
  const flavor = flavors[(index - 1) % flavors.length];
  const form = forms[Math.floor((index - 1) / flavors.length)];
  const brand = brands[(index * 5 + 2) % brands.length];
  const collection = collections[(index * 7 + 3) % collections.length];
  const price = 1800 + ((index * 347) % 9200);
  const isSpecial = index >= 66 && index <= 85;
  const discount = isSpecial || index % 7 === 0 ? Math.round((price * (0.82 + (index % 3) * 0.03)) / 50) * 50 : undefined;
  const imageNumber = String(index).padStart(3, "0");

  return {
    _id: `catalog-${imageNumber}`,
    name_en: `${flavor.en} ${form.en}`,
    name_hy: `${flavor.hy} ${form.hy}`,
    name_ru: `${flavor.ru} — ${form.ru}`,
    price,
    discount,
    weight: `${80 + ((index * 17) % 420)} g`,
    collectionType: collection.en,
    brand: brand.en,
    status: index % 31 === 0 ? "pre_order" : index % 29 === 0 ? "out_of_stock" : "in_stock",
    readyAfter: index % 31 === 0 ? "2 days" : undefined,
    images: [`/assets/uploads/catalog/product-${imageNumber}.webp`],
    ingredients: ingredientSets[(index - 1) % ingredientSets.length],
    shelfLife: index % 5 === 0 ? "6 months" : "12 months",
    nutritionFacts: nutrition,
    stockCount: index % 29 === 0 ? 0 : 8 + ((index * 11) % 58),
    quantityType: "piece",
    description: `${flavor.en} chocolate crafted by ${brand.en}. A distinctive ${form.en.toLowerCase()} made for the Shokoladaran showcase catalog.`,
    order: index,
  };
}

export const fallbackProducts: DemoProduct[] = Array.from({ length: 150 }, (_, index) => makeProduct(index + 1));

// Every storefront rail uses its own product range, avoiding repeated cards on the homepage.
// Each rail contains one image from every base photo family. Keeping the rail at
// exactly 12 also prevents a repeated family from meeting itself at the loop seam.
export const fallbackBestSellers = fallbackProducts.slice(0, 12);
export const fallbackNewsProducts = [
  ...fallbackProducts.slice(18, 24),
  ...fallbackProducts.slice(12, 18),
];
export const fallbackExclusivesProducts = [
  ...fallbackProducts.slice(34, 36),
  ...fallbackProducts.slice(24, 34),
];
export const fallbackGifts = fallbackProducts.slice(45, 65);
export const fallbackSpecials = fallbackProducts.slice(65, 85);

export const fallbackBrands = brands.map((brand, index) => ({
  _id: `brand-${String(index + 1).padStart(2, "0")}`,
  name_en: brand.en,
  name_hy: brand.hy,
  name_ru: brand.ru,
  image: `/assets/uploads/catalog/product-${String(index + 1).padStart(3, "0")}.webp`,
  description: `${brand.en} premium chocolate collection.`,
}));

export const fallbackCollectionTypes = collections.map((collection, index) => ({
  _id: `type-${String(index + 1).padStart(2, "0")}`,
  name_en: collection.en,
  name_hy: collection.hy,
  name_ru: collection.ru,
  type: collection.type,
}));
