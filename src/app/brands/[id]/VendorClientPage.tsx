"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

type Brand = {
  _id: string;
  name: string;
  images?: string[];
  description?: string;
  website?: string;
};

type CollectionType = {
  _id: string;
  name: string;
  type: string;
};

export default function VendorClientPage({ slug }: { slug: string }) {
  const { addToCart, cart, setCart } = useCart();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const { t } = useTranslation();

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/brands").then(res => res.json()),
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/collection-types").then(res => res.json()),
    ]).then(([brandsRaw, productsRaw, collectionsRaw]) => {
      const brands = brandsRaw.map((b: any) => ({
        _id: b._id || b.id,
        name: b.name,
        images: b.images,
        description: b.description,
        website: b.website,
      }));

      const products = productsRaw.map((p: any) => ({
        _id: p._id || p.id,
        name_en: p.name_en,
        name_hy: p.name_hy,
        name_ru: p.name_ru,
        price: p.price,
        weight: p.weight,
        discount: p.discount,
        collectionType: p.collectionType,
        brand: p.brand,
        images: p.images,
        link: p.link,
        status: p.status ?? "in_stock",
        readyAfter: p.readyAfter,
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
        quantityType: p.quantityType || "pieces",
      }));

      const collections = collectionsRaw.map((c: any) => ({
        _id: c._id || c.id,
        name: c.name,
        type: c.type,
      }));

      // Match by slug (id in URL)
      const matchedBrand = brands.find(
        (b: Brand) => b.name.toLowerCase().replace(/\s+/g, "-") === slug
      );
      setBrand(matchedBrand || null);
      setCollectionTypes(collections);
      setProducts(
        matchedBrand
          ? products.filter((p: Product) => p.brand === matchedBrand.name)
          : []
      );
      setLoading(false);
    });
  }, [slug]);

  function removeFromCart(productId: string) {
    setCart(cart => cart.filter(item => item._id !== productId));
  }

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-12">{t("loading")}</div>;
  if (!brand) return notFound();

  let filteredProducts = products;
  if (selectedCollection !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.collectionType === selectedCollection
    );
  }

  if (sortBy === "price-asc") filteredProducts = [...filteredProducts].sort((a, b) => (a.discount ?? a.price) - (b.discount ?? b.price));
  if (sortBy === "price-desc") filteredProducts = [...filteredProducts].sort((a, b) => (b.discount ?? b.price) - (a.discount ?? a.price));
  if (sortBy === "name-asc") filteredProducts = [...filteredProducts].sort((a, b) => a.name_en.localeCompare(b.name_en));
  if (sortBy === "name-desc") filteredProducts = [...filteredProducts].sort((a, b) => b.name_en.localeCompare(a.name_en));

  const brandCollections = Array.from(
    new Set(products.map((p) => p.collectionType))
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {brand.images && (
          <img
            src={brand.images[0]}
            alt={brand.name}
            className="w-40 h-40 object-cover rounded shadow"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-2">{brand.name}</h1>
          {brand.description && (
            <p className="mb-4 text-gray-700">{brand.description}</p>
          )}
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-chocolate text-white px-4 py-2 rounded mb-2"
            >
              {t("visit_website")}
            </a>
          )}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-chocolate mb-6">{t("products")}</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedCollection}
            onChange={e => setSelectedCollection(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">{t("all_collections")}</option>
            {brandCollections.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="price-asc">{t("sort_options.price_low_to_high")}</option>
            <option value="price-desc">{t("sort_options.price_high_to_low")}</option>
            <option value="name-asc">{t("sort_options.name_asc")}</option>
            <option value="name-desc">{t("sort_options.name_desc")}</option>
          </select>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item._id === product._id);
              const quantity = cartItem?.quantity ?? 0;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg p-4 relative transition-transform hover:scale-105 hover:shadow-2xl flex flex-col"
                >
                  <div className="relative">
                    {product.images && (
                      <a href={`/product/${product._id}`}>
                        <img
                          src={product.images[0]}
                          alt={product.name_en}
                          className="w-full h-40 object-cover rounded-xl mb-4"
                        />
                      </a>
                    )}
                    {quantity > 0 && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                        {product.quantityType === "kg" && cartItem?.grams
                          ? `${cartItem.grams}g`
                          : quantity}
                      </span>
                    )}
                    {/* Info Button */}
                    {/* <div className="absolute top-2 right-2 group">
                      <button
                        className="bg-white/90 hover:bg-chocolate text-chocolate hover:text-white rounded-full w-8 h-8 flex items-center justify-center shadow border border-gray-200"
                        type="button"
                        aria-label="Product info"
                      >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="white"/>
                          <rect x="9.25" y="8" width="1.5" height="5" rx="0.75" fill="currentColor"/>
                          <rect x="9.25" y="5" width="1.5" height="1.5" rx="0.75" fill="currentColor"/>
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-chocolate rounded-lg shadow-lg p-4 text-xs text-gray-700 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                        {product.name && (
                          <div className="mb-1"><b>Name:</b> {product.name}</div>
                        )}
                        {(product.discount || product.price) && (
                          <div className="mb-1">
                            <b>Price:</b> {product.discount ? `${product.discount} AMD (Discounted)` : `${product.price} AMD`}
                          </div>
                        )}
                        {product.brand && (
                          <div className="mb-1"><b>Brand:</b> {product.brand}</div>
                        )}
                        {product.weight && (
                          <div className="mb-1"><b>Weight:</b> {product.weight} g</div>
                        )}
                        {product.collectionType && (
                          <div className="mb-1"><b>Collection Type:</b> {product.collectionType}</div>
                        )}
                        {product.status && (
                          <div className="mb-1"><b>Status:</b> {product.status}</div>
                        )}
                        {product.ingredients && (
                          <div className="mb-1">
                            <b>Ingredients:</b> {Array.isArray(product.ingredients)
                              ? product.ingredients.join(", ")
                              : product.ingredients}
                          </div>
                        )}
                        {product.readyAfter && (
                          <div className="mb-1"><b>Ready After:</b> {product.readyAfter}</div>
                        )}
                        {product.shelfLife && (
                          <div className="mb-1"><b>Shelf Life:</b> {product.shelfLife}</div>
                        )}
                        {product.nutritionFacts && (
                          <div className="mb-1">
                            <b>Nutrition Facts:</b>
                            <ul className="ml-2 list-disc">
                              {Object.entries(product.nutritionFacts).map(([key, value]) => (
                                <li key={key}><b>{key}:</b> {value}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div> */}
                    {/* </div> */}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-chocolate text-lg mb-1">
                        {
                          i18n.language === "hy"
                            ? product.name_hy
                            : i18n.language === "ru"
                            ? product.name_ru
                            : product.name_en
                        }
                      </h2>
                      <p className="text-sm text-gray-500 mb-1">
                        {product.discount ? (
                          <>
                            <span className="line-through mr-2">{product.price} {t("amd")}</span>
                            <span className="text-red-600">{product.discount} {t("amd")}</span>
                          </>
                        ) : (
                          <>{product.price} {t("amd")}</>
                        )}
                      </p>
                    </div>
                    <div className="mt-4">
                      {product.quantityType === "kg" ? (
                        <KgCartControl
                          product={product}
                          cartItem={cartItem}
                          addToCart={addToCart}
                        />
                      ) : (
                        <PieceCartControl
                          product={product}
                          cartItem={cartItem}
                          addToCart={addToCart}
                          removeFromCart={removeFromCart}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 mt-12">No products found for this brand.</div>
        )}
      </section>
    </main>
  );
}