"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ProductList() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null);

  const itemsPerPage = 8;
  const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "#");

  // Ambil data produk
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setProducts(data);

        const uniqueCategories = [
          "Semua",
          ...Array.from(new Set(data.map((p) => p.category))).filter(Boolean),
        ];
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

  // Filter produk
  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tiktok?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shopee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  return (
    <section id="rekomendasi" className="space-y-8">
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-full text-sm border border-slate-400 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Cari produk..."
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1 md:px-0">
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
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-background shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-1/3 bg-slate-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-300 rounded"></div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                    <div className="h-6 w-14 bg-slate-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          : currentProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-background shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                onClick={() => setModalProduct(product)}
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={product.image}
                    width={400}
                    height={300}
                    alt={product.category}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-3 space-y-1.5">
                  <p className="text-xs text-slate-500">{product.category}</p>
                  <h4 className="font-semibold text-sm">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </article>
            ))}

        {!loading && currentProducts.length === 0 && (
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center text-slate-500 py-10">
            Tidak ada produk ditemukan.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
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

      {/* MODAL PRODUK */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <p className="flex items-center justify-center mt-4 mb-4 gap-1 text-sm text-slate-700">
              Lanjutkan pembelian{" "}
              <span className="font-semibold text-slate-900">{modalProduct.name}</span>
            </p>

            <div className="flex flex-col gap-2">
              {modalProduct.whatsApp && (
                <a
                  href={toUrl(modalProduct.whatsApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm font-semibold text-black hover:border-[#25D366] transition-colors"
                >
                  <Image src="/whatsapp.png" alt="WhatsApp" width={20} height={20} />
                  WhatsApp
                </a>
              )}

              {modalProduct.tiktok && (
                <a
                  href={toUrl(modalProduct.tiktok)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm font-semibold text-black hover:border-[#69C9D0] transition-colors"
                >
                  <Image src="/tiktok.png" alt="TikTok" width={20} height={20} />
                  TikTok
                </a>
              )}

              {modalProduct.shopee && (
                <a
                  href={toUrl(modalProduct.shopee)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm font-semibold bg-background text-[#EE4D2D] hover:border-[#d84424] transition-colors"
                >
                  <Image src="/shopee.png" alt="Shopee" width={20} height={20} />
                  Shopee
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
