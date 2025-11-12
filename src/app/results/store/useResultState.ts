'use client'

import { create } from 'zustand'
import type { Store } from '../types/storeTypes'

type ResultState = {
  stores: Store[]
  selectedStore: Store | null
  setStores: (stores: Store[]) => void
  setSelectedStore: (store: Store | null) => void
}

export const useResultState = create<ResultState>((set) => ({
  stores: [],
  selectedStore: null,
  setStores: (stores) => set({ stores }),
  setSelectedStore: (store) => set({ selectedStore: store }),
}))