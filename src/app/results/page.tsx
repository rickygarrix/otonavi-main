'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useResultState } from './store/useResultState'
import MapView from './components/MapView'
import StoreCardSwiper from './components/StoreCardSwiper'
import StoreGridList from './components/StoreGridList'
import ReturnHomeButton from '@/app/components/Header/ReturnHomeButton'
import FilterButton from './components/FilterButton'

export default function ResultPage() {
  const { stores, setStores, selectedStore } = useResultState()
  const [isListVisible, setIsListVisible] = useState(false)

  const sortMode: 'price' = 'price'

  useEffect(() => {
    const dummyStores = [
      {
        id: '1',
        name: 'CLUB IKO',
        area: { name: '渋谷区' },
        store_type: { label: 'クラブ' },
        walk_minutes: 3,
        price_range: { label: 'リーズナブル' },
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
        price_range: { label: 'プレミアム' },
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
        price_range: { label: 'スタンダード' },
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
        price_range: { label: 'ラグジュアリー' },
        latitude: 35.6432,
        longitude: 139.6981,
        image_url:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      },
    ]

    const priceOrder = ['リーズナブル', 'スタンダード', 'プレミアム', 'ラグジュアリー']

    const sorted = [...dummyStores].sort((a, b) => {
      const aLabel = a.price_range?.label?.trim() ?? ''
      const bLabel = b.price_range?.label?.trim() ?? ''
      return priceOrder.indexOf(aLabel) - priceOrder.indexOf(bLabel)
    })

    setStores(sorted)
  }, [setStores])

  const currentIndex = stores.findIndex((s) => s.id === selectedStore?.id)
  const total = stores.length

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* 🗺️ 背景マップ */}
      <MapView sortMode="price" />

      {/* 📍 上部ヘッダー */}
      <div className="absolute top-4 left-0 right-0 z-40 flex items-center justify-between px-4">
        <ReturnHomeButton />
        <div className="flex-1" />
        <FilterButton onClick={() => alert('検索条件モーダルを開く予定')} />
      </div>

      {/* 🪄 店舗カード（チラ見せ演出） */}
      <div className="absolute bottom-[100px] left-0 right-0 z-20">
        <StoreCardSwiper />
      </div>

      {/* 🔢 ページ番号 */}
      {selectedStore && (
        <div className="absolute bottom-[150px] right-6 z-30 bg-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full shadow">
          {currentIndex + 1} / {total}
        </div>
      )}

      {/* ⬆️ 下部スライドバー */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
        animate={{ height: isListVisible ? '100%' : '90px' }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {/* グリップバー */}
        <motion.div
          className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-gray-300 cursor-grab active:cursor-grabbing"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -40 || info.velocity.y < -400) setIsListVisible(true)
            if (info.offset.y > 40 || info.velocity.y > 400) setIsListVisible(false)
          }}
        />

        {/* 件数表示 */}
        <div className="flex items-center justify-center py-2">
          <p className="text-sm font-semibold text-gray-800">
            {total}件見つかりました
          </p>
        </div>

        {/* 📜 リスト */}
        <AnimatePresence>
          {isListVisible && (
            <motion.div
              key="list"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className="absolute top-12 left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-inner overflow-y-auto"
            >
              <div className="pt-2 pb-20">
                <StoreGridList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}