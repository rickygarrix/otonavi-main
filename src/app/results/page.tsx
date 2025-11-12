'use client'

import { motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useResultState } from './store/useResultState'
import MapView from './components/MapView'
import StoreCardSwiper from './components/StoreCardSwiper'
import StoreGridList from './components/StoreGridList'
import StoreDetailModal from './components/StoreDetailModal'
import FilterButton from './components/FilterButton'
import ReturnHomeButton from '@/app/components/Header/ReturnHomeButton'
import type { Store } from './types/storeTypes'

export default function ResultPage() {
  const [isListVisible, setIsListVisible] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const { stores, setStores } = useResultState()
  const y = useMotionValue(0)
  const [windowHeight, setWindowHeight] = useState(0)

  /** ✅ ダミーデータ */
  useEffect(() => {
    const dummyStores: Store[] = [
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
      {
        id: '4',
        name: 'Café Aurora',
        area: { name: '中目黒' },
        store_type: { label: 'カフェ' },
        walk_minutes: 12,
        price_range: { label: '高め' },
        latitude: 35.6432,
        longitude: 139.6981,
        image_url:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      },
    ]

    const priceOrder: Record<string, number> = { 低め: 0, 中間: 1, 高め: 2 }
    const sorted = [...dummyStores].sort((a, b) => {
      const aRank = priceOrder[a.price_range?.label ?? ''] ?? 999
      const bRank = priceOrder[b.price_range?.label ?? ''] ?? 999
      return aRank - bRank
    })

    setStores(sorted)
  }, [setStores])

  const total = stores.length

  /** 🧮 初期位置設定 */
  useEffect(() => {
    const h = window.innerHeight
    setWindowHeight(h)
    y.set(h * 0.9)
  }, [y])

  const openY = 80
  const closedY = windowHeight * 0.9

  /** 🎬 開閉アニメーション */
  const toggleList = () => {
    const target = isListVisible ? closedY : openY
    setIsListVisible(!isListVisible)

    animate(y, target, {
      type: 'spring',
      stiffness: 260,
      damping: 30,
      mass: 0.7,
    })
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* 🗺️ 背景マップ */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <MapView sortMode="price" />
      </div>

      {/* 📍 上部ヘッダー */}
      <div className="absolute top-4 left-0 right-0 z-40 flex justify-between px-4 pointer-events-auto">
        <ReturnHomeButton />
        <FilterButton onClick={() => alert('フィルター開く予定')} />
      </div>

      {/* 🪄 カードスワイパー（閉じている時のみ） */}
      {!isListVisible && (
        <div className="absolute bottom-[100px] left-0 right-0 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <StoreCardSwiper
              stores={stores}
              onChange={() => { }} // ✅ スワイプで詳細開かない
              onSelect={(store) => setSelectedStore(store)} // ✅ タップ時のみ開く
            />
          </div>
        </div>
      )}

      {/* 🔢 ページ番号 */}
      {!isListVisible && stores.length > 0 && (
        <div className="absolute bottom-[150px] right-6 z-20 bg-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full shadow pointer-events-none">
          {stores.findIndex((s) => s.id === selectedStore?.id) + 1 || 1} / {stores.length}
        </div>
      )}

      {/* 📜 モーダル（件数＋ボタン含む） */}
      <motion.div
        style={{ y, zIndex: 30, height: '100vh' }}
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col"
      >
        {/* 件数＋トグル */}
        <div className="flex items-center justify-center py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <p className="text-[15px] font-semibold text-gray-900">
            {total}件見つかりました
          </p>
          <button
            onClick={toggleList}
            className="ml-2 rounded-full hover:bg-gray-100 transition p-1"
            aria-label="リスト開閉"
          >
            {isListVisible ? (
              <ChevronDown size={20} strokeWidth={2.2} />
            ) : (
              <ChevronUp size={20} strokeWidth={2.2} />
            )}
          </button>
        </div>

        {/* 店舗リスト */}
        <div className="overflow-y-auto flex-1 pt-2 pb-20 scrollbar-hide">
          <StoreGridList onSelect={(store) => setSelectedStore(store)} />
        </div>
      </motion.div>

      {/* 🏪 店舗詳細モーダル（タップ時のみ開く） */}
      {selectedStore && (
        <StoreDetailModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </div>
  )
}