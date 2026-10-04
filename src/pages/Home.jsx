import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // =========================================
  // FETCH PRODUCTS
  // =========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "products")
        );

        const productsData = snapshot.docs.map(
          (productDoc) => ({
            id: productDoc.id,
            ...productDoc.data(),
          })
        );

        setProducts(productsData);
      } catch (error) {
        console.error(
          "Products loading error:",
          error
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================================
  // TOP SELLING PRODUCTS
  // =========================================
  const topSellingProducts = [...products]
    .sort((a, b) => {
      const salesA = Number(
        a.salesCount ??
          a.soldCount ??
          a.sales ??
          0
      );

      const salesB = Number(
        b.salesCount ??
          b.soldCount ??
          b.sales ??
          0
      );

      return salesB - salesA;
    })
    .slice(0, 4);

  // =========================================
  // RATING
  // =========================================
  const renderRating = (rating) => {
    const value = Math.round(
      Number(rating || 0)
    );

    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400 tracking-tight">
          {"★".repeat(Math.min(5, value))}
        </span>

        <span className="text-gray-600">
          {"★".repeat(
            Math.max(0, 5 - value)
          )}
        </span>

        <span className="text-xs text-gray-500 ml-1">
          {rating || "4.5"}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[#070711] text-white min-h-screen">

      {/* =========================================
          HERO SECTION
      ========================================= */}

      <section className="relative overflow-hidden">

        {/* Background Glow */}

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

        <div className="absolute top-20 right-[-150px] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />

        <div className="absolute bottom-[-200px] left-[40%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT CONTENT */}

            <div>

              {/* Badge */}

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold mb-7">

                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />

                Next Generation Shopping

              </div>

              {/* Heading */}

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">

                Shop

                <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  Beyond Limits.
                </span>

              </h1>

              {/* Description */}

              <p className="mt-7 text-lg text-gray-400 max-w-xl leading-relaxed">
                Discover premium products, unbeatable deals
                and a shopping experience designed for the
                next generation.
              </p>

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-4 mt-9">

                <Link
                  to="/products"
                  className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-center shadow-lg shadow-purple-900/30 hover:scale-[1.03] transition"
                >
                  Explore Products

                  <span className="inline-block ml-2 group-hover:translate-x-1 transition">
                    →
                  </span>
                </Link>

                <Link
                  to="/wishlist"
                  className="px-7 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md font-bold text-center hover:bg-white/10 transition"
                >
                  ♡ My Wishlist
                </Link>

              </div>

              {/* Stats */}

              <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg">

                <div>
                  <p className="text-2xl font-black">
                    10K+
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Products
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black">
                    50K+
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Customers
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black">
                    4.9★
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Rating
                  </p>
                </div>

              </div>

            </div>

            {/* HERO VISUAL */}

            <div className="relative">

              <div className="relative mx-auto max-w-lg">

                {/* Glow */}

                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 blur-[80px] opacity-30" />

                {/* Product Card */}

                <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 shadow-2xl">

                  <div className="aspect-square rounded-[1.5rem] bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent flex items-center justify-center overflow-hidden">

                    <div className="relative">

                      <div className="absolute -inset-10 rounded-full border border-purple-400/20 animate-[spin_20s_linear_infinite]" />

                      <div className="absolute -inset-20 rounded-full border border-indigo-400/10" />

                      <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-[3rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-fuchsia-600 rotate-6 shadow-2xl shadow-purple-900/50 flex items-center justify-center">

                        <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-[2.5rem] bg-black/30 backdrop-blur-xl -rotate-6 border border-white/20 flex items-center justify-center">

                          <span className="text-7xl sm:text-8xl">
                            🛍️
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Bottom Info */}

                  <div className="flex items-center justify-between mt-5">

                    <div>

                      <p className="text-sm text-gray-400">
                        Featured Collection
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        Future Essentials
                      </h3>

                    </div>

                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-xl">
                      →
                    </div>

                  </div>

                </div>

                {/* Floating Card */}

                <div className="absolute -left-6 top-20 hidden sm:block">

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        ✓
                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Trusted
                        </p>

                        <p className="font-bold">
                          Secure Shopping
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Floating Card 2 */}

                <div className="absolute -right-6 bottom-20 hidden sm:block">

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        ★
                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Customer Rating
                        </p>

                        <p className="font-bold">
                          4.9 / 5
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          FEATURES
      ========================================= */}

      <section className="border-y border-white/5 bg-white/[0.02]">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl">
                🚚
              </div>

              <div>

                <h3 className="font-bold">
                  Fast Delivery
                </h3>

                <p className="text-sm text-gray-500">
                  Quick doorstep delivery
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-xl">
                🔒
              </div>

              <div>

                <h3 className="font-bold">
                  Secure Payment
                </h3>

                <p className="text-sm text-gray-500">
                  Safe & secure checkout
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl">
                ↩️
              </div>

              <div>

                <h3 className="font-bold">
                  Easy Returns
                </h3>

                <p className="text-sm text-gray-500">
                  Hassle-free returns
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl">
                ⭐
              </div>

              <div>

                <h3 className="font-bold">
                  Premium Quality
                </h3>

                <p className="text-sm text-gray-500">
                  Carefully selected products
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          CATEGORIES
      ========================================= */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

          <div>

            <p className="text-purple-400 font-semibold mb-2">
              Explore
            </p>

            <h2 className="text-3xl sm:text-4xl font-black">
              Shop by Category
            </h2>

            <p className="text-gray-500 mt-2">
              Find exactly what you're looking for.
            </p>

          </div>

          <Link
            to="/products"
            className="text-purple-400 font-semibold hover:text-purple-300 transition"
          >
            View All →
          </Link>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

          {[
            {
              name: "Electronics",
              icon: "💻",
              gradient:
                "from-blue-600/30 to-purple-600/10",
            },
            {
              name: "Fashion",
              icon: "👟",
              gradient:
                "from-pink-600/30 to-purple-600/10",
            },
            {
              name: "Home",
              icon: "🏠",
              gradient:
                "from-orange-600/30 to-yellow-600/10",
            },
            {
              name: "Accessories",
              icon: "⌚",
              gradient:
                "from-cyan-600/30 to-blue-600/10",
            },
          ].map((category) => (

            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(
                category.name
              )}`}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${category.gradient} p-7 min-h-[190px] hover:-translate-y-1 transition duration-300`}
            >

              <div className="text-5xl mb-8 group-hover:scale-110 transition">
                {category.icon}
              </div>

              <h3 className="text-xl font-bold">
                {category.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Explore collection →
              </p>

            </Link>

          ))}

        </div>

      </section>

      {/* =========================================
          TOP SELLING PRODUCTS
      ========================================= */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

          <div>

            <p className="text-purple-400 font-semibold mb-2">
              Best Sellers
            </p>

            <h2 className="text-3xl sm:text-4xl font-black">
              🔥 Top Selling Products
            </h2>

            <p className="text-gray-500 mt-2">
              Most popular products loved by NexCart customers.
            </p>

          </div>

          <Link
            to="/products"
            className="text-purple-400 font-semibold hover:text-purple-300 transition"
          >
            View All →
          </Link>

        </div>

        {loadingProducts ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map((item) => (

              <div
                key={item}
                className="h-[420px] rounded-3xl border border-white/10 bg-white/[0.04] animate-pulse"
              />

            ))}

          </div>

        ) : topSellingProducts.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">

            <div className="text-5xl mb-4">
              🛍️
            </div>

            <p className="text-gray-500">
              No products available.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {topSellingProducts.map((product) => {

              const stock = Number(
                product.stock || 0
              );

              const rating = Number(
                product.rating || 0
              );

              return (

                <article
                  key={product.id}
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden hover:border-purple-500/30 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-square bg-gradient-to-br from-white/[0.06] to-transparent overflow-hidden">

                    <Link
                      to={`/product/${product.id}`}
                    >

                      {product.image ? (

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-8 group-hover:scale-110 transition duration-500"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-7xl">
                          🛍️
                        </div>

                      )}

                    </Link>

                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-lg">
                      🔥 Best Seller
                    </span>

                    {stock <= 0 ? (

                      <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-bold">
                        Out of Stock
                      </span>

                    ) : stock <= 5 ? (

                      <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-orange-500/90 text-white text-xs font-bold">
                        Only {stock} left
                      </span>

                    ) : (

                      <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-green-500/80 text-white text-xs font-bold">
                        In Stock
                      </span>

                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="p-5">

                    <p className="text-xs text-purple-400 mb-2">
                      {product.category || "Featured"}
                    </p>

                    <Link
                      to={`/product/${product.id}`}
                    >

                      <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-purple-400 transition">
                        {product.name}
                      </h3>

                    </Link>

                    <div className="mt-2">
                      {renderRating(rating)}
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mt-3 min-h-[40px]">
                      {product.description ||
                        "Premium quality product from NexCart."}
                    </p>

                    <div className="flex items-end justify-between mt-5">

                      <div>

                        <p className="text-xs text-gray-600">
                          Price
                        </p>

                        <p className="text-2xl font-black text-white">
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="mt-5 block w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-center hover:from-purple-500 hover:to-indigo-500 transition"
                    >
                      View Product →
                    </Link>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </section>

      {/* =========================================
          CTA
      ========================================= */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="relative overflow-hidden rounded-[2rem] border border-purple-500/20 bg-gradient-to-r from-purple-700/30 via-indigo-700/20 to-fuchsia-700/20 p-10 md:p-16">

          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-purple-500/20 blur-[80px]" />

          <div className="relative max-w-2xl">

            <p className="text-purple-300 font-semibold mb-3">
              Ready to explore?
            </p>

            <h2 className="text-3xl md:text-5xl font-black">
              Your next favorite product
              is waiting.
            </h2>

            <p className="text-gray-400 mt-5 leading-relaxed">
              Browse our collection and discover products
              built for your lifestyle.
            </p>

            <Link
              to="/products"
              className="inline-block mt-8 px-7 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition"
            >
              Start Shopping →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;