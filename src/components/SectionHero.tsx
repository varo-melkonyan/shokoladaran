"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SectionHero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  }

  return (
    <section
      className="w-full min-h-[500px] py-12 flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/hero.png')" }}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white drop-shadow">
        Discover the World of Chocolate
      </h1>
      <p className="text-base md:text-lg text-gray-100 mb-6 text-center max-w-xl drop-shadow">
        Curated collections from Armenian brands – pure indulgence in every bite.
      </p>
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md flex items-center justify-center mb-2"
      >
        <div className="relative w-full flex items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-3xl bg-white/80 focus:bg-white border-none shadow-lg text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-chocolate transition-all duration-200"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate w-6 h-6 pointer-events-none"
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
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-chocolate hover:bg-[#5a2d0c] text-white rounded-full px-5 py-2 font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-chocolate"
            style={{ minWidth: 90 }}
          >
            Search
          </button>
        </div>
      </form>
    </section>
  );
}