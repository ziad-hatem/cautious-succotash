// app/students/page.tsx
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  await connectDB();
  const students = await Student.find().sort({ updatedAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
          Saved Students
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="py-3 pr-4">Image</th>
                <th className="py-3 pr-4">Code</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Faculty</th>
                <th className="py-3 pr-4">Level</th>
                <th className="py-3 pr-4">Year</th>
                <th className="py-3 pr-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => (
                <tr
                  key={s._id}
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                >
                  <td className="py-2 pr-4">
                    <img
                      src={s.imgUrl}
                      alt={s.name}
                      className="w-14 h-auto object-cover shadow-md"
                    />
                  </td>
                  <td className="py-2 pr-4">{s.code}</td>
                  <td className="py-2 pr-4 font-medium">{s.name}</td>
                  <td className="py-2 pr-4">{s.faculty}</td>
                  <td className="py-2 pr-4">{s.level}</td>
                  <td className="py-2 pr-4">{s.year}</td>
                  <td className="py-2 pr-4 text-gray-400">
                    {new Date(s.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!students.length && (
            <div className="text-gray-400 mt-6 text-center">
              No students saved yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
