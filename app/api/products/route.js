import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ✅ gunakan prisma dari lib

// 🟢 GET semua produk
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /products error:", error);
    return NextResponse.json({ error: "Gagal mengambil produk." }, { status: 500 });
  }
}

// 🟢 POST buat produk baru
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, whatsApp, tiktok, shopee, category, price, image } = body;

    // Validasi sederhana
    if (!name || !whatsApp || !tiktok || !shopee || !category || !price || !image) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        whatsApp,
        tiktok,
        shopee,
        category,
        price: parseFloat(price),
        image,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /products error:", error);
    return NextResponse.json({ error: "Gagal membuat produk." }, { status: 500 });
  }
}
