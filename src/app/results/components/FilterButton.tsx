'use client'

import React from 'react'
import { FunnelIcon } from '@heroicons/react/24/outline'

interface FilterButtonProps {
  onClick?: () => void
}

/**
 * 🔍 絞り込みボタン（右上）
 */
export default function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 active:scale-95 transition-all duration-150"
      aria-label="フィルターを開く"
    >
      <FunnelIcon className="w-5 h-5 text-gray-700" />
    </button>
  )
}