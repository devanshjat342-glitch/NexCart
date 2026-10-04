import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productRef = doc(
          db,
          "products",
          id
        );

        const productSnapshot =
          await getDoc(productRef);

        if (!productSnapshot.exists()) {
          setError("Product not found.");
          return;
        }

        setProduct({
          id: productSnapshot.id,
          ...productSnapshot.data(),
        });
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        setError(
          "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // QUANTITY
  // =========================

  const stock = Number(
    product?.stock || 0
  );

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(
        (previous) => previous + 1
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(
        (previous) => previous - 1
      );
    }
  };

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    if (!product) return;

    if (stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    addToCart(product, quantity);

    alert(
      `${product.name} added to cart!`
    );
  };

  // =========================
  // BUY NOW
  // =========================

  const handleBuyNow = () => {
    if (!product) return;

    if (stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    addToCart(product, quantity);

    navigate("/cart");
  };

  // =========================
  // WISHLIST
  // =========================

  const handleWishlist = () => {
    if (!product) return;

    const exists = isInWishlist(
      product.id
    );

    toggleWishlist(product);

    alert(
      exists
        ? "Removed from wishlist."
        : "Added to wishlist ❤️"
    );
  };

  // =========================
  // RATING
  // =========================

  const rating = Number(
    product?.rating || 0
  );

  const totalPrice =
    Number(product?.price || 0) *
    quantity;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center">

        <div className="text-center">

          <div className="relative w-14 h-14 mx-auto mb-5">

            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />

            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />

          </div>

          <p className="text-gray-400">
            Loading product...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center px-6">

        <div className="text-center">

          <div className="text-7xl mb-5">
            😕
          </div>

          <h2 className="text-3xl font-bold">
            Product Not Found
          </h2>

          <p className="text-gray-500 mt-3">
            {error ||
              "This product does not exist."}
          </p>

          <Link
            to="/products"
            className="inline-block mt-7 px-7 py-3 rounded-xl bg-purple-600 font-semibold hover:bg-purple-700 transition"
          >
            ← Back to Products
          </Link>

        </div>

      </div>
    );
  }

  const wishlistActive =
    isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-[#070711] text-white">

      {/* =========================
          BACKGROUND
      ========================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px]" />

        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />

      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-10">

        {/* =========================
            BREADCRUMB
        ========================= */}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">

          <Link
            to="/"
            className="hover:text-purple-400 transition"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            to="/products"
            className="hover:text-purple-400 transition"
          >
            Products
          </Link>

          <span>›</span>

          <span className="text-gray-400 truncate">
            {product.name}
          </span>

        </div>

        {/* =========================
            MAIN PRODUCT
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* =========================
              IMAGE SECTION
          ========================= */}

          <div className="relative">

            <div className="sticky top-28">

              <div className="relative aspect-square rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">

                {/* Glow */}

                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/10" />

                <div className="absolute w-72 h-72 rounded-full bg-purple-600/10 blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                {/* Image */}

                <img
                  src={product.image}
                  alt={product.name}
                  className="relative z-10 w-full h-full object-contain p-10 sm:p-16 hover:scale-105 transition duration-700"
                />

                {/* Wishlist */}

                <button
                  onClick={handleWishlist}
                  className={`absolute z-20 top-6 right-6 w-12 h-12 rounded-2xl border backdrop-blur-xl flex items-center justify-center text-xl transition ${
                    wishlistActive
                      ? "bg-red-500 border-red-400 text-white"
                      : "bg-black/40 border-white/10 text-gray-300 hover:text-red-400 hover:border-red-400/30"
                  }`}
                  title={
                    wishlistActive
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                >
                  {wishlistActive
                    ? "♥"
                    : "♡"}
                </button>

                {/* Stock */}

                <div className="absolute z-20 bottom-6 left-6">

                  {stock <= 0 ? (
                    <span className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold">
                      Out of Stock
                    </span>
                  ) : stock <= 5 ? (
                    <span className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold">
                      Only {stock} left
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-full bg-green-500/90 text-white text-sm font-bold">
                      ✓ In Stock
                    </span>
                  )}

                </div>

              </div>

              {/* TRUST CARDS */}

              <div className="grid grid-cols-3 gap-3 mt-4">

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                  <div className="text-xl mb-1">
                    🚚
                  </div>
                  <p className="text-xs text-gray-500">
                    Fast Delivery
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                  <div className="text-xl mb-1">
                    🔒
                  </div>
                  <p className="text-xs text-gray-500">
                    Secure
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                  <div className="text-xl mb-1">
                    ↩️
                  </div>
                  <p className="text-xs text-gray-500">
                    Easy Returns
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =========================
              PRODUCT INFO
          ========================= */}

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 sm:p-10">

            {/* CATEGORY */}

            <p className="text-sm uppercase tracking-[0.2em] text-purple-400 font-bold">
              {product.category ||
                "Premium Product"}
            </p>

            {/* NAME */}

            <h1 className="text-4xl sm:text-5xl font-black leading-tight mt-4">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="flex flex-wrap items-center gap-4 mt-5">

              <div className="flex text-yellow-400 text-lg">

                {"★".repeat(
                  Math.min(
                    5,
                    Math.round(rating)
                  )
                )}

                <span className="text-gray-700">
                  {"★".repeat(
                    Math.max(
                      0,
                      5 -
                        Math.round(
                          rating
                        )
                    )
                  )}
                </span>

              </div>

              <span className="text-gray-400">
                {rating
                  ? `${rating}/5`
                  : "No rating"}
              </span>

            </div>

            {/* PRICE */}

            <div className="mt-8">

              <p className="text-sm text-gray-500">
                Price
              </p>

              <p className="text-4xl font-black text-white mt-1">
                ₹
                {Number(
                  product.price || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-8">

              <h2 className="font-bold text-lg mb-3">
                About this product
              </h2>

              <p className="text-gray-400 leading-7">
                {product.description ||
                  "Experience premium quality and modern design with this carefully selected NexCart product."}
              </p>

            </div>

            {/* DIVIDER */}

            <div className="border-t border-white/10 my-8" />

            {/* QUANTITY */}

            {stock > 0 && (
              <div>

                <p className="font-semibold mb-3">
                  Quantity
                </p>

                <div className="flex items-center gap-3">

                  <button
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 text-xl font-bold hover:bg-white/10 disabled:opacity-30 transition"
                  >
                    −
                  </button>

                  <div className="w-14 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold">
                    {quantity}
                  </div>

                  <button
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >= stock
                    }
                    className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 text-xl font-bold hover:bg-white/10 disabled:opacity-30 transition"
                  >
                    +
                  </button>

                  <span className="text-sm text-gray-500 ml-2">
                    {stock} available
                  </span>

                </div>

              </div>
            )}

            {/* TOTAL */}

            {stock > 0 && (
              <div className="mt-7 rounded-2xl bg-black/20 border border-white/10 p-5">

                <div className="flex items-center justify-between">

                  <span className="text-gray-400">
                    Your total
                  </span>

                  <span className="text-2xl font-black">
                    ₹
                    {totalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>
            )}

            {/* BUTTONS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">

              <button
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.01] transition disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                🛒{" "}
                {stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={stock <= 0}
                className="py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-gray-200 hover:scale-[1.01] transition disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Buy Now →
              </button>

            </div>

            {/* WISHLIST */}

            <button
              onClick={handleWishlist}
              className={`w-full mt-3 py-3.5 rounded-2xl border font-semibold transition ${
                wishlistActive
                  ? "border-red-500/40 bg-red-500/10 text-red-400"
                  : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-red-400"
              }`}
            >
              {wishlistActive
                ? "♥ Remove from Wishlist"
                : "♡ Add to Wishlist"}
            </button>

          </div>

        </div>

        {/* =========================
            INFORMATION
        ========================= */}

        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">

            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl mb-5">
              ✨
            </div>

            <h3 className="font-bold text-lg">
              Premium Quality
            </h3>

            <p className="text-gray-500 text-sm leading-6 mt-2">
              Products are carefully selected for quality,
              performance and value.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">

            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-5">
              🚚
            </div>

            <h3 className="font-bold text-lg">
              Fast Delivery
            </h3>

            <p className="text-gray-500 text-sm leading-6 mt-2">
              Get your order delivered safely and quickly
              to your doorstep.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">

            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl mb-5">
              🔒
            </div>

            <h3 className="font-bold text-lg">
              Secure Shopping
            </h3>

            <p className="text-gray-500 text-sm leading-6 mt-2">
              Your account and order information are protected
              with Firebase security.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProductDetails;