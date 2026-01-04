"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import CommentSlider from "@/components/home/CommentSlider"
import HomeLatestStores from "@/components/home/HomeLatestStores"

import StoreTypeFilter from "@/components/filters/selectors/StoreTypeFilter"
import SearchFilterStickyWrapper from "@/components/filters/layouts/SearchFilterStickyWrapper"
import HomeFilterSections from "@/components/home/HomeFilterSections"
import SearchBar from "@/components/home/SearchBar"
import Footer from "@/components/ui/Footer"

import {
  useHomeStoreCards,
  useHomeMasters,
  useHomeFilterState,
} from "@/hooks/home"

import { useStoresForSearch, useStoreFilters } from "@/hooks/store"
import type { GenericMaster } from "@/types/master"

export default function HomePage() {
  const router = useRouter()
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const [storeTypeId, setStoreTypeId] = useState<string | null>(null)
  const [clearKey, setClearKey] = useState(0)

  // ============================
  // ① Home表示用：最新カード（軽量）
  // ============================
  const { stores: cardStores, loading } = useHomeStoreCards(12)

  // ============================
  // ② マスター（UI・ラベル用）
  // ============================
  const masters = useHomeMasters()

  const storeTypes = useMemo<GenericMaster[]>(() => {
    return Array.from(masters.genericMasters.values()).filter(
      (m) => m.table === "store_types"
    )
  }, [masters.genericMasters])

  // ============================
  // ③ Home専用フィルター状態
  // ============================
  const filter = useHomeFilterState(masters.externalLabelMap, { storeTypeId })
  const { selectedKeys, selectedLabels, handleClear, ...setters } = filter

  // ============================
  // ④ 検索用：全店舗（件数計算専用）
  // ============================
  const { stores: searchStores } = useStoresForSearch()

  const { filteredStores } = useStoreFilters(searchStores, {
    filters: selectedKeys,
    storeTypeId,
  })

  // ============================
  // ⑤ handlers
  // ============================
  const handleClearAll = () => {
    handleClear()
    setClearKey((v) => v + 1)
    setStoreTypeId(null)
  }

  const handleGoToStores = () => {
    const params = new URLSearchParams()

    if (storeTypeId) params.set("store_type_id", storeTypeId)
    selectedKeys.forEach((k) => params.append("filters", k))

    router.push(`/stores?${params.toString()}`)
  }

  const handleClickFilter = (label: string) => {
    const section = masters.labelToSectionMap.get(label)
    if (!section) return

    sectionRefs.current[section]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  // ============================
  // ⑥ View（fv UI）
  // ============================
  return (
    <>
      {/* ===== Hero ===== */}
      <div className="text-light-3 relative flex h-146 flex-col items-center gap-10 overflow-hidden bg-[url('/background-sp@2x.png')] bg-cover bg-center px-4 pt-20">
        <p className="text-[10px] tracking-widest">
          夜の音楽をもっと楽しむための音箱ナビ
        </p>

        <Image
          src="/logo-white.svg"
          alt="オトナビ"
          width={200}
          height={60}
          className="drop-shadow-lg"
        />

        {!loading && (
          <div className="mt-10">
            <HomeLatestStores stores={cardStores} />
          </div>
        )}

        <CommentSlider />
      </div>

      {/* ===== Store Type ===== */}
      <SearchFilterStickyWrapper>
        <StoreTypeFilter
          storeTypes={storeTypes}
          activeTypeId={storeTypeId}
          onChange={setStoreTypeId}
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
        setEnvironmentKeys={setters.setEnvironmentKeys}
        setOtherKeys={setters.setOtherKeys}
      />

      {/* ===== Fixed Search Bar ===== */}
      <SearchBar
        selectedFilters={selectedLabels}
        onClear={handleClearAll}
        onSearch={handleGoToStores}
        count={filteredStores.length} // ★ Homeでも該当件数が即わかる
        onClickFilter={handleClickFilter}
      />

      <Footer hasFixedBottom />
    </>
  )
}