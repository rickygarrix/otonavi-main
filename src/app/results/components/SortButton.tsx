'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const sortOptions = [
  { id: 'price', label: '料金が低い順' },
  { id: 'station', label: '最寄駅から近い順' },
]

export default function SortButton({ onChange }: { onChange: (v: string) => void }) {
  const [selected, setSelected] = useState(sortOptions[0])

  const handleClick = () => {
    const next =
      selected.id === 'price' ? sortOptions[1] : sortOptions[0]
    setSelected(next)
    onChange(next.id)
  }

  return (
    <button
      onClick={handleClick}
      className="bg-white/80 backdrop-blur-sm rounded-full shadow px-3 py-1.5 text-sm font-medium text-gray-800 flex items-center gap-1 hover:bg-white transition"
    >
      {selected.label}
      <ChevronDown className="w-4 h-4 text-gray-600" />
    </button>
  )
}