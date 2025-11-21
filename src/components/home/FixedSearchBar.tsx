"use client"

import { Search } from "lucide-react"

type Props = {
  selectedFilters: string[]
  onClear: () => void
  onSearch: () => void
  count: number
}

export default function FixedSearchBar({
  selectedFilters,
  onClear,
  onSearch,
  count,
}: Props) {
  const isDisabled = count === 0

  const searchLabel = isDisabled
    ? "該当する店舗はありません"
    : `${count}件を検索`

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        bg-white z-50 border-t border-slate-200
        px-4 py-3
      "
    >
      <div className="flex gap-3 mt-2">
        {/* 全クリア */}
        <button
          onClick={onClear}
          className="
            flex-1 h-12 bg-slate-100 rounded-xl
            text-slate-900 font-medium
          "
        >
          すべてクリア
        </button>

        {/* 検索ボタン */}
        <button
          onClick={!isDisabled ? onSearch : undefined}
          disabled={isDisabled}
          className={`
            flex-[2] h-12 rounded-xl
            flex items-center justify-center gap-2
            text-lg font-semibold transition
            ${isDisabled
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-slate-800 text-white active:scale-[0.97]"
            }
          `}
        >
          <Search className="w-5 h-5" />
          {searchLabel}
        </button>
      </div>
    </div>
  )
}