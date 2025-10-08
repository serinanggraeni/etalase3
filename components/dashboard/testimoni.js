"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";

export default function TestimoniPage() {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔁 Simulasi fetch data
  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonials([
        { id: 1, name: "Andi", rating: 5, message: "Pelayanan sangat memuaskan! Barang cepat sampai." },
        { id: 2, name: "Budi", rating: 4, message: "Produk bagus, hanya saja pengiriman agak lama." },
        { id: 3, name: "Citra", rating: 5, message: "Sangat suka dengan kualitasnya. Akan beli lagi!" },
        { id: 4, name: "Dewi", rating: 5, message: "Harga terjangkau dan kualitas terbaik." },
        { id: 5, name: "Eka", rating: 4, message: "Cukup puas, semoga lebih cepat responnya." },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 🔁 Gerakkan kartu dari kanan ke kiri terus-menerus
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev <= -100 ? 0 : prev - 0.05));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 text-center">
        Testimoni Pelanggan
      </h2>

      {/* 🧾 SCROLL TESTIMONI */}
      <div className="overflow-hidden relative w-full pointer-events-none">
        <div
          className="flex gap-4 sm:gap-6 transition-transform"
          style={{
            transform: `translateX(${offset}%)`,
            width: `${(loading ? 5 : testimonials.length) * 2 * 18}%`,
          }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-56 sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 animate-pulse"
                >
                  <div className="w-14 sm:w-16 h-14 sm:h-16 mx-auto mb-3 rounded-full bg-slate-200" />
                  <div className="h-3 sm:h-4 w-20 sm:w-24 bg-slate-200 rounded mx-auto mb-3" />
                  <div className="flex justify-center mb-3 gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-200 rounded-full"></div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-slate-200 rounded mx-auto" />
                    <div className="h-3 w-2/3 bg-slate-200 rounded mx-auto" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded mx-auto" />
                  </div>
                </div>
              ))
            : [...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-56 sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all text-center"
                >
                  <div className="w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-xl sm:text-2xl mx-auto mb-3">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="font-semibold text-base sm:text-lg text-slate-800 mb-2">
                    {t.name}
                  </h4>
                  <div className="flex justify-center mb-2 sm:mb-3">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          starIndex < t.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {t.message}
                  </p>
                </div>
              ))}
        </div>
      </div>

      {/* 🧭 Tombol buka modal */}
      {!loading && (
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all"
          >
            Berikan Testimoni
          </button>
        </div>
      )}

      {/* 🪟 Modal Form Input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-5 sm:p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 text-center">
              Tambahkan Testimoni
            </h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Andi"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Testimoni
                </label>
                <textarea
                  placeholder="Tuliskan pengalaman Anda..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-colors ${
                        i < rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-400"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base px-4 py-2 sm:py-2.5 rounded-lg w-full mt-3"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
