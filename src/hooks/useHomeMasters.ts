"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

// ================================
// 型定義
// ================================
type Prefecture = {
  id: string
  name_ja: string
  region: string
}

type Area = {
  id: string
  name: string
  is_23ward: boolean
}

type DrinkDefinition = {
  key: string
  label: string
  category: string   // ← スクロールに必要
}

type GenericMaster = {
  id: string
  label: string
}

export function useHomeMasters() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [drinkMasters, setDrinkMasters] = useState<DrinkDefinition[]>([])
  const [genericMasters, setGenericMasters] = useState<Map<string, string>>(new Map())

  // ============================
  // 都道府県・エリア
  // ============================
  useEffect(() => {
    const load = async () => {
      const { data: prefData } = await supabase
        .from("prefectures")
        .select("id, name_ja, region")

      const { data: areaData } = await supabase
        .from("areas")
        .select("id, name, is_23ward")

      setPrefectures(prefData ?? [])
      setAreas(areaData ?? [])
    }
    load()
  }, [])

  // ============================
  // ドリンク
  // ============================
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("drink_definitions")
        .select("key, label, category") // ← category を取得
        .eq("is_active", true)

      setDrinkMasters((data ?? []) as DrinkDefinition[])
    }
    load()
  }, [])

  // ============================
  // Generic 全マスタ
  // ============================
  useEffect(() => {
    const tables = [
      "store_types",
      "event_trend_definitions",
      "rule_definitions",
      "baggage_definitions",
      "security_definitions",
      "toilet_definitions",
      "size_definitions",
      "floor_definitions",
      "seat_type_definitions",
      "smoking_definitions",
      "environment_definitions",
      "other_definitions",
      "price_range_definitions",
      "pricing_system_definitions",
      "discount_definitions",
      "vip_definitions",
      "payment_method_definitions",
      "sound_definitions",
      "lighting_definitions",
      "production_definitions",
      "food_definitions",
      "service_definitions",
      "customer_definitions",
      "atmosphere_definitions",
      "hospitality_definitions",
    ]

    const loadAll = async () => {
      const map = new Map<string, string>()

      for (const table of tables) {
        const { data } = await supabase
          .from(table)
          .select("id, label")
          .eq("is_active", true)

        data?.forEach((item: GenericMaster) => map.set(item.id, item.label))
      }

      setGenericMasters(map)
    }

    loadAll()
  }, [])

  // ============================
  // 全ラベル → 表示名
  // ============================
  const externalLabelMap = useMemo(() => {
    const map = new Map<string, string>()

    prefectures.forEach((p) => map.set(p.id, p.name_ja))
    areas.forEach((a) => map.set(a.id, a.name))
    drinkMasters.forEach((d) => map.set(d.key, d.label))
    genericMasters.forEach((v, k) => map.set(k, v))

    return map
  }, [prefectures, areas, drinkMasters, genericMasters])

  // ============================
  // 都道府県名 → 地方
  // ============================
  const prefectureRegionMap = useMemo(() => {
    const map = new Map<string, string>()
    prefectures.forEach((p) => map.set(p.name_ja, p.region))
    return map
  }, [prefectures])

  // ============================
  // エリア名 → is_23ward
  // ============================
  const areaMap = useMemo(() => {
    const map = new Map<string, Area>()
    areas.forEach((a) => map.set(a.name, a))
    return map
  }, [areas])

  // ============================
  // ドリンク名(label) → category
  // ============================
  const drinkCategoryMap = useMemo(() => {
    const map = new Map<string, string>() // label → category
    drinkMasters.forEach((d) => map.set(d.label, d.category))
    return map
  }, [drinkMasters])

  return {
    externalLabelMap,
    prefectureRegionMap,
    areaMap,
    drinkCategoryMap, // ← ★ここが今回の主役！
  }
}