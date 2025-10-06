// app/api/products/[id]/route.js
export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper untuk memastikan URL Shopee valid
const toUrl = (u = "") =>
  u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "";

// Helper parse ID dari params
const parseId = (params) => {
  const id = Number(params?.id);
  if (!Number.isInteger(id)) throw new Error("ID tidak valid");
  return id;
};

// GET /api/products/:id
export async function GET(_req, { params }) {
  try {
    const id = parseId(params);
    const r = await prisma.product.findUnique({ where: { id } });

    if (!r)
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    const product = {
      id: r.id,
      name: r.name,
      whatsapp: r.whatsapp ?? "",
      tiktok: r.tiktok ?? "",
      shopee: toUrl(r.shopee ?? ""),
      category: r.category ?? "",
      price: Number(r.price ?? 0),
      image: r.image ?? "",
      createdAt: r.createdAt,
    };

    return NextResponse.json(product, { status: 200 });
  } catch (e) {
    console.error("GET /products/:id error:", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// PUT /api/products/:id
export async function PUT(req, { params }) {
  try {
    const id = parseId(params);
    const body = await req.json();
    const { name, whatsapp, tiktok, shopee, category, price, image } = body;

    // Validasi semua field wajib diisi
    if (!name || !whatsapp || !tiktok || !shopee || !category || !price || !image) {
      return NextResponse.json(
        { error: "VALIDATION", message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        whatsapp,
        tiktok,
        shopee: toUrl(shopee),
        category,
        price: parseFloat(price),
        image,
      },
    });

    return NextResponse.json({
      ...updated,
      shopee: toUrl(updated.shopee ?? ""),
      price: Number(updated.price ?? 0),
    });
  } catch (e) {
    console.error("PUT /products/:id error:", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id
export async function DELETE(_req, { params }) {
  try {
    const id = parseId(params);
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Produk berhasil dihapus" }, { status: 200 });
  } catch (e) {
    console.error("DELETE /products/:id error:", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
