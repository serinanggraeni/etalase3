"use client";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
