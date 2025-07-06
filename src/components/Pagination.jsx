"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages, genre }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    params.set("genre", genre); // Preserve genre filter
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded 
                   bg-gray-200 text-gray-800 hover:bg-gray-300 
                   dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600
                   disabled:opacity-50"
      >
        Previous
      </button>

      <span className="font-semibold text-gray-700 dark:text-gray-200">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded 
                   bg-gray-200 text-gray-800 hover:bg-gray-300 
                   dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600
                   disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
