export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "");

// GET: list products
export async function GET() {
  try {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

    const products = rows.map((r) => ({
      id: r.id,
      name: r.name ?? "",
      whatsapp: r.whatsapp ?? "",       // <- konsisten
      image: r.image ?? "",
      tiktok: r.tiktok ?? "",
      shopee: toUrl(r.shopee ?? ""),
      category: r.category ?? "",
      price: Number(r.price ?? 0),
      createdAt: r.createdAt,           // untuk tampilan tabel
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
    const { name, whatsapp, tiktok, shopee, category, price, image } = await req.json();

    if (![name, whatsapp, tiktok, shopee, category, price, image].every(Boolean)) {
      return NextResponse.json(
        { error: "VALIDATION", message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        name,
        whatsapp,                        // <- konsisten
        tiktok,
        shopee: toUrl(shopee),
        category,
        price: parseFloat(price),
        image,
      },
    });

    const out = {
      id: created.id,
      name: created.name ?? "",
      whatsapp: created.whatsapp ?? "",
      image: created.image ?? "",
      tiktok: created.tiktok ?? "",
      shopee: toUrl(created.shopee ?? ""),
      category: created.category ?? "",
      price: Number(created.price ?? 0),
      createdAt: created.createdAt,
    };

    return NextResponse.json(out, { status: 201 });
  } catch (e) {
    console.error("[POST /api/products]", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
