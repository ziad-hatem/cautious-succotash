// app/api/scrape/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import { fetchAndScrape } from "@/lib/scrape";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code || String(code).trim() === "") {
      return NextResponse.json(
        { success: false, error: "Code is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const baseUrl =
      process.env.TARGET_SEARCH_URL ||
      "https://id.o6uelearning.com/Home/Search?searchName=";
    const scraped = await fetchAndScrape(String(code).trim(), baseUrl);

    if (!scraped) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    // Upsert by code
    const saved = await Student.findOneAndUpdate(
      { code: scraped.code },
      scraped,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({ success: true, student: saved });
  } catch (err: any) {
    console.error("API /api/scrape error:", err?.message || err);
    return NextResponse.json(
      { success: false, error: "Failed to scrape" },
      { status: 500 }
    );
  }
}
