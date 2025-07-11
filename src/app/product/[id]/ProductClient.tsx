"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";

export default function ProductClient({
  product,
  recommendations,
}: {
  product: any;
  recommendations: any[];
}) {
  const { addToCart, removeFromCart, cart } = useCart();

  // Find this product in the cart
  const cartItem = cart.find((item) => item._id === product._id);

  return (
    <div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-8">
        {/* Left: Product Images */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-contain rounded-xl"
            />
          </div>
        </div>
        {/* Right: Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-chocolate mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-end gap-3 mb-4">
              {product.discount ? (
                <>
                  <span className="line-through text-gray-400 text-lg">{product.price} AMD</span>
                  <span className="text-red-600 font-bold text-2xl">{product.discount} AMD</span>
                </>
              ) : (
                <span className="text-chocolate font-bold text-2xl">{product.price} AMD</span>
              )}
            </div>
            <div className="flex gap-6 mb-4">
              <div>
                <span className="font-semibold text-chocolate">Brand:</span>{" "}
                <span className="text-gray-700">{product.brand}</span>
              </div>
              <div>
                <span className="font-semibold text-chocolate">Collection:</span>{" "}
                <span className="text-gray-700">{product.collectionType}</span>
              </div>
            </div>
            {/* Cart Control */}
            <div className="mt-6">
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
      </div>
      {/* Recommendations */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6 text-chocolate">Recommended Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {recommendations.map((rec) => (
            <div key={rec._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <Link href={`/product/${rec._id}`}>
                <img
                  src={rec.image}
                  alt={rec.name}
                  className="w-full h-40 object-contain mb-2 rounded cursor-pointer"
                />
              </Link>
              <div className="font-semibold text-chocolate">{rec.name}</div>
              <div className="text-red-600 font-bold">
                {rec.discount ? `${rec.discount} AMD` : `${rec.price} AMD`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}