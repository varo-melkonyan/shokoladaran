// A polished repository-backed demo catalog. It also keeps the storefront useful
// whenever the external database is temporarily unavailable.
const images = {
  gift: "/assets/uploads/demo/assorted-gift-box.webp",
  dark: "/assets/uploads/demo/dark-almond-bar.webp",
  raspberry: "/assets/uploads/demo/raspberry-truffles.webp",
  pistachio: "/assets/uploads/demo/pistachio-pralines.webp",
  white: "/assets/uploads/demo/white-berry-chocolate.webp",
  apricot: "/assets/uploads/demo/apricot-orange-chocolate.webp",
};

type DemoProduct = {
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
};

const nutrition = { energy: "535 kcal", fat: "34 g", carbohydrates: "49 g", sugars: "38 g", protein: "7 g" };

function product(data: Omit<DemoProduct, "quantityType" | "nutritionFacts" | "shelfLife"> & Partial<Pick<DemoProduct, "nutritionFacts" | "shelfLife">>): DemoProduct {
  return { quantityType: "piece", shelfLife: "12 months", nutritionFacts: nutrition, ...data };
}

export const fallbackProducts: DemoProduct[] = [
  product({ _id: "demo-001", name_en: "Royal Assorted Collection", name_hy: "Արքայական տեսականի", name_ru: "Королевское ассорти", price: 12900, discount: 10900, weight: "420 g", collectionType: "Gift Boxes", brand: "Ararat Cacao", status: "in_stock", images: [images.gift], ingredients: ["Cocoa mass", "Cocoa butter", "Pistachio", "Raspberry", "Hazelnut"], stockCount: 18, description: "A celebratory selection of handcrafted pralines and truffles in an elegant gift box." }),
  product({ _id: "demo-002", name_en: "Yerevan Evening Box", name_hy: "Երևանյան երեկո", name_ru: "Ереванский вечер", price: 9800, weight: "320 g", collectionType: "Gift Boxes", brand: "Yerevan Chocolatier", status: "in_stock", images: [images.gift], ingredients: ["Milk chocolate", "Dark chocolate", "Caramel", "Almond"], stockCount: 24, description: "An elegant assortment inspired by warm Yerevan evenings." }),
  product({ _id: "demo-003", name_en: "Silk Road Grand Selection", name_hy: "Մետաքսի ճանապարհ մեծ տեսականի", name_ru: "Большая коллекция Шёлкового пути", price: 15800, discount: 13900, weight: "560 g", collectionType: "Gift Boxes", brand: "Silk Road Sweets", status: "pre_order", readyAfter: "2 days", images: [images.gift], ingredients: ["Chocolate", "Nuts", "Dried fruit", "Spices"], stockCount: 0, description: "A generous premium box created for memorable gifts and celebrations." }),
  product({ _id: "demo-004", name_en: "Noir 72% Almond & Sea Salt", name_hy: "Նուար 72% նուշ և ծովի աղ", name_ru: "Нуар 72% миндаль и морская соль", price: 2900, discount: 2450, weight: "100 g", collectionType: "Dark Chocolate", brand: "Noir Atelier", status: "in_stock", images: [images.dark], ingredients: ["Cocoa mass 72%", "Almond", "Cocoa butter", "Sea salt"], stockCount: 41, description: "Deep dark chocolate balanced with roasted almonds and delicate sea salt." }),
  product({ _id: "demo-005", name_en: "Cacao Nib Crunch 80%", name_hy: "Կակաոյի հատիկներ 80%", name_ru: "Какао-крупка 80%", price: 3200, weight: "90 g", collectionType: "Dark Chocolate", brand: "Ararat Cacao", status: "in_stock", images: [images.dark], ingredients: ["Cocoa mass 80%", "Cocoa nibs", "Cane sugar"], stockCount: 32, description: "Intense single-origin chocolate with a clean cacao crunch." }),
  product({ _id: "demo-006", name_en: "Midnight Sugar-Free Bar", name_hy: "Կեսգիշեր առանց շաքարի", name_ru: "Полночь без сахара", price: 3400, weight: "90 g", collectionType: "Sugar-Free", brand: "Noir Atelier", status: "in_stock", images: [images.dark], ingredients: ["Cocoa mass", "Cocoa butter", "Erythritol", "Almond"], stockCount: 27, description: "Full-bodied dark chocolate sweetened without added sugar." }),
  product({ _id: "demo-007", name_en: "Alpine Hazelnut Milk Bar", name_hy: "Ալպյան պնդուկով կաթնային շոկոլադ", name_ru: "Альпийский молочный шоколад с фундуком", price: 2600, weight: "110 g", collectionType: "Milk Chocolate", brand: "Alpine Cacao", status: "in_stock", images: [images.dark], ingredients: ["Milk chocolate", "Whole hazelnuts", "Cocoa butter"], stockCount: 38, description: "Creamy milk chocolate packed with gently roasted hazelnuts." }),
  product({ _id: "demo-008", name_en: "Caramel Almond Tablet", name_hy: "Կարամել և նուշ սալիկ", name_ru: "Плитка с карамелью и миндалём", price: 2800, weight: "120 g", collectionType: "Milk Chocolate", brand: "Yerevan Chocolatier", status: "in_stock", images: [images.dark], ingredients: ["Milk chocolate", "Almond", "Caramel", "Sea salt"], stockCount: 29, description: "Smooth milk chocolate with caramelized almond pieces." }),
  product({ _id: "demo-009", name_en: "Raspberry Velvet Truffles", name_hy: "Ազնվամորու թավշյա տրյուֆելներ", name_ru: "Малиновые бархатные трюфели", price: 5900, discount: 5200, weight: "180 g", collectionType: "Truffles", brand: "Yerevan Chocolatier", status: "in_stock", images: [images.raspberry], ingredients: ["Dark chocolate", "Raspberry puree", "Cream", "Cocoa butter"], stockCount: 22, shelfLife: "6 months", description: "Silky ganache truffles with a bright, naturally tart raspberry center." }),
  product({ _id: "demo-010", name_en: "Ruby Berry Bonbons", name_hy: "Ռուբինե հատապտղային բոնբոններ", name_ru: "Рубиновые ягодные конфеты", price: 6400, weight: "200 g", collectionType: "Pralines", brand: "Apricot Gold", status: "in_stock", images: [images.raspberry], ingredients: ["Ruby chocolate", "Raspberry", "Strawberry", "Cocoa butter"], stockCount: 16, description: "Colorful berry bonbons with delicate fruit layers." }),
  product({ _id: "demo-011", name_en: "Dark Raspberry Hearts", name_hy: "Մուգ ազնվամորու սրտիկներ", name_ru: "Тёмные малиновые сердца", price: 4800, weight: "150 g", collectionType: "Fruit & Nut", brand: "Silk Road Sweets", status: "in_stock", images: [images.raspberry], ingredients: ["Dark chocolate", "Raspberry", "Honey"], stockCount: 35, description: "Dark chocolate hearts with a vivid raspberry preserve filling." }),
  product({ _id: "demo-012", name_en: "Berry Truffle Mini Box", name_hy: "Հատապտղային տրյուֆելների փոքր տուփ", name_ru: "Малая коробка ягодных трюфелей", price: 3900, weight: "120 g", collectionType: "Truffles", brand: "Ararat Cacao", status: "out_of_stock", images: [images.raspberry], ingredients: ["Milk chocolate", "Raspberry", "Cream"], stockCount: 0, description: "A compact box of soft berry truffles, ideal for a small surprise." }),
  product({ _id: "demo-013", name_en: "Golden Pistachio Pralines", name_hy: "Ոսկեգույն պիստակով պրալինե", name_ru: "Золотое фисташковое пралине", price: 7200, discount: 6500, weight: "220 g", collectionType: "Pralines", brand: "Apricot Gold", status: "in_stock", images: [images.pistachio], ingredients: ["Milk chocolate", "Pistachio 28%", "Cocoa butter"], stockCount: 19, description: "Luxurious pralines with a rich roasted pistachio center." }),
  product({ _id: "demo-014", name_en: "Pistachio Cream Truffles", name_hy: "Պիստակի կրեմով տրյուֆելներ", name_ru: "Трюфели с фисташковым кремом", price: 6800, weight: "200 g", collectionType: "Truffles", brand: "Silk Road Sweets", status: "in_stock", images: [images.pistachio], ingredients: ["Chocolate", "Pistachio cream", "Cream", "Vanilla"], stockCount: 21, description: "Tender truffles with a smooth pistachio cream heart." }),
  product({ _id: "demo-015", name_en: "Pistachio Jewel Box", name_hy: "Պիստակի զարդատուփ", name_ru: "Фисташковая шкатулка", price: 8900, weight: "300 g", collectionType: "Gift Boxes", brand: "Ararat Cacao", status: "pre_order", readyAfter: "1 day", images: [images.pistachio], ingredients: ["Dark chocolate", "Milk chocolate", "Pistachio"], stockCount: 0, description: "A jewel-like collection for true pistachio lovers." }),
  product({ _id: "demo-016", name_en: "Pistachio Milk Bar", name_hy: "Պիստակով կաթնային սալիկ", name_ru: "Молочная плитка с фисташкой", price: 3100, weight: "100 g", collectionType: "Milk Chocolate", brand: "Alpine Cacao", status: "in_stock", images: [images.pistachio], ingredients: ["Milk chocolate", "Pistachio", "Cocoa butter"], stockCount: 44, description: "Creamy milk chocolate generously filled with pistachios." }),
  product({ _id: "demo-017", name_en: "White Berry Blossom", name_hy: "Սպիտակ հատապտղային ծաղկունք", name_ru: "Белое ягодное цветение", price: 3300, discount: 2950, weight: "100 g", collectionType: "White Chocolate", brand: "Alpine Cacao", status: "in_stock", images: [images.white], ingredients: ["White chocolate", "Freeze-dried strawberry", "Raspberry"], stockCount: 39, description: "Creamy white chocolate scattered with crisp red berries." }),
  product({ _id: "demo-018", name_en: "Strawberry Cloud Bonbons", name_hy: "Ելակի ամպիկ բոնբոններ", name_ru: "Конфеты Клубничное облако", price: 5700, weight: "180 g", collectionType: "Pralines", brand: "Yerevan Chocolatier", status: "in_stock", images: [images.white], ingredients: ["White chocolate", "Strawberry", "Vanilla cream"], stockCount: 25, description: "Light strawberry-and-vanilla bonbons in a delicate white shell." }),
  product({ _id: "demo-019", name_en: "Vanilla Raspberry Tablet", name_hy: "Վանիլ և ազնվամորի սալիկ", name_ru: "Плитка с ванилью и малиной", price: 3000, weight: "100 g", collectionType: "White Chocolate", brand: "Apricot Gold", status: "in_stock", images: [images.white], ingredients: ["White chocolate", "Raspberry", "Madagascar vanilla"], stockCount: 31, description: "Fragrant vanilla white chocolate lifted by tart raspberry." }),
  product({ _id: "demo-020", name_en: "Berry Celebration Box", name_hy: "Հատապտղային տոնական տուփ", name_ru: "Праздничная ягодная коробка", price: 7600, weight: "260 g", collectionType: "Gift Boxes", brand: "Alpine Cacao", status: "in_stock", images: [images.white], ingredients: ["White chocolate", "Milk chocolate", "Mixed berries"], stockCount: 14, description: "A festive selection of white and milk chocolate berry treats." }),
  product({ _id: "demo-021", name_en: "Armenian Apricot Medallions", name_hy: "Հայկական ծիրանի մեդալիոններ", name_ru: "Армянские абрикосовые медальоны", price: 5200, discount: 4600, weight: "190 g", collectionType: "Fruit & Nut", brand: "Apricot Gold", status: "in_stock", images: [images.apricot], ingredients: ["Dark chocolate", "Armenian apricot", "Orange zest"], stockCount: 28, description: "Sun-dried Armenian apricots paired with refined dark chocolate." }),
  product({ _id: "demo-022", name_en: "Orange Cacao Discs", name_hy: "Նարնջով կակաոյի սկավառակներ", name_ru: "Шоколадные диски с апельсином", price: 4700, weight: "170 g", collectionType: "Dark Chocolate", brand: "Noir Atelier", status: "in_stock", images: [images.apricot], ingredients: ["Dark chocolate 70%", "Candied orange", "Cocoa butter"], stockCount: 33, description: "Slim dark chocolate discs with bright candied orange." }),
  product({ _id: "demo-023", name_en: "Apricot & Almond Bites", name_hy: "Ծիրանով և նուշով պատառիկներ", name_ru: "Конфеты с абрикосом и миндалём", price: 4900, weight: "180 g", collectionType: "Fruit & Nut", brand: "Silk Road Sweets", status: "in_stock", images: [images.apricot], ingredients: ["Milk chocolate", "Apricot", "Almond", "Honey"], stockCount: 36, description: "Soft apricot and roasted almond bites coated in chocolate." }),
  product({ _id: "demo-024", name_en: "Sunset Fruit Gift Box", name_hy: "Մայրամուտ մրգային նվեր", name_ru: "Фруктовый подарок Закат", price: 8400, weight: "300 g", collectionType: "Gift Boxes", brand: "Apricot Gold", status: "in_stock", images: [images.apricot], ingredients: ["Dark chocolate", "Apricot", "Orange", "Almond"], stockCount: 17, description: "A warm-toned gift collection of chocolate, apricot and orange." }),
];

export const fallbackBestSellers = fallbackProducts.filter((p) => ["demo-001", "demo-004", "demo-009", "demo-013", "demo-017", "demo-021"].includes(p._id));
export const fallbackNewsProducts = fallbackProducts.filter((p) => ["demo-003", "demo-010", "demo-015", "demo-018", "demo-020", "demo-024"].includes(p._id));
export const fallbackExclusivesProducts = fallbackProducts.filter((p) => ["demo-001", "demo-005", "demo-013", "demo-019", "demo-021"].includes(p._id));

export const fallbackBrands = [
  { _id: "brand-ararat", name_en: "Ararat Cacao", name_hy: "Արարատ Կակաո", name_ru: "Арарат Какао", image: images.gift, description: "Armenian-inspired artisan chocolate and refined gifts." },
  { _id: "brand-yerevan", name_en: "Yerevan Chocolatier", name_hy: "Երևան Շոկոլատիե", name_ru: "Ереван Шоколатье", image: images.raspberry, description: "Modern bonbons and city-inspired chocolate collections." },
  { _id: "brand-apricot", name_en: "Apricot Gold", name_hy: "Ծիրանի Ոսկի", name_ru: "Абрикосовое Золото", image: images.apricot, description: "Chocolate paired with Armenia's finest fruits and nuts." },
  { _id: "brand-noir", name_en: "Noir Atelier", name_hy: "Նուար Ատելիե", name_ru: "Нуар Ателье", image: images.dark, description: "Sophisticated dark chocolate for intense cacao lovers." },
  { _id: "brand-silk", name_en: "Silk Road Sweets", name_hy: "Մետաքսի Ճանապարհ", name_ru: "Сладости Шёлкового пути", image: images.pistachio, description: "Eastern flavors interpreted through premium chocolate." },
  { _id: "brand-alpine", name_en: "Alpine Cacao", name_hy: "Ալպյան Կակաո", name_ru: "Альпийское Какао", image: images.white, description: "Silky milk and white chocolate with delicate fillings." },
];

export const fallbackCollectionTypes = [
  { _id: "type-milk", name_en: "Milk Chocolate", name_hy: "Կաթնային շոկոլադ", name_ru: "Молочный шоколад", type: "collection" },
  { _id: "type-dark", name_en: "Dark Chocolate", name_hy: "Մուգ շոկոլադ", name_ru: "Тёмный шоколад", type: "collection" },
  { _id: "type-white", name_en: "White Chocolate", name_hy: "Սպիտակ շոկոլադ", name_ru: "Белый шоколад", type: "collection" },
  { _id: "type-truffles", name_en: "Truffles", name_hy: "Տրյուֆելներ", name_ru: "Трюфели", type: "collection" },
  { _id: "type-pralines", name_en: "Pralines", name_hy: "Պրալինե", name_ru: "Пралине", type: "collection" },
  { _id: "type-fruit", name_en: "Fruit & Nut", name_hy: "Մրգեր և ընկույզներ", name_ru: "Фрукты и орехи", type: "collection" },
  { _id: "type-gifts", name_en: "Gift Boxes", name_hy: "Նվեր տուփեր", name_ru: "Подарочные наборы", type: "occasion" },
  { _id: "type-sugar-free", name_en: "Sugar-Free", name_hy: "Առանց շաքարի", name_ru: "Без сахара", type: "dietary" },
];
