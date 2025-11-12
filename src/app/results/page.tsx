'use client'

import { motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
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
  const [modalStore, setModalStore] = useState<Store | null>(null)
  const { stores, selectedStore, setStores, setSelectedStore } = useResultState()
  const y = useMotionValue(0)
  const [windowHeight, setWindowHeight] = useState(0)


  useEffect(() => {
    const dummy: Store[] = [
      {
        id: '1',
        name: 'CLUB IKO',
        area: { name: '渋谷区' },
        store_type: { label: 'クラブ' },
        price_range: { label: '高め' },
        latitude: 35.6595,
        longitude: 139.7005,
        walk_minutes: 5, // ✅ 追加
      },
      {
        id: '2',
        name: 'The Bar That Never Leaves',
        area: { name: '新宿区' },
        store_type: { label: 'バー' },
        price_range: { label: '中間' },
        latitude: 35.6938,
        longitude: 139.7034,
        walk_minutes: 8, // ✅ 追加
      },
      {
        id: '3',
        name: 'Lounge Nami',
        area: { name: '港区' },
        store_type: { label: 'ラウンジ' },
        price_range: { label: '低め' },
        latitude: 35.6581,
        longitude: 139.7516,
        walk_minutes: 6, // ✅ 追加
      },
      {
        id: '4',
        name: 'Café Aurora',
        area: { name: '中目黒' },
        store_type: { label: 'カフェ' },
        price_range: { label: '高め' },
        latitude: 35.6432,
        longitude: 139.6981,
        walk_minutes: 10, // ✅ 追加
      },
    ]
    setStores(dummy)
  }, [setStores])

  const sortedStores = useMemo(() => {
    const priceOrder: Record<string, number> = { 低め: 0, 中間: 1, 高め: 2 }
    return [...stores].sort(
      (a, b) =>
        (priceOrder[a.price_range?.label ?? ''] ?? 999) -
        (priceOrder[b.price_range?.label ?? ''] ?? 999)
    )
  }, [stores])

  useEffect(() => {
    // ✅ 初回ロード時のみ1件目を選択
    if (sortedStores.length && !selectedStore) {
      setSelectedStore(sortedStores[0])
    }
  }, [sortedStores])

  const total = sortedStores.length

  useEffect(() => {
    const h = window.innerHeight
    setWindowHeight(h)
    y.set(h * 0.9)
  }, [y])

  const openY = 80
  const closedY = windowHeight * 0.9

  const toggleList = () => {
    const target = isListVisible ? closedY : openY
    setIsListVisible(!isListVisible)
    animate(y, target, { type: 'spring', stiffness: 260, damping: 30 })
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      <div className="absolute inset-0 z-0">
        <MapView sortMode="price" stores={sortedStores} />
      </div>

      <div className="absolute top-4 left-0 right-0 z-40 flex justify-between px-4 pointer-events-auto">
        <ReturnHomeButton />
        <FilterButton onClick={() => alert('フィルター開く予定')} />
      </div>

      {!isListVisible && (
        <div className="absolute bottom-[100px] left-0 right-0 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <StoreCardSwiper
              stores={sortedStores}
              selectedStore={selectedStore}
              onChange={(store) => setSelectedStore(store)}
              onSelect={(store) => setModalStore(store)}
            />
          </div>
        </div>
      )}

      {!isListVisible && total > 0 && (
        <div className="absolute bottom-[150px] right-6 z-20 bg-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full shadow pointer-events-none">
          {sortedStores.findIndex((s) => s.id === selectedStore?.id) + 1 || 1} / {total}
        </div>
      )}

      <motion.div
        style={{ y, zIndex: 30, height: '100vh' }}
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex flex-col"
      >
        <div className="flex items-center justify-center py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <p className="text-[15px] font-semibold text-gray-900">{total}件見つかりました</p>
          <button onClick={toggleList} className="ml-2 rounded-full hover:bg-gray-100 transition p-1">
            {isListVisible ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pt-2 pb-20 scrollbar-hide">
          <StoreGridList onSelect={(store) => setModalStore(store)} />
        </div>
      </motion.div>

      {modalStore && <StoreDetailModal store={modalStore} onClose={() => setModalStore(null)} />}
    </div>
  )
}