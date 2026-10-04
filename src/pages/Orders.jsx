import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase";

import nexcartLogo from "../assets/logo/nexcart-logo.png";
import nexcartIcon from "../assets/logo/nexcart-icon.png";

const ORDER_STATUSES = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- FETCH ORDERS ---------------- */

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(ordersQuery);

        const fetchedOrders = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        fetchedOrders.sort((a, b) => {
          const dateA = getTimestampMillis(a.createdAt);
          const dateB = getTimestampMillis(b.createdAt);

          return dateB - dateA;
        });

        setOrders(fetchedOrders);

        if (fetchedOrders.length > 0) {
          setExpandedOrder(fetchedOrders[0].id);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  /* ---------------- HELPERS ---------------- */

  const getTimestampMillis = (timestamp) => {
    if (!timestamp) return 0;

    if (typeof timestamp.toMillis === "function") {
      return timestamp.toMillis();
    }

    if (timestamp.seconds) {
      return Number(timestamp.seconds) * 1000;
    }

    return 0;
  };

  const formatDate = (timestamp) => {
    const milliseconds = getTimestampMillis(timestamp);

    if (!milliseconds) {
      return "Date unavailable";
    }

    return new Date(milliseconds).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    const milliseconds = getTimestampMillis(timestamp);

    if (!milliseconds) return "";

    return new Date(milliseconds).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const getStatusIndex = (status) => {
    const index = ORDER_STATUSES.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const getStatusIcon = (status, completed, active) => {
    if (completed) {
      return <Check size={17} />;
    }

    if (active) {
      if (status === "Delivered") {
        return <CheckCircle2 size={17} />;
      }

      if (status === "Out for Delivery") {
        return <Truck size={17} />;
      }

      if (status === "Shipped") {
        return <Package size={17} />;
      }

      return <Clock3 size={17} />;
    }

    return <div className="w-2 h-2 rounded-full bg-gray-600" />;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return {
          badge:
            "bg-emerald-500/10 text-emerald-400 border-emerald-400/20",
          dot: "bg-emerald-400",
        };

      case "Out for Delivery":
        return {
          badge:
            "bg-cyan-500/10 text-cyan-400 border-cyan-400/20",
          dot: "bg-cyan-400",
        };

      case "Shipped":
        return {
          badge:
            "bg-blue-500/10 text-blue-400 border-blue-400/20",
          dot: "bg-blue-400",
        };

      case "Processing":
        return {
          badge:
            "bg-purple-500/10 text-purple-400 border-purple-400/20",
          dot: "bg-purple-400",
        };

      default:
        return {
          badge:
            "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
          dot: "bg-yellow-400",
        };
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId
    );
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center px-6">
        <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 blur-[130px]" />

        <div className="relative text-center">
          <div className="relative mx-auto mb-7 w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center justify-center">
            <img
              src={nexcartIcon}
              alt="NexCart"
              className="w-12 h-12 object-contain animate-pulse"
            />

            <div className="absolute inset-[-5px] rounded-2xl border border-purple-500/20 animate-pulse" />
          </div>

          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-5" />

          <p className="text-gray-400">
            Loading your orders...
          </p>

          <p className="text-xs text-gray-600 mt-2">
            NexCart
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- NOT LOGGED IN ---------------- */

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-[-120px] left-[-100px] w-[400px] h-[400px] bg-purple-600/15 blur-[130px] rounded-full" />

        <div className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] bg-fuchsia-600/10 blur-[130px] rounded-full" />

        <div className="relative text-center max-w-md">
          <img
            src={nexcartLogo}
            alt="NexCart"
            className="h-14 w-auto object-contain mx-auto mb-10"
          />

          <div className="w-24 h-24 rounded-3xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mx-auto mb-7">
            <Package
              size={42}
              className="text-purple-400"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Login to view your orders
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Sign in to access your order history and
            delivery tracking.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-purple-600/20"
          >
            Login
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN ---------------- */

  return (
    <div className="min-h-screen bg-[#070711] text-white relative overflow-hidden">
      {/* Background */}

      <div className="absolute top-0 left-[-150px] w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute top-[40%] right-[-150px] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute bottom-[-200px] left-[35%] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* ---------------- HEADER ---------------- */}

        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
            <div>
              {/* Brand */}

              <div className="mb-7">
                <img
                  src={nexcartLogo}
                  alt="NexCart"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm mb-4">
                <Package size={15} />
                Order Management
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                My{" "}
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  Orders
                </span>
              </h1>

              <p className="text-gray-400 mt-3 max-w-xl">
                Track your purchases, check delivery status
                and view your complete order history.
              </p>
            </div>

            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-all duration-300 hover:-translate-y-0.5 shrink-0"
            >
              <ShoppingBag size={18} />

              Continue Shopping

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Order count */}

          {orders.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-gray-300">
                <span className="text-white font-bold">
                  {orders.length}
                </span>{" "}
                {orders.length === 1 ? "Order" : "Orders"}
              </div>

              <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-400/20 text-sm text-purple-300">
                Latest orders & tracking
              </div>
            </div>
          )}
        </div>

        {/* ---------------- NO ORDERS ---------------- */}

        {orders.length === 0 ? (
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-10 sm:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-purple-600/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative">
              <img
                src={nexcartIcon}
                alt="NexCart"
                className="w-16 h-16 object-contain mx-auto mb-6 opacity-90"
              />

              <div className="w-24 h-24 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mx-auto mb-7">
                <ShoppingBag
                  size={40}
                  className="text-purple-400"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                No orders yet
              </h2>

              <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                You haven't placed any orders yet.
                Explore NexCart and find something you love.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-purple-600/20"
              >
                Start Shopping
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          /* ---------------- ORDERS ---------------- */

          <div className="space-y-6">
            {orders.map((order) => {
              const currentStatus =
                order.status || "Order Placed";

              const currentStatusIndex =
                getStatusIndex(currentStatus);

              const statusStyles =
                getStatusStyles(currentStatus);

              const isExpanded =
                expandedOrder === order.id;

              const customer = order.customer || {};
              const orderedProducts = order.products || [];

              return (
                <div
                  key={order.id}
                  className="group rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden hover:border-purple-400/20 transition-all duration-300 shadow-xl shadow-black/10"
                >
                  {/* ---------------- ORDER TOP ---------------- */}

                  <div className="p-5 sm:p-7">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* LEFT */}

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/15 transition">
                          <Package
                            size={21}
                            className="text-purple-400"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            Order ID
                          </p>

                          <p className="font-mono text-sm font-semibold break-all">
                            #{order.id}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays size={13} />
                              {formatDate(order.createdAt)}
                            </span>

                            {formatTime(order.createdAt) && (
                              <span>
                                {formatTime(order.createdAt)}
                              </span>
                            )}

                            <span>•</span>

                            <span>
                              {orderedProducts.length}{" "}
                              {orderedProducts.length === 1
                                ? "item"
                                : "items"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${statusStyles.badge}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${statusStyles.dot}`}
                          />

                          {currentStatus}
                        </span>

                        <div className="sm:text-right">
                          <p className="text-xs text-gray-500">
                            Total
                          </p>

                          <p className="text-xl font-black">
                            ₹
                            {formatPrice(
                              order.totalPrice || 0
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expand */}

                    <button
                      type="button"
                      onClick={() => toggleOrder(order.id)}
                      className="w-full mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-sm text-gray-400 hover:text-white transition"
                    >
                      <span>
                        {isExpanded
                          ? "Hide order details"
                          : "View order details"}
                      </span>

                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>

                  {/* ---------------- EXPANDED ---------------- */}

                  {isExpanded && (
                    <div className="border-t border-white/10">
                      {/* TRACKING */}

                      <div className="p-5 sm:p-7">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h2 className="text-xl font-bold">
                              Order Tracking
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                              Current status:{" "}
                              {currentStatus}
                            </p>
                          </div>

                          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                            <Truck
                              size={22}
                              className="text-purple-400"
                            />
                          </div>
                        </div>

                        {/* DESKTOP TIMELINE */}

                        <div className="hidden md:block relative">
                          <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-white/10" />

                          <div
                            className="absolute top-5 left-[10%] h-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-500"
                            style={{
                              width:
                                currentStatusIndex === 0
                                  ? "0%"
                                  : `${
                                      Math.min(
                                        currentStatusIndex /
                                          (ORDER_STATUSES.length -
                                            1),
                                        1
                                      ) * 80
                                    }%`,
                            }}
                          />

                          <div className="grid grid-cols-5 gap-2 relative">
                            {ORDER_STATUSES.map(
                              (status, index) => {
                                const completed =
                                  index < currentStatusIndex;

                                const active =
                                  index === currentStatusIndex;

                                return (
                                  <div
                                    key={status}
                                    className="text-center"
                                  >
                                    <div
                                      className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center border transition ${
                                        completed || active
                                          ? "bg-purple-500/15 border-purple-400/40 text-purple-300"
                                          : "bg-[#10101c] border-white/10 text-gray-600"
                                      }`}
                                    >
                                      {getStatusIcon(
                                        status,
                                        completed,
                                        active
                                      )}
                                    </div>

                                    <p
                                      className={`text-xs mt-3 font-medium ${
                                        completed || active
                                          ? "text-white"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {status}
                                    </p>

                                    {active && (
                                      <span className="inline-block mt-2 text-[10px] text-purple-400">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* MOBILE TIMELINE */}

                        <div className="md:hidden">
                          {ORDER_STATUSES.map(
                            (status, index) => {
                              const completed =
                                index < currentStatusIndex;

                              const active =
                                index === currentStatusIndex;

                              const isLast =
                                index ===
                                ORDER_STATUSES.length - 1;

                              return (
                                <div
                                  key={status}
                                  className="flex gap-4"
                                >
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
                                        completed || active
                                          ? "bg-purple-500/15 border-purple-400/40 text-purple-300"
                                          : "bg-[#10101c] border-white/10 text-gray-600"
                                      }`}
                                    >
                                      {getStatusIcon(
                                        status,
                                        completed,
                                        active
                                      )}
                                    </div>

                                    {!isLast && (
                                      <div
                                        className={`w-0.5 h-10 ${
                                          completed
                                            ? "bg-purple-500/50"
                                            : "bg-white/10"
                                        }`}
                                      />
                                    )}
                                  </div>

                                  <div className="pt-2 pb-5">
                                    <p
                                      className={`font-semibold ${
                                        completed || active
                                          ? "text-white"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {status}
                                    </p>

                                    {active && (
                                      <p className="text-xs text-purple-400 mt-1">
                                        Current order status
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* PRODUCTS + DELIVERY */}

                      <div className="grid lg:grid-cols-[1fr_330px] border-t border-white/10">
                        {/* PRODUCTS */}

                        <div className="p-5 sm:p-7">
                          <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold">
                              Ordered Products
                            </h2>

                            <span className="text-xs text-gray-500">
                              {orderedProducts.length}{" "}
                              {orderedProducts.length === 1
                                ? "item"
                                : "items"}
                            </span>
                          </div>

                          <div className="space-y-4">
                            {orderedProducts.map(
                              (product, index) => (
                                <div
                                  key={`${product.id}-${index}`}
                                  className="group/product flex gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 hover:bg-white/[0.035] hover:border-purple-400/20 transition"
                                >
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-black/30 border border-white/10 shrink-0">
                                    {product.image ? (
                                      <img
                                        src={product.image}
                                        alt={
                                          product.name ||
                                          "Product"
                                        }
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/product:scale-105"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag
                                          size={24}
                                          className="text-gray-600"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold line-clamp-2">
                                      {product.name ||
                                        "Product"}
                                    </h3>

                                    {product.category && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {product.category}
                                      </p>
                                    )}

                                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                                      <span className="text-sm text-gray-400">
                                        Qty:{" "}
                                        <span className="text-white">
                                          {product.quantity ||
                                            1}
                                        </span>
                                      </span>

                                      <span className="font-semibold">
                                        ₹
                                        {formatPrice(
                                          Number(
                                            product.price || 0
                                          ) *
                                            Number(
                                              product.quantity ||
                                                1
                                            )
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* DELIVERY */}

                        <div className="border-t lg:border-t-0 lg:border-l border-white/10 p-5 sm:p-7">
                          <h2 className="text-xl font-bold mb-5">
                            Delivery Details
                          </h2>

                          <div className="space-y-5">
                            <div className="flex gap-3">
                              <MapPin
                                size={19}
                                className="text-purple-400 shrink-0 mt-0.5"
                              />

                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Delivering to
                                </p>

                                <p className="text-sm font-medium">
                                  {customer.firstName}{" "}
                                  {customer.lastName}
                                </p>

                                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                                  {customer.address}
                                  <br />
                                  {customer.city},{" "}
                                  {customer.state}
                                  <br />
                                  {customer.pincode}
                                </p>
                              </div>
                            </div>

                            {customer.phone && (
                              <div>
                                <p className="text-xs text-gray-500">
                                  Phone
                                </p>

                                <p className="text-sm mt-1">
                                  {customer.phone}
                                </p>
                              </div>
                            )}

                            {customer.email && (
                              <div>
                                <p className="text-xs text-gray-500">
                                  Email
                                </p>

                                <p className="text-sm mt-1 break-all">
                                  {customer.email}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* PAYMENT */}

                      <div className="border-t border-white/10 p-5 sm:p-7">
                        <h2 className="text-xl font-bold mb-5">
                          Payment Summary
                        </h2>

                        <div className="max-w-md space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Subtotal
                            </span>

                            <span>
                              ₹
                              {formatPrice(
                                order.subtotal ||
                                  order.totalPrice ||
                                  0
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Delivery
                            </span>

                            <span className="text-emerald-400">
                              {Number(
                                order.deliveryCharge || 0
                              ) === 0
                                ? "FREE"
                                : `₹${formatPrice(
                                    order.deliveryCharge
                                  )}`}
                            </span>
                          </div>

                          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                            <span className="font-semibold">
                              Total Paid
                            </span>

                            <span className="text-2xl font-black">
                              ₹
                              {formatPrice(
                                order.totalPrice || 0
                              )}
                            </span>
                          </div>

                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-400/20 text-xs text-purple-300">
                            <ShoppingBag size={14} />

                            {order.paymentMethod ||
                              "Cash on Delivery"}
                          </div>
                        </div>
                      </div>

                      {/* ORDER FOOTER */}

                      <div className="border-t border-white/10 px-5 sm:px-7 py-4 bg-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle2
                            size={15}
                            className="text-emerald-400"
                          />

                          Order information is securely
                          stored with NexCart.
                        </div>

                        <img
                          src={nexcartIcon}
                          alt="NexCart"
                          className="h-7 w-7 object-contain opacity-70"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;