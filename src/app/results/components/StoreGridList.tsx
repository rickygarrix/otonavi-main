'use client'

import React from 'react'
import { useResultState } from '../store/useResultState'

export default function StoreGridList() {
  const { stores, selectedStore, setSelectedStore } = useResultState()

  if (!stores.length) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        店舗データがありません
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-16">
      {stores.map((store) => {
        const isSelected = store.id === selectedStore?.id
        return (
          <button
            key={store.id}
            onClick={() => setSelectedStore(store)}
            className={`relative flex flex-col w-full rounded-xl overflow-hidden border transition-all duration-200 ${isSelected
                ? 'border-blue-400 ring-2 ring-blue-100'
                : 'border-gray-200 hover:border-gray-300'
              } bg-white shadow-sm`}
          >
            {/* 画像エリア */}
            <div className="w-full aspect-[1/1] bg-gray-100">
              <img
                src={store.image_url ?? 'https://placehold.co/300x300?text=No+Image'}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* テキスト情報 */}
            <div className="flex flex-col px-2 py-2 text-left">
              <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                {store.name}
              </p>
              <p className="text-[11px] text-gray-600 line-clamp-1">
                {store.area?.name ?? ''}・{store.store_type?.label ?? ''}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}