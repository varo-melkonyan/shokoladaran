export default function DiscountsPage() {
  const discounts = [
    {
      title: "Summer Sale -20%",
      image: "/images/discount1.jpg",
      link: "/product/summer-sale",
    },
    {
      title: "Bundle & Save",
      image: "/images/discount2.jpg",
      link: "/product/bundle-save",
    },
    {
      title: "Limited Time Offer",
      image: "/images/discount3.jpg",
      link: "/product/limited-offer",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-chocolate mb-10 text-center">Discounts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {discounts.map((item, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
            <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-chocolate">{item.title}</h3>
              <a href={item.link} className="mt-3 inline-block text-white bg-chocolate px-4 py-2 rounded hover:bg-brown-700">
                Shop Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
