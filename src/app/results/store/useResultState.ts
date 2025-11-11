'use client'

import { create } from 'zustand'
import type { Store } from '../types/storeTypes'  // ← 型をインポート

/** Zustandの状態定義 */
interface ResultState {
  stores: Store[]
  selectedStore: Store | null
  setStores: (stores: Store[]) => void
  setSelectedStore: (store: Store | null) => void
}

/** Zustandストア本体 */
export const useResultState = create<ResultState>((set) => ({
  stores: [],
  selectedStore: null,
  setStores: (stores) => set({ stores }),
  setSelectedStore: (store) => set({ selectedStore: store }),
}))