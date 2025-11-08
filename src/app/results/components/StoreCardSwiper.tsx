'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, PanInfo, AnimatePresence } from 'framer-motion'
import { useResultState } from '../store/useResultState'

const STACK = 3
const stackStyles = [
  { x: 0, y: 0, scale: 1, opacity: 1, z: 40 },
  { x: 40, y: -6, scale: 0.96, opacity: 0.9, z: 30 },
  { x: 80, y: -12, scale: 0.92, opacity: 0.8, z: 20 },
]

export default function StoreCardSwiper() {
  const { stores, selectedStore, setSelectedStore } = useResultState()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isReloading, setIsReloading] = useState(false)

  // ✅ ピン押下で対象カードを手前に
  useEffect(() => {
    if (!selectedStore) return
    const index = stores.findIndex((s) => s.id === selectedStore.id)
    if (index !== -1) setActiveIndex(index)
  }, [selectedStore, stores])

  // 現在表示しているカード群（最大3枚）
  const visibleStores = useMemo(() => {
    if (!stores.length) return []
    return stores.slice(activeIndex, activeIndex + STACK)
  }, [stores, activeIndex])

  // 下スワイプ → 次へ
  const goNext = () => {
    if (activeIndex + 1 < stores.length) {
      const nextIndex = activeIndex + 1
      setActiveIndex(nextIndex)
      setSelectedStore(stores[nextIndex]) // ✅ ピン連動
    } else {
      // 最後のカードの後でリロード
      setIsReloading(true)
      setTimeout(() => {
        setActiveIndex(0)
        setSelectedStore(stores[0]) // ✅ 最初のピンに戻る
        setIsReloading(false)
      }, 800)
    }
  }

  // 上スワイプ → 1つ前へ
  const goPrev = () => {
    if (activeIndex === 0) return
    const prevIndex = Math.max(0, activeIndex - 1)
    setActiveIndex(prevIndex)
    setSelectedStore(stores[prevIndex]) // ✅ ピン連動
  }

  // スワイプイベント
  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info
    if (offset.y > 40 || velocity.y > 500) goNext()
    if (offset.y < -40 || velocity.y < -500) goPrev()
  }

  if (!stores.length) return null

  return (
    <div className="relative w-full h-[30vh] mt-2 select-none overflow-hidden flex items-end justify-center">
      <AnimatePresence>
        {!isReloading ? (
          visibleStores.map((store, i) => {
            const style = stackStyles[i]
            const isFront = i === 0

            const card = (
              <div className="relative w-full h-24 flex items-center overflow-hidden rounded-2xl bg-white shadow-[0_6px_12px_rgba(0,0,0,0.12)]">
                {/* 左画像 */}
                <div className="h-full w-24 shrink-0 overflow-hidden">
                  <img
                    src={store.image_url ?? 'https://placehold.co/120x120'}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* テキスト */}
                <div className="flex-1 px-3 py-1">
                  <p className="text-base font-bold text-gray-900 leading-tight">
                    {store.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {store.area?.name ?? '東京'}・{store.store_type?.label ?? 'クラブ'}
                  </p>
                </div>
              </div>
            )

            return (
              <motion.div
                key={store.id}
                className="absolute bottom-0 left-0 right-0"
                style={{ zIndex: style.z }}
                initial={{ opacity: 0, y: 15 }}
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
                    className="w-full h-full cursor-grab active:cursor-grabbing"
                  >
                    {card}
                  </motion.div>
                ) : (
                  <div className="pointer-events-none">{card}</div>
                )}
              </motion.div>
            )
          })
        ) : (
          <motion.div
            key="reloading"
            className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            リロード中...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}