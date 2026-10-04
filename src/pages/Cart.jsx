import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    cartCount,
  } = useCart();

  // =========================
  // EMPTY CART
  // =========================

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center px-6">

        <div className="text-center max-w-lg">

          <div className="relative w-28 h-28 mx-auto mb-8">

            <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-2xl" />

            <div className="relative w-full h-full rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur-xl flex items-center justify-center text-5xl">
              🛒
            </div>

          </div>

          <p className="text-purple-400 font-semibold mb-3">
            Your Shopping Bag
          </p>

          <h1 className="text-4xl font-black">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mt-4 leading-7">
            Looks like you haven't added anything yet.
            Explore our collection and find something you love.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold hover:scale-[1.03] transition shadow-lg shadow-purple-900/20"
          >
            Start Shopping →
          </Link>

        </div>

      </div>
    );
  }

  // =========================
  // REMOVE PRODUCT
  // =========================

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  // =========================
  // CLEAR CART
  // =========================

  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (confirmed) {
      clearCart();
    }
  };

  // =========================
  // CHECKOUT
  // =========================

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#070711] text-white">

      {/* BACKGROUND */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px]" />

        <div className="absolute bottom-20 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />

      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-12">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

          <div>

            <p className="text-purple-400 font-semibold mb-2">
              NexCart
            </p>

            <h1 className="text-4xl sm:text-5xl font-black">
              Shopping Cart
            </h1>

            <p className="text-gray-500 mt-3">
              {cartCount}{" "}
              {cartCount === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>

          </div>

          <button
            onClick={handleClearCart}
            className="self-start md:self-auto px-5 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 font-semibold hover:bg-red-500/10 transition"
          >
            🗑 Clear Cart
          </button>

        </div>

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* =========================
              CART ITEMS
          ========================= */}

          <div className="space-y-4">

            {cart.map((item) => {

              const price = Number(
                item.price || 0
              );

              const quantity = Number(
                item.quantity || 1
              );

              const stock = Number(
                item.stock || 999999
              );

              const itemTotal =
                price * quantity;

              return (
                <div
                  key={item.id}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 hover:border-purple-500/20 transition"
                >

                  <div className="flex flex-col sm:flex-row gap-5">

                    {/* IMAGE */}

                    <Link
                      to={`/product/${item.id}`}
                      className="shrink-0"
                    >
                      <div className="w-full sm:w-36 h-36 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent border border-white/5 overflow-hidden">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500"
                        />

                      </div>
                    </Link>

                    {/* DETAILS */}

                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                            {item.category ||
                              "Product"}
                          </p>

                          <Link
                            to={`/product/${item.id}`}
                          >
                            <h2 className="text-xl font-bold mt-1 hover:text-purple-400 transition">
                              {item.name}
                            </h2>
                          </Link>

                        </div>

                        <button
                          onClick={() =>
                            handleRemove(item.id)
                          }
                          className="w-10 h-10 shrink-0 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition"
                          title="Remove"
                        >
                          ✕
                        </button>

                      </div>

                      {/* PRICE */}

                      <div className="mt-4">

                        <span className="text-2xl font-black">
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span className="text-sm text-gray-500 ml-2">
                          each
                        </span>

                      </div>

                      {/* BOTTOM */}

                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mt-5">

                        {/* QUANTITY */}

                        <div>

                          <p className="text-xs text-gray-500 mb-2">
                            Quantity
                          </p>

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-lg font-bold transition"
                            >
                              −
                            </button>

                            <div className="w-12 h-10 rounded-xl border border-white/10 bg-black/20 flex items-center justify-center font-bold">
                              {quantity}
                            </div>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              disabled={
                                quantity >=
                                stock
                              }
                              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-lg font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              +
                            </button>

                          </div>

                          {stock !== 999999 &&
                            stock <= 5 && (
                              <p className="text-xs text-orange-400 mt-2">
                                Only {stock} available
                              </p>
                            )}

                        </div>

                        {/* ITEM TOTAL */}

                        <div className="sm:text-right">

                          <p className="text-xs text-gray-500">
                            Item Total
                          </p>

                          <p className="text-xl font-black text-purple-400 mt-1">
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 font-semibold transition mt-3"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* =========================
              SUMMARY
          ========================= */}

          <aside>

            <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-7">

              <p className="text-purple-400 font-semibold text-sm">
                Order Summary
              </p>

              <h2 className="text-2xl font-black mt-1">
                Your Order
              </h2>

              {/* PRICE */}

              <div className="space-y-4 mt-7">

                <div className="flex justify-between text-gray-400">
                  <span>
                    Subtotal
                  </span>

                  <span className="text-white font-semibold">
                    ₹
                    {Number(
                      totalPrice || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>
                    Delivery
                  </span>

                  <span className="text-green-400 font-semibold">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>
                    Discount
                  </span>

                  <span className="text-gray-500">
                    —
                  </span>
                </div>

              </div>

              {/* DIVIDER */}

              <div className="border-t border-white/10 my-6" />

              {/* TOTAL */}

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Total
                  </p>

                  <p className="text-3xl font-black mt-1">
                    ₹
                    {Number(
                      totalPrice || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <span className="text-xs text-green-400 font-semibold">
                  Tax included
                </span>

              </div>

              {/* CHECKOUT */}

              <button
                onClick={handleCheckout}
                className="w-full mt-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.01] transition shadow-lg shadow-purple-900/20"
              >
                Proceed to Checkout →
              </button>

              {/* SECURITY */}

              <div className="mt-6 pt-5 border-t border-white/10">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    🔒
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      Secure Checkout
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Your information is protected
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 mt-4">

                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    🚚
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      Free Delivery
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      On every NexCart order
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Cart;