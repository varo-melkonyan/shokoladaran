"use client";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  return (
    <>
      {/* Dynamic Ads Section */}
      {ads.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-10">
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

      {/* Slider Section */}
      <section className="py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-chocolate mb-8 text-center">{title}</h2>
          <Slider
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={1500}
            pauseOnHover={true}
            arrows={true}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
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
    </>
  );
}