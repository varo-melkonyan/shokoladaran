"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import Link from "next/link";

// --- Transliteration logic (copy from Navbar.tsx) ---
type Lang = "en" | "hy" | "ru";
type TranslitMap = {
  [source in Lang]?: {
    [target in Lang]?: Record<string, string>
  }
};
const translitMap: TranslitMap = {
  en: {
    hy: { a: "ա", b: "բ", g: "գ", d: "դ", e: "ե", z: "զ", y: "ը", t: "թ", j: "ժ", i: "ի", l: "լ", x: "խ", c: "ց", k: "կ", h: "հ", m: "մ", n: "ն", o: "ո", p: "պ", s: "ս", v: "վ", r: "ր", f: "ֆ", sh: "շ", ch: "չ", ts: "ծ", jh: "ջ", q: "ք", u: "ւ", oo: "ու", o2: "օ" },
    ru: { a: "а", b: "б", v: "в", g: "г", d: "д", e: "е", yo: "ё", zh: "ж", z: "з", i: "и", j: "й", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", r: "р", s: "с", t: "т", u: "у", f: "ф", h: "х", ts: "ц", ch: "ч", sh: "ш", shch: "щ", y: "ы", ye: "э", yu: "ю", ya: "я" }
  },
  ru: {
    hy: { а: "ա", б: "բ", в: "վ", г: "գ", д: "դ", е: "ե", ё: "յո", ж: "ժ", з: "զ", и: "ի", й: "й", к: "կ", л: "լ", м: "մ", н: "ն", о: "ո", п: "պ", р: "ր", с: "ս", т: "տ", у: "ու", ф: "ֆ", х: "խ", ц: "ց", ч: "չ", ш: "շ", щ: "շչ", ы: "ը", э: "է", ю: "յու", я: "յա" }
  },
  hy: {
    en: { ա: "a", բ: "b", գ: "g", դ: "d", ե: "e", զ: "z", ը: "y", թ: "t", ժ: "j", ի: "i", լ: "l", խ: "x", ծ: "ts", կ: "k", հ: "h", մ: "m", ն: "n", ո: "o", պ: "p", ս: "s", վ: "v", ր: "r", ֆ: "f", շ: "sh", չ: "ch", ջ: "jh", ք: "q", ու: "oo", օ: "o2", յ: "j", տ: "t" },
    ru: { ա: "а", բ: "б", գ: "г", դ: "д", ե: "е", զ: "з", ը: "ы", թ: "т", ժ: "ж", ի: "и", լ: "л", խ: "х", ծ: "ц", կ: "к", հ: "х", մ: "м", ն: "н", ո: "о", պ: "п", ս: "с", վ: "в", ր: "р", ֆ: "ф", շ: "ш", չ: "ч", ջ: "дж", ք: "к", ու: "у", օ: "о", յ: "й", տ: "т" }
  }
};
function transliterate(input: string, from: Lang, to: Lang): string {
  const map = translitMap[from]?.[to];
  if (!map) return input;
  let result = "";
  let i = 0;
  while (i < input.length) {
    const twoChar = input.slice(i, i + 2).toLowerCase();
    if (map[twoChar]) { result += map[twoChar]; i += 2; continue; }
    const oneChar = input[i].toLowerCase();
    result += map[oneChar] || input[i];
    i++;
  }
  return result;
}

export default function SectionHero() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useTranslation();

  // Fetch products once
  useEffect(() => {
    fetch("/api/admin/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  // Search logic
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

      const results = products.filter((product) => (
        product.name_en?.toLowerCase().includes(searchLower) ||
        product.name_hy?.toLowerCase().includes(searchLower) ||
        product.name_ru?.toLowerCase().includes(searchLower) ||
        product.name_en?.toLowerCase().includes(translitFromHy) ||
        product.name_hy?.toLowerCase().includes(translitToHy) ||
        product.name_ru?.toLowerCase().includes(translitToRu) ||
        product.name_en?.toLowerCase().includes(translitFromRu)
      ));

      const lang = i18n.language;
      const resultsWithDisplayName = results.map(product => ({
        ...product,
        name:
          lang === "en"
            ? product.name_en
            : lang === "hy"
            ? product.name_hy
            : product.name_ru
      }));

      setSearchResults(resultsWithDisplayName);
      setLoading(false);
    }, 200);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, products, i18n.language]);

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      setShowSearchDropdown(false);
    }
  }

  // price helpers
  const hasValidDiscount = (p: any) =>
    typeof p?.discount === "number" &&
    typeof p?.price === "number" &&
    p.discount > 0 &&
    p.discount < p.price;

  return (
    <section
      className="w-full min-h-[500px] py-12 flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/assets/hero.png')" }}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white drop-shadow">
        {t("home_banner_big")}
      </h1>
      <p className="text-base md:text-lg text-gray-100 mb-6 text-center max-w-xl drop-shadow">
        {t("home_banner_small")}
      </p>
      <div className="w-full max-w-lg mt-8 relative" ref={searchRef}>
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("search_products")}
            className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white border border-gray-200 shadow text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-chocolate transition-all duration-200"
            onFocus={() => {
              if (search.trim()) setShowSearchDropdown(true);
              else { setShowSearchDropdown(false); setSearchResults([]); }
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
        </form>
        {showSearchDropdown && (
          <div className="absolute left-1/2 top-[100%] -translate-x-1/2 w-[900px] bg-white border border-gray-200 shadow-xl z-50 animate-slideDown pointer-events-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">{t("popular_search_terms")}</h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  {/* Spinner here if you want */}
                  <span className="ml-4 text-chocolate font-semibold text-lg">{t("loading")}</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500 text-lg font-semibold">
                  {t("no_results_found")}
                </div>
              ) : (
                <>
                 <div className="grid grid-cols-4 gap-4" style={{ height: "auto", width: "100%" }}>
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
                            alt={item.name_en || item.name_hy || item.name_ru}
                            className="w-24 h-24 object-cover rounded mb-2"
                          />
                        )}
                        <div className="text-base font-medium text-gray-900 text-center">
                          {i18n.language === "hy"
                            ? item.name_hy
                            : i18n.language === "ru"
                            ? item.name_ru
                            : item.name_en}
                        </div>
                        <div className="text-gray-700 text-center mt-1">
                          {hasValidDiscount(item) ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">
                                {t("amd")} {Number(item.price).toFixed(0)}
                              </span>
                              <span className="text-chocolate font-semibold">
                                {t("amd")} {Number(item.discount).toFixed(0)}
                              </span>
                            </>
                          ) : typeof item.price === "number" ? (
                            <span className="text-chocolate font-semibold">
                              {t("amd")} {Number(item.price).toFixed(0)}
                            </span>
                          ) : (
                            ""
                          )}
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
                      {t("see_all_results")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}