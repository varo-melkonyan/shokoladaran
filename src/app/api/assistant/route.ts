import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageToolCall } from "openai/resources/chat/completions";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages = [], user = "", products = [], locale = "en" } = await req.json();
    const MAX_CHARS = 2400;
    const safeUser = String(user).slice(0, MAX_CHARS);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const hasApiKey = !!process.env.OPENAI_API_KEY;

    // Helper functions
    const effPrice = (p: any) => typeof p?.discount === "number" && typeof p?.price === "number" && p.discount > 0 && p.discount < p.price ? p.discount : p?.price;
    const toName = (p: any) => {
        const name = locale === "hy" ? p.name_hy || p.name_en : locale === "ru" ? p.name_ru || p.name_en : p.name_en;
        return name ?? "Product";
    };
    const origin = req.headers.get("origin") || new URL(req.url).origin || "";
    
    const toImage = (p: any) => {
      const src = typeof p.image === "string" && p.image.trim() !== ""
        ? p.image
        : (Array.isArray(p.images) && typeof p.images[0] === "string"
          ? p.images[0]
          : "");
      
      if (!src) return "";
      if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
      if (src.startsWith("/")) return `${origin}${src}`;
      return `${origin}/${src}`;
    };

    const parsePriceRange = (text: string): { min: number | null, max: number | null } => {
      const t = text.toLowerCase().replace(/\s*-\s*/, '-');
      const m = t.match(/(\d+[,.]?\d*)(?:-)?(\d+[,.]?\d*)?/);
      if (!m) return { min: null, max: null };
      
      const rawMin = m[1]?.replace(",", ".");
      const rawMax = m[2]?.replace(",", ".");
      
      const min = Number(rawMin);
      const max = rawMax ? Number(rawMax) : null;
      
      if (max === null) {
          if (/(մինչև|մինչև|մաքս|max|under|up to|no more than)/i.test(t)) {
              return { min: null, max: min };
          }
          if (/(սկսած|starting from|from|от|starting from|from)/i.test(t)) {
              return { min: min, max: null };
          }
          return { min: min, max: min };
      }
      
      return { min: Math.min(min, max), max: Math.max(min, max) };
    };

    type PriceIntent = "expensive" | "cheap" | "discount" | null;
    const detectPriceIntent = (text: string): PriceIntent => {
      const t = text.toLowerCase();
      if (/(ամենաթանկ|թանկ|most\s+expensive|expensive|highest\s+price|բարձր|թանկարժեք|բարձր|թանկարժեք|дорог|самый\s+дорог|дорогие|дорогой)/i.test(t)) return "expensive";
      if (/(էժան|ամենաէժան|cheapest|cheap|low\s+price|ցածր|մատչելի|ցածր|մատչելի|самый\s+деш|дешев|недорого|недорогие)/i.test(t)) return "cheap";
      if (/(զեղչ|скиդ|biggest\s+discount|largest\s+discount|best\s+discount)/i.test(t)) return "discount";
      return null;
    };
    
    const detectKeywords = (text: string): string[] => {
      const t = text.toLowerCase();
      const keywords: string[] = [];
      if (/(վեգան|vegan)/i.test(t)) keywords.push("vegan");
      if (/(կաթնային|milk|молочн)/i.test(t)) keywords.push("milk");
      if (/(սև|դառը|dark|горьկ)/i.test(t)) keywords.push("dark");
      if (/(սպիտակ|white|беլ)/i.test(t)) keywords.push("white");
      if (/(նշանավոր|լեգենդ|legend)/i.test(t)) keywords.push("legend");
      if (/(նվեր|gift|подар)/i.test(t)) keywords.push("gift");
      if (/(ընկույզ|նուշ|հունական|nut|almond|walnut|орех|миндаլ|греց)/i.test(t)) keywords.push("nuts");
      if (/(մրգեր|ջեմ|fruit|jam|ֆրուկտ|ջեմ)/i.test(t)) keywords.push("fruit");
      return keywords;
    };

    // Define the function for the LLM
    const tools = [
      {
        type: "function" as const,
        function: {
          name: "get_product_recommendations",
          description: "Get a list of product recommendations from the store catalog based on user preferences.",
          parameters: {
            type: "object",
            properties: {
              budget_min: {
                type: "number",
                description: "The minimum budget for products in AMD.",
              },
              budget_max: {
                type: "number",
                description: "The maximum budget for products in AMD.",
              },
              price_intent: {
                type: "string",
                enum: ["expensive", "cheap", "discount"],
                description: "User's preference for product price (e.g., 'most expensive', 'cheapest', 'biggest discount').",
              },
              keywords: {
                type: "array",
                items: { type: "string" },
                description: "An array of keywords to filter products, such as 'vegan', 'dark chocolate', 'nuts', 'gift', etc."
              },
            },
          },
        },
      },
    ];
    
    const generatePrompts = (keywords: string[], priceIntent: PriceIntent) => {
      const newPrompts = new Set<string>();
      
      const translations = {
        hy: {
          vegan: "Վեգան շոկոլադ",
          milk: "Կաթնային շոկոլադ",
          dark: "Մուգ շոկոլադ",
          white: "Սպիտակ շոկոլադ",
          nuts: "Շոկոլադ ընկույզով",
          fruit: "Շոկոլադ մրգերով",
          gift: "Նվերների հավաքածու",
          expensive: "Ամենաթանկը",
          cheap: "Ամենաէժանը",
          discount: "Ամենամեծ զեղչը",
        },
        ru: {
          vegan: "Веганский шоколад",
          milk: "Молочный шоколад",
          dark: "Темный шоколад",
          white: "Белый шоколад",
          nuts: "Шоколад с орехами",
          fruit: "Шоколад с фруктами",
          gift: "Подарочный набор",
          expensive: "Самые дорогие",
          cheap: "Самые дешевые",
          discount: "Самая большая скидка",
        },
        en: {
          vegan: "Vegan chocolate",
          milk: "Milk chocolate",
          dark: "Dark chocolate",
          white: "White chocolate",
          nuts: "Chocolate with nuts",
          fruit: "Chocolate with fruit",
          gift: "Gift sets",
          expensive: "Most expensive",
          cheap: "Cheapest",
          discount: "Biggest discount",
        }
      };

      if (keywords) {
        keywords.forEach(kw => {
          if (kw in translations[locale]) {
            newPrompts.add(translations[locale][kw as keyof typeof translations.en]);
          }
        });
      }
      
      if (priceIntent) {
        if (priceIntent in translations[locale]) {
          newPrompts.add(translations[locale][priceIntent as keyof typeof translations.en]);
        }
      }

      if (newPrompts.size === 0) {
        newPrompts.add(translations[locale].milk);
        newPrompts.add(translations[locale].dark);
        newPrompts.add(translations[locale].cheap);
      }
      
      return Array.from(newPrompts).slice(0, 4);
    };

    if (hasApiKey) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 700,
        messages: [{ role: "system", content: "You are a helpful chocolate shop assistant. You respond to user queries about products and make recommendations. If you need to suggest products, call the `get_product_recommendations` function. Provide a natural language response to the user, not a code block or function call itself." }, ...messages.slice(-5)],
        tools: tools,
        tool_choice: "auto",
      });

      const responseMessage = completion.choices[0].message;
      const toolCalls = responseMessage.tool_calls as ChatCompletionMessageToolCall[] | undefined;
      
      let dynamicPrompts: string[] = [];
      let reply = responseMessage.content || "I'm sorry, I couldn't find a suitable recommendation.";
      type Suggestion = {
        id: string;
        href: string;
        image: string;
        name: string;
        price: number | null;
      };
      let suggestions: Suggestion[] = [];

      if (toolCalls && toolCalls.length > 0) {
        const firstToolCall = toolCalls[0];
        
        if (firstToolCall.type === "function") {
            const functionName = firstToolCall.function.name;

            if (functionName === "get_product_recommendations") {
              const functionArgs = JSON.parse(firstToolCall.function.arguments);
              const { budget_min, budget_max, price_intent, keywords } = functionArgs;

              const filtered = products.filter((p: any) => {
                const pr = effPrice(p);
                const matchesMinBudget = !budget_min || (typeof pr === "number" && pr >= budget_min);
                const matchesMaxBudget = !budget_max || (typeof pr === "number" && pr <= budget_max);
                const matchesKeywords = !keywords || keywords.every((keyword: string) => JSON.stringify(p).toLowerCase().includes(keyword.toLowerCase()));
                return matchesMinBudget && matchesMaxBudget && matchesKeywords;
              });

              const sorted = filtered.slice().sort((a, b) => {
                if (price_intent === "expensive") return (effPrice(b) ?? 0) - (effPrice(a) ?? 0);
                if (price_intent === "cheap") return (effPrice(a) ?? 0) - (effPrice(b) ?? 0);
                return (b.price - (b.discount ?? 0)) - (a.price - (a.discount ?? 0));
              });
              
              const picked = sorted.slice(0, 6);
              suggestions = picked.map((p) => ({
                id: String(p._id || p.id || ""),
                href: `/product/${p._id || p.id}`,
                image: toImage(p),
                name: toName(p),
                price: effPrice(p) ?? null,
              }));

              const catalogSnippet = picked.map((p: any) => `- ${toName(p)} • ${effPrice(p) ?? "—"} AMD`).join("\n");
              const functionResponse = { success: true, count: picked.length, results: catalogSnippet };

              const secondCompletion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: "You are a helpful chocolate shop assistant. You respond to user queries about products and make recommendations. Use the provided product list to answer the user naturally." },
                  ...messages.slice(-5),
                  responseMessage,
                  {
                    tool_call_id: firstToolCall.id,
                    role: "tool",
                    name: functionName,
                    content: JSON.stringify(functionResponse),
                  },
                ],
              });

              reply = secondCompletion.choices[0].message.content || "Here are some suggestions.";
              dynamicPrompts = generatePrompts(keywords, price_intent);
            }
        }
      } else {
        const { min: budgetMin, max: budgetMax } = parsePriceRange(safeUser);
        const priceIntent = detectPriceIntent(safeUser);
        const keywords = detectKeywords(safeUser);
        dynamicPrompts = generatePrompts(keywords, priceIntent);
      }

      return new Response(JSON.stringify({
        reply: reply.slice(0, MAX_CHARS),
        suggestions,
        prompts: dynamicPrompts,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { min: budgetMin, max: budgetMax } = parsePriceRange(safeUser);
    const priceIntent = detectPriceIntent(safeUser);
    const keywords = detectKeywords(safeUser);

    const filtered = products.filter((p: any) => {
      const pr = effPrice(p);
      const matchesMinBudget = !budgetMin || (typeof pr === "number" && pr >= budgetMin);
      const matchesMaxBudget = !budgetMax || (typeof pr === "number" && pr <= budgetMax);
      const matchesKeywords = keywords.every(kw => JSON.stringify(p).toLowerCase().includes(kw.toLowerCase()));
      return matchesMinBudget && matchesMaxBudget && matchesKeywords;
    });

    const sorted = filtered.slice().sort((a, b) => {
      if (priceIntent === "expensive") return (effPrice(b) ?? 0) - (effPrice(a) ?? 0);
      if (priceIntent === "cheap") return (effPrice(a) ?? 0) - (effPrice(b) ?? 0);
      return (b.price - (b.discount ?? 0)) - (a.price - (a.discount ?? 0));
    });

    const picked = sorted.slice(0, 6);
    const suggestions = picked.map((p) => ({
      id: String(p._id || p.id || ""),
      href: `/product/${p._id || p.id}`,
      image: toImage(p),
      name: toName(p),
      price: effPrice(p) ?? null,
    }));
    
    const dynamicPrompts = generatePrompts(keywords, priceIntent);

    const header =
      priceIntent === "expensive"
        ? locale === "hy" ? "Ահա ամենաթանկ տարբերակները." : locale === "ru" ? "Вот самые дорогие варианты." : "Here are the most expensive picks."
        : priceIntent === "cheap"
        ? locale === "hy" ? "Ահա ամենաէժան տարբերակները." : locale === "ru" ? "Вот самые недорогие варианты." : "Here are the cheapest picks."
        : locale === "hy" ? "Ահա առաջարկներ լավագույն զեղչերով." : locale === "ru" ? "Вот варианты с лучшими скидками." : "Here are a few picks with the best discounts.";
    
    const reply = header.slice(0, MAX_CHARS);

    return new Response(JSON.stringify({ reply, suggestions, prompts: dynamicPrompts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Assistant API Error:", e);
    return new Response(JSON.stringify({ reply: "Assistant error. Please try again.", suggestions: [], prompts: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}