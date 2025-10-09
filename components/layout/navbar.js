"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Heart,
  Package,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Cookies from "js-cookie";

export default function Navbar() {
  const pathname = usePathname();
  const showNavbarOn = ["/"];
  const showNavbar = showNavbarOn.includes(pathname);

  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // 🔹 baru
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const session = Cookies.get("session");
      if (session === "logged-in")
        setUser({ name: "Admin", email: "admin@etalase.com" });
      else setUser(null);
    };
    checkUser();
    window.addEventListener("user-login", checkUser);
    return () => window.removeEventListener("user-login", checkUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showNavbar) return null;

  // 🔹 Fungsi baru agar animasi muncul halus
  const openSidebar = () => {
    setSidebarOpen(true);
    setTimeout(() => setSidebarVisible(true), 10);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
    setTimeout(() => {
      setSidebarOpen(false);
    }, 300); // sama dengan durasi animasi
  };

  // 🔹 Avatar user (bulat)
  const renderUserCircle = (name, size = 10) => {
    const initial = name ? name[0].toUpperCase() : "?";
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-primary text-white font-semibold text-sm`}
        style={{
          width: `${size * 4}px`,
          height: `${size * 4}px`,
          minWidth: `${size * 4}px`,
        }}
      >
        {initial}
      </div>
    );
  };

  const menuItems = [
    { name: "Beranda", href: "/", icon: <Home size={18} />, roleMenu: "all" },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: <Heart size={18} />,
      roleMenu: "all",
    },
    {
      name: "Kelola Produk",
      href: "/admin/kelola-products",
      icon: <Package size={18} />,
      roleMenu: "user",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings size={18} />,
      roleMenu: "user",
    },
  ];

  return (
    <>
      {/* 🔹 Navbar Desktop */}
      <header
        className={`sticky top-5 z-40 mx-auto transition-all duration-500 ease-in-out py-2 px-2 ${
          scrolled
            ? "max-w-5xl bg-background/80 backdrop-blur-md rounded-4xl shadow-md"
            : "max-w-6xl bg-none border-none rounded-none mt-0 shadow-none"
        }`}
      >
        <div
          className={`px-4 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "py-2" : "py-3"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className={`font-extrabold tracking-tight transition-all duration-300 ${
              scrolled ? "text-primary/90 text-lg" : "text-black text-xl"
            }`}
          >
            Etalase
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-4 text-sm font-medium">
              {menuItems
                .filter(
                  (item) =>
                    item.roleMenu === "all" ||
                    (user && item.roleMenu === "user")
                )
                .map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center gap-1 transition-colors hover:text-primary/90 ${
                      pathname === item.href
                        ? "text-primary font-semibold"
                        : "text-slate-700"
                    }`}
                  >
                    {item.icon} {item.name}
                  </Link>
                ))}
            </nav>

            {/* 🔹 Profil Bulat */}
            {user && (
              <details className="relative group">
                <summary className="list-none cursor-pointer inline-flex items-center gap-2 border border-slate-300 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 transition-all">
                  {renderUserCircle(user.name, 6)}
                  <span className="ml-1">{user.name}</span>
                  <ChevronDown
                    size={16}
                    className="text-slate-500 group-open:rotate-180 transition-transform"
                  />
                </summary>
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 bg-background shadow-lg">
                  <button
                    onClick={() => {
                      Cookies.remove("session");
                      setUser(null);
                      window.location.href = "/";
                    }}
                    className="w-full text-left px-4 py-2 rounded-xl text-sm hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={18} /> Keluar
                  </button>
                </div>
              </details>
            )}
          </div>

          {/* Tombol Menu Mobile */}
          <button
            onClick={openSidebar}
            className="md:hidden p-2 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* 🔹 Sidebar Mobile (Animasi perbaikan) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={handleCloseSidebar}
        >
          <div
            className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl rounded-l-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
              sidebarVisible ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-primary">Menu</h2>
                <button
                  onClick={handleCloseSidebar}
                  className="p-2 rounded-full hover:bg-slate-100 transition-all duration-300 hover:rotate-90"
                  aria-label="Close sidebar"
                >
                  <X size={22} className="text-slate-600" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex flex-col gap-4 text-base font-medium">
                {menuItems
                  .filter(
                    (item) =>
                      item.roleMenu === "all" ||
                      (user && item.roleMenu === "user")
                  )
                  .map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 hover:text-primary transition-colors ${
                        pathname === item.href ? "text-primary" : "text-slate-700"
                      }`}
                      onClick={handleCloseSidebar}
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
              </nav>
            </div>

            {/* 🔹 Profil di bawah Sidebar */}
            {user && (
              <div className="flex flex-col gap-3 border-slate-300 bg-primary/10 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  {renderUserCircle(user.name, 6)}
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    Cookies.remove("session");
                    setUser(null);
                    handleCloseSidebar();
                    window.location.href = "/";
                  }}
                  className="border-t pt-4 border-slate-300 flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
