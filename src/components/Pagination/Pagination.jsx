// src/components/Pagination.jsx
import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // Generate an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center  ">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`flex items-center justify-center px-2 h-10 me-3 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white hover:bg-black`}>
        Previous
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 py-1 text-sm me-1 font-semibold rounded-md transition-colors duration-200 ease-in-out ${
            currentPage === page
              ? "bg-black text-white"
              : "bg-white text-blue-600 hover:bg-slate-700 hover:text-white"
          }`}>
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center px-2 h-10 me-3 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white hover:bg-black`}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
