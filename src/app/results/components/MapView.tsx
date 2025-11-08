// /app/results/components/MapView.tsx

'use client'

import { useResultState } from '../store/useResultState'

export default function MapView({ sortMode }: { sortMode: 'price' | 'station' }) {
  const { stores, selectedStore, setSelectedStore } = useResultState()

  return (
    <div className="h-full w-full bg-gray-200 relative">
      {/* 仮マップ：後でGoogleMap APIに置換 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
        <p>🗺️ Google Map Placeholder</p>

        {/* ピン一覧 */}
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          {stores.map((store) => {
            const label =
              sortMode === 'price'
                ? store.price_range?.label ?? '---'
                : store.walk_minutes
                  ? `${store.walk_minutes}分`
                  : '---'

            return (
              <button
                key={store.id}
                onClick={() => {
                  // 👇この if を削除 or 無効化
                  // if (selectedStore?.id === store.id) return
                  setSelectedStore(store)
                }}
                className={`px-3 py-1 rounded-full text-sm border transition ${selectedStore?.id === store.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-800 border-gray-300'
                  }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}