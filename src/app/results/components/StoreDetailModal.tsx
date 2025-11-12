'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Store } from '../types/storeTypes'

type Props = {
  store: Store | null
  onClose: () => void
}

/**
 * 📱 店舗詳細モーダル（右からスライドイン・全画面表示）
 * - `store` が null の場合は非表示
 * - 右スライドアニメーションで自然に開閉
 */
export default function StoreDetailModal({ store, onClose }: Props) {
  return (
    <AnimatePresence>
      {store && (
        <motion.div
          key="store-detail-modal"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 35 }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
        >
          {/* 🔹ヘッダー */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{store.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition text-sm"
            >
              ✕ 閉じる
            </button>
          </div>

          {/* 🔹メインビジュアル */}
          <div className="w-full h-60 bg-gray-100">
            <img
              src={store.image_url ?? 'https://placehold.co/600x400?text=No+Image'}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 🔹詳細情報 */}
          <div className="p-5 space-y-3">
            <p className="text-sm text-gray-700">
              📍 {store.area?.name ?? ''}・{store.store_type?.label ?? ''}
            </p>
            <p className="text-sm text-gray-700">
              💰 価格帯：{store.price_range?.label ?? '不明'}
            </p>
            <p className="text-sm text-gray-700">
              🚶 徒歩：約{store.walk_minutes}分
            </p>
          </div>

          {/* 🔹追加セクション（ダミー） */}
          <div className="p-5 space-y-4 text-gray-600">
            <p>ここに店舗の詳細説明、写真ギャラリー、レビューなどを配置できます。</p>
            <p>
              現在はダミーデータを表示していますが、将来的に Supabase
              から詳細データを取得して反映できます。
            </p>
            <div className="h-[400px] bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center">
              （詳細コンテンツエリア）
            </div>
          </div>

          {/* 🔹フッター余白 */}
          <div className="h-16" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}