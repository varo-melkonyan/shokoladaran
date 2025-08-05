"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";
import { useCart } from "@/context/CartContext";
import { t } from "i18next";
import { useTranslation } from "react-i18next";


export default function SearchComponent() {
  const { addToCart } = useCart();
  const { i18n } = useTranslation();
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Filter and normalize products
  const filtered = products
    .filter((product) =>
      product.name_en.toLowerCase().includes(query.toLowerCase()) ||
      product.name_hy.toLowerCase().includes(query.toLowerCase()) ||
      product.name_ru.toLowerCase().includes(query.toLowerCase())
    )
    .map((product) => ({
      ...product,
      _id: product._id || product.id,
      status:
        product.status === "in_stock" ||
        product.status === "out_of_stock" ||
        product.status === "pre_order"
          ? product.status
          : "in_stock",
    }));

  const handleAddToCart = (product: any) => {
    const lang = i18n.language;
    const name =
      lang === "en"
        ? product.name_en
        : lang === "hy"
        ? product.name_hy
        : product.name_ru;
    addToCart({ ...product, name });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Search results for: <span className="text-chocolate">{query}</span>
      </h1>
      {loading ? (
        <p className="text-gray-500">{t("loading")}</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <ProductList products={filtered} onAddToCart={handleAddToCart} />
      )}
    </div>
  );
}