// "use client";
// import { useState, useEffect, ChangeEvent } from "react";
// import { NewsProduct } from "@/types/newsProducts";
// import { Product } from "@/types/product";

// type Props = {
//   onAdd: (newNewsProduct: NewsProduct) => void;
//   initialData: NewsProduct | null;
//   brands: { _id: string; name: string }[];
//   collectionTypes: { _id: string; name: string }[];
//   products: Product[];
// };

// export default function NewProductsForm({ onAdd, initialData, brands, collectionTypes, products }: Props) {
//   const [name, setName] = useState(initialData?.name || "");
//   const [image, setImage] = useState(initialData?.image || "");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [link, setLink] = useState(initialData?.link || "");
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [selectedCollectionType, setSelectedCollectionType] = useState("");
//   const [selectedProductId, setSelectedProductId] = useState("");

//   const filteredProducts = products.filter(
//     p =>
//       (!selectedBrand || p.brand === selectedBrand) &&
//       (!selectedCollectionType || p.collectionType === selectedCollectionType)
//   );

//   useEffect(() => {
//     setName(initialData?.name || "");
//     setImage(initialData?.image || "");
//     setLink(initialData?.link || "");
//     setImageFile(null);
//   }, [initialData]);

//   function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setImage(URL.createObjectURL(file)); 
//     }
//   }

//   function handleSubmit(e: React.FormEvent) {
//   e.preventDefault();
//   const product = products.find(p => p._id === selectedProductId);
//   if (product) {
//       onAdd({ ...product, image: product.image || "" });
//       setName("");
//       setImage("");
//       setLink("");
//       setImageFile(null);
//       setSelectedBrand("");
//       setSelectedCollectionType("");
//       setSelectedProductId("");
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
//       <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
//         <option value="">Select Brand</option>
//         {brands.map(b => (
//           <option key={b._id} value={b.name}>{b.name}</option>
//         ))}
//       </select>
//       <select value={selectedCollectionType} onChange={e => setSelectedCollectionType(e.target.value)}>
//         <option value="">Select Collection Type</option>
//         {collectionTypes.map(c => (
//           <option key={c._id} value={c.name}>{c.name}</option>
//         ))}
//       </select>
//       <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
//         <option value="">Select Product</option>
//         {filteredProducts.map(p => (
//           <option key={p._id} value={p._id}>{p.name}</option>
//         ))}
//       </select>
//       <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
//         Add to News Products
//       </button>
//     </form>
//   );
// }