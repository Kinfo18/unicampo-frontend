"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Mostrar máximo 5 páginas alrededor de la actual
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      {/* Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {/* Páginas */}
      {visiblePages.map((page, index) => {
        const prev = visiblePages[index - 1];
        const showEllipsis = prev && page - prev > 1;

        return (
          <div key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-2 text-gray-400 text-sm">…</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                page === currentPage
                  ? "bg-primary-600 text-white shadow-sm"
                  : "border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600"
              }`}
            >
              {page}
            </button>
          </div>
        );
      })}

      {/* Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
