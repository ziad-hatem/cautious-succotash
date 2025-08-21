// app/students/page.tsx
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    faculty?: string;
    sort?: string;
  };
}

export default async function StudentsPage({ searchParams }: Props) {
  await connectDB();

  // Build query
  const query: any = {};
  if (searchParams.faculty) {
    query.faculty = searchParams.faculty;
  }

  // Sorting options
  let sort: any = { updatedAt: -1 };
  if (searchParams.sort === "code_asc") sort = { code: 1 };
  if (searchParams.sort === "code_desc") sort = { code: -1 };
  if (searchParams.sort === "year_asc") sort = { year: 1 };
  if (searchParams.sort === "year_desc") sort = { year: -1 };

  const students = await Student.find(query).sort(sort).lean();

  // Get unique faculties for filter dropdown
  const faculties = await Student.distinct("faculty");

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
          Saved Students
        </h1>

        {/* Filter + Sort Controls */}
        <div className="flex flex-wrap gap-4 justify-between mb-6">
          <form method="get" className="flex gap-3">
            <select
              name="faculty"
              defaultValue={searchParams.faculty || ""}
              className="bg-gray-700 text-white px-3 py-2 rounded-md"
            >
              <option value="">All Faculties</option>
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={searchParams.sort || ""}
              className="bg-gray-700 text-white px-3 py-2 rounded-md"
            >
              <option value="">Sort by Updated</option>
              <option value="code_asc">Code ↑</option>
              <option value="code_desc">Code ↓</option>
              <option value="year_asc">Year ↑</option>
              <option value="year_desc">Year ↓</option>
            </select>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-white"
            >
              Apply
            </button>
          </form>

          {searchParams.faculty || searchParams.sort ? (
            <Link
              href="/students"
              className="text-sm text-gray-400 hover:text-gray-200 underline"
            >
              Reset Filters
            </Link>
          ) : null}
        </div>

        {/* Students Table */}
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
              No students found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
