import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages = [], user = "", products = [], locale = "en" } = await req.json();

    const MAX_CHARS = 2400;
    const safeUser = String(user).slice(0, MAX_CHARS);

    // helpers
    const effPrice = (p: any) =>
      typeof p?.discount === "number" && typeof p?.price === "number" && p.discount > 0 && p.discount < p.price
        ? p.discount
        : p?.price;

    const parseMaxBudget = (text: string): number | null => {
      const t = text.toLowerCase();
      const hasBudgetCue = /(մինչև|բյուջե|առավելագույն|до|бюджет|макс|max|under|<=|≤|up to|no more than)/i.test(t);
      const m = t.match(/(\d[\d\s.,]*)/);
      if (!m) return null;
      const raw = m[1].replace(/\s+/g, "").replace(",", ".");
      const n = Number(raw);
      if (!isFinite(n) || n <= 0) return null;
      return hasBudgetCue ? Math.round(n) : null;
    };

    type PriceIntent = "expensive" | "cheap" | "discount" | null;

    const detectPriceIntent = (text: string): PriceIntent => {
      const t = text.toLowerCase();
      if (/(ամենաթանկ|ամենա\s*թանկ|թանկ|most\s*expensive|highest\s*price|дорог|самый\s*дорог)/i.test(t)) return "expensive";
      if (/(էժան|ամենաէժան|cheapest|cheap|low\s*price|самый\s*деш|дешев)/i.test(t)) return "cheap";
      if (/(զեղչ|скид|biggest\s*discount|largest\s*discount|best\s*discount)/i.test(t)) return "discount";
      return null;
    };

    const budgetAMD = parseMaxBudget(safeUser);
    const priceIntent = detectPriceIntent(safeUser);

    const byDiscountValue = (a: any, b: any) => {
      const adis = (typeof a.price === "number" ? a.price : 0) - (typeof a.discount === "number" ? a.discount : 0);
      const bdis = (typeof b.price === "number" ? b.price : 0) - (typeof b.discount === "number" ? b.discount : 0);
      return bdis - adis;
    };

    const byPriceAsc = (a: any, b: any) => {
      const ap = effPrice(a) ?? Number.POSITIVE_INFINITY;
      const bp = effPrice(b) ?? Number.POSITIVE_INFINITY;
      return ap - bp;
    };

    const byPriceDesc = (a: any, b: any) => {
      const ap = effPrice(a) ?? Number.NEGATIVE_INFINITY;
      const bp = effPrice(b) ?? Number.NEGATIVE_INFINITY;
      return bp - ap;
    };

    // candidates and filters
    const candidates: any[] = Array.isArray(products) ? products.filter(Boolean) : [];

    const budgeted = budgetAMD
      ? candidates.filter((p) => {
          const pr = effPrice(p);
          return typeof pr === "number" && pr <= budgetAMD!;
        })
      : candidates;

    const base = (budgetAMD ? budgeted : candidates).slice();

    let sorted: any[] = [];
    if (base.length) {
      if (priceIntent === "expensive") sorted = base.sort(byPriceDesc);
      else if (priceIntent === "cheap") sorted = base.sort(byPriceAsc);
      else sorted = base.sort(byDiscountValue);
    } else {
      sorted = candidates.slice().sort(byPriceAsc);
    }

    // suggestions (images + links)
    const toName = (p: any) =>
      locale === "hy" ? p.name_hy || p.name_en : locale === "ru" ? p.name_ru || p.name_en : p.name_en;

    const toHref = (p: any) => p.link || `/product/${p._id || p.id}`;

    // Build absolute image URLs for suggestions
    const origin = req.headers.get("origin") || new URL(req.url).origin || "";

    const FALLBACK_IMG = "https://via.placeholder.com/200x200?text=No+Image";

    const toImage = (p: any) => {
      const src = Array.isArray(p.images) && typeof p.images[0] === "string" ? p.images[0] : "";
      if (!src) return FALLBACK_IMG;
      if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
      if (src.startsWith("/")) return `${origin}${src}`;
      return `${origin}/${src}`;
    };

    const picked = sorted.slice(0, 6);

    const suggestions = picked.map((p) => ({
      id: String(p._id || p.id || ""),
      href: toHref(p),
      image: toImage(p),
      name: toName(p) || "Product",
      price: effPrice(p) ?? null,
      origPrice: typeof p.price === "number" ? p.price : null,
    }));

    // system + catalog snippet (for LLM)
    const sys =
      locale === "hy"
        ? "Դու շոկոլադի խանութի օգնական ես։ Եթե կա բյուջե՝ առաջարկիր միայն գին ≤ բյուջե (AMD) ապրանքներ։ Պահպանիր օգտատիրոջ գնային նախապատվությունը (ամենաթանկ/ամենաէժան/լավագույն զեղչ): Առաջարկիր 3–6 կետերով, գներով։"
        : locale === "ru"
        ? "Вы помощник магазина шоколада. Если указан бюджет — предлагайте только товары с ценой ≤ бюджет (AMD). Учитывайте ценовые намерения (самые дорогие/самые недорогие/лучшая скидка). Дайте 3–6 пунктов с ценой."
        : "You are a chocolate shop assistant. If a budget is provided, only suggest items priced ≤ budget (AMD). Respect price intent (most expensive/cheapest/best discount). Provide 3–6 bullet points with prices.";

    const catalogSnippet = picked
      .map((p: any) => `- ${toName(p)} • ${effPrice(p) ?? "—"} AMD`)
      .join("\n");

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const userWithControls =
        `User: ${safeUser}` +
        (budgetAMD ? `\nBudget: ${budgetAMD} AMD (only ≤ this)` : "") +
        (priceIntent ? `\nPriceIntent: ${priceIntent}` : "") +
        `\n\nCatalog (sorted sample):\n${catalogSnippet || "(no catalog)"}`;

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,
          max_tokens: 700,
          messages: [
            { role: "system", content: sys },
            // pass through conversation history
            ...Array.isArray(messages)
              ? messages
                  .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
                  .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, MAX_CHARS) }))
              : [],
            { role: "user", content: userWithControls },
          ],
        }),
      });

      const j = await r.json().catch(() => ({} as any));

      const reply = (j?.choices?.[0]?.message?.content ||
        (locale === "hy" ? "Ահա մի քանի առաջարկ։" : locale === "ru" ? "Вот несколько предложений." : "Here are some suggestions.")) as string;

      return new Response(
        JSON.stringify({ reply: reply.slice(0, MAX_CHARS), suggestions }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fallback reply text (no OpenAI key)
    const header =
      priceIntent === "expensive"
        ? locale === "hy"
          ? "Ահա ամենաթանկ տարբերակները."
          : locale === "ru"
          ? "Вот самые дорогие варианты."
          : "Here are the most expensive picks."
        : priceIntent === "cheap"
        ? locale === "hy"
          ? "Ահա ամենաէժան տարբերակները."
          : locale === "ru"
          ? "Вот самые недорогие варианты."
          : "Here are the cheapest picks."
        : locale === "hy"
        ? "Ահա առաջարկներ լավագույն զեղչերով."
        : locale === "ru"
        ? "Вот варианты с лучшими скидками."
        : "Here are a few picks with the best discounts.";

    const reply = `${header}\n`.slice(0, MAX_CHARS);

    return new Response(JSON.stringify({ reply, suggestions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ reply: "Assistant error.", suggestions: [] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}