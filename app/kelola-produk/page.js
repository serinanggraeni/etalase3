// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Plus, Pencil, Trash2, Search, X, Save, Loader2 } from "lucide-react";
// const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "#");

// /** Util kecil */
// const rupiah = (n) =>
//   new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
//     Number.isFinite(Number(n)) ? Number(n) : 0
//   );

// export default function KelolaProdukPage() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("Semua");
//   const [showForm, setShowForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editing, setEditing] = useState(null); // product or null
//   const [form, setForm] = useState({ tiktok: "", shopee: "", category: "", price: "", image: "" });

//   const [page, setPage] = useState(1);
//   const perPage = 10;

//   /** Ambil semua produk */
//   async function load() {
//     try {
//       setErr("");
//       setLoading(true);
//       const res = await fetch("/api/products", { cache: "no-store" });
//       if (!res.ok) {
//         const txt = await res.text().catch(() => "");
//         throw new Error(`HTTP ${res.status} ${txt}`);
//       }
//       const json = await res.json();
//       const rows = Array.isArray(json) ? json : json?.products ?? [];
//       setItems(rows);
//     } catch (e) {
//       console.error(e);
//       setErr(e.message || "Gagal memuat produk");
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   /** Derive kategori unik */
//   const categories = useMemo(() => {
//     const set = new Set(["Semua"]);
//     items.forEach((p) => {
//       const c = (p?.category?.name ?? p?.category ?? "").toString().trim();
//       if (c) set.add(c);
//     });
//     return Array.from(set);
//   }, [items]);

//   /** Filter + pagination */
//   const filtered = items.filter((p) => {
//     const cat = (p?.category?.name ?? p?.category ?? "").toString().toLowerCase();
//     const s = search.toLowerCase();
//     const matchCat = category === "Semua" || cat === category.toLowerCase();
//     const matchText =
//       (p?.tiktok ?? "").toLowerCase().includes(s) ||
//       (p?.shopee ?? "").toLowerCase().includes(s) ||
//       cat.includes(s);
//     return matchCat && matchText;
//   });

//   const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
//   const current = filtered.slice((page - 1) * perPage, page * perPage);

//   /** Handlers */
//   function openNew() {
//     setEditing(null);
//     setForm({ tiktok: "", shopee: "", category: "", price: "", image: "" });
//     setShowForm(true);
//   }

//   function openEdit(p) {
//     setEditing(p);
//     setForm({
//       tiktok: p?.tiktok ?? "",
//       shopee: p?.shopee ?? "",
//       category: p?.category?.name ?? p?.category ?? "",
//       price: p?.price ?? "",
//       image: p?.image ?? "",
//     });
//     setShowForm(true);
//   }

//   async function onSave(e) {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const payload = {
//         tiktok: form.tiktok?.trim(),
//         shopee: form.shopee?.trim(),
//         category: form.category?.trim(),
//         price: parseFloat(form.price) || 0,
//         image: form.image?.trim(),
//       };

//       const url = editing ? `/api/products/${editing.id}` : "/api/products";
//       const method = editing ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const msg = await res.text().catch(() => "");
//         throw new Error(`HTTP ${res.status} ${msg}`);
//       }

//       setShowForm(false);
//       setEditing(null);
//       await load();
//     } catch (e) {
//       alert(e.message || "Gagal menyimpan produk");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function onDelete(p) {
//     if (!confirm(`Hapus produk ini?\n${p?.tiktok || p?.shopee || "(tanpa judul)"}`)) return;
//     try {
//       const res = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
//       if (!res.ok) {
//         const msg = await res.text().catch(() => "");
//         throw new Error(`HTTP ${res.status} ${msg}`);
//       }
//       await load();
//     } catch (e) {
//       alert(e.message || "Gagal menghapus produk");
//     }
//   }

//   /** UI */
//   return (
//     <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
//       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-extrabold">Kelola Produk</h1>
//           <p className="text-sm text-slate-500">Total: {items.length} produk</p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               placeholder="Cari tiktok/shopee/kategori…"
//               className="w-64 rounded-full border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           <select
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setPage(1);
//             }}
//             className="rounded-full border border-slate-300 px-3 py-2 text-sm"
//           >
//             {categories.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={openNew}
//             className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white text-sm font-semibold hover:bg-primary/90"
//           >
//             <Plus className="w-4 h-4" /> Tambah
//           </button>
//         </div>
//       </header>

//       {/* Error / Loading */}
//       {err && (
//         <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
//           {err}
//         </div>
//       )}
//       {loading && (
//         <div className="flex items-center gap-2 text-slate-600">
//           <Loader2 className="w-4 h-4 animate-spin" /> Memuat data…
//         </div>
//       )}

//       {/* Tabel */}
//       {!loading && (
//         <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
//           <table className="min-w-full text-sm">
//             <thead className="bg-slate-50 text-slate-700">
//               <tr>
//                 <th className="px-4 py-3 text-left w-24">Gambar</th>
//                 <th className="px-4 py-3 text-left">Kategori</th>
//                 <th className="px-4 py-3 text-left">Tiktok</th>
//                 <th className="px-4 py-3 text-left">Shopee</th>
//                 <th className="px-4 py-3 text-left">Harga</th>
//                 <th className="px-4 py-3 text-right w-32">Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {current.map((p) => (
//                 <tr key={p.id} className="border-t">
//                   <td className="px-4 py-3">
//                     {/* pakai <img> biar gak perlu config domain next/image */}
//                     <img
//                       src={p.image || "https://placehold.co/120x90?text=Img"}
//                       alt={p.category || "image"}
//                       className="w-16 h-12 object-cover rounded-md border"
//                     />
//                   </td>
//                   <td className="px-4 py-3">{p?.category?.name ?? p?.category ?? "-"}</td>
//                   <td className="px-4 py-3 max-w-[280px] truncate" title={p.tiktok}>
//                     {p.tiktok || "-"}
//                   </td>
//                   <td className="px-4 py-3 max-w-[280px] truncate" title={p.shopee}>
//                     {p.shopee ? (
//                       <a className="text-primary underline" href={toUrl(p.shopee)} target="_blank" rel="noreferrer">
//                         Link
//                       </a>
//                     ) : (
//                       "-"
//                     )}
//                   </td>
//                   <td className="px-4 py-3">{rupiah(p.price)}</td>
//                   <td className="px-4 py-3">
//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={() => openEdit(p)}
//                         className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-slate-50"
//                         title="Edit"
//                       >
//                         <Pencil className="w-4 h-4" /> Edit
//                       </button>
//                       <button
//                         onClick={() => onDelete(p)}
//                         className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
//                         title="Hapus"
//                       >
//                         <Trash2 className="w-4 h-4" /> Hapus
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {current.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
//                     Tidak ada data.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading && totalPages > 1 && (
//         <div className="flex justify-center items-center gap-1">
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             className="px-3 py-1 rounded-md border hover:bg-slate-50"
//             disabled={page === 1}
//           >
//             ‹
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
//             .map((n) => (
//               <button
//                 key={n}
//                 onClick={() => setPage(n)}
//                 className={`w-8 h-8 rounded-md text-sm ${
//                   page === n ? "bg-primary text-white" : "border hover:bg-slate-50"
//                 }`}
//               >
//                 {n}
//               </button>
//             ))}
//           <button
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             className="px-3 py-1 rounded-md border hover:bg-slate-50"
//             disabled={page === totalPages}
//           >
//             ›
//           </button>
//         </div>
//       )}

//       {/* Modal Form */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b px-5 py-3">
//               <h3 className="font-semibold">{editing ? "Edit Produk" : "Tambah Produk"}</h3>
//               <button className="p-1 rounded-md hover:bg-slate-100" onClick={() => setShowForm(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={onSave} className="grid gap-4 p-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-slate-600 mb-1">Kategori</label>
//                   <input
//                     value={form.category}
//                     onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
//                     placeholder="Contoh: Cooler Bag"
//                     className="w-full rounded-md border px-3 py-2 text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-slate-600 mb-1">Harga</label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="1"
//                     value={form.price}
//                     onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
//                     className="w-full rounded-md border px-3 py-2 text-sm"
//                     required
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-sm text-slate-600 mb-1">Judul/Deskripsi TikTok</label>
//                   <input
//                     value={form.tiktok}
//                     onChange={(e) => setForm((s) => ({ ...s, tiktok: e.target.value }))}
//                     className="w-full rounded-md border px-3 py-2 text-sm"
//                     placeholder="Teks yang ditampilkan"
//                     required
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-sm text-slate-600 mb-1">Link Shopee</label>
//                   <input
//                     type="url"
//                     value={form.shopee}
//                     onChange={(e) => setForm((s) => ({ ...s, shopee: e.target.value }))}
//                     className="w-full rounded-md border px-3 py-2 text-sm"
//                     placeholder="https://shopee.co.id/..."
//                     required
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-sm text-slate-600 mb-1">URL Gambar</label>
//                   <input
//                     type="url"
//                     value={form.image}
//                     onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
//                     className="w-full rounded-md border px-3 py-2 text-sm"
//                     placeholder="https://..."
//                     required
//                   />
//                 </div>
//               </div>

//               {form.image && (
//                 <div className="rounded-lg border p-3">
//                   <p className="text-xs text-slate-500 mb-2">Preview</p>
//                   <img src={form.image} alt="preview" className="w-full h-48 object-cover rounded-md border" />
//                 </div>
//               )}

//               <div className="flex items-center justify-end gap-2 pt-1">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white text-sm font-semibold disabled:opacity-60"
//                 >
//                   {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                   Simpan
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
