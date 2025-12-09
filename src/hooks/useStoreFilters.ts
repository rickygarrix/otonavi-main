"use client"

import { useState, useMemo, useCallback } from "react"
import type { HomeStore } from "@/types/store"

export function useStoreFilters(
  stores: HomeStore[],
  externalLabelMap?: Map<string, string> // ✅ 追加
) {
  // ============================
  // フィルタ state
  // ============================
  const [prefecture, setPrefecture] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)
  const [storeType, setStoreType] = useState<string | null>(null)

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
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [securityKeys, setSecurityKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [floorKeys, setFloorKeys] = useState<string[]>([])
  const [sizeKey, setSizeKey] = useState<string | null>(null)

  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [pricingSystemKeys, setPricingSystemKeys] = useState<string[]>([])
  const [discountKeys, setDiscountKeys] = useState<string[]>([])
  const [vipKeys, setVipKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  const [soundKeys, setSoundKeys] = useState<string[]>([])
  const [lightingKeys, setLightingKeys] = useState<string[]>([])
  const [productionKeys, setProductionKeys] = useState<string[]>([])

  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [hospitalityKey, setHospitalityKey] = useState<string | null>(null)

  const [foodKeys, setFoodKeys] = useState<string[]>([])
  const [serviceKeys, setServiceKeys] = useState<string[]>([])
  const [drinkKeys, setDrinkKeys] = useState<string[]>([])

  // ============================
  // ✅ 内部 + 外部 labelMap を合成
  // ============================
  const labelMap = useMemo(() => {
    const map = new Map<string, string>()

    stores.forEach((s: any) => {
      if (s.prefecture_id && s.prefecture_label) map.set(s.prefecture_id, s.prefecture_label)
      if (s.area_id && s.area_label) map.set(s.area_id, s.area_label)
    })

    // ✅ 店舗が0件の県もここで補完
    externalLabelMap?.forEach((v, k) => {
      if (!map.has(k)) map.set(k, v)
    })

    return map
  }, [stores, externalLabelMap])

  // ============================
  // ✅ 全クリア（← これが今 undefined 扱いされてた）
  // ============================
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

    setPriceRange(null)
    setPricingSystemKeys([])
    setDiscountKeys([])
    setVipKeys([])
    setPaymentMethodKeys([])

    setSoundKeys([])
    setLightingKeys([])
    setProductionKeys([])

    setCustomerKeys([])
    setAtmosphereKeys([])
    setHospitalityKey(null)

    setFoodKeys([])
    setServiceKeys([])
    setDrinkKeys([])

    setAchievementFilter({ hasAward: false, hasMedia: false })
  }, [])

  // ============================
  // 絞り込みロジック
  // ============================
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      // ✅ 都道府県
      if (prefecture && s.prefecture_id !== prefecture) return false

      // ✅ エリア
      if (area && s.area_id !== area) return false

      // ✅ ドリンク（ここが今回の本丸）
      if (drinkKeys.length > 0) {
        // stores 側が drink_keys: string[] を持っている前提
        if (!s.drink_keys) return false

        const hasMatch = drinkKeys.some((key) =>
          s.drink_keys.includes(key)
        )

        if (!hasMatch) return false
      }

      return true
    })
  }, [stores, prefecture, area, drinkKeys])

  const count = filteredStores.length

  // ============================
  // ✅ 表示用フィルター（UUID → 日本語）
  // ============================
  const selectedFilters = [
    prefecture ? labelMap.get(prefecture) ?? prefecture : null,
    area ? labelMap.get(area) ?? area : null,

    // ✅ ドリンクも表示対象に追加
    ...drinkKeys.map((k) => labelMap.get(k) ?? k),
  ].filter(Boolean) as string[]

  // ============================
  // パネル制御
  // ============================
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)

  const handleSearch = useCallback(() => {
    if (count > 0) setIsResultOpen(true)
  }, [count])

  const handleSelectStore = useCallback((store: HomeStore) => {
    setSelectedStore(store)
    setIsDetailOpen(true)
  }, [])

  const handleCloseAll = useCallback(() => {
    setIsResultOpen(false)
    setIsDetailOpen(false)
    setSelectedStore(null)
  }, [])

  // ============================
  // ✅ ここが Home で展開している完全一致の return
  // ============================
  return {
    prefecture, setPrefecture,
    area, setArea,
    storeType, setStoreType,

    eventTrendKeys, setEventTrendKeys,
    ruleKeys, setRuleKeys,

    achievementFilter, setAchievementFilter,

    seatTypeKeys, setSeatTypeKeys,
    smokingKeys, setSmokingKeys,
    environmentKeys, setEnvironmentKeys,
    otherKeys, setOtherKeys,
    baggageKeys, setBaggageKeys,
    securityKeys, setSecurityKeys,
    toiletKeys, setToiletKeys,
    floorKeys, setFloorKeys,
    sizeKey, setSizeKey,

    priceRange, setPriceRange,
    pricingSystemKeys, setPricingSystemKeys,
    discountKeys, setDiscountKeys,
    vipKeys, setVipKeys,
    paymentMethodKeys, setPaymentMethodKeys,

    soundKeys, setSoundKeys,
    lightingKeys, setLightingKeys,
    productionKeys, setProductionKeys,

    customerKeys, setCustomerKeys,
    atmosphereKeys, setAtmosphereKeys,
    hospitalityKey, setHospitalityKey,

    foodKeys, setFoodKeys,
    serviceKeys, setServiceKeys,
    drinkKeys, setDrinkKeys,

    filteredStores,
    selectedFilters,
    count,

    isResultOpen,
    isDetailOpen,
    selectedStore,
    handleSearch,
    handleSelectStore,
    handleCloseAll,
    handleClear, // ✅ これでエラー消える
  }
}