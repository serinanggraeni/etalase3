"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ConfigPanel() {
  const [config, setConfig] = useState({
    tiktokUrl: "",
    shopeeUrl: "",
    whatsappNumber: "",
    whatsappMessage: "",
    primaryColor: "#3b82f6",
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Ambil config dari server
  useEffect(() => {
    axios.get("/api/config").then(res => {
      if (res.data) setConfig(res.data);
      setLoading(false);
    });
  }, []);

  // 🔹 Simpan perubahan
  const handleSave = async () => {
    await axios.put("/api/config", config);
    alert("✅ Config berhasil disimpan!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold text-gray-800">⚙️ Website Config</h2>

      <label className="block">
        <span className="font-medium">URL TikTok</span>
        <input
          type="text"
          className="w-full mt-1 border rounded p-2"
          value={config.tiktokUrl || ""}
          onChange={e => setConfig({ ...config, tiktokUrl: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="font-medium">URL Shopee</span>
        <input
          type="text"
          className="w-full mt-1 border rounded p-2"
          value={config.shopeeUrl || ""}
          onChange={e => setConfig({ ...config, shopeeUrl: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="font-medium">Nomor WhatsApp</span>
        <input
          type="text"
          className="w-full mt-1 border rounded p-2"
          placeholder="contoh: 628123456789"
          value={config.whatsappNumber || ""}
          onChange={e => setConfig({ ...config, whatsappNumber: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="font-medium">Pesan WhatsApp</span>
        <textarea
          className="w-full mt-1 border rounded p-2"
          value={config.whatsappMessage || ""}
          onChange={e => setConfig({ ...config, whatsappMessage: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="font-medium">Warna Utama</span>
        <input
          type="color"
          className="w-20 h-10 mt-1 rounded"
          value={config.primaryColor || "#3b82f6"}
          onChange={e => setConfig({ ...config, primaryColor: e.target.value })}
        />
      </label>

      <button
        onClick={handleSave}
        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Simpan Perubahan
      </button>
    </div>
  );
}
