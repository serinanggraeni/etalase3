"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import axios from "axios";
import Card from "../reusable/card";

export default function TestimoniPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [myTestimoni, setMyTestimoni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", message: "" });
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // Ambil daftar testimoni umum
        const res = await axios.get("/api/testimoni", {
          withCredentials: true,
        });
        setTestimonials(res.data);

        // Ambil testimoni milik user
        try {
          const me = await axios.get("/api/testimoni/getMe", {
            withCredentials: true,
          });
          setMyTestimoni(me.data || null);
        } catch (err) {
          console.log("User belum punya testimoni", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 🎨 Warna avatar
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 55%)`;
  }

  // 🔄 Auto-scroll horizontal
  useEffect(() => {
    const container = document.getElementById("testimonial-scroll");
    if (!container) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;
    const scroll = setInterval(() => {
      if (container.scrollWidth - container.clientWidth <= scrollAmount) {
        scrollAmount = 0;
      } else {
        scrollAmount += scrollSpeed;
      }
      container.scrollLeft = scrollAmount;
    }, 30);

    return () => clearInterval(scroll);
  }, [testimonials]);

  // 📝 Submit testimoni
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedData;
      if (myTestimoni) {
        const res = await axios.put(`/api/testimoni/${myTestimoni.id}`, {
          ...form,
          rating,
        });
        updatedData = res.data;
        setTestimonials((prev) =>
          prev.map((t) => (t.id === updatedData.id ? updatedData : t))
        );
        setMyTestimoni(updatedData);
      } else {
        const res = await axios.post("/api/testimoni", { ...form, rating });
        updatedData = res.data.testimoni;
        setTestimonials((prev) => [updatedData, ...prev]);
        setMyTestimoni(updatedData);
      }

      // 🔧 Reset form setelah submit agar tidak double input
      setForm({ name: "", message: "" });
      setRating(0);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑️ Hapus testimoni
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus testimoni ini?")) return;
    try {
      await axios.delete(`/api/testimoni/${myTestimoni.id}`);
      setTestimonials((prev) => prev.filter((t) => t.id !== myTestimoni.id));
      setMyTestimoni(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 🪄 Fungsi untuk membuka modal (fix double input)
  const openModal = (isEditing = false) => {
    if (isEditing && myTestimoni) {
      // kalau mode edit → isi dengan data lama
      setForm({
        name: myTestimoni.name,
        message: myTestimoni.message,
      });
      setRating(myTestimoni.rating);
    } else {
      // kalau tambah baru → kosongkan form
      setForm({ name: "", message: "" });
      setRating(0);
    }
    setIsModalOpen(true);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-12">
      <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">
        Testimoni Pelanggan
      </h2>

      {/* Daftar testimoni */}
      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        id="testimonial-scroll"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-100 md:w-72 h-48 sm:w-60 rounded-2xl animate-pulse"
              />
            ))
          : testimonials.map((t) => (
              <Card
                key={t.id}
                className="md:min-h-72 min-h-60 min-w-50 md:min-w-72 max-w-72 transition-all p-2 md:p-4 flex flex-col justify-between"
              >
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-slate-700 text-sm mb-4 text-center">
                    “{t.message}”
                  </p>
                </div>

                <div>
                  <div className="flex justify-center mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < t.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 items-center mt-2 border-t border-slate-200 pt-2 md:pt-4">
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ backgroundColor: stringToColor(t.name || "A") }}
                    >
                      {(t.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-xs md:text-sm font-semibold text-slate-800 leading-tight">
                        {t.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {new Date(t.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {/* Tombol aksi */}
      {!loading && (
        <div className="text-center mt-12">
          {myTestimoni ? (
            <div className="flex justify-center gap-3">
              <button
                onClick={() => openModal(true)} // ✨ edit mode
                className="bg-background hover:bg-primary text-primary hover:text-white border border-primary font-semibold px-4 py-2 rounded-full shadow-md"
              >
                Edit Testimoni
              </button>

              <button
                onClick={handleDelete}
                className="bg-primary hover:bg-background border border-primary hover:text-primary text-white font-semibold px-4 py-2 rounded-full shadow-md"
              >
                Hapus
              </button>
            </div>
          ) : (
            <button
              onClick={() => openModal(false)} // ✨ tambah mode
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full shadow-md"
            >
              Tambahkan Testimoni
            </button>
          )}
        </div>
      )}

      {/* Modal form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-center mb-5">
              {myTestimoni ? "Edit Testimoni" : "Tambah Testimoni"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama Anda"
                value={form.name}
                maxLength={15}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              />

              <textarea
                placeholder="Tulis pengalaman Anda..."
                value={form.message}
                maxLength={150}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-indigo-400"
              />

              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className={`w-7 h-7 cursor-pointer transition-colors ${
                      i < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-400"
                    }`}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg font-semibold shadow-md"
              >
                {myTestimoni ? "Simpan Perubahan" : "Kirim Testimoni"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
