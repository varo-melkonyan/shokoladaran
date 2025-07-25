"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type Brand = { _id: string; name: string };
type CollectionType = { id: string; name: string; type: "collection" | "children" | "dietary" };

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  

  useEffect(() => {
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(data => setBrands(data.map((b: any) => ({
        _id: b._id || b.id,
        name: b.name,
      }))));
    fetch("/api/admin/collection-types")
      .then(res => res.json())
      .then(data => setCollectionTypes(data.map((c: any) => ({
        id: c._id || c.id,
        name: c.name,
        type: c.type, // <-- include type!
      }))));
  }, []);
  
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  }
  const pathname = usePathname();

  const navLinks = [
    { name: "Brands", href: "/brands" },
    { name: "Gifts", href: "/gifts" },
  ];

  // Split brands into two columns for dropdown
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));
  const mid = Math.ceil(sortedBrands.length / 2);
  const brandsCol1 = sortedBrands.slice(0, mid);
  const brandsCol2 = sortedBrands.slice(mid);

  // Filter and split collections and dietary types
  const collections = collectionTypes.filter(ct => ct.type === "collection");
  const childrenTypes = collectionTypes.filter(ct => ct.type === "children");
  const dietaryTypes = collectionTypes.filter(ct => ct.type === "dietary");
  const sortedCollections = [...collections].sort((a, b) => a.name.localeCompare(b.name));
  const midCol = Math.ceil(sortedCollections.length / 2);
  const collectionsCol1 = sortedCollections.slice(0, midCol);
  const collectionsCol2 = sortedCollections.slice(midCol);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Navigation Links */}
        <nav className="flex items-center gap-8">
          <div className="border-gray-100">
        <div className="hidden md:flex max-w-7xl mx-auto py-2 justify-center space-x-8 text-chocolate font-semibold text-sm uppercase tracking-wider">
          {/* Collection Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button
              className="cursor-pointer flex items-center gap-1 bg-transparent border-none outline-none"
              aria-haspopup="true"
              aria-expanded={showDropdown}
              tabIndex={0}
              type="button"
            >
              Chocolates <span className="text-xs">▼</span>
            </button>

            {showDropdown && (
  <div className="fixed left-1/2 -translate-x-1/2 z-50 w-[1200px] max-w-[98vw] bg-white shadow-xl rounded-lg p-8 grid grid-cols-3 gap-10">
    
    {/* Product Type */}
    <div>
      <h3 className="text-lg font-extrabold text-chocolate uppercase mb-4">Product Type</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <ul className="space-y-1">
          {collectionsCol1.map((col) => (
            <li key={col.id}>
              <Link
                href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-gray-700 hover:text-chocolate transition"
              >
                {col.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-1">
          {collectionsCol2.map((col) => (
            <li key={col.id}>
              <Link
                href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-gray-700 hover:text-chocolate transition"
              >
                {col.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* For Children & Dietary */}
    <div>
      {childrenTypes.length > 0 && (
        <>
          <h3 className="text-lg font-extrabold text-chocolate uppercase mb-4">For Children</h3>
          <ul className="space-y-2 mb-6">
            {childrenTypes.map((type) => (
              <li key={type.id}>
                <Link
                  href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-gray-800 hover:text-chocolate transition font-medium"
                >
                  {type.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="text-lg font-extrabold text-chocolate uppercase mb-4">Dietary</h3>
      <ul className="space-y-2">
        {dietaryTypes.map((type) => (
          <li key={type.id}>
            <Link
              href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-gray-800 hover:text-chocolate transition font-medium"
            >
              {type.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    {/* Image with links */}
    <div className="relative rounded-xl overflow-hidden h-[200px] mt-4 flex flex-col justify-between">
      {/* Background Image */}
      <img
        src="/assets/images/exclusive-rose.png"
        alt="Chocolate Preview"
        className="object-cover w-full h-full absolute inset-0"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />

      {/* Centered ALL PRODUCTS link */}
      <Link
        href="/all-products"
        className="absolute inset-0 flex items-center justify-center z-20"
      >
        <span className="text-white text-xl font-bold tracking-wider">ALL PRODUCTS</span>
      </Link>

      {/* Bottom Links: Discounts and Special */}
      <div className="absolute bottom-0 w-full flex justify-center gap-6 py-2 z-20">
        <Link
          href="/discounts"
          className={`text-white text-sm font-medium hover:underline ${pathname?.startsWith("/discounts") ? "text-chocolate" : ""}`}
        >
          Discounts
        </Link>
        <Link
          href="/special"
          className={`text-white text-sm font-medium hover:underline ${pathname?.startsWith("/special") ? "text-chocolate" : ""}`}
        >
          Special
        </Link>
      </div>
    </div>
  </div>
)}

          </div>
          

          {/* Brands Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowBrandsDropdown(true)}
            onMouseLeave={() => setShowBrandsDropdown(false)}
          >
            <button
              className="cursor-pointer flex items-center gap-1 bg-transparent border-none outline-none"
              aria-haspopup="true"
              aria-expanded={showBrandsDropdown}
              tabIndex={0}
              type="button"
            >
              Brands <span className="text-xs">▼</span>
            </button>

            {showBrandsDropdown && (
              <div className="fixed left-1/2 top-28 -translate-x-1/2 bg-white shadow-xl rounded-lg p-8 z-50 w-[700px] max-w-[98vw]">
                <h3 className="text-lg font-bold text-chocolate mb-6 text-center">
                  <Link href="/brands" className="hover:underline">All Brands</Link>
                </h3>
                <div className="grid grid-cols-3 gap-6 items-center">
                  {/* First column of brands */}
                  <div className="space-y-2">
                    {brandsCol1.map((brand) => (
                      <Link
                        key={brand._id}
                        href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-3 py-2 rounded hover:bg-chocolate/10 hover:text-chocolate text-gray-700 transition-colors text-sm text-center"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                  {/* Center image */}
                  <div className="flex justify-center">
                    <img
                      src="/assets/images/brands_bar.png"
                      alt="Brands Bar"
                      className="w-full max-w-[220px] h-42 object-contain rounded"
                    />
                  </div>
                  {/* Second column of brands */}
                  <div className="space-y-2">
                    {brandsCol2.map((brand) => (
                      <Link
                        key={brand._id}
                        href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-3 py-2 rounded hover:bg-chocolate/10 hover:text-chocolate text-gray-700 transition-colors text-sm text-center"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Other Links */}
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${(pathname ?? "").startsWith(link.href) ? "text-chocolate underline font-bold" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
        </nav>

        {/* Center: Logo */}
        <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-3xl font-cursive font-bold text-chocolate">
          <Link href="/">Shokoladaran</Link>
        </h1>
        <p className="text-sm text-chocolate tracking-wide">Chocolate Marketplace</p>
      </div>

        {/* Right: Search and Icons */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative">
            <form
  onSubmit={handleSearch}
  className="w-full max-w-md flex items-center justify-center mb-4"
>
  <div className="relative w-full flex items-center">
    {/* Search Input */}
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search products..."
      className="w-full pl-12 pr-24 py-3 rounded-3xl bg-white/80 focus:bg-white border-none shadow-lg text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-chocolate transition-all duration-200"
    />

    {/* Search Icon */}
    <svg
      className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate w-5 h-5 pointer-events-none"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>

    {/* Submit Button */}
    <button
      type="submit"
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-chocolate hover:bg-[#5a2d0c] text-white rounded-full px-4 py-1.5 text-sm shadow transition-all duration-200"
    >
      Search
    </button>
  </div>
</form>

          </div>
          {/* Cart Icon */}
          <Link href="/cart" className="h-6 w-6 flex items-center justify-center">
            <img
              src="https://cdn.animaapp.com/projects/632aa472e54a449a6cf9dc9a/releases/6883652fe1f55f4c5df6a2b6/img/component-2-46.svg"
              alt="Cart"
              className="h-6 w-6"
            />
          </Link>
        </div>
      </div>

      <div className="md:hidden flex justify-end px-6">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl text-chocolate"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}