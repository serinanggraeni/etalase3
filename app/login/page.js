// app/page.jsx
import { cookies } from "next/headers";

export default function HomePage() {
  const loggedIn = cookies().get("session")?.value === "logged-in";

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <a href="/" className="text-xl font-extrabold tracking-tight">Etalase</a>

          {/* Search pill */}
          <div className="flex-1">
            <label className="relative block">
              <input
                className="w-full rounded-full border border-slate-200 pl-11 pr-4 py-2 outline-none
                           focus:ring-2 focus:ring-indigo-500"
                placeholder="Cari produk atau toko..."
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">🔎</span>
            </label>
          </div>

          {/* Menu kanan */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <a className="inline-flex items-center gap-1 hover:text-indigo-600" href="#"><span>🏠</span>Beranda</a>
            <a className="inline-flex items-center gap-1 hover:text-indigo-600" href="#"><span>🤍</span>Wishlist</a>

            {/* TAMPILKAN HANYA JIKA LOGIN */}
            {loggedIn && (
              <a className="inline-flex items-center gap-1 hover:text-indigo-600" href="/kelola-produk">
                <span>🛠️</span>Kelola Produk
              </a>
            )}
          </nav>

          {/* KANAN: Admin dropdown kalau login, tombol Login kalau tidak */}
          {loggedIn ? (
            <details className="relative">
              <summary className="list-none cursor-pointer inline-flex items-center gap-2 rounded-lg border
                                   border-slate-200 px-3 py-1.5 text-sm font-semibold">
                <span>👤 Admin</span><span className="text-slate-500">▾</span>
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-1">
                <a className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-50" href="#">Profil</a>
                <form action="/api/logout" method="POST">
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm
                                     hover:bg-red-50 hover:text-red-600">
                    Keluar
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <a
              href="/login"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
            >
              Masuk
            </a>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* HERO */}
        <section className="rounded-3xl bg-gradient-to-r from-indigo-500 to-sky-400 text-white p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="md:flex md:items-center">
            <div className="flex-1">
              <p className="text-white/80 font-semibold">Halo, Selamat Datang</p>
              <h2 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight">
                Jelajahi Produk Pilihan
              </h2>
              <div className="mt-4">
                <a href="#rekomendasi"
                   className="inline-flex items-center gap-2 rounded-lg bg-white text-indigo-700
                              font-semibold px-4 py-2 shadow hover:bg-slate-50">
                  Lihat Rekomendasi
                </a>
              </div>
            </div>
            <div className="hidden md:block w-px h-32 mx-8 bg-white/30 rounded-full" />
            <div className="hidden md:flex items-center justify-center">
              <div className="size-16 md:size-20 rounded-2xl bg-white/20 grid place-items-center">
                <span className="text-3xl">🏬</span>
              </div>
            </div>
          </div>
        </section>

        {/* Rekomendasi */}
        <section id="rekomendasi" className="space-y-4">
          <h3 className="text-lg font-semibold">Rekomendasi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src="https://picsum.photos/seed/etalase/600/450"
                  alt="Produk"
                />
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-500">Umum</p>
                <h4 className="font-semibold">random</h4>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Rp 300</span>
                  <a
                    href="#"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-white text-sm font-semibold hover:bg-blue-700"
                  >
                    Lihat
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
