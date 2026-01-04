// src/hooks/store/useStoreFilters.ts
"use client"

import { useMemo } from "react"
import type { SearchStore } from "@/types/store"

type Options = {
  ids?: string[]
  filters?: string[]
  storeTypeId?: string | null   // ← これを追加
}

/**
 * /stores 用フィルタリング
 * - Home から渡された keys で検索する
 */
export function useStoreFilters(
  stores: SearchStore[],
  options?: Options
) {
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {

      // ✅ storeTypeId を別判定
      if (
        options?.storeTypeId &&
        store.store_type_id !== options.storeTypeId
      ) {
        return false
      }

      if (options?.filters?.length) {

        // 🔥 ここに入れる
        console.log("filters", options.filters)

        const storeKeys = [
          store.prefecture_id,
          store.area_id,
          store.price_range_key,
          store.size_key,
          ...store.customer_keys,
          ...store.atmosphere_keys,
          ...store.environment_keys,
          ...store.drink_keys,
          ...store.payment_method_keys,
          ...store.event_trend_keys,
          ...store.baggage_keys,
          ...store.smoking_keys,
          ...store.toilet_keys,
          ...store.other_keys,
        ].filter(Boolean)

        // 🔥 ここも
        console.log("storeKeys", storeKeys)

        const hit = options.filters.some((f) =>
          storeKeys.includes(f)
        )

        if (!hit) return false
      }

      return true
    })
  }, [stores, options?.filters, options?.storeTypeId])

  return { filteredStores }
}