"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Gift = {
  _id: string;
  name?: string;
  title?: string;
  image: string;
  price: number;
  discount?: number;
  link?: string;
};

export default function GiftsClient() {
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    fetch("/api/gifts")
      .then((res) => res.json())
      .then((data) => setGifts(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-chocolate mb-10 text-center">Gifts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {gifts.map((item, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
            <img src={item.image} alt={item.title || item.name} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h2 className="font-semibold text-chocolate text-base md:text-l lg:text-l">
                {item.title || item.name}
              </h2>
              <div className="mt-2 mb-3">
                {item.discount ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">{item.price} AMD</span>
                    <span className="text-chocolate font-bold">{item.discount} AMD</span>
                  </>
                ) : (
                  <span className="text-chocolate font-bold">{item.price} AMD</span>
                )}
              </div>
              <Link
                href={item.link || `/product/${item._id}`}
                className="mt-3 inline-block text-white bg-chocolate px-4 py-2 rounded hover:bg-brown-700"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}