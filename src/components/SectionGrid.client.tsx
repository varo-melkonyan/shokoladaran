"use client";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

type Ad = {
  images: string[];
  link?: string;
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

  return (
    <>
      {/* Desktop/Tablet: All Ads */}
      {ads.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-10 hidden md:block">
          <div className="flex gap-6 flex-wrap justify-center">
            {ads.map((ad, idx) =>
              ad.images.map((img, i) => (
                ad.link ? (
                  <a key={idx + "-" + i} href={ad.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={img}
                      alt="Advertisement"
                      className="rounded-xl shadow-lg w-auto h-64 object-cover"
                    />
                  </a>
                ) : (
                  <img
                    key={idx + "-" + i}
                    src={img}
                    alt="Advertisement"
                    className="rounded-xl shadow-lg w-auto h-64 object-cover"
                  />
                )
              ))
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

      {/* Slider Section */}
      <section className="py-6 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-chocolate mb-8 text-center">{title}</h2>
          <Slider
            dots={false}
            infinite={true}
            speed={2000}
            slidesToShow={4}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={10}
            pauseOnHover={true}
            arrows={true}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 1 } },
              { breakpoint: 640, settings: { slidesToShow: 1 } }
            ]}
          >
            {items.map((item, i) => {
              const cartItem = cart.find((ci) => ci._id === item._id);
              return (
                <div key={i} className="px-2">
                  <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
                    <div className="relative">
                      <a href={`/product/${item._id || item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name || item.title}
                          className="w-full h-48 object-cover cursor-pointer"
                        />
                      </a>
                    </div>
                    <div className="p-4">
                      <h2 className="font-semibold text-chocolate text-base md:text-l lg:text-l">
                        {item.name || item.title}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">{item.collectionType}</p>
                      <p className="text-chocolate font-bold mt-2">
                        {item.discount ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">{item.price} ֏</span>
                            <span className="text-red-600 font-extrabold">{item.discount} ֏</span>
                          </>
                        ) : (
                          item.price ? `${item.price} ֏` : "Price not available"
                        )}
                      </p>
                      <div className="mt-3">
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
        </div>
      </section>

      {/* Mobile Only Slider Section */}
      <section className="py-4 bg-white block md:hidden">
        <div className="max-w-full mx-auto px-2">
          <h2 className="text-2xl font-bold text-chocolate mb-4 text-center">{title}</h2>
          <Slider
            infinite={true}
            speed={500}
            slidesToShow={2}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
            pauseOnHover={true}
            arrows={false}
            centerMode={false}
            centerPadding="0px"
          >
            {items.map((item, i) => {
              const cartItem = cart.find((ci) => ci._id === item._id);
              return (
                <div key={i} className="px-1">
                  <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
                    <div className="relative">
                      <a href={`/product/${item._id || item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name || item.title}
                          className="w-full h-40 object-cover cursor-pointer"
                        />
                      </a>
                    </div>
                    <div className="p-3">
                      <h2 className="font-semibold text-chocolate text-base text-center">
                        {item.name || item.title}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1 text-center">{item.collectionType}</p>
                      <p className="text-chocolate font-bold mt-2 text-center">
                        {item.discount ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">{item.price} ֏</span>
                            <span className="text-red-600 font-extrabold">{item.discount} ֏</span>
                          </>
                        ) : (
                          item.price ? `${item.price} ֏` : "Price not available"
                        )}
                      </p>
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
        </div>
      </section>
    </>
  );
}