import { connectDB } from "@/lib/mongodb";
import Jobs from "@/models/Jobs";
import Student from "@/models/Student";

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: { jobId: string };
}) {
  await connectDB();

  const job = await Jobs.findOne({ jobId: params.jobId }).lean();
  const students = await Student.find({ jobId: params.jobId }).lean();

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        Job not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {/* @ts-ignore */}
          Bulk Search {job.jobId} ({job.start} → {job.end})
        </h1>
        <p className="mb-4">
          Status:{" "}
          <span
            className={
              // @ts-ignore
              job.status === "done"
                ? "text-green-400"
                : // @ts-ignore
                job.status === "running"
                ? "text-yellow-400"
                : "text-gray-400"
            }
          >
            {/* @ts-ignore */}
            {job.status}
          </span>
        </p>

        {students.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* @ts-ignore */}
            {students.map((s: any) => (
              <div key={s._id} className="bg-gray-800 rounded-xl p-4">
                <img
                  src={s.imgUrl}
                  alt={s.name}
                  className="w-full rounded-lg mb-2"
                />
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-gray-400">{s.code}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No students scraped yet.</div>
        )}
      </div>
    </main>
  );
}
