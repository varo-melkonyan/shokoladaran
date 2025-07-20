"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type Brand = { _id: string; name: string };
type CollectionType = { id: string; name: string; type: "collection" | "children" | "dietary" };

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);

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

  const pathname = usePathname();

  const navLinks = [
    { name: "Brands", href: "/brands" },
    { name: "Gifts", href: "/gifts" },
    { name: "Discounts", href: "/discounts" },
    { name: "Special", href: "/special" },
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
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center">
        <h1 className="text-3xl font-cursive font-bold text-chocolate">
          <Link href="/">Shokoladaran</Link>
        </h1>
        <p className="text-sm text-chocolate tracking-wide">Chocolate Marketplace</p>
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

      <div className="border-t border-gray-100">
        <div className="hidden md:flex max-w-7xl mx-auto px-6 py-2 justify-center space-x-8 text-chocolate font-semibold text-sm uppercase tracking-wider">
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
              Collection <span className="text-xs">▼</span>
            </button>

            {showDropdown && (
              <div
                className="fixed left-1/2 top-28 -translate-x-1/2 bg-white shadow-xl rounded-lg grid grid-cols-3 gap-12 p-6 z-50 w-[1200px]"
                style={{ maxWidth: "98vw" }}
              >
                {/* Collections Type */}
                <div>
                  <h3 className="text-md font-bold text-chocolate mt-6 mb-3">Collections Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ul className="space-y-1">
                      {collectionsCol1.map((col) => (
                        <li key={col.id}>
                          <Link href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-gray-700 hover:text-chocolate">{col.name}</Link>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-1">
                      {collectionsCol2.map((col) => (
                        <li key={col.id}>
                          <Link href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-gray-700 hover:text-chocolate">{col.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Children's Type */}
                <div>
                  {childrenTypes.length > 0 && (
                    <>
                      <h3 className="text-md font-bold text-chocolate mb-3 mt-6">Children's Type</h3>
                      <ul className="space-y-1">
                        {childrenTypes.map((type) => (
                          <li key={type.id}>
                            <Link href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-gray-700 hover:text-chocolate">{type.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <h3 className="text-md font-bold text-chocolate mb-3 mt-6">Dietary Type</h3>
                  <ul className="space-y-1">
                    {dietaryTypes.map((type) => (
                      <li key={type.id}>
                        <Link href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-gray-700 hover:text-chocolate">{type.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Image on the right */}
                <div className="flex flex-col items-center justify-start relative w-full h-full mt-6">
                  <img
                    src="/assets/images/exclusive-rose.png"
                    alt="Chocolate Preview"
                    className="w-full h-48 object-cover"
                  />
                  <Link
                    href="/all-products"
                    className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white"
                    style={{ letterSpacing: "2px" }}
                  >
                    ALL PRODUCTS
                  </Link>
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
                <h3 className="text-lg font-bold text-chocolate mb-6 text-center">Top Brands</h3>
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden px-6 py-4 space-y-3 text-chocolate font-semibold text-sm uppercase tracking-wider">
          <div>
            <details>
              <summary className="cursor-pointer">Collection</summary>
              <div className="pl-4 pt-2">
                <h4 className="text-sm font-bold text-chocolate">Collections Type</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {collections.map((col) => (
                    <li key={col.id}>
                      <Link href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`} className="block hover:text-chocolate">{col.name}</Link>
                    </li>
                  ))}
                </ul>
                <h4 className="mt-3 text-sm font-bold text-chocolate">Children's Type</h4>
<ul className="text-sm text-gray-700 space-y-1">
  {childrenTypes.map((type) => (
    <li key={type.id}>
      <Link href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`} className="block hover:text-chocolate">{type.name}</Link>
    </li>
  ))}
</ul>
                <h4 className="mt-3 text-sm font-bold text-chocolate">Dietary Type</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {dietaryTypes.map((type) => (
                    <li key={type.id}>
                      <Link href={`/collection/${type.name.toLowerCase().replace(/\s+/g, "-")}`} className="block hover:text-chocolate">{type.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block ${(pathname ?? "").startsWith(link.href) ? "text-chocolate underline font-bold" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}