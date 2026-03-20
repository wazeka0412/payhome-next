'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`inline-flex items-center justify-center min-w-[44px] h-[44px] px-4 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
            page === currentPage
              ? 'bg-[#E8740C] text-white border-2 border-[#E8740C] shadow-md'
              : 'border-2 border-gray-200 text-gray-600 hover:border-[#E8740C] hover:text-[#E8740C]'
          }`}
          style={page === currentPage ? { boxShadow: '0 4px 12px rgba(232, 116, 12, 0.3)' } : {}}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center justify-center h-[44px] px-5 rounded-full text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:border-[#E8740C] hover:text-[#E8740C] transition-all duration-200 cursor-pointer gap-1.5"
        >
          次へ <span>→</span>
        </button>
      )}
    </div>
  )
}
