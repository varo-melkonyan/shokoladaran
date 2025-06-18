import { Product } from "@/types/product";

type Props = {
  product: Product;
  onClose: () => void;
};

export default function ProductInfoModal({ product, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">×</button>
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <ul className="space-y-1">
          <li><b>Brand:</b> {product.brand}</li>
          <li><b>Weight:</b> {product.weight}</li>
          <li><b>Collection Type:</b> {product.collectionType}</li>
          <li><b>Price:</b> {product.price} ֏</li>
          {product.status && <li><b>Status:</b> {product.status}</li>}
          {product.ingredients && (
            <li>
              <b>Ingredients:</b> {Array.isArray(product.ingredients) ? product.ingredients.join(", ") : product.ingredients}
            </li>
          )}
          {product.shelfLife && <li><b>Shelf Life:</b> {product.shelfLife}</li>}
          {product.nutritionFacts && (
            <li>
              <b>Nutrition Facts:</b>
              <ul className="ml-4">
                {Object.entries(product.nutritionFacts).map(([key, value]) => (
                  <li key={key}><b>{key}:</b> {value}</li>
                ))}
              </ul>
            </li>
          )}
          <li>
            <b>Link:</b>{" "}
            <a
              href={product.link}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Product
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}