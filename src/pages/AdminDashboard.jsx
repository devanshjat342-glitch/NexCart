import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  IndianRupee,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Truck,
  ArrowRight,
  RefreshCw,
  Users,
  Boxes,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import { db, auth } from "../firebase";

const ADMIN_EMAIL = "devanshjat342@gmail.com";

const STATUS_STYLES = {
  "Order Placed": {
    icon: Clock3,
    className:
      "bg-blue-500/10 text-blue-300 border-blue-400/20",
  },
  Processing: {
    icon: Package,
    className:
      "bg-yellow-500/10 text-yellow-300 border-yellow-400/20",
  },
  Shipped: {
    icon: Truck,
    className:
      "bg-purple-500/10 text-purple-300 border-purple-400/20",
  },
  "Out for Delivery": {
    icon: Truck,
    className:
      "bg-orange-500/10 text-orange-300 border-orange-400/20",
  },
  Delivered: {
    icon: CheckCircle2,
    className:
      "bg-green-500/10 text-green-300 border-green-400/20",
  },
};

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(timestamp) {
  if (!timestamp) return "—";

  try {
    const date = timestamp?.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function getOrderTime(order) {
  try {
    if (!order?.createdAt) return 0;

    if (typeof order.createdAt.toMillis === "function") {
      return order.createdAt.toMillis();
    }

    const date = order.createdAt?.toDate
      ? order.createdAt.toDate()
      : new Date(order.createdAt);

    return date.getTime() || 0;
  } catch {
    return 0;
  }
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.065]">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-purple-500/20" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {value}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${iconClass}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config =
    STATUS_STYLES[status] || STATUS_STYLES["Order Placed"];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon size={13} />
      {status || "Order Placed"}
    </span>
  );
}

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminEmail(user?.email || "");
    });

    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [ordersSnapshot, productsSnapshot] =
        await Promise.all([
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "products")),
        ]);

      const ordersData = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(
        "Dashboard data load nahi ho pa raha. Firestore rules aur Firebase connection check karein."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum + Number(order.totalPrice || order.total || 0),
      0
    );

    const pendingOrders = orders.filter(
      (order) =>
        !["Delivered", "Cancelled"].includes(
          order.status || "Order Placed"
        )
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    const lowStock = products.filter(
      (product) => Number(product.stock ?? 0) > 0 &&
        Number(product.stock ?? 0) <= 5
    ).length;

    const outOfStock = products.filter(
      (product) => Number(product.stock ?? 0) <= 0
    ).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders,
      deliveredOrders,
      lowStock,
      outOfStock,
    };
  }, [orders, products]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => getOrderTime(b) - getOrderTime(a))
      .slice(0, 6);
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return [...products]
      .filter(
        (product) => Number(product.stock ?? 0) <= 5
      )
      .sort(
        (a, b) =>
          Number(a.stock ?? 0) - Number(b.stock ?? 0)
      )
      .slice(0, 6);
  }, [products]);

  const totalItemsSold = useMemo(() => {
    return orders.reduce((total, order) => {
      const items = Array.isArray(order.products)
        ? order.products
        : [];

      return (
        total +
        items.reduce(
          (itemTotal, item) =>
            itemTotal + Number(item.quantity || 1),
          0
        )
      );
    }, 0);
  }, [orders]);

  const customerCount = useMemo(() => {
    const ids = new Set();

    orders.forEach((order) => {
      if (order.userId) {
        ids.add(order.userId);
      }
    });

    return ids.size;
  }, [orders]);

  if (
    adminEmail &&
    adminEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
  ) {
    return (
      <div className="min-h-[80vh] bg-[#070711] px-4 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center">
          <ShieldCheck
            size={48}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Access Denied
          </h1>

          <p className="mt-2 text-slate-400">
            Aapke account ko admin dashboard access nahi hai.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070711] px-4 py-8 text-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-0 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[20%] h-80 w-80 rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-[35%] h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
              <LayoutDashboard size={14} />
              Admin Control Center
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              NexCart store ka complete overview yahan se manage
              karein.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-bold shadow-lg shadow-purple-900/20 transition hover:scale-[1.02]"
            >
              <Package size={17} />
              Manage Products
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
                />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] lg:col-span-2" />
              <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
            </div>
          </div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                subtitle="All orders revenue"
                icon={IndianRupee}
                iconClass="border-green-400/20 bg-green-500/10 text-green-300"
              />

              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                subtitle={`${stats.pendingOrders} orders pending`}
                icon={ShoppingBag}
                iconClass="border-blue-400/20 bg-blue-500/10 text-blue-300"
              />

              <StatCard
                title="Total Products"
                value={stats.totalProducts}
                subtitle={`${stats.outOfStock} out of stock`}
                icon={Boxes}
                iconClass="border-purple-400/20 bg-purple-500/10 text-purple-300"
              />

              <StatCard
                title="Low Stock"
                value={stats.lowStock}
                subtitle="5 or fewer items"
                icon={AlertTriangle}
                iconClass="border-orange-400/20 bg-orange-500/10 text-orange-300"
              />
            </div>

            {/* Secondary Stats */}
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    <Users size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Unique Customers
                    </p>
                    <p className="text-xl font-bold">
                      {customerCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-300">
                    <TrendingUp size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Items Sold
                    </p>
                    <p className="text-xl font-bold">
                      {totalItemsSold}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-300">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Delivered Orders
                    </p>
                    <p className="text-xl font-bold">
                      {stats.deliveredOrders}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Recent Orders */}
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl lg:col-span-2">
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                  <div>
                    <h2 className="text-lg font-bold">
                      Recent Orders
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Latest customer orders
                    </p>
                  </div>

                  <Link
                    to="/admin/orders"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-purple-300 transition hover:text-purple-200"
                  >
                    View All
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                      <ShoppingBag
                        size={28}
                        className="text-slate-500"
                      />
                    </div>

                    <h3 className="mt-4 font-semibold">
                      No orders yet
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Customer orders yahan दिखाई देंगे.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {recentOrders.map((order) => {
                      const customerName =
                        order.customer?.name ||
                        order.customerName ||
                        "Customer";

                      return (
                        <div
                          key={order.id}
                          className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 text-purple-300">
                              <ShoppingBag size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold">
                                #{order.id.slice(0, 10)}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {customerName}
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <StatusBadge
                              status={
                                order.status ||
                                "Order Placed"
                              }
                            />

                            <p className="min-w-[90px] text-right text-sm font-bold">
                              {formatCurrency(
                                order.totalPrice ||
                                  order.total
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Low Stock */}
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                  <div>
                    <h2 className="text-lg font-bold">
                      Stock Alerts
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Products needing attention
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300">
                    <AlertTriangle size={17} />
                  </div>
                </div>

                {lowStockProducts.length === 0 ? (
                  <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-300">
                      <CheckCircle2 size={26} />
                    </div>

                    <h3 className="mt-4 font-semibold">
                      Stock looks good
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      No low-stock products.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {lowStockProducts.map((product) => {
                      const stock = Number(
                        product.stock ?? 0
                      );

                      return (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-4"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/5">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name || "Product"}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-600">
                                <Package size={18} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {product.name ||
                                "Unnamed Product"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {product.category ||
                                "General"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-sm font-bold ${
                                stock <= 0
                                  ? "text-red-400"
                                  : stock <= 2
                                  ? "text-orange-400"
                                  : "text-yellow-300"
                              }`}
                            >
                              {stock <= 0
                                ? "Out"
                                : stock}
                            </p>

                            <p className="text-[10px] text-slate-600">
                              stock
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="border-t border-white/10 p-4">
                  <Link
                    to="/admin/products"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
                  >
                    Manage Inventory
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </section>
            </div>

            {/* Quick Actions */}
            <section className="mt-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold">
                  Quick Actions
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Frequently used admin controls
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  to="/admin/orders"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-blue-400/20 hover:bg-blue-500/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                      <ShoppingBag size={20} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-300"
                    />
                  </div>

                  <h3 className="mt-4 font-bold">
                    Manage Orders
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Update order status and track orders.
                  </p>
                </Link>

                <Link
                  to="/admin/products"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-purple-400/20 hover:bg-purple-500/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                      <Package size={20} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-purple-300"
                    />
                  </div>

                  <h3 className="mt-4 font-bold">
                    Manage Products
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Add, edit or remove products.
                  </p>
                </Link>

                <Link
                  to="/products"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-fuchsia-400/20 hover:bg-fuchsia-500/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-300">
                      <ExternalLink size={20} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-fuchsia-300"
                    />
                  </div>

                  <h3 className="mt-4 font-bold">
                    View Store
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Open the customer storefront.
                  </p>
                </Link>

                <Link
                  to="/"
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-green-400/20 hover:bg-green-500/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-300">
                      <LayoutDashboard size={20} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-green-300"
                    />
                  </div>

                  <h3 className="mt-4 font-bold">
                    Go Home
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Return to the NexCart homepage.
                  </p>
                </Link>
              </div>
            </section>

            {/* Footer info */}
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={15}
                  className="text-green-400"
                />
                Admin session secured
              </div>

              <div>
                Firebase Firestore • Live Dashboard
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;