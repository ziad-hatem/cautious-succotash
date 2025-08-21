"use client";

import { useEffect } from "react";

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
  createdAt?: string;
}

interface Props {
  student: Student;
  onClose: () => void;
}

export default function StudentPopup({ student, onClose }: Props) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Prevent background scroll

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const InfoRow = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;

    return (
      <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-600 last:border-b-0">
        <span className="text-gray-400 text-sm font-medium mb-1 sm:mb-0">
          {label}:
        </span>
        <span className="text-white break-words sm:text-right sm:max-w-[60%]">
          {value}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-600 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Student Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Student Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 mx-auto md:mx-0 bg-gray-700 rounded-xl overflow-hidden">
                {student.imgUrl ? (
                  <img
                    src={student.imgUrl}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-20 h-20"
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
            </div>

            {/* Student Information */}
            <div className="flex-1 space-y-0">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {student.name}
                </h3>
                <p className="text-indigo-400 text-lg font-medium">
                  Code: {student.code}
                </p>
              </div>

              <div className="space-y-0">
                <InfoRow label="Faculty" value={student.faculty} />
                <InfoRow label="Division" value={student.division} />
                <InfoRow label="Level" value={student.level} />
                <InfoRow label="Academic Year" value={student.year} />
                <InfoRow label="Semester" value={student.semester} />
                <InfoRow label="Email" value={student.email} />
                <InfoRow label="Barcode" value={student.barcode} />
                {student.jobId && (
                  <InfoRow label="Job ID" value={student.jobId} />
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <h4 className="text-lg font-semibold text-white mb-4">
              Record Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Created:</span>
                <p className="text-white">
                  {formatDate(student.createdAt || student.updatedAt)}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Last Updated:</span>
                <p className="text-white">{formatDate(student.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Image URL for debugging */}
          {student.imgUrl && (
            <div className="mt-6 pt-6 border-t border-gray-600">
              <details className="text-sm">
                <summary className="text-gray-400 cursor-pointer hover:text-white">
                  Image URL (Click to expand)
                </summary>
                <p className="mt-2 text-xs text-gray-300 break-all bg-gray-700 p-3 rounded">
                  {student.imgUrl}
                </p>
              </details>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-600 p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {student.imgUrl && (
              <a
                href={student.imgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
              >
                Open Image
              </a>
            )}
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
