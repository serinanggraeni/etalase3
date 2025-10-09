import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟡 PUT (edit testimoni)
export async function PUT(req, { params }) {
  try {
    const { name, message, rating } = await req.json();

    const updated = await prisma.testimoni.update({
      where: { id: Number(params.id) },
      data: { name, message, rating },
    });

    return NextResponse.json({ success: true, testimoni: updated });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui testimoni" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE (hapus testimoni)
export async function DELETE(_, { params }) {
  try {
    await prisma.testimoni.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus testimoni" },
      { status: 500 }
    );
  }
}
