import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  Search,
  RefreshCw,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  ChevronDown,
  X,
  Truck,
  CheckCircle,
  Clock,
  Loader2,
  Eye,
} from "lucide-react";

import { db } from "../firebase";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ==============================
  // FETCH ORDERS
  // ==============================
  const fetchOrders = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(ordersQuery);

      const orderList = snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...orderDoc.data(),
      }));

      setOrders(orderList);
    } catch (error) {
      console.error("Error fetching orders:", error);

      // Fallback if createdAt ordering causes an issue
      try {
        const snapshot = await getDocs(collection(db, "orders"));

        const orderList = snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }));

        orderList.sort((a, b) => {
          const dateA = getDateValue(a.createdAt);
          const dateB = getDateValue(b.createdAt);

          return dateB - dateA;
        });

        setOrders(orderList);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        toast.error("Failed to load orders");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==============================
  // DATE HELPER
  // ==============================
  function getDateValue(timestamp) {
    if (!timestamp) return 0;

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().getTime();
    }

    if (timestamp instanceof Date) {
      return timestamp.getTime();
    }

    const date = new Date(timestamp);

    return isNaN(date.getTime()) ? 0 : date.getTime();
  }

  // ==============================
  // FORMAT DATE
  // ==============================
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    let date;

    if (typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==============================
  // CUSTOMER NAME
  // ==============================
  const getCustomerName = (order) => {
    if (order.customer?.name) {
      return order.customer.name;
    }

    const firstName = order.customer?.firstName || "";
    const lastName = order.customer?.lastName || "";

    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      return fullName;
    }

    if (order.customerName) {
      return order.customerName;
    }

    return "Customer";
  };

  // ==============================
  // STATUS COLOR
  // ==============================
  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "Out for Delivery":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";

      case "Shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "Processing":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "Order Placed":
      default:
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }
  };

  // ==============================
  // STATUS ICON
  // ==============================
  const StatusIcon = ({ status }) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={15} />;

      case "Out for Delivery":
        return <Truck size={15} />;

      case "Shipped":
        return <Package size={15} />;

      case "Processing":
        return <Loader2 size={15} />;

      default:
        return <Clock size={15} />;
    }
  };

  // ==============================
  // UPDATE ORDER STATUS
  // ==============================
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const orderRef = doc(db, "orders", orderId);

      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      setSelectedOrder((previousOrder) => {
        if (!previousOrder || previousOrder.id !== orderId) {
          return previousOrder;
        }

        return {
          ...previousOrder,
          status: newStatus,
        };
      });

      toast.success("Order status updated");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // ==============================
  // FILTER ORDERS
  // ==============================
  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName = getCustomerName(order);

      const searchableText = [
        order.id,
        order.userId,
        customerName,
        order.customer?.email,
        order.customer?.phone,
        order.customer?.city,
        order.customer?.state,
        order.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue || searchableText.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // ==============================
  // TOTALS
  // ==============================
  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status !== "Delivered" && order.status !== "Cancelled"
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.totalPrice || 0),
    0
  );

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="mx-auto mb-4 animate-spin text-blue-400"
          />

          <p className="text-slate-400">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white px-4 py-6 md:px-8 lg:px-10">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="mb-2 text-sm font-medium text-blue-400">
            ADMIN PANEL
          </p>

          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Order Management
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage customer orders, payment details and delivery status.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold transition hover:border-blue-400/30 hover:bg-blue-500/10 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {/* ================================= */}
      {/* STATS */}
      {/* ================================= */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Orders
              </p>

              <p className="mt-2 text-3xl font-black">
                {totalOrders}
              </p>
            </div>

            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Package size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-3xl font-black">
                {pendingOrders}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-400">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Delivered
              </p>

              <p className="mt-2 text-3xl font-black">
                {deliveredOrders}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Revenue
              </p>

              <p className="mt-2 text-2xl font-black">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
              <IndianRupee size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================= */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">

        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search by order ID, customer, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40"
          />
        </div>

        <div className="relative md:w-56">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none focus:border-blue-400/40"
          >
            <option value="All" className="bg-slate-900">
              All Status
            </option>

            {STATUS_OPTIONS.map((status) => (
              <option
                key={status}
                value={status}
                className="bg-slate-900"
              >
                {status}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
        </div>
      </div>

      {/* ================================= */}
      {/* RESULTS */}
      {/* ================================= */}
      <div className="mb-4 text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-300">
          {filteredOrders.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-300">
          {orders.length}
        </span>{" "}
        orders
      </div>

      {/* ================================= */}
      {/* EMPTY */}
      {/* ================================= */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">

          <Package
            size={50}
            className="mx-auto mb-5 text-slate-600"
          />

          <h2 className="text-xl font-bold">
            No orders found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        /* ================================= */
        /* ORDER CARDS */
        /* ================================= */
        <div className="space-y-4">

          {filteredOrders.map((order) => {
            const customerName = getCustomerName(order);

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:border-white/20"
              >

                {/* TOP */}
                <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Package size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Order ID
                      </p>

                      <p className="mt-1 truncate font-mono text-sm font-bold text-blue-400">
                        #{order.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    {/* STATUS */}
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      <StatusIcon status={order.status} />

                      {order.status || "Order Placed"}
                    </div>

                    {/* VIEW */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold transition hover:bg-white/[0.08]"
                    >
                      <Eye size={15} />
                      View Details
                    </button>
                  </div>
                </div>

                {/* BODY */}
                <div className="grid gap-5 p-5 lg:grid-cols-[1fr_1fr_220px]">

                  {/* CUSTOMER */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Customer
                    </p>

                    <div className="flex items-start gap-3">
                      <User
                        size={17}
                        className="mt-0.5 text-slate-500"
                      />

                      <div>
                        <p className="font-semibold">
                          {customerName}
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <Mail size={13} />
                          {order.customer?.email || "No email"}
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <Phone size={13} />
                          {order.customer?.phone || "No phone"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ORDER INFO */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Order Information
                    </p>

                    <div className="space-y-2 text-sm">

                      <p className="flex items-center gap-2 text-slate-400">
                        <Calendar size={15} />
                        {formatDate(order.createdAt)}
                      </p>

                      <p className="flex items-center gap-2 text-slate-400">
                        <Package size={15} />

                        {order.products?.length || 0} item(s)
                      </p>

                      <p className="flex items-center gap-2 text-slate-400">
                        <MapPin size={15} />

                        {order.customer?.city || "N/A"},{" "}
                        {order.customer?.state || ""}
                      </p>
                    </div>
                  </div>

                  {/* PRICE + STATUS */}
                  <div className="lg:text-right">

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      ₹
                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <div className="mt-4">

                      <label className="mb-2 block text-left text-xs text-slate-500 lg:text-right">
                        Update Status
                      </label>

                      <div className="relative">
                        <select
                          value={
                            order.status || "Order Placed"
                          }
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className="w-full appearance-none rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 pr-9 text-xs font-semibold text-white outline-none focus:border-blue-400/40 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                                className="bg-slate-900"
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                      </div>

                    </div>
                  </div>
                </div>

                {/* PRODUCTS */}
                {order.products?.length > 0 && (
                  <div className="border-t border-white/10 bg-black/10 px-5 py-4">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Products
                    </p>

                    <div className="flex gap-3 overflow-x-auto pb-1">

                      {order.products.map(
                        (product, index) => (
                          <div
                            key={`${product.id || "product"}-${index}`}
                            className="flex min-w-[230px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                          >

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-14 w-14 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5">
                                <Package
                                  size={20}
                                  className="text-slate-600"
                                />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {product.name || "Product"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                ₹
                                {Number(
                                  product.price || 0
                                ).toLocaleString("en-IN")}{" "}
                                ×{" "}
                                {product.quantity || 1}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ================================= */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1020] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1020]/95 px-6 py-5 backdrop-blur">

              <div>
                <p className="text-xs uppercase tracking-wider text-blue-400">
                  Order Details
                </p>

                <h2 className="mt-1 font-mono text-lg font-bold">
                  #{selectedOrder.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* STATUS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs text-slate-500">
                      Current Status
                    </p>

                    <div
                      className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        selectedOrder.status
                      )}`}
                    >
                      <StatusIcon
                        status={selectedOrder.status}
                      />

                      {selectedOrder.status ||
                        "Order Placed"}
                    </div>
                  </div>

                  <div className="sm:w-60">

                    <select
                      value={
                        selectedOrder.status ||
                        "Order Placed"
                      }
                      disabled={
                        updatingId ===
                        selectedOrder.id
                      }
                      onChange={(e) =>
                        updateOrderStatus(
                          selectedOrder.id,
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-blue-400/40"
                    >
                      {STATUS_OPTIONS.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-slate-900"
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>

                  </div>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                <h3 className="mb-4 font-bold">
                  Customer Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-500">
                      Name
                    </p>

                    <p className="mt-1 font-semibold">
                      {getCustomerName(
                        selectedOrder
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm">
                      {selectedOrder.customer
                        ?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 text-sm">
                      {selectedOrder.customer
                        ?.phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      User ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-400">
                      {selectedOrder.userId ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <MapPin size={18} />
                  Delivery Address
                </h3>

                <p className="text-sm leading-6 text-slate-300">
                  {selectedOrder.customer
                    ?.address || "N/A"}
                  <br />

                  {selectedOrder.customer
                    ?.city || ""}
                  {selectedOrder.customer
                    ?.city &&
                  selectedOrder.customer?.state
                    ? ", "
                    : ""}
                  {selectedOrder.customer
                    ?.state || ""}
                  {selectedOrder.customer
                    ?.pincode
                    ? ` - ${selectedOrder.customer.pincode}`
                    : ""}
                </p>
              </div>

              {/* PRODUCTS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                <h3 className="mb-4 font-bold">
                  Ordered Products
                </h3>

                <div className="space-y-3">

                  {(selectedOrder.products ||
                    []).map(
                    (product, index) => (
                      <div
                        key={`${product.id || "item"}-${index}`}
                        className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/10 p-3"
                      >

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/5">
                            <Package
                              size={22}
                              className="text-slate-600"
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">
                            {product.name ||
                              "Product"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Quantity:{" "}
                            {product.quantity ||
                              1}
                          </p>
                        </div>

                        <p className="font-bold">
                          ₹
                          {(
                            Number(
                              product.price || 0
                            ) *
                            Number(
                              product.quantity || 1
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* PAYMENT */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                <h3 className="mb-4 font-bold">
                  Payment & Summary
                </h3>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>

                    <span>
                      ₹
                      {Number(
                        selectedOrder.subtotal ||
                          0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Charge</span>

                    <span>
                      ₹
                      {Number(
                        selectedOrder.deliveryCharge ||
                          0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-3">

                    <div className="flex justify-between">

                      <span className="font-bold">
                        Total
                      </span>

                      <span className="text-xl font-black">
                        ₹
                        {Number(
                          selectedOrder.totalPrice ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-500">
                    Payment Method:{" "}
                    <span className="font-semibold text-slate-300">
                      {selectedOrder.paymentMethod ||
                        "Cash on Delivery"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Ordered:{" "}
                    <span className="text-slate-300">
                      {formatDate(
                        selectedOrder.createdAt
                      )}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;