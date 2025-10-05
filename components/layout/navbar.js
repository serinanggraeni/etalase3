// Navbar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Heart, Package, User, LogOut, ChevronDown, Search } from "lucide-react";
import Cookies from "js-cookie";

export default function Navbar() {
  const pathname = usePathname();
  const showNavbarOn = ["/"];
  const showNavbar = showNavbarOn.includes(pathname);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const session = Cookies.get("session");
      if (session === "logged-in") setUser({ name: "Admin" });
      else setUser(null);
    };

    checkUser(); // cek saat mount

    // listen event login
    window.addEventListener("user-login", checkUser);

    return () => window.removeEventListener("user-login", checkUser);
  }, []);

  if (!showNavbar) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">Etalase</Link>
        <div className="flex-1">
          <label className="relative block">
            <input
              type="text"
              className="w-100 rounded-full border border-slate-200 pl-11 pr-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Cari produk atau toko..."
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search /></span>
          </label>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link href="#" className="inline-flex items-center gap-1 hover:text-indigo-600"><Home size={18} /> Beranda</Link>
          <Link href="#" className="inline-flex items-center gap-1 hover:text-indigo-600"><Heart size={18} /> Wishlist</Link>
          <Link href="#" className="inline-flex items-center gap-1 hover:text-indigo-600"><Package size={18} /> Kelola Produk</Link>
        </nav>

        {user && (
          <details className="relative">
            <summary className="list-none cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold">
              <User size={18} /> {user.name} <ChevronDown size={14} className="text-slate-500" />
            </summary>
            <div className="absolute right-0 mt-2 w-32 rounded-xl border border-slate-200 bg-white shadow-lg p-1">
              <button
                onClick={() => {
                  Cookies.remove("session");
                  setUser(null);
                  window.location.href = "/";
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 flex items-center gap-1"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </details>
        )}
      </div>
    </header>
  );
}
