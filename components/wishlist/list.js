"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

export default function List() {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil ID wishlist dari cookie, tanpa mengubah atau menghapusnya
  useEffect(() => {
    const cookieData = Cookies.get("wishlist");
    if (!cookieData) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(cookieData);
      if (Array.isArray(parsed)) setWishlistIds(parsed);
    } catch (err) {
      console.error("Gagal parsing cookie wishlist:", err);
    }
  }, []);

  // Ambil semua produk dan filter berdasarkan ID di cookie
  useEffect(() => {
    if (wishlistIds.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchWishlist() {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const products = await res.json();
        const filtered = products.filter((p) => wishlistIds.includes(p.id));
        setWishlist(filtered);
      } catch (err) {
        console.error("Gagal memuat produk wishlist:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [wishlistIds]);

  const toUrl = (url = "") =>
    url && /^https?:\/\//i.test(url) ? url : url ? `https://${url}` : "#";

  if (loading)
    return (
      <div className="text-center text-slate-500 py-10 animate-pulse">
        Memuat wishlist...
      </div>
    );

  if (wishlist.length === 0)
    return (
      <div className="text-center text-slate-500 py-10">
        Belum ada produk di wishlist 💔
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-4 mt-6">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer"
          onClick={() => {
            const link = item.shopee || item.tiktok || item.whatsapp || "#";
            if (link && link !== "#") window.open(toUrl(link), "_blank");
          }}
        >
          {/* Gambar produk */}
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={item.image?.trimStart() || "/no-image.png"}
              alt={item.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info produk */}
          <div className="flex flex-col justify-between h-full">
            <h3 className="text-base md:text-lg font-semibold text-slate-800">
              {item.name}
            </h3>
            <p className="text-sm text-slate-500">{item.category}</p>
            <p className="text-primary font-bold text-base">
              Rp {Number(item.price).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
