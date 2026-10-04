import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Edit3,
  Image as ImageIcon,
  Package,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { db } from "../firebase";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  image: "",
  description: "",
  rating: "4.5",
  stock: "",
};

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getStockStatus(stock) {
  const value = Number(stock ?? 0);

  if (value <= 0) {
    return {
      label: "Out of Stock",
      className:
        "border-red-400/20 bg-red-500/10 text-red-300",
    };
  }

  if (value <= 5) {
    return {
      label: "Low Stock",
      className:
        "border-orange-400/20 bg-orange-500/10 text-orange-300",
    };
  }

  return {
    label: "In Stock",
    className:
      "border-green-400/20 bg-green-500/10 text-green-300",
  };
}

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const fetchProducts = async (refresh = false) => {
    try {
      setRefreshing(refresh);

      const snapshot = await getDocs(
        collection(db, "products")
      );

      const productData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setProducts(productData);
    } catch (error) {
      console.error("Products fetch error:", error);

      toast.error(
        "Products load nahi ho pa rahe."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) =>
            String(product.category || "").trim()
          )
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products
      .filter((product) => {
        if (!searchValue) return true;

        return (
          String(product.name || "")
            .toLowerCase()
            .includes(searchValue) ||
          String(product.category || "")
            .toLowerCase()
            .includes(searchValue) ||
          String(product.description || "")
            .toLowerCase()
            .includes(searchValue)
        );
      })
      .filter((product) => {
        if (categoryFilter === "All") return true;

        return (
          String(product.category || "") ===
          categoryFilter
        );
      })
      .sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
  }, [products, search, categoryFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      price:
        product.price !== undefined
          ? String(product.price)
          : "",
      category: product.category || "",
      image: product.image || "",
      description: product.description || "",
      rating:
        product.rating !== undefined
          ? String(product.rating)
          : "4.5",
      stock:
        product.stock !== undefined
          ? String(product.stock)
          : "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Product name required hai.");
      return false;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      toast.error("Valid product price enter karein.");
      return false;
    }

    if (!form.category.trim()) {
      toast.error("Category required hai.");
      return false;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      toast.error("Valid stock quantity enter karein.");
      return false;
    }

    const rating = Number(form.rating);

    if (
      Number.isNaN(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      toast.error("Rating 0 se 5 ke beech honi chahiye.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const productData = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      rating: Number(form.rating),
      stock: Number(form.stock),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(
          doc(db, "products", editingId),
          productData
        );

        setProducts((previous) =>
          previous.map((product) =>
            product.id === editingId
              ? {
                  ...product,
                  ...productData,
                }
              : product
          )
        );

        toast.success("Product successfully updated.");
      } else {
        const newProduct = await addDoc(
          collection(db, "products"),
          {
            ...productData,
            createdAt: serverTimestamp(),
          }
        );

        setProducts((previous) => [
          ...previous,
          {
            id: newProduct.id,
            ...productData,
          },
        ]);

        toast.success("Product successfully added.");
      }

      closeModal();
    } catch (error) {
      console.error("Product save error:", error);

      toast.error(
        "Product save nahi hua. Firestore rules check karein."
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (product) => {
    setDeleteTarget(product);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;

    const id = deleteTarget.id;

    setDeletingId(id);

    try {
      await deleteDoc(doc(db, "products", id));

      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );

      toast.success("Product deleted successfully.");

      setDeleteTarget(null);
    } catch (error) {
      console.error("Product delete error:", error);

      toast.error(
        "Product delete nahi hua. Firestore rules check karein."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070711] px-4 py-8 text-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-0 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="absolute right-[8%] top-[15%] h-80 w-80 rounded-full bg-indigo-600/10 blur-[130px]" />

        <div className="absolute bottom-0 left-[40%] h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
              <Package size={14} />
              Inventory Management
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              NexCart ke products, prices aur inventory
              manage karein.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchProducts(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09] disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold shadow-lg shadow-purple-900/20 transition hover:scale-[1.02]"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <p className="text-xs text-slate-500">
              Total Products
            </p>

            <p className="mt-2 text-2xl font-bold">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <p className="text-xs text-slate-500">
              Categories
            </p>

            <p className="mt-2 text-2xl font-bold">
              {categories.length}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-400/10 bg-orange-500/[0.04] p-4 backdrop-blur-xl">
            <p className="text-xs text-slate-500">
              Low Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-300">
              {
                products.filter(
                  (product) =>
                    Number(product.stock ?? 0) > 0 &&
                    Number(product.stock ?? 0) <= 5
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-red-400/10 bg-red-500/[0.04] p-4 backdrop-blur-xl">
            <p className="text-xs text-slate-500">
              Out of Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-red-300">
              {
                products.filter(
                  (product) =>
                    Number(product.stock ?? 0) <= 0
                ).length
              }
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/10"
              />
            </div>

            {/* Category */}
            <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-2xl">
              <button
                onClick={() =>
                  setCategoryFilter("All")
                }
                className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  categoryFilter === "All"
                    ? "bg-purple-600 text-white"
                    : "border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]"
                }`}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setCategoryFilter(category)
                  }
                  className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    categoryFilter === category
                      ? "bg-purple-600 text-white"
                      : "border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {filteredProducts.length} of{" "}
              {products.length} products
            </span>

            {(search || categoryFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("All");
                }}
                className="text-purple-300 hover:text-purple-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[390px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
                />
              )
            )}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <Package
                size={30}
                className="text-slate-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No products found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Search ya category filter change karein.
            </p>

            <button
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold"
            >
              <Plus size={17} />
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(
                product.stock
              );

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-white/[0.055]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-950/30 to-indigo-950/30">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || "Product"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                          event.currentTarget.parentElement
                            .querySelector(
                              ".image-fallback"
                            )
                            ?.classList.remove("hidden");
                        }}
                      />
                    ) : null}

                    <div
                      className={`image-fallback absolute inset-0 flex items-center justify-center ${
                        product.image
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <ImageIcon
                        size={40}
                        className="text-slate-700"
                      />
                    </div>

                    {/* Stock */}
                    <div className="absolute left-3 top-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-xl ${stockStatus.className}`}
                      >
                        {stockStatus.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="absolute right-3 top-3 flex gap-2 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                      <button
                        onClick={() =>
                          openEditModal(product)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-white backdrop-blur-xl transition hover:bg-purple-600"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() =>
                          confirmDelete(product)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-white backdrop-blur-xl transition hover:bg-red-600"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-white">
                          {product.name ||
                            "Unnamed Product"}
                        </h3>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {product.category ||
                            "Uncategorized"}
                        </p>
                      </div>

                      <p className="shrink-0 text-base font-black text-purple-300">
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="text-xs font-semibold text-slate-300">
                          {Number(
                            product.rating || 0
                          ).toFixed(1)}
                        </span>
                      </div>

                      <span className="text-slate-700">
                        •
                      </span>

                      <span className="text-xs text-slate-500">
                        Stock:{" "}
                        <span className="font-semibold text-slate-300">
                          {Number(product.stock ?? 0)}
                        </span>
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          openEditModal(product)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-white/[0.09]"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          confirmDelete(product)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-500/[0.05] px-3 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0c0c18] shadow-2xl shadow-black/50">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0c0c18]/95 p-5 backdrop-blur-xl">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  {editingId
                    ? "Edit Product"
                    : "New Product"}
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {editingId
                    ? "Update Product"
                    : "Add Product"}
                </h2>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 16 Pro"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/10"
                />
              </div>

              {/* Price + Stock */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Price *
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="999"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Stock *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="50"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40"
                  />
                </div>
              </div>

              {/* Category + Rating */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Category *
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Electronics"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Rating
                  </label>

                  <div className="relative">
                    <Star
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 fill-yellow-400 text-yellow-400"
                    />

                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      placeholder="4.5"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40"
                    />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Product Image URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40"
                  />
                </div>

                {form.image && (
                  <div className="mt-3 h-32 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Product description..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/40"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={17} />
                      {editingId
                        ? "Update Product"
                        : "Add Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-[#0c0c18] p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertTriangle size={27} />
            </div>

            <h2 className="mt-5 text-center text-xl font-bold">
              Delete Product?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Kya aap{" "}
              <span className="font-semibold text-slate-300">
                {deleteTarget.name}
              </span>{" "}
              ko permanently delete karna chahte hain?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={Boolean(deletingId)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08]"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={Boolean(deletingId)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold transition hover:bg-red-500 disabled:opacity-60"
              >
                {deletingId ? (
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}

                {deletingId
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;