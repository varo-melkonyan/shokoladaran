"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const MAX_CHARS = 2400;

// Inline fallback image (light gray with “No image”)
const FALLBACK_IMG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='240'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'>No image</text></svg>`;

type ProductLite = {
  _id: string;
  name_en?: string;
  name_hy?: string;
  name_ru?: string;
  price?: number;
  discount?: number | null;
  collectionType?: any;
  brand?: any;
};

export type Suggestion = {
  id: string;
  href: string;
  image: string;
  name: string;
  price: number | null; // effective/current price
  origPrice?: number | null; // if present and > price, show strike-through
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  suggestions?: Suggestion[];
};

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

  // Keep payload small: only send key fields
  const skinnyProducts = useMemo(
    () =>
      (products || []).slice(0, 200).map((p) => ({
        _id: p._id,
        name_en: p.name_en,
        name_hy: p.name_hy,
        name_ru: p.name_ru,
        price: p.price,
        discount: p.discount,
        brand:
          typeof p.brand === "object" && p.brand
            ? {
                _id: p.brand._id,
                name_en: (p.brand as any).name_en ?? (p.brand as any).brand_en,
                name_hy: (p.brand as any).name_hy ?? (p.brand as any).brand_hy,
                name_ru: (p.brand as any).name_ru ?? (p.brand as any).brand_ru,
              }
            : p.brand,
        collectionType:
          typeof p.collectionType === "object" && p.collectionType
            ? {
                _id: (p.collectionType as any)._id,
                name_en: (p.collectionType as any).name_en,
                name_hy: (p.collectionType as any).name_hy,
                name_ru: (p.collectionType as any).name_ru,
              }
            : p.collectionType,
      })),
    [products]
  );

  useEffect(() => {
    if (!open) return;
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
          messages, // full conversation history
          user: text,
          products: skinnyProducts,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply =
        (data?.reply as string | undefined)?.slice(0, MAX_CHARS) ||
        (i18n.language === "hy"
          ? "Ահա որոշ առաջարկներ։"
          : i18n.language === "ru"
          ? "Вот некоторые предложения."
          : "Here are some suggestions.");

      const suggestions: Suggestion[] = Array.isArray(data?.suggestions)
        ? data.suggestions
        : [];

      setMessages((m) => [...m, { role: "assistant", content: reply, suggestions }]);
    } catch (e) {
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

  const quickPrompts =
    i18n.language === "hy"
      ? [
          "Նվեր ծննդյան համար, բյուջե՝ 5000֏",
          "Կորպորատիվ նվերներ, ատում եմ դառը",
          "Կաթնային շոկոլադ մանկական հավաքածու",
          "Վեգան, ընկուզեղեն չեմ ցանկանում",
          "Ամենաշատ զեղչ ունեցողները",
          "Սիրահարների օր, 10000֏",
        ]
      : i18n.language === "ru"
      ? [
          "Подарок на день рождения, бюджет 5000֏",
          "Корпоративные подарки, не люблю горький",
          "Молочный шоколад детская подборка",
          "Веган, без орехов",
          "С наибольшей скидкой",
          "Ко Дню Святого Валентина, 10000֏",
        ]
      : [
          "Birthday gift, budget 5000 AMD",
          "Corporate gifts, no dark chocolate",
          "Milk chocolate kids assortment",
          "Vegan, no nuts",
          "Biggest discounts",
          "Valentine’s Day, 10,000 AMD",
        ];

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-8 right-8 bg-chocolate text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
        title="Chat"
        aria-label="Chat"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-28 right-8 w-[22rem] max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col sm:bottom-28 sm:right-8 md:w-[24rem]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-chocolate">
              {i18n.language === "hy"
                ? "Շոկոլադ օգնական"
                : i18n.language === "ru"
                ? "Шоколадный помощник"
                : "Chocolate Assistant"}
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-chocolate" aria-label="Close chat">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="px-4 py-3 space-y-3 overflow-y-auto max-h-[60vh]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-2xl text-sm leading-snug max-w-[85%] break-words ${
                    m.role === "user"
                      ? "bg-chocolate text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Suggestions grid under the LAST assistant message that has suggestions */}
            {(() => {
              const lastWithSuggIndex = [...messages]
                .map((m, i) => ({ i, m }))
                .reverse()
                .find((x) => x.m.role === "assistant" && x.m.suggestions && x.m.suggestions.length)?.i;

              if (lastWithSuggIndex == null) return null;

              const sUG = messages[lastWithSuggIndex].suggestions!;
              return (
                <div className="grid grid-cols-2 gap-3">
                  {sUG.map((s) => (
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
                          const img = e.currentTarget as HTMLImageElement;
                          (img as any).onerror = null; // prevent loop
                          img.src = FALLBACK_IMG;
                        }}
                      />
                      <div className="mt-2 text-[12px] font-medium text-chocolate line-clamp-2">{s.name}</div>
                      {/* Price with optional strike-through */}
                      {typeof s.price === "number" && (
                        <div className="text-[12px] text-gray-700 mt-1 flex items-center gap-2">
                          <span>{s.price} AMD</span>
                          {typeof s.origPrice === "number" && s.origPrice > s.price && (
                            <span className="line-through text-gray-400 text-[11px]">{s.origPrice} AMD</span>
                          )}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              );
            })()}

            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl text-sm bg-gray-100 text-gray-800 rounded-bl-none" aria-live="polite">
                  <span className="inline-flex items-center gap-1">
                    <span>Typing</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>.</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="px-3 pb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {quickPrompts.map((q) => (
                <button
                  key={q}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-chocolate"
                maxLength={MAX_CHARS}
                placeholder={
                  i18n.language === "hy"
                    ? "Գրեք առիթը, նախասիրությունները կամ բյուջեն…"
                    : i18n.language === "ru"
                    ? "Опишите повод, предпочтения или бюджет…"
                    : "Describe occasion, preferences, or budget…"
                }
                aria-label="Message"
              />
              <span className="text-[11px] text-gray-400">{input.length}/{MAX_CHARS}</span>
              <button
                onClick={send}
                disabled={loading || input.trim() === ""}
                className="bg-chocolate text-white px-3 py-2 rounded-xl text-sm disabled:opacity-50"
              >
                {i18n.language === "hy" ? "Ուղարկել" : i18n.language === "ru" ? "Отправить" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}