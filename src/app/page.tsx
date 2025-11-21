"use client"

import { useState, useCallback, useMemo } from "react"
import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import HomeSlider from "@/components/home/HomeSlider"
import { useHomeStores } from "@/hooks/useHomeStores"
import SearchFilter from "@/components/home/SearchFilter"
import AreaSelector from "@/components/home/AreaSelector"
import StoreTypeSelector from "@/components/home/StoreTypeSelector"
import FixedSearchBar from "@/components/home/FixedSearchBar"

import SearchResultPanel from "@/components/SearchResultPanel"
import StoreDetailPanel from "@/components/StoreDetailPanel"
import type { HomeStore } from "@/types/store"

export default function HomePage() {
  const { stores, loading } = useHomeStores()

  // -----------------------------
  // 🏷 選択状態
  // -----------------------------
  const [prefecture, setPrefecture] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)
  const [storeType, setStoreType] = useState<string | null>(null)

  // 🔍 検索結果パネル
  const [isResultOpen, setIsResultOpen] = useState(false)

  // 🏬 店舗詳細パネル
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // -----------------------------
  // 📝 ハンドラー
  // -----------------------------
  const handleAreaChange = useCallback((pref: string | null, area: string | null) => {
    setPrefecture(pref)
    setArea(area)
  }, [])

  const handleStoreTypeChange = useCallback((type: string | null) => {
    setStoreType(type)
  }, [])

  const handleClear = useCallback(() => {
    setPrefecture(null)
    setArea(null)
    setStoreType(null)
  }, [])

  // -----------------------------
  // 🔍 フィルタリングロジック
  // -----------------------------
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      if (prefecture && s.prefecture !== prefecture) return false
      if (area && s.area !== area) return false
      if (storeType && s.type !== storeType) return false
      return true
    })
  }, [stores, prefecture, area, storeType])

  const count = filteredStores.length

  // 検索実行 → パネル表示
  const handleSearch = useCallback(() => {
    if (count === 0) return
    setIsResultOpen(true)
  }, [count])

  // 選択中フィルタ
  const selectedFilters = [prefecture, area, storeType].filter(Boolean) as string[]

  // 店舗クリック → 詳細パネルへ
  const handleSelectStore = useCallback((store: HomeStore) => {
    setSelectedStore(store)
    setIsDetailOpen(true)
  }, [])

  return (
    <>
      {/* ========================== */}
      {/* 🎨 背景カーブ + スライダー */}
      {/* ========================== */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />

        <div className="mt-[80px]">
          <LogoHero />
        </div>

        <div className="mt-[40px]">
          {!loading && <HomeSlider stores={stores} />}
        </div>

        <div className="h-[140px]" />
      </div>

      {/* ========================== */}
      {/* 🔍 フィルター UI */}
      {/* ========================== */}
      <div className="bg-white w-full py-8">
        <SearchFilter />
        <div className="h-6" />
        <AreaSelector onChange={handleAreaChange} />
        <StoreTypeSelector onChange={handleStoreTypeChange} />
      </div>

      {/* ========================== */}
      {/* 🔍 固定検索バー */}
      {/* ========================== */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleSearch}
        count={count}
      />

      {/* ========================== */}
      {/* 📋 検索結果スライドインパネル */}
      {/* ========================== */}
      <SearchResultPanel
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        stores={filteredStores}
        selectedFilters={selectedFilters}
        onSelectStore={handleSelectStore}   // ★追加
      />

      {/* ========================== */}
      {/* 🏬 店舗詳細スライドインパネル */}
      {/* ========================== */}
      <StoreDetailPanel
        store={selectedStore}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  )
}