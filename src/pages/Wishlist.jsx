import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";

function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    toast.info(`${product.name} removed from wishlist`);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.info("Wishlist cleared");
  };

  return (
    <div className="min-h-screen bg-[#070711] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-purple-600/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[35%] right-0 w-[400px] h-[400px] bg-fuchsia-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm mb-4">
              <Sparkles size={15} />
              Your Collection
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              My{" "}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Wishlist
              </span>
            </h1>

            <p className="text-gray-400 mt-3">
              Save the products you love and shop them whenever you're ready.
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition"
            >
              <Trash2 size={17} />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Empty Wishlist */}
        {wishlist.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-purple-600/5 blur-3xl rounded-full" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-10 sm:p-16 text-center">

              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-400/20 flex items-center justify-center mb-7">
                <Heart
                  size={42}
                  className="text-purple-400"
                  strokeWidth={1.5}
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Your wishlist is empty
              </h2>

              <p className="text-gray-400 max-w-md mx-auto mb-8">
                You haven't saved any products yet. Explore our collection
                and add products you love to your wishlist.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-semibold shadow-lg shadow-purple-900/30 transition"
              >
                Explore Products
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Count */}
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Heart size={18} className="text-pink-400 fill-pink-400" />
              <span>
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "item" : "items"} saved
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-1"
                >

                  {/* Image */}
                  <div className="relative h-64 bg-black/20 overflow-hidden">

                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </Link>

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070711] via-transparent to-transparent pointer-events-none" />

                    {/* Wishlist Remove */}
                    <button
                      onClick={() => handleRemove(product)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-pink-400 hover:bg-pink-500/20 hover:border-pink-400/30 transition"
                      title="Remove from wishlist"
                    >
                      <Heart
                        size={19}
                        fill="currentColor"
                      />
                    </button>

                    {/* Category */}
                    {product.category && (
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-gray-200">
                        {product.category}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">

                    <Link to={`/product/${product.id}`}>
                      <h2 className="font-semibold text-lg text-white line-clamp-1 hover:text-purple-400 transition">
                        {product.name}
                      </h2>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">

                      <div className="flex text-yellow-400 text-sm">
                        ★★★★★
                      </div>

                      <span className="text-xs text-gray-500">
                        {product.rating || "4.5"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mt-5">

                      <div>
                        <span className="text-2xl font-bold text-white">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {Number(product.stock || 0) > 0 ? (
                        <span className="text-xs text-emerald-400">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs text-red-400">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-[1fr_auto] gap-3 mt-5">

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={Number(product.stock || 0) <= 0}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition shadow-lg shadow-purple-900/20"
                      >
                        <ShoppingCart size={17} />
                        Add to Cart
                      </button>

                      <button
                        onClick={() => handleRemove(product)}
                        className="w-12 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 flex items-center justify-center transition"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 rounded-3xl border border-purple-400/10 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5">

              <div>
                <h3 className="text-xl font-bold">
                  Still looking for something?
                </h3>

                <p className="text-gray-400 mt-1">
                  Discover more products from our collection.
                </p>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition whitespace-nowrap"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wishlist;