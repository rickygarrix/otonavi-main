'use client'

import { Filter } from 'lucide-react'

export default function FilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/80 backdrop-blur-sm rounded-full shadow px-2.5 py-2 flex items-center justify-center hover:bg-white transition"
    >
      <Filter className="w-5 h-5 text-gray-800" />
    </button>
  )
}