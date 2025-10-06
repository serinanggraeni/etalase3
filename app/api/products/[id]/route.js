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
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { tiktok, shopee, category, price, image } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        tiktok,
        shopee,
        category,
        price: parseFloat(price),
        image,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}

// ✅ DELETE product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
