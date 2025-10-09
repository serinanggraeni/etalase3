import { Store } from "lucide-react";

export default function HomeHeader() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-primary to-primary/70 text-background p-6 md:p-8 shadow-sm relative overflow-hidden">
      <div className="md:flex md:items-center">
        <div className="flex-1">
          <p className="text-background/80 font-semibold">Halo, Selamat Datang</p>
          <h2 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight">
            Jelajahi Produk Pilihan
          </h2>
          <div className="mt-4">
            <button
              href="/wishlist"
              className="rounded-lg px-4 py-2.5 inline-flex bg-background text-primary font-semibold hover:bg-primary hover:text-background border border-background"
            >
              Wishlist Anda
            </button>
          </div>
        </div>

        <div className="hidden md:block w-px h-32 mx-8 bg-background/30 rounded-full" />

        <div className="hidden md:flex items-center justify-center">
          <div className="size-16 md:size-24 rounded-2xl bg-background/20 grid place-items-center">
            <Store size={36} strokeWidth={2} className="text-background" />
          </div>
        </div>
      </div>
    </section>
  );
}
