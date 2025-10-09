export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "");
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
    if (!r) return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    return NextResponse.json({
      id: r.id,
      name: r.name ?? "",
      whatsapp: r.whatsapp ?? "",
      tiktok: r.tiktok ?? "",
      shopee: toUrl(r.shopee ?? ""),
      category: r.category ?? "",
      price: Number(r.price ?? 0),
      image: r.image ?? "",
      createdAt: r.createdAt,
    });
  } catch (e) {
    console.error("GET /products/:id error:", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// PUT /api/products/:id  (partial update biar fleksibel)
export async function PUT(req, { params }) {
  try {
    const id = parseId(params);
    const body = await req.json();
    const data = {};
    if ("name" in body) data.name = body.name;
    if ("whatsapp" in body) data.whatsapp = body.whatsapp;
    if ("tiktok" in body) data.tiktok = body.tiktok;
    if ("shopee" in body) data.shopee = toUrl(body.shopee);
    if ("category" in body) data.category = body.category;
    if ("price" in body) data.price = parseFloat(body.price);
    if ("image" in body) data.image = body.image;

    const updated = await prisma.product.update({ where: { id }, data });

    return NextResponse.json({
      id: updated.id,
      name: updated.name ?? "",
      whatsapp: updated.whatsapp ?? "",
      tiktok: updated.tiktok ?? "",
      shopee: toUrl(updated.shopee ?? ""),
      category: updated.category ?? "",
      price: Number(updated.price ?? 0),
      image: updated.image ?? "",
      createdAt: updated.createdAt,
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
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /products/:id error:", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
