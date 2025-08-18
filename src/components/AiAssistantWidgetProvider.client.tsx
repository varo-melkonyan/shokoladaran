"use client";

import { useEffect, useMemo, useState } from "react";
import AiAssistantWidget from "./AiAssistantWidget";

type ProductLite = {
  _id: string;
  name_en?: string;
  name_hy?: string;
  name_ru?: string;
  price?: number;
  discount?: number | null;
  brand?: any;
  collectionType?: any;
  images?: string[];
};

export default function AiAssistantWidgetProvider() {
  const [raw, setRaw] = useState<ProductLite[] | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        const mapped: ProductLite[] = (Array.isArray(data) ? data : []).map((p: any) => ({
          _id: p._id || p.id,
          name_en: p.name_en,
          name_hy: p.name_hy,
          name_ru: p.name_ru,
          price: p.price,
          discount: p.discount,
          images: p.images,
          brand:
            typeof p.brand === "object" && p.brand
              ? {
                  _id: p.brand._id || p.brand.id,
                  name_en: p.brand.name_en ?? p.brand.brand_en,
                  name_hy: p.brand.name_hy ?? p.brand.brand_hy,
                  name_ru: p.brand.name_ru ?? p.brand.brand_ru,
                }
              : p.brand,
          collectionType:
            typeof p.collectionType === "object" && p.collectionType
              ? {
                  _id: p.collectionType._id || p.collectionType.id,
                  name_en: p.collectionType.name_en,
                  name_hy: p.collectionType.name_hy,
                  name_ru: p.collectionType.name_ru,
                }
              : p.collectionType,
        }));
        setRaw(mapped);
      } catch {
        setRaw([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // de-duplicate by _id and limit payload
  const products = useMemo(() => {
    if (!raw) return [] as ProductLite[];
    const seen = new Set<string>();
    const out: ProductLite[] = [];
    for (const p of raw) {
      const id = p._id;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push(p);
      if (out.length >= 200) break; // keep widget light
    }
    return out;
  }, [raw]);

  return <AiAssistantWidget products={products} />;
}