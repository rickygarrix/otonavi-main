"use client"

import { X } from "lucide-react"
import type { HomeStore } from "@/types/store"

type Props = {
  store: HomeStore | null
  isOpen: boolean
  onClose: () => void
}

export default function StoreDetailPanel({ store, isOpen, onClose }: Props) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-full max-w-[480px]
        bg-white z-[70] shadow-xl
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        flex flex-col
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b">
        <button onClick={onClose}>
          <X className="w-6 h-6 text-slate-700" />
        </button>
        <div className="text-lg font-semibold text-slate-900">
          店舗詳細
        </div>
      </div>

      {store && (
        <div className="overflow-y-auto p-4">
          <img
            src={store.image_url ?? "/default_shop.svg"}
            alt={store.name}
            className="w-full h-48 rounded-xl object-cover mb-4"
          />

          <h2 className="text-xl font-bold text-slate-900">{store.name}</h2>
          <p className="text-slate-600 mt-1 text-sm">
            {store.prefecture} {store.area} ・ {store.type}
          </p>

          {store.description && (
            <p className="mt-4 text-slate-700 leading-relaxed">
              {store.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}