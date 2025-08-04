"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

type Brand = { _id: string; name: string };
type CollectionType = { id: string; name: string; type: "collection" | "children" | "dietary" };

type Lang = "en" | "hy" | "ru";

type TranslitMap = {
  [source in Lang]?: {
    [target in Lang]?: Record<string, string>
  }
};

const translitMap: TranslitMap = {
  en: {
    hy: {
      a: "ա", b: "բ", g: "գ", d: "դ", e: "ե", z: "զ", y: "ը", t: "թ",
      j: "ժ", i: "ի", l: "լ", x: "խ", c: "ց", k: "կ", h: "հ", m: "մ",
      n: "ն", o: "ո", p: "պ", s: "ս", v: "վ", r: "ր", f: "ֆ",
      sh: "շ", ch: "չ", ts: "ծ", jh: "ջ", q: "ք", u: "ւ", oo: "ու", o2: "օ"
    },
    ru: {
      a: "а", b: "б", v: "в", g: "г", d: "д", e: "е", yo: "ё", zh: "ж", z: "з",
      i: "и", j: "й", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п",
      r: "р", s: "с", t: "т", u: "у", f: "ф", h: "х", ts: "ц", ch: "ч",
      sh: "ш", shch: "щ", y: "ы", ye: "э", yu: "ю", ya: "я"
    }
  },
  ru: {
    hy: {
      а: "ա", б: "բ", в: "վ", г: "գ", д: "դ", е: "ե", ё: "յո", ж: "ժ", з: "զ",
      и: "ի", й: "յ", к: "կ", л: "լ", м: "մ", н: "ն", о: "ո", п: "պ",
      р: "ր", с: "ս", т: "տ", у: "ու", ф: "ֆ", х: "խ", ц: "ց", ч: "չ",
      ш: "շ", щ: "շչ", ы: "ը", э: "է", ю: "յու", я: "յա"
    }
  },
  hy: {
    en: {
      ա: "a", բ: "b", գ: "g", դ: "d", ե: "e", զ: "z", ը: "y", թ: "t",
      ժ: "j", ի: "i", լ: "l", խ: "x", ծ: "ts", կ: "k", հ: "h", մ: "m",
      ն: "n", ո: "o", պ: "p", ս: "s", վ: "v", ր: "r", ֆ: "f", շ: "sh",
      չ: "ch", ջ: "jh", ք: "q", ու: "oo", օ: "o2", յ: "j", տ: "t"
    },
    ru: {
      ա: "а", բ: "б", գ: "г", դ: "д", ե: "е", զ: "з", ը: "ы", թ: "т",
      ժ: "ж", ի: "и", լ: "л", խ: "х", ծ: "ц", կ: "к", հ: "х", մ: "м",
      ն: "н", ո: "о", պ: "п", ս: "с", վ: "в", ր: "р", ֆ: "ф", շ: "ш",
      չ: "ч", ջ: "дж", ք: "к", ու: "у", օ: "о", յ: "й", տ: "т"
    }
  }
};


function transliterate(input: string, from: Lang, to: Lang): string {
  const map = translitMap[from]?.[to];
  if (!map) return input;

  let result = "";
  let i = 0;

  while (i < input.length) {
    const twoChar = input.slice(i, i + 2).toLowerCase();
    if (map[twoChar]) {
      result += map[twoChar];
      i += 2;
      continue;
    }

    const oneChar = input[i].toLowerCase();
    result += map[oneChar] || input[i];
    i++;
  }

  return result;
}



export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [gifts, setGifts] = useState<any[]>([]);
  const [specials, setSpecials] = useState<any[]>([]);
  const { t } = useTranslation();
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(data => setBrands(data.map((b: any) => ({
        _id: b._id || b.id,
        name: b.name,
      }))));
    fetch("/api/admin/collection-types")
      .then(res => res.json())
      .then(data => setCollectionTypes(data.map((c: any) => ({
        id: c._id || c.id,
        name: c.name,
        type: c.type,
      }))));
  }, []);


  // Auto-search as you type
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setLoading(false);
      return;
    }
    setShowSearchDropdown(true);
    setLoading(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
    const searchLower = search.trim().toLowerCase();

    const translitFromHy = transliterate(searchLower, "hy", "en");
    const translitFromRu = transliterate(searchLower, "ru", "en");
    const translitToHy = transliterate(searchLower, "en", "hy");
    const translitToRu = transliterate(searchLower, "en", "ru");

    const results = products.filter((product) => {
      const name = product.name.toLowerCase();
      return (
        name.includes(searchLower) ||
        name.includes(translitFromHy) ||
        name.includes(translitFromRu) ||
        name.includes(translitToHy) ||
        name.includes(translitToRu)
      );
    });

    setSearchResults(results);
    setLoading(false);
  }, 200);


    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, products]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    if (showSearchDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSearchDropdown]);

 useEffect(() => {
  async function fetchAll() {
    setLoading(true);
    try {
      const [productsRes, giftsRes, specialsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/gifts"),
        fetch("/api/admin/special"),
      ]);
      const [productsData, giftsData, specialsData] = await Promise.all([
        productsRes.json(),
        giftsRes.json(),
        specialsRes.json(),
      ]);
      setProducts(productsData);
      setGifts(giftsData);
      setSpecials(specialsData);
    } catch (err) {
      setProducts([]);
      setGifts([]);
      setSpecials([]);
    }
    setLoading(false);
  }
  fetchAll();
}, []);
  
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      setShowSearchDropdown(false);
    }
  }
  const pathname = usePathname();

  const navLinks = [
    { name: t("brands"), href: "/brands" },
    { name: t("gifts"), href: "/gifts" },
  ];

  // Split brands into two columns for dropdown
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));
  const mid = Math.ceil(sortedBrands.length / 2);
  const brandsCol1 = sortedBrands.slice(0, mid);
  const brandsCol2 = sortedBrands.slice(mid);

  // Filter and split collections and dietary types
  const collections = collectionTypes.filter(ct => ct.type === "collection");
  const childrenTypes = collectionTypes.filter(ct => ct.type === "children");
  const dietaryTypes = collectionTypes.filter(ct => ct.type === "dietary");
  const sortedCollections = [...collections].sort((a, b) => a.name.localeCompare(b.name));
  const midCol = Math.ceil(sortedCollections.length / 2);
  const collectionsCol1 = sortedCollections.slice(0, midCol);
  const collectionsCol2 = sortedCollections.slice(midCol);

  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  // Calculate total
  const total = cart.reduce((sum, item) => {
    if (typeof item.grams === "number") {
      const unitPrice = item.discount ?? item.price ?? 0;
      return sum + Math.round((unitPrice / 100) * item.grams);
    }
    return sum + ((item.discount ?? item.price ?? 0) * item.quantity);
  }, 0);

  // Handlers for plus/minus
  const handleIncrease = (item: any) => {
    if (typeof item.grams === "number") {
      addToCart({ ...item, grams: (item.grams ?? 0) + 10 });
    } else {
      addToCart({ ...item, quantity: 1 });
    }
  };
  const handleDecrease = (item: any) => {
    if (typeof item.grams === "number") {
      addToCart({ ...item, grams: Math.max((item.grams ?? 0) - 10, 0) });
    } else {
      addToCart({ ...item, quantity: -1 });
    }
  };

  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCart]);
  
  useEffect(() => {
    const savedLng = localStorage.getItem("lng");
    if (savedLng && i18n.language !== savedLng) {
      i18n.changeLanguage(savedLng);
    }
  }, []);

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setShowLangDropdown(false);
  };

  function getCartItemLink(item: any) {
  const foundGift = gifts.find(
    (g) => g.name && item.name && g.name.toLowerCase() === item.name.toLowerCase()
  );
  if (foundGift) return `/gifts/${foundGift._id}`;

  const foundSpecial = specials.find(
    (s) => s.name && item.name && s.name.toLowerCase() === item.name.toLowerCase()
  );
  if (foundSpecial) return `/special/${foundSpecial._id}`;

  const foundProduct = products.find(
    (p) => p.name && item.name && p.name.toLowerCase() === item.name.toLowerCase()
  );
  if (foundProduct) return `/product/${foundProduct.slug || foundProduct._id}`;

  return `/product/${item.slug || item._id}`;
}

  return (
    <>
      {/* --- MOBILE NAVBAR --- */}
      <div className="block md:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Hamburger */}
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-chocolate"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-7 h-7 text-chocolate" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Language Dropdown */}
            <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-full font-semibold border border-chocolate bg-white text-chocolate hover:bg-chocolate hover:text-white transition"
          onClick={() => setShowLangDropdown((prev) => !prev)}
          aria-label="Select language"
          type="button"
        >
          <span className="uppercase">{i18n.language}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showLangDropdown && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            {["hy", "en", "ru"].map((lng) => (
              <button
                key={lng}
                onClick={() => handleChangeLanguage(lng)}
                className={`block w-full text-left px-4 py-2 rounded-xl font-semibold transition ${
                  i18n.language === lng
                    ? "bg-chocolate text-white"
                    : "text-chocolate hover:bg-chocolate/10"
                }`}
              >
                {lng === "hy" ? "Հայերեն" : lng === "en" ? "English" : "Русский"}
              </button>
            ))}
          </div>
        )}
      </div>
            {/* Logo */}
            <Link href="/" className="text-xl font-cursive font-bold text-chocolate">Shokoladaran</Link>
            {/* Cart */}
            <button
              onClick={() => setShowCart(true)}
              className="relative h-7 w-7 flex items-center justify-center"
              aria-label="Open cart"
              type="button"
            >
              <img
                src="https://cdn.animaapp.com/projects/632aa472e54a449a6cf9dc9a/releases/6883652fe1f55f4c5df6a2b6/img/component-2-46.svg"
                alt="Cart"
                className="h-7 w-7"
              />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-chocolate text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="fixed top-[68px] left-0 w-full px-4 py-2 bg-white border-b border-gray-100 z-40">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search_products")}
                className="w-full pl-10 pr-3 py-2 rounded-2xl bg-white border border-gray-200 shadow text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-chocolate transition-all duration-200"
                onFocus={() => {
                  if (search.trim()) {
                    setShowSearchDropdown(true);
                  } else {
                    setShowSearchDropdown(false);
                    setSearchResults([]);
                  }
                }}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate w-5 h-5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </form>
          {/* Mobile Search Dropdown */}
          {showSearchDropdown && (
  <div className="absolute left-0 top-[100%] w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-slideDown pointer-events-auto">
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{t("popular_search_terms")}</h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          {/* You can put your spinner here */}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-500 text-lg font-semibold">
          {t("no_results_found")}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {searchResults.slice(0, 4).map((item) => (
              <button
                key={item._id}
                className="flex flex-col items-center p-2 rounded hover:bg-chocolate/10 transition w-full"
                type="button"
                onClick={async () => {
                  setShowSearchDropdown(false);
                  await router.push(`/product/${item.slug || item._id}`);
                }}
                onTouchStart={async () => {
                  setShowSearchDropdown(false);
                  await router.push(`/product/${item.slug || item._id}`);
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded mb-2"
                  />
                )}
                <div className="text-base font-medium text-gray-900 text-center">
                  {item.name}
                </div>
                <div className="text-gray-700 text-center mt-1">
                  {item.price ? `$ ${item.price.toFixed(2)}` : ""}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-chocolate text-white px-6 py-2 rounded text-base font-semibold hover:bg-[#a06a1b] transition"
              type="button"
              onClick={async () => {
                setShowSearchDropdown(false);
                await router.push(`/search?query=${encodeURIComponent(search)}`);
              }}
              onTouchStart={async () => {
                setShowSearchDropdown(false);
                await router.push(`/search?query=${encodeURIComponent(search)}`);
              }}
            >
              See all results
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-200 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <nav
          className={`fixed top-0 left-0 h-full w-[90vw] max-w-sm bg-[#fdfaf6] z-[70] shadow-2xl rounded-tr-3xl rounded-br-3xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ minWidth: 260 }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <span className="text-2xl font-bold text-chocolate tracking-wide">{t("chocolate")}</span>
            <button
              className="p-2 rounded-full hover:bg-chocolate/10 focus:outline-none focus:ring-2 focus:ring-chocolate"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-7 h-7 text-chocolate" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            {/* Product Type */}
            <div className="bg-white rounded-xl shadow p-3 mb-2">
              <button
                className="flex items-center justify-between w-full"
                onClick={() => setOpenSection(openSection === "product" ? null : "product")}
              >
                <span className="font-bold text-lg text-chocolate flex items-center gap-2">
                  <span role="img" aria-label="chocolate">🍫</span> {t("product_type")}
                </span>
                <span className="text-chocolate">{openSection === "product" ? "▲" : "▼"}</span>
              </button>
              {openSection === "product" && (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
                  {collections.map((col) => (
                    <li key={col.id}>
                      <Link
                        href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block text-[15px] text-chocolate hover:underline"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {col.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* For Children */}
            {childrenTypes.length > 0 && (
              <div className="bg-white rounded-xl shadow p-3 mb-2">
                <button
                  className="flex items-center justify-between w-full"
                  onClick={() => setOpenSection(openSection === "children" ? null : "children")}
                >
                  <span className="font-bold text-lg text-chocolate flex items-center gap-2">
                    <span role="img" aria-label="bear">🐻</span> {t("for_children")}
                  </span>
                  <span className="text-chocolate">{openSection === "children" ? "▲" : "▼"}</span>
                </button>
                {openSection === "children" && (
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
                    {childrenTypes.map((type) => (
                      <li key={type.id}>
                        <Link
                          href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block text-[15px] text-chocolate hover:underline"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {type.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {/* Dietary */}
            {dietaryTypes.length > 0 && (
              <div className="bg-white rounded-xl shadow p-3 mb-2">
                <button
                  className="flex items-center justify-between w-full"
                  onClick={() => setOpenSection(openSection === "dietary" ? null : "dietary")}
                >
                  <span className="font-bold text-lg text-chocolate flex items-center gap-2">
                    <span role="img" aria-label="leaf">🌱</span> {t("Dietary")}
                  </span>
                  <span className="text-chocolate">{openSection === "dietary" ? "▲" : "▼"}</span>
                </button>
                {openSection === "dietary" && (
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
                    {dietaryTypes.map((type) => (
                      <li key={type.id}>
                        <Link
                          href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block text-[15px] text-chocolate hover:underline"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {type.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {/* Brands */}
            <div className="bg-white rounded-xl shadow p-3 mb-2">
              <button
                className="flex items-center justify-between w-full"
                onClick={() => setOpenSection(openSection === "brands" ? null : "brands")}
              >
                <span className="font-bold text-lg text-chocolate flex items-center gap-2">
                  <span role="img" aria-label="tag">🏷️</span> {t("brands")}
                </span>
                <span className="text-chocolate">{openSection === "brands" ? "▲" : "▼"}</span>
              </button>
              {openSection === "brands" && (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
                  {brands.map((brand) => (
                    <li key={brand._id}>
                      <Link
                        href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block text-[15px] text-chocolate hover:underline"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {brand.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 text-center">
                <Link
                  href="/brands"
                  className="inline-block text-chocolate underline text-xs"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  See all brands
                </Link>
              </div>
            </div>
            {/* Other Links */}
            <div className="bg-white rounded-xl shadow p-3 mb-2">
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/discounts"
                  className="block py-2 px-2 rounded text-chocolate font-semibold hover:bg-chocolate/10 transition text-base text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("discounts")}
                </Link>
                <Link
                  href="/special"
                  className="block py-2 px-2 rounded text-chocolate font-semibold hover:bg-chocolate/10 transition text-base text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("special")}
                </Link>
                <Link
                  href="/gifts"
                  className="block py-2 px-2 rounded text-chocolate font-semibold hover:bg-chocolate/10 transition text-base text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("gifts")}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Cart Drawer (shared for mobile/desktop) */}
        <div
          className={`fixed top-0 right-0 h-full w-96 max-w-full bg-white shadow-2xl z-[100] transform transition-transform duration-300 ${
            showCart ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Free Shipping Banner */}
          <div className="bg-yellow-100 text-yellow-800 text-center px-4 py-2 font-semibold text-sm border-b border-yellow-200">
            {t("free_shipping_info")}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-chocolate">{t("your_cart")}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1"
                aria-label="Clear cart"
                title="Clear cart"
                type="button"
              >
                {t("clear_cart")}
              </button>
              <button
                onClick={() => setShowCart(false)}
                className="text-2xl text-gray-500 hover:text-chocolate"
                aria-label="Close cart"
                type="button"
              >
                &times;
              </button>
            </div>
          </div>
         <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
            {cart.length === 0 ? (
              <div className="text-gray-500">{t("empty_cart")}</div>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3 border-b pb-3">
                  {/* Product Image */}
                  {(item.images && item.images[0]) || item.images ? (
                  <Link
                    href={getCartItemLink(item)}
                    onClick={() => setShowCart(false)}
                    className="block"
                  >
                    <img
                      src={item.images && item.images[0] ? item.images[0] : "/placeholder.png"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = "/placeholder.png"; }}
                    />
                  </Link>
                  ) : null}
                  <div className="flex-1">
                    <div className="font-semibold">
                      <Link
                        href={getCartItemLink(item)}
                        className="text-chocolate hover:underline"
                        onClick={() => setShowCart(false)}
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Minus Button */}
                      <button
                        onClick={() => handleDecrease(item)}
                        className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      {/* Quantity/Grams */}
                      <span className="min-w-[40px] text-center">
                        {typeof item.grams === "number"
                          ? `${item.grams}g`
                          : item.quantity}
                      </span>
                      {/* Plus Button */}
                      <button
                        onClick={() => handleIncrease(item)}
                        className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="text-right font-semibold">
                    {typeof item.grams === "number"
                      ? Math.round(((item.discount ?? item.price ?? 0) / 100) * item.grams) + " ֏"
                      : (item.discount ?? item.price ?? 0) * item.quantity + " ֏"}
                  </div>
                  {/* Remove Icon */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label="Remove"
                    title="Remove"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">{t("total")}</span>
              <span className="text-base font-bold text-chocolate">{total} ֏</span>
            </div>
            <Link
              href="/cart"
              className="block w-full text-center bg-chocolate text-white py-2 rounded-lg font-semibold hover:bg-[#a06a1b] transition"
              onClick={() => setShowCart(false)}
            >
              🛒 {t("see_cart")}
            </Link>
          </div>
        </div>
        {/* Overlay */}
        {showCart && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-[99]"
            onClick={() => setShowCart(false)}
          />
        )}
      </div>

      {/* --- DESKTOP NAVBAR --- */}
      <div className="hidden md:block">
        <header className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-200 z-50"
                onMouseLeave={() => {
                  setShowDropdown(false);
                  setShowBrandsDropdown(false);
                }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            {/* Logo (now left) */}
            <div className="max-w-7xl mx-auto px-6 text-center"
                 onMouseEnter={() => {
                   setShowDropdown(false);
                   setShowBrandsDropdown(false);
                 }}
            >
              <h1 className="text-3xl font-cursive font-bold text-chocolate">
                <Link href="/">Shokoladaran</Link>
              </h1>
              <p className="text-sm text-chocolate tracking-wide">Chocolate Marketplace</p>
            </div>

            {/* Navigation Links (now center) */}
            <nav className="flex items-center gap-8 justify-center flex-1">
              <div className="border-gray-100">
                <div className="hidden md:flex max-w-7xl mx-auto py-2 justify-center space-x-8 text-chocolate font-semibold text-sm uppercase tracking-wider">
                  {/* Collection Dropdown */}
                  <div className=""
                       onMouseEnter={() => {
                         setShowDropdown(true);
                         setShowBrandsDropdown(false);
                       }}
                  >
                    <button
                      className="cursor-pointer flex items-center gap-1 bg-transparent border-none outline-none"
                      aria-haspopup="true"
                      aria-expanded={showDropdown}
                      tabIndex={0}
                      type="button"
                    >
                      {t("chocolate")} <span className="text-xs">▼</span>
                    </button>

                    {showDropdown && (
                      <div className="absolute left-0 top-full w-screen bg-white shadow-xl z-50 animate-slideDown">
                        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-10">
                          {/* Product Type */}
                          <div>
                            <h3 className="text-lg font-extrabold text-chocolate uppercase mb-4">{t("product_type")}</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                              <ul className="space-y-1">
                                {collectionsCol1.map((col) => (
                                  <li key={col.id}>
                                    <Link
                                      href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="inline-block text-sm text-gray-700 hover:text-chocolate transition relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-chocolate after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                                      onClick={() => setShowDropdown(false)}
                                    >
                                      {col.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <ul className="space-y-1">
                                {collectionsCol2.map((col) => (
                                  <li key={col.id}>
                                    <Link
                                      href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="inline-block text-sm text-gray-700 hover:text-chocolate transition relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-chocolate after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                                      onClick={() => setShowDropdown(false)}                                    
                                    >
                                      {col.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* For Children & Dietary */}
                          <div>
                            {childrenTypes.length > 0 && (
                              <>
                                <h3 className="text-lg font-extrabold text-chocolate uppercase mb-4">{t("for_children")}</h3>
                                <ul className="space-y-2 mb-6">
                                  {childrenTypes.map((type) => (
                                    <li key={type.id}>
                                      <Link
                                        href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="inline-block text-sm text-gray-700 hover:text-chocolate transition relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-chocolate after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                                        onClick={() => setShowDropdown(false)}
                                      >
                                        {type.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}

                            <h3 className="text-lg font-extrabold text-chocolate uppercase mb-4">{t("Dietary")}</h3>
                            <ul className="space-y-2">
                              {dietaryTypes.map((type) => (
                                <li key={type.id}>
                                  <Link
                                    href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="inline-block text-sm text-gray-700 hover:text-chocolate transition relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-chocolate after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                                    onClick={() => setShowDropdown(false)}
                                  >
                                    {type.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Image with links */}
                          <div className="relative rounded-xl overflow-hidden h-[200px] mt-4 flex flex-col justify-between">
                            <img
                              src="/assets/images/exclusive-rose.png"
                              alt="Chocolate Preview"
                              className="object-cover w-full h-full absolute inset-0"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />
                            <Link
                              href="/all-products"
                              className="absolute inset-0 flex items-center justify-center z-20"
                              onClick={() => setShowDropdown(false)}
                            >
                              <span className="text-white text-xl font-bold tracking-wider">{t("product_types.all_products")}</span>
                            </Link>
                            <div className="absolute bottom-0 w-full flex justify-center gap-6 py-2 z-20">
                              <Link 
                              href="/discounts" 
                              className="text-white text-sm font-medium hover:underline"
                              onClick={() => setShowDropdown(false)}
                              >
                                {t("discounts")}
                              </Link>
                              <Link 
                              href="/special" 
                              className="text-white text-sm font-medium hover:underline"
                              onClick={() => setShowDropdown(false)}
                              >
                                {t("special")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Brands Dropdown */}
                  <div
                    className=""
                    onMouseEnter={() => {
                      setShowBrandsDropdown(true);
                      setShowDropdown(false);
                    }}

                  >
                    <button
                      onMouseLeave={() => setShowDropdown(false)}

                      className="cursor-pointer flex items-center gap-1 bg-transparent border-none outline-none"
                      aria-haspopup="true"
                      aria-expanded={showBrandsDropdown}
                      tabIndex={0}
                      type="button"
                    >
                      {t("brands")} <span className="text-xs">▼</span>
                    </button>

                    {showBrandsDropdown && (
                      <div className="absolute left-0 top-full w-screen bg-white shadow-xl z-50 animate-slideDown">
                        <div className="max-w-7xl mx-auto px-4 py-8">
                          <h3 className="text-lg font-bold text-chocolate mb-6 text-center">
                            <Link href="/brands" className="hover:underline" onClick={() => setShowBrandsDropdown(false)}>{t("all_brands")}</Link>
                          </h3>
                          <div className="grid grid-cols-3 gap-6 items-center">
                            <div className="space-y-2">
                              {brandsCol1.map((brand) => (
                                <Link
                                  key={brand._id}
                                  href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="block px-3 py-2 rounded hover:bg-chocolate/10 hover:text-chocolate text-gray-700 transition-colors text-sm text-center"
                                  onClick={() => setShowBrandsDropdown(false)}
                                >
                                  {brand.name}
                                </Link>
                              ))}
                            </div>
                            <div className="flex justify-center">
                              <img
                                src="/assets/images/brands_bar.png"
                                alt="Brands Bar"
                                className="w-full max-w-[220px] h-42 object-contain rounded"
                              />
                            </div>
                            <div className="space-y-2">
                              {brandsCol2.map((brand) => (
                                <Link
                                  key={brand._id}
                                  href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="block px-3 py-2 rounded hover:bg-chocolate/10 hover:text-chocolate text-gray-700 transition-colors text-sm text-center"
                                >
                                  {brand.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Other Links */}
                  <div
                    className=""
                    onMouseEnter={() => {
                      setShowBrandsDropdown(false);
                      setShowDropdown(false);
                    }}>
                    {navLinks.slice(1).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`${(pathname ?? "").startsWith(link.href) ? "text-chocolate underline font-bold" : ""}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Right: Search and Icons */}
            <div className="flex items-center gap-6"
                 onMouseEnter={() => {
                   setShowDropdown(false);
                   setShowBrandsDropdown(false);
                 }}
            >
                <div className="relative w-56" ref={searchRef}>
                  <form onSubmit={handleSearch} className="flex items-center justify-center">
                    <div className="relative w-full flex items-center">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("search_products")}
                        className="w-full pl-12 py-3 rounded-3xl bg-white/80 focus:bg-white border-none shadow-lg text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-chocolate transition-all duration-200"
                        onFocus={() => {
                          if (search.trim()) {
                            setShowSearchDropdown(true);
                          } else {
                            setShowSearchDropdown(false);
                            setSearchResults([]);
                          }
                        }}
                      />
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate w-5 h-5 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                  </form>
                  {/* Search Dropdown */}
                  {showSearchDropdown && (
                    <div className="fixed right-0 top-[70px] mt-0 w-[600px] bg-white rounded-xl shadow-xl z-50 animate-slideDown">
                      <div className="flex">
                        <div className="flex-1 p-6">
                          <h3 className="text-lg font-semibold mb-4">{t("popular_search_terms")}</h3>
                          {loading ? (
                            <div className="flex items-center justify-center py-12">
                              <svg className="animate-spin h-8 w-8 text-chocolate" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                              </svg>
                              <span className="ml-4 text-chocolate font-semibold text-lg">{t("loading")}</span>
                            </div>
                          ) : searchResults.length === 0 ? (
                            <div className="flex items-center justify-center py-12 text-gray-500 text-lg font-semibold">
                              {t("no_results_found")}
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-2 gap-6">
                                {searchResults.slice(0, 4).map((item) => (
                                  <div key={item._id} className="flex flex-col items-center">
                                    <Link
                                      href={`/product/${item.slug || item._id}`}
                                      className="block"
                                      onClick={() => setShowSearchDropdown(false)}
                                    >
                                      {item.image && (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-40 h-40 object-cover rounded mb-2"
                                        />
                                      )}
                                      <div className="text-base font-medium text-gray-900 text-center">{item.name}</div>
                                      <div className="text-gray-700 text-center mt-1">
                                        {item.price ? `$ ${item.price.toFixed(2)}` : ""}
                                      </div>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-center mt-8">
                                <Link
                                  href={`/search?query=${encodeURIComponent(search)}`}
                                  className="bg-black text-white px-8 py-3 rounded text-lg font-semibold hover:bg-chocolate transition"
                                  onClick={() => setShowSearchDropdown(false)}
                                >
                                  {t("see_all_results")}
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              {/* Cart Icon */}
              <button
                onClick={() => setShowCart(true)}
                className="relative h-6 w-6 flex items-center justify-center"
                aria-label="Open cart"
                type="button"
              >
                <img
                  src="https://cdn.animaapp.com/projects/632aa472e54a449a6cf9dc9a/releases/6883652fe1f55f4c5df6a2b6/img/component-2-46.svg"
                  alt="Cart"
                  className="h-6 w-6"
                />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-chocolate text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                    {cart.length}
                  </span>
                )}
              </button>
              {/* Language Selector */}
              <div className="relative ml-4">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-full font-semibold border border-chocolate bg-white text-chocolate hover:bg-chocolate hover:text-white transition"
                  onClick={() => setShowLangDropdown((prev) => !prev)}
                  aria-label="Select language"
                  type="button"
                >
                  <span className="uppercase">{i18n.language}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    {["hy", "en", "ru"].map((lng) => (
                      <button
                        key={lng}
                        onClick={() => handleChangeLanguage(lng)}
                        className={`block w-full text-left px-4 py-2 rounded-xl font-semibold transition ${
                          i18n.language === lng
                            ? "bg-chocolate text-white"
                            : "text-chocolate hover:bg-chocolate/10"
                        }`}
                      >
                        {lng === "hy" ? "Հայերեն" : lng === "en" ? "English" : "Русский"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Cart Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-96 max-w-full bg-white shadow-2xl z-[100] transform transition-transform duration-300 ${
            showCart ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Free Shipping Banner */}
          <div className="bg-yellow-100 text-yellow-800 text-center px-4 py-2 font-semibold text-sm border-b border-yellow-200">
            {t("free_shipping_info")}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-chocolate">{t("your_cart")}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1"
                aria-label="Clear cart"
                title="Clear cart"
                type="button"
              >
                {t("clear_cart")}
              </button>
              <button
                onClick={() => setShowCart(false)}
                className="text-2xl text-gray-500 hover:text-chocolate"
                aria-label="Close cart"
                type="button"
              >
                &times;
              </button>
            </div>
          </div>
         <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
            {cart.length === 0 ? (
              <div className="text-gray-500">{t("empty_cart")}</div>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3 border-b pb-3">
                  {/* Product Image */}
                  {(item.images && item.images[0]) || item.images ? (
                  <Link
                    href={getCartItemLink(item)}
                    onClick={() => setShowCart(false)}
                    className="block"
                  >
                    <img
                      src={item.images && item.images[0] ? item.images[0] : "/placeholder.png"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = "/placeholder.png"; }}
                    />
                  </Link>
                  ) : null}
                  <div className="flex-1">
                    <div className="font-semibold">
                      <Link
                      href={getCartItemLink(item)}
                      className="text-chocolate hover:underline"
                      onClick={() => setShowCart(false)}
                    >
                      {item.name}
                    </Link>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Minus Button */}
                      <button
                        onClick={() => handleDecrease(item)}
                        className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      {/* Quantity/Grams */}
                      <span className="min-w-[40px] text-center">
                        {typeof item.grams === "number"
                          ? `${item.grams}g`
                          : item.quantity}
                      </span>
                      {/* Plus Button */}
                      <button
                        onClick={() => handleIncrease(item)}
                        className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="text-right font-semibold">
                    {typeof item.grams === "number"
                      ? Math.round(((item.discount ?? item.price ?? 0) / 100) * item.grams) + " ֏"
                      : (item.discount ?? item.price ?? 0) * item.quantity + " ֏"}
                  </div>
                  {/* Remove Icon */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label="Remove"
                    title="Remove"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">{t("total")}</span>
              <span className="text-base font-bold text-chocolate">{total} ֏</span>
            </div>
            <Link
              href="/cart"
              className="block w-full text-center bg-chocolate text-white py-2 rounded-lg font-semibold hover:bg-[#a06a1b] transition"
              onClick={() => setShowCart(false)}
            >
              🛒 {t("see_cart")}
            </Link>
          </div>
        </div>
        {/* Overlay */}
        {showCart && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-[99]"
            onClick={() => setShowCart(false)}
          />
        )}
      </div>
    </>
  );
}
