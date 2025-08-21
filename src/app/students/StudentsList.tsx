"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import StudentPopup from "./StudentPopup";

interface Student {
  _id: string;
  code: string;
  name: string;
  imgUrl?: string;
  faculty?: string;
  division?: string;
  level?: string;
  year?: string;
  semester?: string;
  email?: string;
  barcode?: string;
  jobId?: string;
  updatedAt: string;
}

interface Props {
  students: Student[];
  faculties: string[];
  searchParams: {
    faculty?: string;
    sort?: string;
    page?: string;
  };
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function StudentsList({
  students,
  faculties,
  searchParams,
  currentPage,
  totalPages,
  totalCount,
}: Props) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(urlSearchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when changing filters
    if (newParams.faculty !== undefined || newParams.sort !== undefined) {
      params.delete("page");
    }

    router.push(`/students?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`/students?${params.toString()}`);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const showPages = 5; // Number of page buttons to show

      let start = Math.max(1, currentPage - Math.floor(showPages / 2));
      let end = Math.min(totalPages, start + showPages - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    };

    return (
      <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
        {/* Previous button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 text-sm"
        >
          ←
        </button>

        {/* First page */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
            >
              1
            </button>
            {getPageNumbers()[0] > 2 && (
              <span className="text-gray-400">...</span>
            )}
          </>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`px-3 py-2 rounded-lg text-sm ${
              pageNum === currentPage
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Last page */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <span className="text-gray-400">...</span>
            )}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 text-sm"
        >
          →
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6">
        {/* Stats & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
          <div className="text-sm text-gray-400">
            Showing {students.length} of {totalCount} students
            {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={searchParams.faculty || ""}
              onChange={(e) => updateFilters({ faculty: e.target.value })}
              className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
            >
              <option value="">All Faculties</option>
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <select
              value={searchParams.sort || ""}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
            >
              <option value="">Sort by Updated</option>
              <option value="code_asc">Code ↑</option>
              <option value="code_desc">Code ↓</option>
              <option value="year_asc">Year ↑</option>
              <option value="year_desc">Year ↓</option>
            </select>

            {(searchParams.faculty || searchParams.sort) && (
              <Link
                href="/students"
                className="text-sm text-gray-400 hover:text-gray-200 underline self-center"
              >
                Reset
              </Link>
            )}
          </div>
        </div>

        {/* Students Grid */}
        {students.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {students.map((student) => (
              <div
                key={student._id}
                onClick={() => setSelectedStudent(student)}
                className="bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg"
              >
                {/* Student Image */}
                <div className="aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-gray-600">
                  {student.imgUrl ? (
                    <img
                      src={student.imgUrl}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Student Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm md:text-base line-clamp-2">
                    {student.name}
                  </h3>

                  <div className="space-y-1 text-xs md:text-sm">
                    <p className="text-indigo-300 font-medium">
                      Code: {student.code}
                    </p>

                    {student.faculty && (
                      <p className="text-gray-300 line-clamp-1">
                        {student.faculty}
                      </p>
                    )}

                    <div className="flex justify-between items-center text-gray-400">
                      {student.level && <span>{student.level}</span>}
                      {student.year && <span>{student.year}</span>}
                    </div>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400">
                    Updated: {new Date(student.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-lg">No students found</p>
            <p className="text-sm mt-2">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Student Popup */}
      {selectedStudent && (
        <StudentPopup
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
}
