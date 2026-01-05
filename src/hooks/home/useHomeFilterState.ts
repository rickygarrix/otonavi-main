"use client"

import { useCallback, useMemo, useState } from "react"

type Options = {
  storeTypeId?: string | null
}

type EmptyReturn = {
  storeTypeId: string | null
  selectedKeys: string[]
  selectedLabels: string[]
  handleClear: () => void

  setPrefectureIds: (v: string[]) => void
  setAreaIds: (v: string[]) => void
  setCustomerKeys: (v: string[]) => void
  setAtmosphereKeys: (v: string[]) => void
  setEnvironmentKeys: (v: string[]) => void
  setSizeKeys: (v: string[]) => void
  setDrinkKeys: (v: string[]) => void
  setPriceRangeKeys: (v: string[]) => void
  setPaymentMethodKeys: (v: string[]) => void
  setEventTrendKeys: (v: string[]) => void
  setBaggageKeys: (v: string[]) => void
  setSmokingKeys: (v: string[]) => void
  setToiletKeys: (v: string[]) => void
  setOtherKeys: (v: string[]) => void
}

const noop = () => {}

const EMPTY_RETURN: EmptyReturn = {
  storeTypeId: null,
  selectedKeys: [],
  selectedLabels: [],
  handleClear: noop,

  setPrefectureIds: noop,
  setAreaIds: noop,
  setCustomerKeys: noop,
  setAtmosphereKeys: noop,
  setEnvironmentKeys: noop,
  setSizeKeys: noop,
  setDrinkKeys: noop,
  setPriceRangeKeys: noop,
  setPaymentMethodKeys: noop,
  setEventTrendKeys: noop,
  setBaggageKeys: noop,
  setSmokingKeys: noop,
  setToiletKeys: noop,
  setOtherKeys: noop,
}

/**
 * Home 専用フィルター状態管理
 * - Home では検索しない
 * - URL 用 keys / 表示用 labels を分離
 * - masters 未ロード時は idle（爆速化）
 */
export function useHomeFilterState(
  externalLabelMap?: Map<string, string>,
  options?: Options,
  enabled: boolean = true
) {
  /**
   * 🔥 masters 未ロード時は state を一切持たない
   */
  if (!enabled || !externalLabelMap) {
    return {
      ...EMPTY_RETURN,
      storeTypeId: options?.storeTypeId ?? null,
    }
  }

  // ===== エリア系 =====
  const [prefectureIds, setPrefectureIds] = useState<string[]>([])
  const [areaIds, setAreaIds] = useState<string[]>([])

  // ===== 属性系 =====
  const [customerKeys, setCustomerKeys] = useState<string[]>([])
  const [atmosphereKeys, setAtmosphereKeys] = useState<string[]>([])
  const [environmentKeys, setEnvironmentKeys] = useState<string[]>([])
  const [sizeKeys, setSizeKeys] = useState<string[]>([])

  const [drinkKeys, setDrinkKeys] = useState<string[]>([])
  const [priceRangeKeys, setPriceRangeKeys] = useState<string[]>([])
  const [paymentMethodKeys, setPaymentMethodKeys] = useState<string[]>([])

  const [eventTrendKeys, setEventTrendKeys] = useState<string[]>([])
  const [baggageKeys, setBaggageKeys] = useState<string[]>([])
  const [smokingKeys, setSmokingKeys] = useState<string[]>([])
  const [toiletKeys, setToiletKeys] = useState<string[]>([])
  const [otherKeys, setOtherKeys] = useState<string[]>([])

  /**
   * URL に渡す “生キー”
   */
  const selectedKeys = useMemo(
    () => [
      ...prefectureIds,
      ...areaIds,
      ...customerKeys,
      ...atmosphereKeys,
      ...environmentKeys,
      ...sizeKeys,
      ...drinkKeys,
      ...priceRangeKeys,
      ...paymentMethodKeys,
      ...eventTrendKeys,
      ...baggageKeys,
      ...smokingKeys,
      ...toiletKeys,
      ...otherKeys,
    ],
    [
      prefectureIds,
      areaIds,
      customerKeys,
      atmosphereKeys,
      environmentKeys,
      sizeKeys,
      drinkKeys,
      priceRangeKeys,
      paymentMethodKeys,
      eventTrendKeys,
      baggageKeys,
      smokingKeys,
      toiletKeys,
      otherKeys,
    ]
  )

  /**
   * SearchBar 表示用ラベル
   */
  const selectedLabels = useMemo(
    () => selectedKeys.map((k) => externalLabelMap.get(k) ?? k),
    [selectedKeys, externalLabelMap]
  )

  /**
   * 全解除
   */
  const handleClear = useCallback(() => {
    setPrefectureIds([])
    setAreaIds([])

    setCustomerKeys([])
    setAtmosphereKeys([])
    setEnvironmentKeys([])
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

  return {
    storeTypeId: options?.storeTypeId ?? null,

    selectedKeys,
    selectedLabels,

    prefectureIds,
    areaIds,

    customerKeys,
    atmosphereKeys,
    environmentKeys,
    sizeKeys,

    drinkKeys,
    priceRangeKeys,
    paymentMethodKeys,

    eventTrendKeys,
    baggageKeys,
    smokingKeys,
    toiletKeys,
    otherKeys,

    setPrefectureIds,
    setAreaIds,

    setCustomerKeys,
    setAtmosphereKeys,
    setEnvironmentKeys,
    setSizeKeys,

    setDrinkKeys,
    setPriceRangeKeys,
    setPaymentMethodKeys,

    setEventTrendKeys,
    setBaggageKeys,
    setSmokingKeys,
    setToiletKeys,
    setOtherKeys,

    handleClear,
  }
}