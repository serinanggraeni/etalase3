import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /products/:id error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE product by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, whatsApp, tiktok, shopee, category, price, image } = body;

    // Validasi sederhana
    if (!name || !whatsApp || !tiktok || !shopee || !category || !price || !image) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT /products/:id error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}

// ✅ DELETE product by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /products/:id error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
