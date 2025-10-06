export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const toUrl = (u = "") =>
  u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "";

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

    const product = {
      id: r.id,
      image: r.image ?? "",
      tiktok: r.tiktok ?? "",
      shopee: toUrl(r.shopee ?? ""),
      category: r?.category?.name ?? r?.category ?? "",
      price: Number(r.price ?? 0),
    };
    return NextResponse.json(product);
  } catch (e) {
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
    const { tiktok, shopee, category, price, image } = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(tiktok !== undefined && { tiktok }),
        ...(shopee !== undefined && { shopee: toUrl(shopee) }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({
      ...updated,
      shopee: toUrl(updated.shopee ?? ""),
      price: Number(updated.price ?? 0),
    });
  } catch (e) {
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
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
