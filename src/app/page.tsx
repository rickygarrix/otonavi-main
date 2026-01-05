"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import CommentSlider from "@/components/home/CommentSlider"
import HomeLatestStores from "@/components/home/HomeLatestStores"
import StoreTypeFilter from "@/components/selectors/StoreTypeFilter"
import SearchBar from "@/components/home/SearchBar"
import Footer from "@/components/ui/Footer"
import HomeFilterSections from "@/components/home/HomeFilterSections"

import {
  useHomeStoreCards,
  useHomeMasters,
  useHomeFilterState,
  useHomeSearchCount,
} from "@/hooks/home"

import type { GenericMaster } from "@/types/master"

export default function HomePage() {
  const router = useRouter()
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // =========================
  // State
  // =========================
  const [storeTypeId, setStoreTypeId] = useState<string | null>(null)
  const [clearKey, setClearKey] = useState(0)

  /** 🔑 masters 起動フラグ */
  const [mastersEnabled, setMastersEnabled] = useState(true)

  // =========================
  // Hero：最新店舗（最優先）
  // =========================
  const { stores: cardStores, loading } = useHomeStoreCards(12)

  // =========================
  // 件数だけ先に取得（爆速）
  // =========================
  const { count } = useHomeSearchCount({
    storeTypeId,
    filterKeys: [],
  })

  // =========================
  // Masters（遅延ロード）
  // =========================
  const masters = useHomeMasters(mastersEnabled)

  const storeTypes = useMemo<GenericMaster[]>(() => {
    if (!mastersEnabled) return []
    return Array.from(masters.genericMasters.values()).filter(
      (m) => m.table === "store_types"
    )
  }, [masters.genericMasters, mastersEnabled])

  // =========================
  // Filters（masters 前提）
  // =========================
  const filter = useHomeFilterState(
    masters.externalLabelMap,
    { storeTypeId },
    mastersEnabled
  )

  const { selectedKeys, selectedLabels, handleClear, ...setters } = filter

  // masters が有効な場合のみ、フィルタ反映した件数を再取得
  const { count: filteredCount } = useHomeSearchCount({
    storeTypeId,
    filterKeys: mastersEnabled ? selectedKeys : [],
  })

  const displayCount = mastersEnabled ? filteredCount : count

  // =========================
  // Handlers
  // =========================
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
    if (!mastersEnabled) setMastersEnabled(true)

    const section = masters.labelToSectionMap.get(label)
    if (!section) return

    sectionRefs.current[section]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  // =========================
  // View
  // =========================
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
      <StoreTypeFilter
        storeTypes={storeTypes}
        activeTypeId={storeTypeId}
        onChange={(id) => {
          setStoreTypeId(id)
          setMastersEnabled(true)
        }}
      />

      {/* ===== Filters ===== */}
      {mastersEnabled && (
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
      )}

      {/* ===== Fixed Search Bar ===== */}
      <SearchBar
        selectedFilters={selectedLabels}
        onClear={handleClearAll}
        onSearch={handleGoToStores}
        count={displayCount}
        onClickFilter={handleClickFilter}
      />

      <Footer hasFixedBottom />
    </>
  )
}