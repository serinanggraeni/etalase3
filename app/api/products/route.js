export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const toUrl = (u = "") =>
  u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "";

// GET: list products
export async function GET() {
  try {
    const rows = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    // flatten + aman numerik
    const products = rows.map((r) => ({
      id: r.id,
      image: r.image ?? "",
      name: r.name ?? "",
      whatsApp: r.whatsApp ?? "",
      tiktok: toUrl(r.tiktok ?? ""),
      shopee: toUrl(r.shopee ?? ""),
      category: r?.category?.name ?? r?.category ?? "",
      price: Number(r.price ?? 0),
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (e) {
    console.error("[GET /api/products]", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// POST: create product
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, whatsApp, tiktok, shopee, category, price, image } = body;

    // Validasi sederhana
    if (!name || !whatsApp || !tiktok || !shopee || !category || !price || !image) {

      return NextResponse.json(
        { error: "VALIDATION", message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        name,
        whatsApp,
        tiktok,
        shopee: toUrl(shopee),
        category,
        price: parseFloat(price),
        image,
      },
    });

    return NextResponse.json(
      {
        ...created,
        shopee: toUrl(created.shopee ?? ""),
        price: Number(created.price ?? 0),
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("[POST /api/products]", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
