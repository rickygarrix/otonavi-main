"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { RegionKey } from "@/app/page"

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
  category: string
}

type GenericMaster = {
  id: string
  label: string
}

// ================================
// テーブル → セクション名 対応表
// ================================
const TABLE_TO_SECTION: Record<string, string> = {
  store_types: "店舗タイプ",
  event_trend_definitions: "イベントの傾向",
  rule_definitions: "ルール / マナー",
  baggage_definitions: "荷物預かり",
  security_definitions: "セキュリティ",
  toilet_definitions: "トイレ",
  size_definitions: "広さ",
  floor_definitions: "フロアの位置",
  seat_type_definitions: "座席タイプ",
  smoking_definitions: "喫煙",
  environment_definitions: "周辺環境",
  other_definitions: "その他",
  price_range_definitions: "価格帯",
  pricing_system_definitions: "料金システム",
  discount_definitions: "ディスカウント",
  vip_definitions: "VIP",
  payment_method_definitions: "支払い方法",
  sound_definitions: "音響",
  lighting_definitions: "照明",
  production_definitions: "演出",
  food_definitions: "フード",
  service_definitions: "サービス",
  customer_definitions: "客層",
  atmosphere_definitions: "雰囲気",
  hospitality_definitions: "接客",
}

// ================================
// Generic Master Loader
// ================================
async function loadGenericMasters() {
  const idLabelMap = new Map<string, string>()

  for (const table of Object.keys(TABLE_TO_SECTION)) {
    const { data } = await supabase
      .from(table)
      .select("id, label")
      .eq("is_active", true)

    data?.forEach((item: GenericMaster) => {
      idLabelMap.set(item.id, item.label)
    })
  }

  return idLabelMap
}

// ================================
// Hook
// ================================
export function useHomeMasters() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [drinkMasters, setDrinkMasters] = useState<DrinkDefinition[]>([])
  const [genericMasters, setGenericMasters] =
    useState<Map<string, string>>(new Map())

  // ============================
  // 初期ロード（すべて1回）
  // ============================
  useEffect(() => {
    const load = async () => {
      const [
        { data: prefData },
        { data: areaData },
        { data: drinkData },
      ] = await Promise.all([
        supabase.from("prefectures").select("id, name_ja, region"),
        supabase.from("areas").select("id, name, is_23ward"),
        supabase
          .from("drink_definitions")
          .select("key, label, category")
          .eq("is_active", true),
      ])

      setPrefectures(prefData ?? [])
      setAreas(areaData ?? [])
      setDrinkMasters((drinkData ?? []) as DrinkDefinition[])

      const genericMap = await loadGenericMasters()
      setGenericMasters(genericMap)
    }

    load()
  }, [])

  // ============================
  // 全ラベル → 表示名
  // ============================
  const externalLabelMap = useMemo(() => {
    const map = new Map<string, string>()

    prefectures.forEach((p) => map.set(p.id, p.name_ja))
    areas.forEach((a) => map.set(a.id, a.name))
    drinkMasters.forEach((d) => map.set(d.key, d.label))
    genericMasters.forEach((label, id) => map.set(id, label))

    return map
  }, [prefectures, areas, drinkMasters, genericMasters])

  // ============================
  // label → セクション名（スクロール用）
  // ============================
  const labelToSectionMap = useMemo(() => {
    const map = new Map<string, string>()

    for (const [_, sectionName] of Object.entries(TABLE_TO_SECTION)) {
      genericMasters.forEach((label) => {
        map.set(label, sectionName)
      })
    }

    return map
  }, [genericMasters])

  // ============================
  // 都道府県名 → 地方
  // ============================
  const prefectureRegionMap = useMemo(() => {
    const map = new Map<string, RegionKey>()
    prefectures.forEach((p) => {
      map.set(p.name_ja, p.region as RegionKey)
    })
    return map
  }, [prefectures])

  // ============================
  // エリア名 → Area
  // ============================
  const areaMap = useMemo(() => {
    const map = new Map<string, Area>()
    areas.forEach((a) => map.set(a.name, a))
    return map
  }, [areas])

  // ============================
  // ドリンク名 → category
  // ============================
  const drinkCategoryMap = useMemo(() => {
    const map = new Map<string, string>()
    drinkMasters.forEach((d) => map.set(d.label, d.category))
    return map
  }, [drinkMasters])

  // ============================
  // return
  // ============================
  return {
    externalLabelMap,
    prefectureRegionMap,
    areaMap,
    drinkCategoryMap,
    labelToSectionMap,
  }
}