"use client"

import { useState, useCallback, useMemo } from "react"
import CurvedBackground from "@/components/home/CurvedBackground"
import LogoHero from "@/components/home/LogoHero"
import HomeSlider from "@/components/home/HomeSlider"
import CommentSlider from "@/components/home/CommentSlider"
import { useHomeStores } from "@/hooks/useHomeStores"
import SearchFilter from "@/components/home/SearchFilter"

import AreaSelector from "@/components/home/AreaSelector"
import AchievementSelector from "@/components/home/AchievementSelector"

import GenericSelector from "@/components/home/GenericSelector"

import FixedSearchBar from "@/components/home/FixedSearchBar"
import SearchResultPanel from "@/components/SearchResultPanel"
import StoreDetailPanel from "@/components/StoreDetailPanel"

import type { HomeStore } from "@/types/store"

export default function HomePage() {
  const { stores, loading } = useHomeStores()

  // ▼ 基本フィルタ
  const [prefecture, setPrefecture] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)
  const [storeType, setStoreType] = useState<string | null>(null)

  // ▼ 既存フィルタ
  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([])
  const [ruleKeys, setRuleKeys] = useState<string[]>([])
  const [achievementFilter, setAchievementFilter] = useState({
    hasAward: false,
    hasMedia: false,
  })

  // ▼ GenericSelector フィルタ
  const [seatTypeKeys, setSeatTypeKeys] = useState<string[]>([])
  const [smokingKeys, setSmokingKeys] = useState<string[]>([])
  const [environmentKeys, setEnvironmentKeys] = useState<string[]>([])
  const [otherKeys, setOtherKeys] = useState<string[]>([])
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [securityKeys, setSecurityKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [floorKeys, setFloorKeys] = useState<string[]>([])
  const [sizeKey, setSizeKey] = useState<string | null>(null)

  // ▼ パネル系
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)

  const handleCloseAll = useCallback(() => {
    setIsDetailOpen(false)
    setIsResultOpen(false)
    setSelectedStore(null)
  }, [])

  // ▼ 全クリア
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

  // ▼ フィルタ実行
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      if (prefecture && s.prefecture !== prefecture) return false
      if (area && s.area !== area) return false
      if (storeType && s.store_type_id !== storeType) return false
      if (achievementFilter.hasAward && !s.hasAward) return false
      if (achievementFilter.hasMedia && !s.hasMedia) return false

      const checks: [string[], string[]][] = [
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
        if (selected.length > 0 && !selected.every((k) => storeKeys.includes(k))) {
          return false
        }
      }

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

  // ▼ 検索ボタン
  const handleSearch = useCallback(() => {
    if (count > 0) setIsResultOpen(true)
  }, [count])

  // ▼ 選択中フィルタ表示用
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
          {!loading && <HomeSlider stores={stores} onSelectStore={handleSelectStore} />}
        </div>
        <div className="absolute left-0 bottom-[30px] w-full flex justify-center pointer-events-none">
          <CommentSlider />
        </div>
        <div className="h-[160px]" />
      </div>

      {/* フィルタ */}
      <div className="bg-white w-full py-8">
        <SearchFilter />
        <div className="h-6" />

        {/* 地域 */}
        <AreaSelector onChange={(pref, a) => { setPrefecture(pref); setArea(a); }} />

        {/* 店舗タイプ → GenericSelector に統一 */}
        <GenericSelector
          title="店舗タイプ"
          table="store_types"
          selection="single"
          onChange={setStoreType}
        />

        {/* Achievement */}
        <AchievementSelector onChange={setAchievementFilter} />

        {/* 汎用フィルタ */}
        <GenericSelector title="座席タイプ" table="seat_type_definitions" selection="multi" onChange={setSeatTypeKeys} />
        <GenericSelector title="喫煙" table="smoking_definitions" selection="multi" onChange={setSmokingKeys} />
        <GenericSelector title="周辺環境" table="environment_definitions" selection="multi" onChange={setEnvironmentKeys} />
        <GenericSelector title="その他" table="other_definitions" selection="multi" onChange={setOtherKeys} />
        <GenericSelector title="荷物預かり" table="baggage_definitions" selection="multi" onChange={setBaggageKeys} />
        <GenericSelector title="セキュリティ" table="security_definitions" selection="multi" onChange={setSecurityKeys} />
        <GenericSelector title="トイレ" table="toilet_definitions" selection="multi" onChange={setToiletKeys} />
        <GenericSelector title="フロア位置" table="floor_definitions" selection="multi" onChange={setFloorKeys} />
        <GenericSelector title="広さ" table="size_definitions" selection="single" onChange={setSizeKey} />
      </div>

      {/* 固定検索バー */}
      <FixedSearchBar
        selectedFilters={selectedFilters}
        onClear={handleClear}
        onSearch={handleSearch}
        count={count}
      />

      {/* 結果 */}
      <SearchResultPanel
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        onCloseAll={handleCloseAll}
        stores={filteredStores}
        selectedFilters={selectedFilters}
        onSelectStore={handleSelectStore}
      />

      {/* 詳細 */}
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