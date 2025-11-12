'use client'

import React from 'react'
import type { Store } from '../types/storeTypes'

type Props = {
  onSelect: (store: Store) => void
}

/**
 * 📋 店舗グリッドリスト（ResultPage 下部）
 * - 各カードクリックで詳細モーダルを開く
 */
export default function StoreGridList({ onSelect }: Props) {
  // ✅ Store 型に完全準拠したダミーデータ
  const stores: Store[] = [
    {
      id: '1',
      name: 'CLUB IKO',
      area: { name: '渋谷区' },
      store_type: { label: 'クラブ' },
      walk_minutes: 3,
      price_range: { label: '高め' },
      latitude: 35.6595,
      longitude: 139.7005,
      image_url:
        'https://images.unsplash.com/photo-1598387993441-c89d7c54f21c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      name: 'The Bar That Never Leaves',
      area: { name: '新宿区' },
      store_type: { label: 'バー' },
      walk_minutes: 10,
      price_range: { label: '中間' },
      latitude: 35.6938,
      longitude: 139.7034,
      image_url:
        'https://images.unsplash.com/photo-1566417713940-fe7c737a9e9c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '3',
      name: 'Lounge Nami',
      area: { name: '港区' },
      store_type: { label: 'ラウンジ' },
      walk_minutes: 6,
      price_range: { label: '低め' },
      latitude: 35.6581,
      longitude: 139.7516,
      image_url:
        'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&w=600&q=80',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-10">
      {stores.map((store) => (
        <button
          key={store.id}
          onClick={() => onSelect(store)}
          className="text-left bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <div className="aspect-[4/3] w-full bg-gray-100">
            <img
              src={store.image_url ?? 'https://placehold.co/300x200?text=No+Image'}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2.5">
            <h3 className="font-semibold text-[15px] truncate">{store.name}</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">
              {store.area?.name ?? ''}・{store.store_type?.label ?? ''}
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5">
              🚶 約{store.walk_minutes}分 / 💰 {store.price_range?.label}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}