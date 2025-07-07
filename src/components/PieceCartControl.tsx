import { FaShoppingCart } from "react-icons/fa";

export default function PieceCartControl({ product, cartItem, addToCart, removeFromCart }: any) {
  const count = cartItem?.quantity ?? 0;

  const handleMinus = () => {
    if (count > 1) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        image: product.image,
        status: product.status || "in_stock",
        readyAfter: product.readyAfter,
        quantity: -1,
      });
    } else if (count === 1) {
      if (removeFromCart) {
        removeFromCart(product._id);
      } else {
        addToCart({
          _id: product._id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          image: product.image,
          status: product.status || "in_stock",
          readyAfter: product.readyAfter,
          quantity: 0,
        });
      }
    }
  };

  const handlePlus = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.image,
      status: product.status || "in_stock",
      readyAfter: product.readyAfter,
      quantity: 1,
    });
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center bg-gray-100 rounded-lg shadow-inner px-1 py-1">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-l-lg text-lg font-bold transition"
          onClick={handleMinus}
          type="button"
          // No longer disable at count === 1
          disabled={count <= 0}
        >-</button>
        <span className="w-12 border-0 bg-transparent text-center font-semibold focus:outline-none">{count}</span>
        <button
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r-lg text-lg font-bold transition"
          onClick={handlePlus}
          type="button"
        >+</button>
      </div>
    </div>
  );
}