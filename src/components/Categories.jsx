function Categories() {
  const categories = [
    "Electronics",
    "Fashion",
    "Shoes",
    "Mobiles",
    "Laptops",
    "Accessories",
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:bg-blue-600 hover:text-white transition cursor-pointer"
          >
            <h3 className="font-semibold">{category}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;