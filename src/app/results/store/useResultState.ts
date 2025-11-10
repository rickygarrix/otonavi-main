// /app/results/store/useResultState.ts
import { create } from 'zustand'
import { Store } from '../types/store'

type SortOrder = 'price' | 'distance' | 'popular' | 'newest'
type ViewMode = 'map' | 'list'

interface ResultState {
  stores: Store[]
  selectedStore: Store | null
  sortOrder: SortOrder
  viewMode: ViewMode
  isFilterModalOpen: boolean
  isSortModalOpen: boolean

  // actions
  setStores: (stores: Store[]) => void
  setSelectedStore: (store: Store | null) => void
  setSortOrder: (order: SortOrder) => void
  setViewMode: (mode: ViewMode) => void
  toggleFilterModal: () => void
  toggleSortModal: () => void
  reset: () => void
}

export const useResultState = create<ResultState>((set) => ({
  stores: [],
  selectedStore: null,
  sortOrder: 'price',
  viewMode: 'map',
  isFilterModalOpen: false,
  isSortModalOpen: false,

  // 🔹 アクション
  setStores: (stores) => set({ stores }),
  setSelectedStore: (store) => set({ selectedStore: store }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleFilterModal: () =>
    set((state) => ({ isFilterModalOpen: !state.isFilterModalOpen })),
  toggleSortModal: () =>
    set((state) => ({ isSortModalOpen: !state.isSortModalOpen })),

  // 🔹 全リセット
  reset: () =>
    set({
      stores: [],
      selectedStore: null,
      sortOrder: 'price',
      viewMode: 'map',
      isFilterModalOpen: false,
      isSortModalOpen: false,
    }),
}))