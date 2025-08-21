import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Jobs from "@/models/Jobs";

export async function POST(req: Request) {
  await connectDB();
  const { start, end } = await req.json();

  const jobId = `JOB-${Date.now()}`;

  const job = await Jobs.create({
    jobId,
    start,
    end,
    status: "pending",
  });

  return NextResponse.json({ success: true, jobId: job.jobId });
}
