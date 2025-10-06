"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // form data
  const [form, setForm] = useState({
    tiktok: "",
    shopee: "",
    category: "",
    price: "",
    image: "",
  });

  // ambil data produk
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    }
  }

  // filter pencarian
  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.tiktok.toLowerCase().includes(lower) ||
          p.shopee.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      )
    );
  }, [search, products]);

  // tambah produk
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post("/api/products", form);
      setShowModal(false);
      setForm({ tiktok: "", shopee: "", category: "", price: "", image: "" });
      fetchProducts();
    } catch (err) {
      console.error("Gagal menambahkan produk:", err);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Daftar Produk</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          <Plus size={18} /> Tambahkan Produk
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabel Produk */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Gambar</th>
              <th className="p-3 text-left">Tiktok</th>
              <th className="p-3 text-left">Shopee</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-left">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt={product.category}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3">{product.tiktok}</td>
                  <td className="p-3">{product.shopee}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">Rp {Number(product.price).toLocaleString()}</td>
                  <td className="p-3">
                    {new Date(product.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Tidak ada produk ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Produk */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Tambah Produk Baru</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {["tiktok", "shopee", "category", "price", "image"].map((field) => (
                <input
                  key={field}
                  type={field === "price" ? "number" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
