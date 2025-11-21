// src/components/SearchResultPanel.tsx
"use client"

import { X } from "lucide-react"
import type { HomeStore } from "@/types/store"
import StoreCard from "@/components/store/StoreCard"  // ★ 追加

type Props = {
  isOpen: boolean
  onClose: () => void
  stores: HomeStore[]
  selectedFilters: string[]
  onSelectStore: (store: HomeStore) => void
}

export default function SearchResultPanel({
  isOpen,
  onClose,
  stores,
  selectedFilters,
  onSelectStore,
}: Props) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full max-w-[480px]
        bg-white shadow-2xl z-[60]
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        flex flex-col
      `}
    >
      {/* --- Header --- */}
      <div className="flex items-center gap-4 px-4 py-3 border-b">
        <button onClick={onClose}>
          <X className="w-6 h-6 text-slate-700" />
        </button>

        <div className="text-lg font-semibold text-slate-900">
          {stores.length}件の店舗
        </div>
      </div>

      {/* --- Filters --- */}
      {selectedFilters.length > 0 && (
        <div className="px-4 py-3 flex flex-wrap gap-2 border-b bg-slate-50">
          {selectedFilters.map((f, i) => (
            <span
              key={i}
              className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-200"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {/* --- 店舗一覧 --- */}
      <div className="overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {stores.map((s) => (
            <StoreCard
              key={s.id}
              store={s}
              onClick={() => onSelectStore(s)}  // ← 詳細パネルへ
            />
          ))}
        </div>
      </div>
    </div>
  )
}