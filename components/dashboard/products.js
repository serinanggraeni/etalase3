"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductList() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]); // dari backend
  const [categories, setCategories] = useState(["Semua"]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;
  const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "#");

  // 🧩 Ambil data dari API
    useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        // pastikan selalu array
        const items = Array.isArray(json)
          ? json
          : (json?.products ?? json?.data ?? []);

        setProducts(items);

        // category bisa string / object {name: "..."}
        const catList = items
          .map(p => (p?.category?.name ?? p?.category ?? ""))
          .filter(Boolean);

        const uniqueCategories = ["Semua", ...new Set(catList)];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
        setProducts([]);
        setCategories(["Semua"]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);


  // 🔍 Filter produk
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch =
      p.tiktok?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shopee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 🧭 Ganti halaman
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // 🔢 Hitung halaman yang ditampilkan (maksimal 5)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (loading)
    return (
      <div className="text-center text-slate-500 py-10">Memuat produk...</div>
    );

  return (
    <section id="rekomendasi" className="space-y-8">
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-72 rounded-full text-sm border border-slate-400 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Cari produk..."
          />
        </div>

        {/* FILTER KATEGORI */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                activeCategory === category
                  ? "bg-primary text-background border-primary shadow-sm"
                  : "bg-background text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* DAFTAR PRODUK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-slate-200 bg-background shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <Image
                src={product.image}
                width={600}
                height={450}
                alt={product.category}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-slate-500">{product.category}</p>
              <h4 className="font-semibold">{product.tiktok}</h4>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </span>
                <a
                  href={toUrl(product.shopee)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-background text-sm font-medium hover:bg-primary/80 transition-colors"
                >
                  Lihat
                </a>
              </div>
            </div>
          </article>
        ))}

        {currentProducts.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-10">
            Tidak ada produk ditemukan.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-md text-sm font-medium ${
                currentPage === page
                  ? "bg-primary text-background"
                  : "border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
