"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const MAX_CHARS = 2400;

// Inline fallback image with proper URL encoding
const FALLBACK_IMG = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='320' height='240'%3e%3crect width='100%25' height='100%25' fill='%23f3f4f6'/%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3eNo image%3c/text%3e%3c/svg%3e`;

type ProductLite = {
  _id: string;
  name_en?: string;
  name_hy?: string;
  name_ru?: string;
  price?: number;
  discount?: number | null;
  collectionType?: { _id: string; name_en?: string; name_hy?: string; name_ru?: string; };
  brand?: { _id: string; name_en?: string; name_hy?: string; name_ru?: string; brand_en?: string; brand_hy?: string; brand_ru?: string; };
  images?: string[];
};

type Suggestion = {
  id: string;
  href: string;
  image: string;
  name: string;
  price: number | null;
};

type ChatMessage = { role: "user" | "assistant"; content: string; suggestions?: Suggestion[] };

export default function AiAssistantWidget({ products = [] as ProductLite[] }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        i18n.language === "hy"
          ? "Բարև, ինչպես կարող եմ օգնել ընտրել շոկոլադե նվերներ կամ համադրություններ?"
          : i18n.language === "ru"
          ? "Здравствуйте! Чем помочь с выбором шоколадных подарков или подборок?"
          : "Hi! How can I help you pick chocolate gifts or assortments?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  
  const initialPrompts = useMemo(() => {
    return i18n.language === "hy"
      ? ["Նվեր ծննդյան համար", "Կորպորատիվ նվերներ", "Կաթնային շոկոլադ", "Ամենաէժանները"]
      : i18n.language === "ru"
      ? ["Подарок на день рождения", "Корпоративные подарки", "Молочный шоколад", "Самые недорогие"]
      : ["Birthday gift", "Corporate gifts", "Milk chocolate", "Cheapest"];
  }, [i18n.language]);

  const [dynamicPrompts, setDynamicPrompts] = useState<string[]>(initialPrompts);

  const skinnyProducts = useMemo(
    () =>
      (products || []).map((p) => ({
        _id: p._id,
        name_en: p.name_en,
        name_hy: p.name_hy,
        name_ru: p.name_ru,
        price: p.price,
        images: p.images,
        discount: p.discount,
        brand: typeof p.brand === "object" && p.brand ? { _id: p.brand._id, name_en: p.brand.name_en ?? p.brand.brand_en, name_hy: p.brand.name_hy ?? p.brand.brand_hy, name_ru: p.brand.name_ru ?? p.brand.brand_ru, } : p.brand,
        collectionType: typeof p.collectionType === "object" && p.collectionType ? { _id: p.collectionType._id, name_en: p.collectionType.name_en, name_hy: p.collectionType.name_hy, name_ru: p.collectionType.name_ru, } : p.collectionType,
      })),
    [products]
  );

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim().slice(0, MAX_CHARS);
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: i18n.language,
          messages: [...messages, { role: "user", content: text }],
          user: text,
          products: skinnyProducts,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = (data?.reply as string | undefined)?.slice(0, MAX_CHARS) || (i18n.language === "hy" ? "Ահա որոշ առաջարկներ։" : i18n.language === "ru" ? "Вот некоторые предложения." : "Here are some suggestions.");
      const suggestions: Suggestion[] = Array.isArray(data?.suggestions) ? data.suggestions : [];
      
      if (Array.isArray(data.prompts) && data.prompts.length > 0) {
        setDynamicPrompts(data.prompts);
      } else {
        setDynamicPrompts(initialPrompts);
      }
      
      setMessages((m) => [...m, { role: "assistant", content: reply, suggestions }]);
    } catch (e) {
      console.error("Assistant API call failed:", e);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            i18n.language === "hy"
              ? "Սերվերի սխալ։ Խնդրում ենք փորձել կրկին։"
              : i18n.language === "ru"
              ? "Ошибка сервера. Попробуйте снова."
              : "Server error. Please try again.",
          suggestions: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open) { // <-- Correct way to check the boolean state
            setDynamicPrompts(initialPrompts);
          }
        }}
        className="fixed bottom-8 right-8 bg-chocolate text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
        title="Chat"
        aria-label="Chat"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-28 right-8 w-[22rem] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-chocolate">
              {i18n.language === "hy"
                ? "Շոկոլադ օգնական"
                : i18n.language === "ru"
                ? "Шоколадный помощник"
                : "Chocolate Assistant"}
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-chocolate">
              ✕
            </button>
          </div>

          <div ref={listRef} className="px-4 py-3 space-y-3 overflow-y-auto max-h-[50vh]">
            {messages.map((m, idx) => (
              <div key={idx}>
                <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-snug ${m.role === "user" ? "bg-chocolate text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
                  >
                    {m.content}
                  </div>
                </div>
                {m.role === "assistant" && m.suggestions && m.suggestions.length > 0 && idx === messages.length - 1 && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {m.suggestions.map((s) => (
                      <a
                        key={s.id + s.href}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-200 rounded-xl p-2 hover:shadow transition bg-white"
                      >
                        <img
                          src={s.image && s.image.trim() !== "" ? s.image : FALLBACK_IMG}
                          alt={s.name}
                          className="w-full h-28 object-cover rounded-md"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.src = FALLBACK_IMG;
                            img.onerror = null;
                          }}
                        />
                        <div className="mt-2 text-[12px] font-medium text-chocolate line-clamp-2">{s.name}</div>
                        {typeof s.price === "number" && <div className="text-[12px] text-gray-700 mt-1">{s.price} AMD</div>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl text-sm bg-gray-100 text-gray-800 rounded-bl-none">…</div>
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="px-3 pb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {dynamicPrompts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInput(q)}
                  className="text-[11px] px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pb-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-chocolate"
                maxLength={MAX_CHARS}
                placeholder={
                  i18n.language === "hy"
                    ? "Գրեք առիթը, նախասիրությունները կամ բյուջեն…"
                    : i18n.language === "ru"
                    ? "Опишите повод, предпочтения или бюджет…"
                    : "Describe occasion, preferences, or budget…"
                }
              />
              <span className="text-[11px] text-gray-400">{input.length}/{MAX_CHARS}</span>
              <button
                type="submit"
                disabled={loading || input.trim() === ""}
                className="bg-chocolate text-white px-3 py-2 rounded-xl text-sm disabled:opacity-50"
              >
                {i18n.language === "hy" ? "Ուղարկել" : i18n.language === "ru" ? "Отправить" : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}