"use client";

import HomeHeader from "@/components/dashboard/header";
import ProductList from "@/components/dashboard/products";
import TestimoniPage from "@/components/dashboard/testimoni";

export default function HomeContent() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
      <HomeHeader />
      <ProductList />
      <TestimoniPage />
    </main>
  );
}
