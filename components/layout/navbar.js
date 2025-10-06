"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Heart,
  Package,
  User,
  LogOut,
  ChevronDown,
  Search,
} from "lucide-react";
import Cookies from "js-cookie";

export default function Navbar() {
  const pathname = usePathname();
  const showNavbarOn = ["/"];
  const showNavbar = showNavbarOn.includes(pathname);

  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const session = Cookies.get("session");
      if (session === "logged-in") setUser({ name: "Admin" });
      else setUser(null);
    };

    checkUser();
    window.addEventListener("user-login", checkUser);

    return () => window.removeEventListener("user-login", checkUser);
  }, []);

  // 🔹 Efek scroll shrink
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showNavbar) return null;

  return (
    <header
      className={`sticky top-5 z-40 mx-auto transition-all duration-500 ease-in-out py-2 px-2 ${
        scrolled
          ? "max-w-5xl bg-background/80 backdrop-blur-md rounded-4xl shadow-md"
          : "max-w-6xl bg-none border-none rounded-none mt-0 shadow-none"
      }`}
    >
      <div
        className={`px-4 py-3 flex items-center gap-4 transition-all duration-500 justify-between ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <div>
        <Link
          href="/"
          className={`font-extrabold tracking-tight transition-all duration-300 ${
            scrolled ? "text-primary/90 text-lg" : "text-black text-xl"
          }`}
        >
          Etalase
        </Link>
        </div>
        <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link
            href="#"
            className="inline-flex items-center gap-1 hover:text-primary/90"
          >
            <Home size={18} /> Beranda
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-1 hover:text-primary/90"
          >
            <Heart size={18} /> Wishlist
          </Link>
          <Link
            href="/admin/kelola-products"
            className="inline-flex items-center gap-1 hover:text-primary/90"
          >
            <Package size={18} /> Kelola Produk
          </Link>
        </nav>

        {user && (
          <details className="relative">
            <summary className="list-none cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-slate-400 px-3 py-1.5 text-sm font-semibold">
              <User size={18} /> {user.name}{" "}
              <ChevronDown size={14} className="text-slate-500" />
            </summary>
            <div className="absolute right-0 mt-2 w-32 rounded-xl border border-slate-200 bg-background shadow-lg">
              <button
                onClick={() => {
                  Cookies.remove("session");
                  setUser(null);
                  window.location.href = "/";
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-red-50 hover:text-red-600 flex items-center gap-1"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </details>
        )}
      </div>
      </div>
    </header>
  );
}
