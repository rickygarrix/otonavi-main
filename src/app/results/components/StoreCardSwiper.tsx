'use client'

import { useMemo, useState } from 'react'
import { motion, PanInfo, AnimatePresence } from 'framer-motion'
import { useResultState } from '../store/useResultState'

const STACK = 3
const stackStyles = [
  { x: 0, y: 0, scale: 1.0, opacity: 1, z: 40 },
  { x: 40, y: -6, scale: 0.96, opacity: 0.9, z: 30 },
  { x: 80, y: -12, scale: 0.92, opacity: 0.8, z: 20 },
]

export default function StoreCardSwiper() {
  const { stores, selectedStore, setSelectedStore } = useResultState()
  const [isReloading, setIsReloading] = useState(false)
  const [animPhase, setAnimPhase] = useState<'normal' | 'reverse'>('normal')

  const activeIndex = useMemo(() => {
    if (!stores.length) return 0
    if (!selectedStore) return 0
    const i = stores.findIndex((s) => s.id === selectedStore.id)
    return i >= 0 ? i : 0
  }, [stores, selectedStore])

  const visibleStores = useMemo(() => {
    if (!stores.length) return []
    return stores.slice(activeIndex, activeIndex + STACK)
  }, [stores, activeIndex])

  const goNext = () => {
    if (!stores.length) return
    const nextIndex = activeIndex + 1
    if (nextIndex < stores.length) {
      setSelectedStore(stores[nextIndex])
    } else {
      // ✅ リロード開始
      setIsReloading(true)
      setAnimPhase('reverse')
    }
  }

  const goPrev = () => {
    if (!stores.length) return
    const prevIndex = Math.max(0, activeIndex - 1)
    setSelectedStore(stores[prevIndex])
  }

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
                <div className="h-full w-24 shrink-0 overflow-hidden">
                  <img
                    src={store.image_url ?? 'https://placehold.co/120x120'}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 px-3 py-1">
                  <p className="text-base font-bold text-gray-900 leading-tight">{store.name}</p>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ x: style.x, y: style.y, scale: style.scale, opacity: style.opacity }}
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
          // 🎬 パタパタ逆再生アニメーション
          <div className="absolute bottom-0 left-0 right-0">
            {[2, 1, 0].map((i) => (
              <motion.div
                key={`reverse-${i}`}
                className="absolute bottom-0 left-0 right-0"
                initial={{ y: -120 - i * 40, rotate: -3 + i * 2, opacity: 0 }}
                animate={{
                  y: [-120 - i * 40, 0],
                  rotate: [-3 + i * 2, 0],
                  opacity: [0, 1],
                  transition: {
                    delay: i * 0.25, // ← 3→2→1 の順に戻る
                    duration: 0.6,
                    ease: [0.25, 0.6, 0.3, 1.0],
                  },
                }}
                // ✅ 1枚目（最後のアニメーション）が終わったら完了
                onAnimationComplete={() => {
                  if (i === 0) {
                    setTimeout(() => {
                      setSelectedStore(stores[0])
                      setIsReloading(false)
                      setAnimPhase('normal')
                    }, 100) // ← 少し余韻
                  }
                }}
              >
                <div className="relative w-full h-24 flex items-center overflow-hidden rounded-2xl bg-white shadow-[0_6px_12px_rgba(0,0,0,0.15)]">
                  <div className="h-full w-24 shrink-0 overflow-hidden">
                    <img
                      src={stores[i]?.image_url ?? 'https://placehold.co/120x120'}
                      alt={stores[i]?.name ?? ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 px-3 py-1">
                    <p className="text-base font-bold text-gray-900 leading-tight">{stores[i]?.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {stores[i]?.area?.name ?? '東京'}・{stores[i]?.store_type?.label ?? 'クラブ'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}