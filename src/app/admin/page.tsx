import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="mb-6 text-2xl font-bold">Admin Dashboard</h2>
      <ul className="space-y-3">
        <li>
          <Link href="/admin/best-sellers" className="text-blue-600 hover:underline">Best Sellers</Link>
        </li>
        <li>
          <Link href="/admin/brands" className="text-blue-600 hover:underline">Brands</Link>
        </li>
        <li>
          <Link href="/admin/collections" className="text-blue-600 hover:underline">Collections</Link>
        </li>
        <li>
          <Link href="/admin/exclusives-products" className="text-blue-600 hover:underline">Exclusives Products</Link>
        </li>
        <li>
          <Link href="/admin/news-products" className="text-blue-600 hover:underline">News Products</Link>
        </li>
        <li>
          <Link href="/admin/products" className="text-blue-600 hover:underline">Products</Link>
        </li>
        <li>
          <Link href="/admin/recommendations" className="text-blue-600 hover:underline">Recommendations</Link>
        </li>
      </ul>
    </div>
  );
}