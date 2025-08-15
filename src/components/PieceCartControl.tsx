import { FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function PieceCartControl({ product, cartItem, addToCart, removeFromCart }: any) {
  const count = cartItem?.quantity ?? 0;

  const { t } = useTranslation();

  const handleMinus = () => {
    if (count > 1) {
      addToCart({
        _id: product._id,
        name_en: product.name_en,
        name_hy: product.name_hy,
        name_ru: product.name_ru,
        price: product.price,
        discount: product.discount,
        images: product.images,
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
          name_en: product.name_en,
          name_hy: product.name_hy,
          name_ru: product.name_ru,
          price: product.price,
          discount: product.discount,
          images: product.images,
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
      name_en: product.name_en,
      name_hy: product.name_hy,
      name_ru: product.name_ru,
      price: product.price,
      discount: product.discount,
      images: product.images,
      status: product.status || "in_stock",
      readyAfter: product.readyAfter,
      quantity: 1,
    });
  };

  return count === 0 ? (
    <button
      className="add-btn flex items-center gap-2 px-4 py-2 font-semibold bg-chocolate text-chocolate hover:bg-chocolate-dark transition"
      onClick={handlePlus}
      type="button"
    >
      <FaShoppingCart className="text-lg text-chocolate" />
      {t("add")}
    </button>
  ) : (
    <div className="qty-control border border-chocolate rounded-[6px] flex gap-2 items-center px-2 py-1 bg-chocolate">
      <button
        className="add-btn text-xl px-3 rounded-[6px] hover:bg-chocolate/10 hover:text-white transition text-chocolate"
        onClick={handleMinus}
        type="button"
        aria-label="Decrease"
      >
        -
      </button>
      <span className="font-semibold text-base min-w-[20px] text-center text-chocolate">{count}</span>
      <button
        className="add-btn text-xl px-3 rounded-[6px] hover:bg-chocolate/10 hover:text-white transition text-chocolate"
        onClick={handlePlus}
        type="button"
        aria-label="Increase"
      >+</button>
    </div>
  );
}