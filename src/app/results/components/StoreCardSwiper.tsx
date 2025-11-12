'use client'

import { useMemo } from 'react'
import { motion, PanInfo, AnimatePresence } from 'framer-motion'
import type { Store } from '../types/storeTypes'

const STACK = 3
const stackStyles = [
  { x: 0, y: 0, scale: 1.0, opacity: 1, z: 40 },
  { x: 40, y: -6, scale: 0.96, opacity: 0.9, z: 30 },
  { x: 80, y: -12, scale: 0.92, opacity: 0.8, z: 20 },
]

type Props = {
  stores: Store[]
  selectedStore: Store | null
  onChange?: (store: Store) => void
  onSelect?: (store: Store) => void
}

export default function StoreCardSwiper({ stores, selectedStore, onChange, onSelect }: Props) {
  // 現在インデックスは props から算出（内部stateは持たない）
  const activeIndex = useMemo(() => {
    if (!stores.length || !selectedStore) return 0
    const i = stores.findIndex((s) => s.id === selectedStore.id)
    return i >= 0 ? i : 0
  }, [stores, selectedStore])

  // 表示スタック
  const visibleStores = useMemo(() => {
    const remaining = stores.length - activeIndex
    const count = Math.min(STACK, remaining)
    return stores.slice(activeIndex, activeIndex + count)
  }, [stores, activeIndex])

  // 次へ／前へ（ループ）
  const goNext = () => {
    if (!stores.length) return
    const next = stores[(activeIndex + 1) % stores.length]
    onChange?.(next)
  }
  const goPrev = () => {
    if (!stores.length) return
    const prev = stores[(activeIndex - 1 + stores.length) % stores.length]
    onChange?.(prev)
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info
    if (offset.y > 40 || velocity.y > 500) goNext()
    if (offset.y < -40 || velocity.y < -500) goPrev()
  }

  if (!stores.length) return null

  return (
    <div className="relative w-full h-[150px] select-none flex items-end justify-center overflow-visible">
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
                  className="cursor-grab active:cursor-grabbing"
                  onClick={() => onSelect?.(store)}
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

function Card({ store }: { store: Store }) {
  return (
    <div className="relative w-[360px] h-[120px] rounded-xl bg-white flex overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_0px_4px_rgba(0,0,0,0.1)]">
      <div className="w-[120px] h-full overflow-hidden shrink-0 bg-gray-100 grid place-items-center">
        <span className="text-xs text-gray-400">120 × 120</span>
      </div>
      <div className="w-[240px] bg-white pl-4 pr-4 flex flex-col justify-center">
        <p className="text-sm font-bold text-gray-900 leading-[1.4] line-clamp-1">{store.name}</p>
        <p className="text-xs text-gray-600 mt-[4px] line-clamp-1">
          {store.area?.name ?? '東京'}・{store.store_type?.label ?? 'クラブ'}
        </p>
        <div className="flex items-center gap-1 mt-[6px]">
          <span className="text-gray-500 text-sm">￥</span>
          <p className="text-xs text-gray-700 leading-4">{store.price_range?.label ?? '中間'}</p>
        </div>
      </div>
    </div>
  )
}