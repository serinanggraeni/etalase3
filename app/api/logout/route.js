import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true, message: "Logged out" });
  
  // Hapus cookie 'session'
  res.cookies.set({
    name: "session",
    value: "",
    path: "/",
    maxAge: 0, // ini akan menghapus cookie
  });

  return res;
}
