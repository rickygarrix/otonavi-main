"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import CommentSlider from "@/components/home/CommentSlider"
import HomeLatestStores from "@/components/home/HomeLatestStores"

import StoreTypeFilter from "@/components/filters/StoreTypeFilter"
import SearchFilterStickyWrapper from "@/components/filters/SearchFilterStickyWrapper"
import FixedSearchBar from "@/components/home/FixedSearchBar"
import Footer from "@/components/Footer"
import HomeFilterSections from "@/components/home/HomeFilterSections"

import { useHomeStores } from "@/hooks/useHomeStores"
import { useHomeMasters } from "@/hooks/useHomeMasters"
import { useHomeStoreFilters } from "@/hooks/useStoreFilters"

import type { StoreType } from "@/types/store"

export default function HomePage() {
  const router = useRouter()

  // 🔽 セクションスクロール用 refs
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const [storeType, setStoreType] = useState<StoreType | null>(null)
  const [clearKey, setClearKey] = useState(0)

  const { stores, loading } = useHomeStores()
  const masters = useHomeMasters()

  const filter = useHomeStoreFilters(stores, masters.externalLabelMap, {
    storeType,
  })

  const {
    filteredStores,
    selectedFilters,
    count,
    handleClear,
    ...setters
  } = filter

  // -----------------------------
  // クリア
  // -----------------------------
  const handleClearAll = () => {
    handleClear()
    setClearKey((v) => v + 1)
    setStoreType(null)
  }

  // -----------------------------
  // 検索遷移
  // -----------------------------
  const handleGoToStores = () => {
    const params = new URLSearchParams()

    if (storeType) params.set("type", storeType)
    selectedFilters.forEach((f) => params.append("filters", f))
    filteredStores.forEach((s) => params.append("ids", s.id))

    router.push(`/stores?${params.toString()}`)
  }

  // -----------------------------
  // ✅ チップ → セクションスクロール（正解実装）
  // -----------------------------
  const handleClickFilter = (label: string) => {
    const section = masters.labelToSectionMap.get(label)
    if (!section) return

    sectionRefs.current[section]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <>
      {/* ===== Hero ===== */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />

        <div className="mt-[80px]">
          <LogoHero />
        </div>

        {!loading && (
          <div className="mt-[40px]">
            <HomeLatestStores stores={stores} />
          </div>
        )}

        <div className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none">
          <CommentSlider />
        </div>

        <div className="h-[160px]" />
      </div>

      {/* ===== Store Type ===== */}
      <SearchFilterStickyWrapper>
        <StoreTypeFilter
          activeType={storeType}
          onChange={setStoreType}
        />
      </SearchFilterStickyWrapper>

      {/* ===== Filters ===== */}
      <HomeFilterSections
        clearKey={clearKey}
        sectionRefs={sectionRefs}
        setPrefectureIds={setters.setPrefectureIds}
        setAreaIds={setters.setAreaIds}
        setCustomerKeys={setters.setCustomerKeys}
        setAtmosphereKeys={setters.setAtmosphereKeys}
        setSizeKey={setters.setSizeKeys}
        setDrinkKeys={setters.setDrinkKeys}
        setPriceRangeKeys={setters.setPriceRangeKeys}
        setPaymentMethodKeys={setters.setPaymentMethodKeys}
        setEventTrendKeys={setters.setEventTrendKeys}
        setBaggageKeys={setters.setBaggageKeys}
        setSmokingKeys={setters.setSmokingKeys}
        setToiletKeys={setters.setToiletKeys}
        setOtherKeys={setters.setOtherKeys}
      />

      {/* ===== Fixed Search Bar ===== */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClearAll}
        onSearch={handleGoToStores}
        count={count}
        onClickFilter={handleClickFilter}
      />

      <Footer />
      <div className="h-[50px]" />
    </>
  )
}