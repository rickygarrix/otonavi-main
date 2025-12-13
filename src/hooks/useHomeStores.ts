"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { HomeStore } from "@/types/store"

// =====================
// Supabase row types
// =====================
type DefinitionKV = {
  key: string
  label: string
}

type StoreImageRow = {
  image_url: string | null
  is_main: boolean | null
  order_num: number | null
}

type StoreRow = {
  id: string
  name: string
  name_kana: string | null
  updated_at: string
  description: string | null
  access: string | null
  google_map_url: string | null
  address: string | null

  instagram_url: string | null
  x_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  official_site_url: string | null

  prefecture: { id: string; name_ja: string } | null
  area: { id: string; name: string } | null

  store_type: { id: string; label: string } | null
  price_range: { id: string; label: string } | null

  size: DefinitionKV | null
  hospitality_def: DefinitionKV | null

  open_hours: {
    day_of_week: number
    open_time: string | null
    close_time: string | null
    last_order_time: string | null
    is_closed: boolean
  }[]

  special_hours: {
    start_date: string
    end_date: string
    open_time: string | null
    close_time: string | null
    last_order_time: string | null
    is_closed: boolean
    reason: string | null
  }[]

  event_trends: { event_trend_definitions: DefinitionKV | null }[]
  rules: { rule_definitions: DefinitionKV | null }[]

  store_images: StoreImageRow[]
}

// =====================
// utils
// =====================
const extractKV = <T extends Record<string, DefinitionKV | null>>(
  rows: T[],
  field: keyof T
) => {
  const keys: string[] = []
  const labels: string[] = []

  rows.forEach((r) => {
    if (r[field]?.key) keys.push(r[field]!.key)
    if (r[field]?.label) labels.push(r[field]!.label)
  })

  return { keys, labels }
}

const resolveStoreImage = (images: StoreImageRow[]) => {
  if (!images.length) return "/default_shop.svg"

  const main = images.find((i) => i.is_main)
  if (main?.image_url) return main.image_url

  return (
    [...images]
      .sort((a, b) => (a.order_num ?? 999) - (b.order_num ?? 999))[0]
      ?.image_url ?? "/default_shop.svg"
  )
}

// 未取得M2M初期値
const EMPTY_M2M = {
  baggage_keys: [],
  baggage_labels: [],
  security_keys: [],
  security_labels: [],
  toilet_keys: [],
  toilet_labels: [],
  floor_keys: [],
  floor_labels: [],
  seat_type_keys: [],
  seat_type_labels: [],
  smoking_keys: [],
  smoking_labels: [],
  environment_keys: [],
  environment_labels: [],
  other_keys: [],
  other_labels: [],
  pricing_system_keys: [],
  pricing_system_labels: [],
  discount_keys: [],
  discount_labels: [],
  vip_keys: [],
  vip_labels: [],
  payment_method_keys: [],
  payment_method_labels: [],
  sound_keys: [],
  sound_labels: [],
  lighting_keys: [],
  lighting_labels: [],
  production_keys: [],
  production_labels: [],
  customer_keys: [],
  customer_labels: [],
  atmosphere_keys: [],
  atmosphere_labels: [],
  food_keys: [],
  food_labels: [],
  service_keys: [],
  service_labels: [],
  drink_keys: [],
  drink_labels: [],
  drink_categories: {},
} as const

// =====================
// hook
// =====================
export function useHomeStores() {
  const [stores, setStores] = useState<HomeStore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("stores")
        .select(`
          id,
          name,
          name_kana,
          updated_at,
          description,
          access,
          google_map_url,
          address,
          instagram_url,
          x_url,
          facebook_url,
          tiktok_url,
          official_site_url,

          prefecture:prefecture_id ( id, name_ja ),
          area:area_id ( id, name ),

          store_type:store_type_id ( id, label ),
          price_range:price_range_id ( id, label ),
          size:size ( key, label ),
          hospitality_def:hospitality ( key, label ),

          open_hours:store_open_hours (
            day_of_week,
            open_time,
            close_time,
            last_order_time,
            is_closed
          ),

          special_hours:store_special_open_hours (
            start_date,
            end_date,
            open_time,
            close_time,
            last_order_time,
            is_closed,
            reason
          ),

          event_trends:store_event_trends ( event_trend_definitions ( key, label ) ),
          rules:store_rules ( rule_definitions ( key, label ) ),

          store_images:store_images (
            image_url,
            is_main,
            order_num
          )
        `)

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const rows = data as unknown as StoreRow[]

      const formatted: HomeStore[] = rows.map((s) => {
        const eventTrends = extractKV(s.event_trends, "event_trend_definitions")
        const rules = extractKV(s.rules, "rule_definitions")

        return {
          id: s.id,
          name: s.name,
          name_kana: s.name_kana,

          prefecture_id: s.prefecture?.id ?? null,
          prefecture_label: s.prefecture?.name_ja ?? null,
          area_id: s.area?.id ?? null,
          area_label: s.area?.name ?? null,

          store_type_id: s.store_type?.id ?? null,
          type_label: s.store_type?.label ?? null,

          price_range_id: s.price_range?.id ?? null,
          price_range_label: s.price_range?.label ?? null,

          image_url: resolveStoreImage(s.store_images),

          description: s.description,
          access: s.access,
          google_map_url: s.google_map_url,
          address: s.address,

          instagram_url: s.instagram_url,
          x_url: s.x_url,
          facebook_url: s.facebook_url,
          tiktok_url: s.tiktok_url,
          official_site_url: s.official_site_url,

          open_hours: s.open_hours,
          special_hours: s.special_hours,
          updated_at: s.updated_at,

          event_trend_keys: eventTrends.keys,
          event_trend_labels: eventTrends.labels,
          rule_keys: rules.keys,
          rule_labels: rules.labels,

          ...EMPTY_M2M,

          hospitality_key: s.hospitality_def?.key ?? null,
          hospitality_label: s.hospitality_def?.label ?? null,
          size_key: s.size?.key ?? null,
          size_label: s.size?.label ?? null,

          hasAward: false,
          hasMedia: false,
        }
      })

      setStores(formatted)
      setLoading(false)
    }

    load()
  }, [])

  return { stores, loading }
}