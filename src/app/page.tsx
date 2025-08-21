// app/page.tsx
"use client";

import { useState } from "react";

type Student = {
  imgUrl: string;
  name: string;
  code: string;
  faculty: string;
  division: string;
  level: string;
  year: string;
  semester: string;
  email: string;
  barcode: string;
};

export default function Page() {
  const [code, setCode] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSearch() {
    setErr("");
    setStudent(null);
    setLoading(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!data.success) {
        setErr(data.error || "Unknown error");
      } else {
        setStudent(data.student);
      }
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          🎓 O6U Student Scraper
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border border-gray-700 rounded-lg p-2 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student code, e.g. 24003206"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button
            onClick={onSearch}
            disabled={loading || !code.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {err && (
          <div className="mb-4 rounded-lg bg-red-900/50 border border-red-700 p-3 text-red-300">
            {err}
          </div>
        )}

        {student && (
          <div className="mt-4">
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={student.imgUrl}
                alt={student.name}
                className="w-36 h-auto object-cover border border-gray-700"
              />
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <Info label="كود الطالب" value={student.code} />
                <Info label="الكلية" value={student.faculty} />
                <Info label="الشعبة" value={student.division} />
                <Info label="المستوى" value={student.level} />
                <Info label="العام الدراسي" value={student.year} />
                <Info label="الترم" value={student.semester} />
                <Info label="الإيميل" value={student.email} />
                <Info label="Barcode" value={student.barcode} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-medium break-all">{value || "—"}</div>
    </div>
  );
}
