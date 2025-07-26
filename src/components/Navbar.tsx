"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type Brand = { _id: string; name: string };
type CollectionType = { id: string; name: string; type: "collection" | "children" | "dietary" };

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
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
        type: c.type,
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

  const { cart, addToCart, removeFromCart } = useCart();

  // Calculate total
  const total = cart.reduce((sum, item) => {
    if (typeof item.grams === "number") {
      const unitPrice = item.discount ?? item.price ?? 0;
      return sum + Math.round((unitPrice / 100) * item.grams);
    }
    return sum + ((item.discount ?? item.price ?? 0) * item.quantity);
  }, 0);

  // Handlers for plus/minus
  const handleIncrease = (item: any) => {
    if (typeof item.grams === "number") {
      addToCart({ ...item, grams: (item.grams ?? 0) + 10 });
    } else {
      addToCart({ ...item, quantity: 1 });
    }
  };
  const handleDecrease = (item: any) => {
    if (typeof item.grams === "number") {
      addToCart({ ...item, grams: Math.max((item.grams ?? 0) - 10, 0) });
    } else {
      addToCart({ ...item, quantity: -1 });
    }
  };

  // Prevent body scroll when cart drawer is open
  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCart]);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
              onMouseLeave={() => {
                setShowDropdown(false);
                setShowBrandsDropdown(false);
              }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Left: Navigation Links */}
          <nav className="flex items-center gap-8">
            <div className="border-gray-100">
              <div className="hidden md:flex max-w-7xl mx-auto py-2 justify-center space-x-8 text-chocolate font-semibold text-sm uppercase tracking-wider"
>
                {/* Collection Dropdown */}
                <div className=""
                     onMouseEnter={() => {
                       setShowDropdown(true);
                       setShowBrandsDropdown(false);
                     }}
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
                    <div className="absolute left-0 top-full w-screen bg-white shadow-xl z-50 animate-slideDown">
                      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-10">
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
                          <img
                            src="/assets/images/exclusive-rose.png"
                            alt="Chocolate Preview"
                            className="object-cover w-full h-full absolute inset-0"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />
                          <Link
                            href="/all-products"
                            className="absolute inset-0 flex items-center justify-center z-20"
                          >
                            <span className="text-white text-xl font-bold tracking-wider">ALL PRODUCTS</span>
                          </Link>
                          <div className="absolute bottom-0 w-full flex justify-center gap-6 py-2 z-20">
                            <Link href="/discounts" className="text-white text-sm font-medium hover:underline">
                              Discounts
                            </Link>
                            <Link href="/special" className="text-white text-sm font-medium hover:underline">
                              Special
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Brands Dropdown */}
                <div
                  className=""
                  onMouseEnter={() => {
                    setShowBrandsDropdown(true);
                    setShowDropdown(false);
                  }}

                >
                  <button
                    onMouseLeave={() => setShowDropdown(false)}

                    className="cursor-pointer flex items-center gap-1 bg-transparent border-none outline-none"
                    aria-haspopup="true"
                    aria-expanded={showBrandsDropdown}
                    tabIndex={0}
                    type="button"
                  >
                    Brands <span className="text-xs">▼</span>
                  </button>

                  {showBrandsDropdown && (
                    <div className="absolute left-0 top-full w-screen bg-white shadow-xl z-50 animate-slideDown">
                      <div className="max-w-7xl mx-auto px-4 py-8">
                        <h3 className="text-lg font-bold text-chocolate mb-6 text-center">
                          <Link href="/brands" className="hover:underline">All Brands</Link>
                        </h3>
                        <div className="grid grid-cols-3 gap-6 items-center">
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
                          <div className="flex justify-center">
                            <img
                              src="/assets/images/brands_bar.png"
                              alt="Brands Bar"
                              className="w-full max-w-[220px] h-42 object-contain rounded"
                            />
                          </div>
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
                    </div>
                  )}
                </div>
                {/* Other Links */}
                <div
                  className=""
                  onMouseEnter={() => {
                    setShowBrandsDropdown(false);
                    setShowDropdown(false);
                  }}>
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
            </div>
          </nav>

          {/* Center: Logo */}
          <div className="max-w-7xl mx-auto px-6 text-center"
               onMouseEnter={() => {
                 setShowDropdown(false);
                 setShowBrandsDropdown(false);
               }}
          >
            <h1 className="text-3xl font-cursive font-bold text-chocolate">
              <Link href="/">Shokoladaran</Link>
            </h1>
            <p className="text-sm text-chocolate tracking-wide">Chocolate Marketplace</p>
          </div>

          {/* Right: Search and Icons */}
          <div className="flex items-center gap-6"
               onMouseEnter={() => {
                 setShowDropdown(false);
                 setShowBrandsDropdown(false);
               }}
          >
            <div className="relative">
              <form onSubmit={handleSearch} className="w-full max-w-md flex items-center justify-center">
                <div className="relative w-full flex items-center">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-24 py-3 rounded-3xl bg-white/80 focus:bg-white border-none shadow-lg text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-chocolate transition-all duration-200"
                  />
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
            <button
              onClick={() => setShowCart(true)}
              className="relative h-6 w-6 flex items-center justify-center"
              aria-label="Open cart"
              type="button"
            >
              <img
                src="https://cdn.animaapp.com/projects/632aa472e54a449a6cf9dc9a/releases/6883652fe1f55f4c5df6a2b6/img/component-2-46.svg"
                alt="Cart"
                className="h-6 w-6"
              />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-chocolate text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[100] transform transition-transform duration-300 ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Free Shipping Banner */}
        <div className="bg-yellow-100 text-yellow-800 text-center px-4 py-2 font-semibold text-sm border-b border-yellow-200">
          Unlock Free Shipping with AMD 20,000.00 more in your cart!
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-chocolate">Your Cart</h2>
          <button
            onClick={() => setShowCart(false)}
            className="text-2xl text-gray-500 hover:text-chocolate"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>
       <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
          {cart.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex items-center gap-3 border-b pb-3">
                {/* Product Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Minus Button */}
                    <button
                      onClick={() => handleDecrease(item)}
                      className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    {/* Quantity/Grams */}
                    <span className="min-w-[40px] text-center">
                      {typeof item.grams === "number"
                        ? `${item.grams}g`
                        : item.quantity}
                    </span>
                    {/* Plus Button */}
                    <button
                      onClick={() => handleIncrease(item)}
                      className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Price */}
                <div className="text-right font-semibold">
                  {typeof item.grams === "number"
                    ? Math.round(((item.discount ?? item.price ?? 0) / 100) * item.grams) + " ֏"
                    : (item.discount ?? item.price ?? 0) * item.quantity + " ֏"}
                </div>
                {/* Remove Icon */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  aria-label="Remove"
                  title="Remove"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-base font-bold text-chocolate">{total} ֏</span>
          </div>
          <Link
            href="/cart"
            className="block w-full text-center bg-chocolate text-white py-2 rounded-lg font-semibold hover:bg-[#a06a1b] transition"
            onClick={() => setShowCart(false)}
          >
            🛒 See Cart
          </Link>
        </div>
      </div>
      {/* Overlay */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-[99]"
          onClick={() => setShowCart(false)}
        />
      )}
    </>
  );
}
