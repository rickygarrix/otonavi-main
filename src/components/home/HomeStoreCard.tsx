'use client'

import type { HomeStore } from '@/types/store'

export default function HomeStoreCard({ store }: { store: HomeStore }) {
  return (
    <div className="w-[260px] rounded-3xl overflow-hidden bg-[#0c0c0c80] backdrop-blur-md shadow-lg text-center">

      <div className="w-full h-60 overflow-hidden">
        {store.image_url ? (
          <img
            src={store.image_url}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="py-3 text-white">
        <p className="font-bold text-lg">{store.name}</p>
        <p className="text-sm opacity-80">
          {store.area} ・ {store.type}
        </p>
      </div>
    </div>
  )
}