'use client'

import { useMemo } from 'react'
import { motion, PanInfo, AnimatePresence } from 'framer-motion'
import { useResultState } from '../store/useResultState'

/** 最大スタック数（前面+2枚） */
const STACK = 3

const stackStyles = [
  { x: 0, y: 0, scale: 1.0, opacity: 1, z: 40 },
  { x: 40, y: -6, scale: 0.96, opacity: 0.9, z: 30 },
  { x: 80, y: -12, scale: 0.92, opacity: 0.8, z: 20 },
]

export default function StoreCardSwiper() {
  const { stores, selectedStore, setSelectedStore } = useResultState()

  /** 現在のインデックス */
  const activeIndex = useMemo(() => {
    if (!stores.length) return 0
    if (!selectedStore) return 0
    const i = stores.findIndex((s) => s.id === selectedStore.id)
    return i >= 0 ? i : 0
  }, [stores, selectedStore])

  /** スタック対象のカード配列 */
  const visibleStores = useMemo(() => {
    if (!stores.length) return []
    const remaining = stores.length - activeIndex
    const count = Math.min(STACK, remaining)
    return stores.slice(activeIndex, activeIndex + count)
  }, [stores, activeIndex])

  /** 次へ（スワイプ下） */
  const goNext = () => {
    if (!stores.length) return
    const nextIndex = activeIndex + 1
    if (nextIndex >= stores.length) {
      // ✅ 最後のカードをめくったらループ
      setSelectedStore(stores[0])
    } else {
      setSelectedStore(stores[nextIndex])
    }
  }

  /** 前へ（スワイプ上） */
  const goPrev = () => {
    if (!stores.length) return
    const prevIndex = Math.max(0, activeIndex - 1)
    setSelectedStore(stores[prevIndex])
  }

  /** スワイプ操作 */
  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info
    if (offset.y > 40 || velocity.y > 500) goNext()
    if (offset.y < -40 || velocity.y < -500) goPrev()
  }

  if (!stores.length) return null

  return (
    <div className="relative w-full h-[150px] select-none overflow-visible flex items-end justify-center">
      <AnimatePresence>
        {visibleStores.map((store, i) => {
          const style = stackStyles[i]
          const isFront = i === 0

          return (
            <motion.div
              key={store.id}
              className="absolute bottom-0 left-0 right-0 flex justify-center"
              style={{ zIndex: style.z }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                x: style.x,
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
              }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            >
              {isFront ? (
                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.03 }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Card store={store} />
                </motion.div>
              ) : (
                <div className="pointer-events-none">
                  <Card store={store} />
                </div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/** ✅ カードコンポーネント */
function Card({ store }: { store: any }) {
  return (
    <div className="relative w-[360px] h-[120px] rounded-xl bg-white flex overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_0px_4px_rgba(0,0,0,0.1)]">
      {/* 左：画像 */}
      <div className="w-[120px] h-full overflow-hidden shrink-0">
        <img
          src={store.image_url ?? 'https://placehold.co/120x120'}
          alt={store.name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* 右：情報 */}
      <div className="w-[240px] bg-white pl-4 pr-4 flex flex-col justify-center">
        <p className="text-sm font-bold text-gray-900 leading-[1.4] line-clamp-1">
          {store.name}
        </p>
        <p className="text-xs text-gray-600 mt-[4px] line-clamp-1">
          {store.area?.name ?? '東京'}・{store.store_type?.label ?? 'クラブ'}
        </p>
        <div className="flex items-center gap-1 mt-[6px]">
          <span className="text-gray-500 text-sm">￥</span>
          <p className="text-xs text-gray-700 leading-4">
            {store.price_range?.label ?? '中間'}
          </p>
        </div>
      </div>
    </div>
  )
}