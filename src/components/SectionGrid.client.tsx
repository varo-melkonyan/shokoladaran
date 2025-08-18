"use client";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

type Ad = {
  images: string[];
  link?: string;
};

// Inline fallback (no 404s)
const FALLBACK_IMG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'>No image</text></svg>`;

const safeImg = (src?: string) => {
  if (!src || src.trim() === "") return FALLBACK_IMG;
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("/")) return src;
  return `/${src}`; // make relative paths site-relative
};

export default function SectionGrid({
  title,
  items,
  ads = [],
}: {
  title: string;
  items: any[];
  ads?: Ad[];
}) {
  const { cart, removeFromCart, addToCart } = useCart();

  // Pick a random ad for mobile (client-only)
  const [randomAd, setRandomAd] = useState<null | { img: string; link?: string; key: string }>(null);
  const { t, i18n: i18next } = useTranslation();

  useEffect(() => {
    if (!ads.length) return;
    const flatAds = ads.flatMap(ad =>
      ad.images.map((img, i) => ({
        img,
        link: ad.link,
        key: `${ad.link || "img"}-${i}`,
      }))
    );
    if (!flatAds.length) return;
    setRandomAd(flatAds[Math.floor(Math.random() * flatAds.length)]);
  }, [ads]);

  // Helpers
  const hasValidDiscount = (item: any) =>
    typeof item?.discount === "number" &&
    typeof item?.price === "number" &&
    item.discount > 0 &&
    item.discount < item.price;

  const discountPercent = (item: any) =>
    hasValidDiscount(item) ? Math.round(100 - (item.discount / item.price) * 100) : 0;

  const getBrandLabel = (brand: unknown): string => {
    if (!brand) return "";
    if (typeof brand === "object" && brand !== null) {
      const obj = brand as Record<string, string | undefined>;
      const en = obj.brand_en ?? obj.name_en ?? "";
      const hy = obj.brand_hy ?? obj.name_hy ?? en;
      const ru = obj.brand_ru ?? obj.name_ru ?? en;
      return i18next.language === "hy" ? hy : i18next.language === "ru" ? ru : en;
    }
    return String(brand);
  };

  const productHref = (it: any) => `/product/${it._id || it.id}`;

  return (
    <>
      {/* Desktop/Tablet: All Ads */}
      {ads.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-10 hidden md:block">
          <div className="flex gap-6 flex-wrap justify-center">
            {ads.map((ad, idx) =>
              ad.images.map((img, i) =>
                ad.link ? (
                  <a
                    key={`${idx}-${i}`}
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={img}
                      alt="Advertisement"
                      className="rounded-xl shadow-lg w-auto h-64 object-cover"
                    />
                  </a>
                ) : (
                  <img
                    key={`${idx}-${i}`}
                    src={img}
                    alt="Advertisement"
                    className="rounded-xl shadow-lg w-auto h-64 object-cover"
                  />
                )
              )
            )}
          </div>
        </section>
      )}

      {/* Mobile: One Random Ad */}
      {randomAd && (
        <section className="block md:hidden px-4 mb-6">
          <div className="flex justify-center">
            {randomAd.link ? (
              <a href={randomAd.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={randomAd.img}
                  alt="Advertisement"
                  className="rounded-xl shadow-lg h-36 w-auto object-cover"
                  style={{ minWidth: 200, width: "auto", maxWidth: "100%" }}
                />
              </a>
            ) : (
              <img
                src={randomAd.img}
                alt="Advertisement"
                className="rounded-xl shadow-lg h-36 w-auto object-cover"
                style={{ minWidth: 200, width: "auto", maxWidth: "100%" }}
              />
            )}
          </div>
        </section>
      )}

      {/* Slider Section (Desktop/Tablet) */}
      <section className="py-6 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-chocolate mb-8 text-center">{title}</h2>
          <Slider
            dots={false}
            infinite
            speed={2000}
            slidesToShow={4}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={10}
            pauseOnHover
            arrows
            responsive={[
              { breakpoint: 1280, settings: { slidesToShow: 3 } },
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 640, settings: { slidesToShow: 1 } }
            ]}
          >
            {items.map((item, i) => {
              const cartItem = cart.find((ci) => ci._id === item._id);

              return (
                <div key={i} className="px-2">
                  <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
                    <div className="relative">
                      <Link href={productHref(item)}>
                        <img
                          src={safeImg(item.images?.[0])}
                          alt={item.name_en || item.title || "Product"}
                          className="w-full h-64 object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.onerror = null;
                            img.src = FALLBACK_IMG;
                          }}
                        />
                      </Link>

                      {/* Discount percent badge */}
                      {hasValidDiscount(item) && (
                        <span className="absolute top-3 left-3 bg-chocolate text-white text-xs font-bold px-2 py-1 rounded z-10 opacity-100 transition">
                          -{discountPercent(item)}%
                        </span>
                      )}

                      {/* Brand badge (3-language) */}
                      {item.brand && (
                        <span className="absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                          {getBrandLabel(item.brand)}
                        </span>
                      )}

                      {/* Price badge */}
                      <span className="absolute bottom-3 left-3 bg-white/90 text-chocolate text-sm font-bold px-3 py-1 rounded shadow z-10">
                        {hasValidDiscount(item) ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">{item.price} ֏</span>
                            <span className="text-chocolate font-extrabold">{item.discount} ֏</span>
                          </>
                        ) : (
                          <span className="text-chocolate font-extrabold">
                            {item.price ? `${item.price} ֏` : t("price_not_available") || "Price not available"}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col">
                      <h2 className="font-semibold text-chocolate text-base line-clamp-2 min-h-[44px]">
                        <Link href={productHref(item)} className="hover:underline">
                          {i18next.language === "hy"
                            ? (item.name_hy || item.name_en || item.title || "Product")
                            : i18next.language === "ru"
                            ? (item.name_ru || item.name_en || item.title || "Product")
                            : (item.name_en || item.title || "Product")}
                        </Link>
                      </h2>

                      <div className="mt-3 self-end pointer-events-auto opacity-100">
                        {item.quantityType === "kg" ? (
                          <KgCartControl product={item} cartItem={cartItem} addToCart={addToCart} />
                        ) : (
                          <PieceCartControl
                            product={item}
                            cartItem={cartItem}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>

      {/* Mobile Only Slider Section */}
      <section className="py-4 bg-white block md:hidden">
        <div className="max-w-full mx-auto px-2">
          <h2 className="text-2xl font-bold text-chocolate mb-4 text-center">{title}</h2>
        </div>
        <Slider
          infinite
          speed={500}
          slidesToShow={2}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={3000}
          pauseOnHover
          arrows={false}
          centerMode={false}
          centerPadding="0px"
        >
          {items.map((item, i) => {
            const cartItem = cart.find((ci) => ci._id === item._id);
            const qty = cartItem?.quantity ?? 0;
            const grams = (cartItem as any)?.grams as number | undefined;

            return (
              <div key={i} className="px-1">
                <div className="group bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="relative">
                    <Link href={productHref(item)}>
                      <img
                        src={safeImg(item.images?.[0])}
                        alt={item.name_en || item.title || "Product"}
                        className="w-full h-44 object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.onerror = null;
                          img.src = FALLBACK_IMG;
                        }}
                      />
                    </Link>

                    {/* Discount percent badge */}
                    {hasValidDiscount(item) && (
                      <span className="absolute top-2 left-2 bg-chocolate text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                        -{discountPercent(item)}%
                      </span>
                    )}

                    {/* Brand badge */}
                    {item.brand && (
                      <span className="absolute top-2 right-2 bg-white/80 text-chocolate text-[10px] font-semibold px-2 py-0.5 rounded z-10">
                        {getBrandLabel(item.brand)}
                      </span>
                    )}

                    {/* Price badge */}
                    <span className="absolute bottom-2 left-2 bg-white/90 text-chocolate text-xs font-bold px-2 py-0.5 rounded shadow z-10">
                      {hasValidDiscount(item) ? (
                        <>
                          <span className="line-through text-gray-400 mr-1">{item.price} ֏</span>
                          <span className="text-chocolate font-extrabold">{item.discount} ֏</span>
                        </>
                      ) : (
                        <span className="text-chocolate font-extrabold">
                          {item.price ? `${item.price} ֏` : t("price_not_available") || "Price not available"}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="p-3">
                    <h2 className="font-semibold text-chocolate text-base text-center line-clamp-2 min-h-[44px]">
                      {i18next.language === "hy"
                        ? item.name_hy
                        : i18next.language === "ru"
                        ? item.name_ru
                        : item.name_en}
                    </h2>
                    <div className="mt-3 flex justify-center">
                      {item.quantityType === "kg" ? (
                        <KgCartControl
                          product={item}
                          cartItem={cartItem}
                          addToCart={addToCart}
                        />
                      ) : (
                        <PieceCartControl
                          product={item}
                          cartItem={cartItem}
                          addToCart={addToCart}
                          removeFromCart={removeFromCart}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </section>
    </>
  );
}