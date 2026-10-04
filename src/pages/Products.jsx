import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Products() {
  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const urlCategory =
    searchParams.get("category");

  const [category, setCategory] = useState(
    urlCategory || "All"
  );

  const [sort, setSort] = useState("default");

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const snapshot = await getDocs(
          collection(db, "products")
        );

        const productsData =
          snapshot.docs.map(
            (productDoc) => ({
              id: productDoc.id,
              ...productDoc.data(),
            })
          );

        setProducts(productsData);
      } catch (err) {
        console.error(
          "Products loading error:",
          err
        );

        setError(
          "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================================
  // SYNC URL CATEGORY
  // =========================================

  useEffect(() => {
    const currentCategory =
      searchParams.get("category");

    setCategory(
      currentCategory || "All"
    );
  }, [searchParams]);

  // =========================================
  // CATEGORIES
  // =========================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ),
    ];

    return [
      "All",
      ...uniqueCategories,
    ];
  }, [products]);

  // =========================================
  // FILTER + SORT
  // =========================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
    if (search.trim()) {
      const searchValue =
        search.toLowerCase().trim();

      result = result.filter(
        (product) =>
          `${product.name || ""} ${
            product.category || ""
          } ${product.description || ""}`
            .toLowerCase()
            .includes(searchValue)
      );
    }

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (product) =>
          String(
            product.category || ""
          ).toLowerCase() ===
          String(category).toLowerCase()
      );
    }

    // SORT
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        String(
          a.name || ""
        ).localeCompare(
          String(b.name || "")
        )
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  // =========================================
  // CATEGORY CHANGE
  // =========================================

  const handleCategoryChange = (
    selectedCategory
  ) => {
    setCategory(selectedCategory);

    if (selectedCategory === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: selectedCategory,
      });
    }
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = (product) => {
    if (Number(product.stock || 0) <= 0) {
      alert(
        "This product is out of stock."
      );
      return;
    }

    addToCart(product, 1);

    alert(
      `${product.name} added to cart!`
    );
  };

  // =========================================
  // WISHLIST
  // =========================================

  const handleWishlist = (product) => {
    const alreadyAdded =
      isInWishlist(product.id);

    toggleWishlist(product);

    alert(
      alreadyAdded
        ? "Removed from wishlist."
        : "Added to wishlist ❤️"
    );
  };

  // =========================================
  // RATING
  // =========================================

  const renderRating = (rating) => {
    const value = Math.round(
      Number(rating || 0)
    );

    return (
      <div className="flex items-center gap-1">

        <div className="text-yellow-400 tracking-tight">
          {"★".repeat(
            Math.min(5, value)
          )}

          <span className="text-gray-600">
            {"★".repeat(
              Math.max(
                0,
                5 - value
              )
            )}
          </span>
        </div>

        <span className="text-xs text-gray-500 ml-1">
          {rating || "0"}
        </span>

      </div>
    );
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center">

        <div className="text-center">

          <div className="relative w-14 h-14 mx-auto mb-5">

            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />

            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />

          </div>

          <p className="text-gray-400">
            Loading products...
          </p>

        </div>

      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center px-6">

        <div className="text-center">

          <div className="text-6xl mb-5">
            ⚠️
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Products unavailable
          </h2>

          <p className="text-gray-500 mb-6">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="px-6 py-3 rounded-xl bg-purple-600 font-semibold hover:bg-purple-700 transition"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070711] text-white">

      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />

      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-12">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="mb-10">

          <p className="text-purple-400 font-semibold mb-2">
            NexCart Collection
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

            <div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                Explore Products
              </h1>

              <p className="text-gray-500 mt-3 max-w-xl">
                Discover carefully selected products
                for your everyday lifestyle.
              </p>

            </div>

            <div className="text-sm text-gray-500">

              <span className="text-white font-bold">
                {filteredProducts.length}
              </span>{" "}

              products found

            </div>

          </div>

        </div>

        {/* =========================================
            SEARCH + SORT
        ========================================= */}

        <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 mb-8">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">

            {/* SEARCH */}

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products..."
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition"
              />

              {search && (

                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  ✕
                </button>

              )}

            </div>

            {/* SORT */}

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
              className="bg-[#11111d] border border-white/10 rounded-2xl px-5 py-4 text-gray-300 outline-none focus:border-purple-500/60 cursor-pointer"
            >

              <option value="default">
                Sort: Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="name">
                Name A-Z
              </option>

            </select>

          </div>

          {/* CATEGORY */}

          <div className="flex gap-2 overflow-x-auto pt-4 pb-1 scrollbar-hide">

            {categories.map((item) => (

              <button
                key={item}
                onClick={() =>
                  handleCategoryChange(
                    item
                  )
                }
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  category === item
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* =========================================
            ACTIVE CATEGORY
        ========================================= */}

        {category !== "All" && (

          <div className="mb-6 flex items-center gap-3">

            <span className="text-sm text-gray-500">
              Showing:
            </span>

            <span className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-semibold">
              {category}
            </span>

            <button
              onClick={() =>
                handleCategoryChange(
                  "All"
                )
              }
              className="text-xs text-gray-500 hover:text-white"
            >
              Clear
            </button>

          </div>

        )}

        {/* =========================================
            EMPTY
        ========================================= */}

        {filteredProducts.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-16 text-center">

            <div className="text-6xl mb-5">
              🔍
            </div>

            <h2 className="text-2xl font-bold">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSort("default");
                handleCategoryChange(
                  "All"
                );
              }}
              className="mt-6 px-6 py-3 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          /* =========================================
              PRODUCT GRID
          ========================================= */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {filteredProducts.map(
              (product) => {

                const stock = Number(
                  product.stock || 0
                );

                const outOfStock =
                  stock <= 0;

                const wishlistActive =
                  isInWishlist(
                    product.id
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

                      {/* CATEGORY */}

                      {product.category && (

                        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-gray-300">
                          {product.category}
                        </span>

                      )}

                      {/* WISHLIST */}

                      <button
                        onClick={() =>
                          handleWishlist(
                            product
                          )
                        }
                        className={`absolute top-4 right-4 w-10 h-10 rounded-xl backdrop-blur-md border flex items-center justify-center text-lg transition ${
                          wishlistActive
                            ? "bg-red-500 border-red-400 text-white"
                            : "bg-black/40 border-white/10 text-gray-300 hover:text-red-400 hover:border-red-500/30"
                        }`}
                        title={
                          wishlistActive
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        {wishlistActive
                          ? "♥"
                          : "♡"}
                      </button>

                      {/* STOCK */}

                      <div className="absolute bottom-4 left-4">

                        {outOfStock ? (

                          <span className="px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-bold">
                            Out of Stock
                          </span>

                        ) : stock <= 5 ? (

                          <span className="px-3 py-1.5 rounded-full bg-orange-500/90 text-white text-xs font-bold">
                            Only {stock} left
                          </span>

                        ) : (

                          <span className="px-3 py-1.5 rounded-full bg-green-500/80 text-white text-xs font-bold">
                            In Stock
                          </span>

                        )}

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="p-5">

                      <Link
                        to={`/product/${product.id}`}
                      >

                        <h2 className="font-bold text-lg text-white line-clamp-1 group-hover:text-purple-400 transition">
                          {product.name}
                        </h2>

                      </Link>

                      {/* RATING */}

                      <div className="mt-2">
                        {renderRating(
                          product.rating
                        )}
                      </div>

                      {/* DESCRIPTION */}

                      <p className="text-sm text-gray-500 line-clamp-2 mt-3 min-h-[40px]">
                        {product.description ||
                          "Premium quality product from NexCart."}
                      </p>

                      {/* PRICE */}

                      <div className="flex items-end justify-between mt-5">

                        <div>

                          <p className="text-xs text-gray-600">
                            Price
                          </p>

                          <p className="text-2xl font-black text-white">
                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </div>

                      {/* BUTTONS */}

                      <div className="grid grid-cols-[1fr_auto] gap-2 mt-5">

                        <button
                          onClick={() =>
                            handleAddToCart(
                              product
                            )
                          }
                          disabled={
                            outOfStock
                          }
                          className="py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-500 hover:to-indigo-500 transition disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                          {outOfStock
                            ? "Unavailable"
                            : "🛒 Add to Cart"}
                        </button>

                        <Link
                          to={`/product/${product.id}`}
                          className="w-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition"
                          title="View product"
                        >
                          →
                        </Link>

                      </div>

                    </div>

                  </article>

                );
              }
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default Products;