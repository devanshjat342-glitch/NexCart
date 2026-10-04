import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Home,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import nexcartLogo from "../assets/logo/nexcart-logo.png";
import nexcartIcon from "../assets/logo/nexcart-icon.png";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId;
  const customerName = location.state?.customerName || "Customer";
  const totalPrice = Number(location.state?.totalPrice || 0);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  /*
   * If someone directly opens /order-success without
   * completing an order, send them back to their orders.
   */
  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center px-6 relative overflow-hidden">

        {/* Background */}
        <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-fuchsia-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative text-center max-w-md">

          {/* Mobile / Fallback Logo */}
          <Link
            to="/"
            className="inline-flex items-center justify-center mb-8 group"
          >
            <img
              src={nexcartLogo}
              alt="NexCart"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          <div className="w-24 h-24 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mx-auto mb-7">
            <Package
              size={42}
              className="text-purple-400"
            />
          </div>

          <h1 className="text-3xl font-black mb-3">
            No Order Found
          </h1>

          <p className="text-gray-400 mb-8">
            We couldn't find a recent order associated with this page.
          </p>

          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-semibold transition shadow-lg shadow-purple-900/20"
          >
            View My Orders
            <ArrowRight size={18} />
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070711] text-white relative overflow-hidden">

      {/* =========================================================
          BACKGROUND GLOWS
      ========================================================= */}

      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="absolute top-1/2 right-[-150px] w-[400px] h-[400px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* =========================================================
            BRANDING
        ========================================================= */}

        <div className="flex justify-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center group"
          >
            <img
              src={nexcartLogo}
              alt="NexCart"
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
        </div>

        {/* =========================================================
            SUCCESS HEADER
        ========================================================= */}

        <div className="text-center">

          {/* Success Icon */}
          <div className="relative inline-flex mb-8">

            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />

            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center">

              <CheckCircle2
                size={58}
                className="text-emerald-400"
                strokeWidth={1.5}
              />

            </div>

          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-sm mb-5">

            <Check size={15} />

            Order Confirmed

          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">

            Thank You,{" "}

            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              {customerName}
            </span>

            !

          </h1>

          <p className="text-gray-400 mt-4 max-w-xl mx-auto leading-relaxed">
            Your order has been successfully placed. We've received your
            order and will start processing it shortly.
          </p>

        </div>

        {/* =========================================================
            MAIN CARD
        ========================================================= */}

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-950/20">

          {/* =======================================================
              ORDER HEADER
          ======================================================= */}

          <div className="p-6 sm:p-8 border-b border-white/10">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              {/* Order ID */}
              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Order ID
                </p>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center shrink-0">
                    <Package
                      size={21}
                      className="text-purple-400"
                    />
                  </div>

                  <span className="font-mono text-sm sm:text-base text-white break-all">
                    #{orderId}
                  </span>

                </div>

              </div>

              {/* Total */}
              <div className="sm:text-right">

                <p className="text-sm text-gray-500 mb-2">
                  Order Total
                </p>

                <p className="text-2xl font-black">
                  ₹{formatPrice(totalPrice)}
                </p>

              </div>

            </div>

          </div>

          {/* =======================================================
              TRACKING TIMELINE
          ======================================================= */}

          <div className="p-6 sm:p-8">

            <h2 className="text-xl font-bold mb-8">
              What's Next?
            </h2>

            <div className="relative">

              {/* Desktop connecting line */}
              <div className="hidden sm:block absolute top-5 left-[10%] right-[10%] h-px bg-white/10" />

              <div className="grid sm:grid-cols-3 gap-8 relative">

                {/* Step 1 */}
                <div className="text-center">

                  <div className="relative mx-auto w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mb-4">

                    <Check
                      size={20}
                      className="text-emerald-400"
                    />

                  </div>

                  <h3 className="font-semibold">
                    Order Placed
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Your order is confirmed
                  </p>

                </div>

                {/* Step 2 */}
                <div className="text-center">

                  <div className="relative mx-auto w-11 h-11 rounded-full bg-purple-500/15 border border-purple-400/30 flex items-center justify-center mb-4">

                    <Package
                      size={19}
                      className="text-purple-400"
                    />

                  </div>

                  <h3 className="font-semibold">
                    Processing
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    We're preparing your items
                  </p>

                </div>

                {/* Step 3 */}
                <div className="text-center">

                  <div className="relative mx-auto w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">

                    <Truck
                      size={19}
                      className="text-gray-500"
                    />

                  </div>

                  <h3 className="font-semibold text-gray-400">
                    Delivery
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    On the way to you
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =======================================================
              COD INFO
          ======================================================= */}

          <div className="mx-6 sm:mx-8 mb-8 rounded-2xl border border-purple-400/10 bg-purple-500/5 p-5">

            <div className="flex gap-4">

              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center shrink-0">

                <ShoppingBag
                  size={20}
                  className="text-purple-400"
                />

              </div>

              <div>

                <h3 className="font-semibold">
                  Cash on Delivery
                </h3>

                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                  Please keep the exact or required amount ready when
                  your order arrives.
                </p>

              </div>

            </div>

          </div>

          {/* =======================================================
              ACTIONS
          ======================================================= */}

          <div className="p-6 sm:p-8 border-t border-white/10">

            <div className="grid sm:grid-cols-2 gap-4">

              {/* Track Order */}
              <Link
                to="/orders"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-semibold transition shadow-lg shadow-purple-900/20"
              >
                <Package size={18} />

                Track My Order

                <ArrowRight size={17} />
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold transition"
              >
                <ShoppingBag size={18} />

                Continue Shopping
              </Link>

            </div>

            {/* Home */}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-500 hover:text-white transition"
            >
              <Home size={16} />

              Back to Home
            </Link>

          </div>

        </div>

        {/* =========================================================
            BOTTOM MESSAGE
        ========================================================= */}

        <div className="text-center mt-8">

          <div className="flex items-center justify-center gap-2 mb-3">
            <img
              src={nexcartIcon}
              alt="NexCart"
              className="w-6 h-6 object-contain opacity-70"
            />

            <span className="text-xs text-gray-500">
              NexCart
            </span>
          </div>

          <p className="text-sm text-gray-600">
            A confirmation of your order has been saved to your account.
          </p>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;