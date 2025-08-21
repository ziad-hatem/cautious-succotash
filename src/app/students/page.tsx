// app/students/page.tsx
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import StudentsList from "./StudentsList";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    faculty?: string;
    sort?: string;
    page?: string;
  };
}

export default async function StudentsPage({ searchParams }: Props) {
  await connectDB();

  const page = parseInt(searchParams.page || "1");
  const limit = 50;
  const skip = (page - 1) * limit;

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

  // Get students with pagination
  const [students, totalCount] = await Promise.all([
    Student.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Student.countDocuments(query),
  ]);

  // Get unique faculties for filter dropdown
  const faculties = await Student.distinct("faculty");

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-400">
          Saved Students
        </h1>

        <StudentsList
          // @ts-ignore
          students={students}
          faculties={faculties}
          searchParams={searchParams}
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </div>
    </main>
  );
}
