import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mt-12">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-emerald-50 disabled:opacity-50 disabled:hover:bg-transparent transition"
      >
        <ChevronLeft size={20} className="rtl:rotate-180" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg border transition ${
            currentPage === page
              ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
              : 'border-gray-200 hover:bg-emerald-50 text-gray-600'
          }`}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:bg-emerald-50 disabled:opacity-50 disabled:hover:bg-transparent transition"
      >
        <ChevronRight size={20} className="rtl:rotate-180" />
      </button>
    </div>
  );
};

export default Pagination;
