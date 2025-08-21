"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BulkPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start, end }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push(`/jobs/${data.jobId}`);
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Bulk Student Search</h1>
        <input
          type="number"
          placeholder="Start Code"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="number"
          placeholder="End Code"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-bold"
        >
          {loading ? "Creating job..." : "Start Search"}
        </button>
      </form>
    </main>
  );
}
