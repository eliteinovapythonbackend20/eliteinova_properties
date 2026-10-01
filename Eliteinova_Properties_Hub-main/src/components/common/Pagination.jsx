import React from 'react';

// Shared Prev / page-numbers / Next control, styled to match the teal/emerald
// theme used across the property browse pages. Pass it the state from
// usePagination() — it never manages page state itself.
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Windowed page numbers: first, last, current +/-1, with ellipses between gaps
  const pages = [];
  const pageWindow = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= pageWindow) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="mt-8 bg-[#E1EDEB] rounded-lg shadow-sm border border-teal-100 py-2.5 px-3">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg font-semibold text-sm border-2 border-teal-600 text-teal-700 hover:bg-teal-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
        >
          ← Prev
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-teal-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all duration-300 ${
                p === currentPage
                  ? 'text-white shadow-lg'
                  : 'text-teal-700 border-2 border-teal-200/50 hover:bg-teal-50'
              }`}
              style={
                p === currentPage
                  ? { background: 'linear-gradient(135deg, #00695C, #26A69A)' }
                  : undefined
              }
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg font-semibold text-[14px] border-2 border-teal-600 text-teal-700 hover:bg-teal-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
