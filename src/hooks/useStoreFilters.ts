"use client"

import { useState, useMemo, useCallback } from "react"
import type { HomeStore } from "@/types/store"

/**
 * 🔑 storeTypeId = store_types.id（UUID）
 */
type Options = {
  storeTypeId?: string | null
}

export function useHomeStoreFilters(
  stores: HomeStore[],
  externalLabelMap?: Map<string, string>,
  options?: Options
) {
  // ============================
  // state
  // ============================
  const [prefectureIds, setPrefectureIds] = useState<string[]>([])
  const [areaIds, setAreaIds] = useState<string[]>([])

  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [sizeKeys, setSizeKeys] = useState<string[]>([])

  const [drinkKeys, setDrinkKeys] = useState<string[]>([])
  const [priceRangeKeys, setPriceRangeKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([])
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [smokingKeys, setSmokingKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [otherKeys, setOtherKeys] = useState<string[]>([])

  // ============================
  // ID / key → label map
  // ============================
  const labelMap = useMemo(() => {
    const map = new Map<string, string>()

    // stores に含まれる動的ラベル
    stores.forEach((s) => {
      if (s.prefecture_id && s.prefecture_label) {
        map.set(s.prefecture_id, s.prefecture_label)
      }
      if (s.area_id && s.area_label) {
        map.set(s.area_id, s.area_label)
      }
    })

    // masters（useHomeMasters 由来）
    externalLabelMap?.forEach((label, key) => {
      if (!map.has(key)) {
        map.set(key, label)
      }
    })

    return map
  }, [stores, externalLabelMap])

  // ============================
  // filtering core
  // ============================
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      /**
       * ✅ store type filter
       * store_type_id (UUID) で比較する
       */
      if (
        options?.storeTypeId != null &&
        s.store_type_id !== options.storeTypeId
      ) {
        return false
      }

      // prefecture
      if (
        prefectureIds.length &&
        (!s.prefecture_id || !prefectureIds.includes(s.prefecture_id))
      ) {
        return false
      }

      // area
      if (
        areaIds.length &&
        (!s.area_id || !areaIds.includes(s.area_id))
      ) {
        return false
      }

      // generic filters
      const checks: [string[], string[]][] = [
        [customerKeys, s.customer_keys ?? []],
        [atmosphereKeys, s.atmosphere_keys ?? []],
        [sizeKeys, s.size_key ? [s.size_key] : []],
        [drinkKeys, s.drink_keys ?? []],
        [priceRangeKeys, s.price_range_id ? [s.price_range_id] : []],
        [paymentMethodKeys, s.payment_method_keys ?? []],
        [eventTrendKeys, s.event_trend_keys ?? []],
        [baggageKeys, s.baggage_keys ?? []],
        [smokingKeys, s.smoking_keys ?? []],
        [toiletKeys, s.toilet_keys ?? []],
        [otherKeys, s.other_keys ?? []],
      ]

      for (const [selected, storeValues] of checks) {
        if (selected.length && !selected.some((k) => storeValues.includes(k))) {
          return false
        }
      }

      return true
    })
  }, [
    stores,
    options?.storeTypeId,
    prefectureIds,
    areaIds,
    customerKeys,
    atmosphereKeys,
    sizeKeys,
    drinkKeys,
    priceRangeKeys,
    paymentMethodKeys,
    eventTrendKeys,
    baggageKeys,
    smokingKeys,
    toiletKeys,
    otherKeys,
  ])

  // ============================
  // derived values
  // ============================
  const count = filteredStores.length

  const selectedFilters = [
    ...prefectureIds,
    ...areaIds,
    ...customerKeys,
    ...atmosphereKeys,
    ...sizeKeys,
    ...drinkKeys,
    ...priceRangeKeys,
    ...paymentMethodKeys,
    ...eventTrendKeys,
    ...baggageKeys,
    ...smokingKeys,
    ...toiletKeys,
    ...otherKeys,
  ].map((k) => labelMap.get(k) ?? k)

  // ============================
  // clear
  // ============================
  const handleClear = useCallback(() => {
    setPrefectureIds([])
    setAreaIds([])
    setCustomerKeys([])
    setAtmosphereKeys([])
    setSizeKeys([])
    setDrinkKeys([])
    setPriceRangeKeys([])
    setPaymentMethodKeys([])
    setEventTrendKeys([])
    setBaggageKeys([])
    setSmokingKeys([])
    setToiletKeys([])
    setOtherKeys([])
  }, [])

  // ============================
  // return
  // ============================
  return {
    // setters
    prefectureIds, setPrefectureIds,
    areaIds, setAreaIds,
    customerKeys, setCustomerKeys,
    atmosphereKeys, setAtmosphereKeys,
    sizeKeys, setSizeKeys,
    drinkKeys, setDrinkKeys,
    priceRangeKeys, setPriceRangeKeys,
    paymentMethodKeys, setPaymentMethodKeys,
    eventTrendKeys, setEventTrendKeys,
    baggageKeys, setBaggageKeys,
    smokingKeys, setSmokingKeys,
    toiletKeys, setToiletKeys,
    otherKeys, setOtherKeys,

    // results
    filteredStores,
    selectedFilters,
    count,
    handleClear,
  }
}