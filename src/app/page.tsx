"use client"

import { useState, useCallback, useMemo } from "react"
import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import HomeSlider from "@/components/home/HomeSlider"
import CommentSlider from "@/components/home/CommentSlider"
import { useHomeStores } from "@/hooks/useHomeStores"
import SearchFilter from "@/components/home/SearchFilter"

import AreaSelector from "@/components/home/AreaSelector"
import StoreTypeSelector from "@/components/home/StoreTypeSelector"
import EventTrendSelector from "@/components/home/EventTrendSelector"
import RuleSelector from "@/components/home/RuleSelector"
import AchievementSelector from "@/components/home/AchievementSelector"

import SeatTypeSelector from "@/components/home/SeatTypeSelector"
import SmokingSelector from "@/components/home/SmokingSelector"
import EnvironmentSelector from "@/components/home/EnvironmentSelector"
import OtherSelector from "@/components/home/OtherSelector"

import BaggageSelector from "@/components/home/BaggageSelector"
import SecuritySelector from "@/components/home/SecuritySelector"
import ToiletSelector from "@/components/home/ToiletSelector"
import FloorSelector from "@/components/home/FloorSelector"
import SizeSelector from "@/components/home/SizeSelector"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import SearchResultPanel from "@/components/SearchResultPanel"
import StoreDetailPanel from "@/components/StoreDetailPanel"

import type { HomeStore } from "@/types/store"

export default function HomePage() {
  const { stores, loading } = useHomeStores()

  // ---------- 基本フィルタ ----------
  const [prefecture, setPrefecture] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)
  const [storeType, setStoreType] = useState<string | null>(null)

  // ---------- 追加フィルタ（既存） ----------
  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([])
  const [ruleKeys, setRuleKeys] = useState<string[]>([])
  const [achievementFilter, setAchievementFilter] = useState({
    hasAward: false,
    hasMedia: false,
  })

  const [seatTypeKeys, setSeatTypeKeys] = useState<string[]>([])
  const [smokingKeys, setSmokingKeys] = useState<string[]>([])
  const [environmentKeys, setEnvironmentKeys] = useState<string[]>([])
  const [otherKeys, setOtherKeys] = useState<string[]>([])

  // ---------- 追加フィルタ（今回追加分） ----------
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [securityKeys, setSecurityKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [floorKeys, setFloorKeys] = useState<string[]>([])
  const [sizeKey, setSizeKey] = useState<string | null>(null) // 広さは単一選択

  // ---------- パネル制御 ----------
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)

  // ---------- 全閉じ ----------
  const handleCloseAll = useCallback(() => {
    setIsDetailOpen(false)
    setIsResultOpen(false)
    setSelectedStore(null)
  }, [])

  const handleAchievementChange = useCallback(
    (v: { hasAward: boolean; hasMedia: boolean }) => {
      setAchievementFilter(v)
    },
    []
  )

  // ---------- 全クリア ----------
  const handleClear = useCallback(() => {
    setPrefecture(null)
    setArea(null)
    setStoreType(null)

    setEventTrendKeys([])
    setRuleKeys([])
    setSeatTypeKeys([])
    setSmokingKeys([])
    setEnvironmentKeys([])
    setOtherKeys([])
    setBaggageKeys([])
    setSecurityKeys([])
    setToiletKeys([])
    setFloorKeys([])
    setSizeKey(null)

    setAchievementFilter({ hasAward: false, hasMedia: false })
  }, [])

  // ---------- フィルタ適用 ----------
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      // 基本
      if (prefecture && s.prefecture !== prefecture) return false
      if (area && s.area !== area) return false
      if (storeType && s.type !== storeType) return false

      // 実績
      if (achievementFilter.hasAward && !s.hasAward) return false
      if (achievementFilter.hasMedia && !s.hasMedia) return false

      // 各マスタフィルタ
      const checks = [
        [eventTrendKeys, s.event_trend_keys],
        [ruleKeys, s.rule_keys],
        [seatTypeKeys, s.seat_type_keys],
        [smokingKeys, s.smoking_keys],
        [environmentKeys, s.environment_keys],
        [otherKeys, s.other_keys],
        [baggageKeys, s.baggage_keys],
        [securityKeys, s.security_keys],
        [toiletKeys, s.toilet_keys],
        [floorKeys, s.floor_keys],
      ]

      for (const [selected, storeKeys] of checks) {
        if (selected.length > 0) {
          if (!selected.every((k) => storeKeys.includes(k))) return false
        }
      }

      // 広さ（単一）
      if (sizeKey && s.size_key !== sizeKey) return false

      return true
    })
  }, [
    stores,
    prefecture,
    area,
    storeType,
    eventTrendKeys,
    ruleKeys,
    seatTypeKeys,
    smokingKeys,
    environmentKeys,
    otherKeys,
    baggageKeys,
    securityKeys,
    toiletKeys,
    floorKeys,
    sizeKey,
    achievementFilter,
  ])

  const count = filteredStores.length

  const handleSearch = useCallback(() => {
    if (count > 0) setIsResultOpen(true)
  }, [count])

  // ---------- 選択中のフィルタ ----------
  const selectedFilters = [
    prefecture,
    area,
    storeType,
    ...eventTrendKeys,
    ...ruleKeys,
    ...seatTypeKeys,
    ...smokingKeys,
    ...environmentKeys,
    ...otherKeys,
    ...baggageKeys,
    ...securityKeys,
    ...toiletKeys,
    ...floorKeys,
    sizeKey,
    achievementFilter.hasAward ? "受賞歴あり" : null,
    achievementFilter.hasMedia ? "メディア掲載あり" : null,
  ].filter(Boolean) as string[]

  const handleSelectStore = useCallback((store: HomeStore) => {
    setSelectedStore(store)
    setIsDetailOpen(true)
  }, [])

  return (
    <>
      {/* 背景 */}
      <div className="relative w-full text-white overflow-hidden">
        <CurvedBackground />
        <div className="mt-[80px]"><LogoHero /></div>

        <div className="mt-[40px]">
          {!loading && (
            <HomeSlider stores={stores} onSelectStore={handleSelectStore} />
          )}
        </div>

        <div className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none">
          <CommentSlider />
        </div>

        <div className="h-[160px]" />
      </div>

      {/* フィルタ UI */}
      <div className="bg-white w-full py-8">
        <SearchFilter />

        <div className="h-6" />
        <AreaSelector onChange={setArea} />

        <StoreTypeSelector onChange={setStoreType} />
        <EventTrendSelector onChange={setEventTrendKeys} />
        <RuleSelector onChange={setRuleKeys} />
        <AchievementSelector onChange={setAchievementFilter} />

        {/* 🔥 未追加だったフィルタ */}
        <SeatTypeSelector onChange={setSeatTypeKeys} />
        <SmokingSelector onChange={setSmokingKeys} />
        <EnvironmentSelector onChange={setEnvironmentKeys} />
        <OtherSelector onChange={setOtherKeys} />

        <BaggageSelector onChange={setBaggageKeys} />
        <SecuritySelector onChange={setSecurityKeys} />
        <ToiletSelector onChange={setToiletKeys} />
        <FloorSelector onChange={setFloorKeys} />
        <SizeSelector onChange={setSizeKey} />
      </div>

      {/* 固定検索バー */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleSearch}
        count={count}
      />

      {/* 検索結果パネル */}
      <SearchResultPanel
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        onCloseAll={handleCloseAll}
        stores={filteredStores}
        selectedFilters={selectedFilters}
        onSelectStore={handleSelectStore}
      />

      {/* 店舗詳細 */}
      <StoreDetailPanel
        store={selectedStore}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onCloseAll={handleCloseAll}
      />

      <div className="h-[50px]" />
    </>
  )
}