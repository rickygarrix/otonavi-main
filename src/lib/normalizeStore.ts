// lib/normalizeStore.ts
import type { HomeStore } from "@/types/store"

/**
 * 配列: [{definitions: {key, label}}...] → { keys:[], labels:[] }
 */
function extractM2M(list: any[], defKey: string) {
  if (!Array.isArray(list)) return { keys: [], labels: [] }

  const keys = list.map((i) => i[defKey]?.key).filter(Boolean)
  const labels = list.map((i) => i[defKey]?.label).filter(Boolean)

  return { keys, labels }
}

/**
 * ドリンク（カテゴリ別）
 */
function extractDrinks(list: any[]) {
  const keys: string[] = []
  const labels: string[] = []
  const categories: Record<string, { keys: string[]; labels: string[] }> = {}

  if (!Array.isArray(list)) return { keys, labels, drink_categories: categories }

  for (const row of list) {
    const def = row.drink_definitions
    if (!def) continue

    keys.push(def.key)
    labels.push(def.label)

    if (!categories[def.category]) {
      categories[def.category] = { keys: [], labels: [] }
    }
    categories[def.category].keys.push(def.key)
    categories[def.category].labels.push(def.label)
  }

  return { keys, labels, drink_categories: categories }
}

/**
 * stores SELECT 結果 → HomeStore 型へマッピング
 */
export function normalizeStore(raw: any): HomeStore {
  if (!raw) throw new Error("normalizeStore: raw is null")

  // 単一リレーション
  const prefecture_label = raw.prefectures?.name_ja ?? null
  const area_label = raw.areas?.name ?? null
  const type_label = raw.store_types?.label ?? null
  const price_range_label = raw.price_range_definitions?.label ?? null
  const hospitality_label = raw.hospitality_definitions?.label ?? null
  const size_label = raw.size_definitions?.label ?? null

  // M2M
  const baggage = extractM2M(raw.store_baggage, "baggage_definitions")
  const rules = extractM2M(raw.store_rules, "rule_definitions")
  const event = extractM2M(raw.store_event_trends, "event_trend_definitions")
  const security = extractM2M(raw.store_security, "security_definitions")
  const toilet = extractM2M(raw.store_toilet, "toilet_definitions")
  const floor = extractM2M(raw.store_floor, "floor_definitions")
  const seat = extractM2M(raw.store_seat_type, "seat_type_definitions")
  const smoking = extractM2M(raw.store_smoking, "smoking_definitions")
  const environment = extractM2M(raw.store_environment, "environment_definitions")
  const other = extractM2M(raw.store_other, "other_definitions")
  const pricing = extractM2M(raw.store_pricing_system, "pricing_system_definitions")
  const discount = extractM2M(raw.store_discounts, "discount_definitions")
  const vip = extractM2M(raw.store_vips, "vip_definitions")
  const payment = extractM2M(raw.store_payment_methods, "payment_method_definitions")
  const sound = extractM2M(raw.store_sounds, "sound_definitions")
  const lighting = extractM2M(raw.store_lightings, "lighting_definitions")
  const production = extractM2M(raw.store_productions, "production_definitions")
  const customers = extractM2M(raw.store_customers, "customer_definitions")
  const atmos = extractM2M(raw.store_atmospheres, "atmosphere_definitions")
  const food = extractM2M(raw.store_foods, "food_definitions")
  const service = extractM2M(raw.store_services, "service_definitions")

  // ドリンクカテゴリ
  const drinks = extractDrinks(raw.store_drinks)

  return {
    id: raw.id,
    name: raw.name,
    name_kana: raw.name_kana ?? null,

    prefecture_id: raw.prefecture_id,
    prefecture_label,

    area_id: raw.area_id,
    area_label,

    store_type_id: raw.store_type_id,
    type_label,

    price_range_id: raw.price_range_id,
    price_range_label,

    image_url: raw.image_url ?? "",
    description: raw.description ?? null,

    instagram_url: raw.instagram_url,
    x_url: raw.x_url,
    facebook_url: raw.facebook_url,
    tiktok_url: raw.tiktok_url,
    official_site_url: raw.official_site_url,

    access: raw.access,
    google_map_url: raw.google_map_url,
    address: raw.address,

    open_hours: raw.store_open_hours ?? [],
    special_hours: raw.store_special_open_hours ?? [],

    updated_at: raw.updated_at,

    // 中間テーブル系（keys + labels）
    event_trend_keys: event.keys,
    event_trend_labels: event.labels,

    rule_keys: rules.keys,
    rule_labels: rules.labels,

    baggage_keys: baggage.keys,
    baggage_labels: baggage.labels,

    security_keys: security.keys,
    security_labels: security.labels,

    toilet_keys: toilet.keys,
    toilet_labels: toilet.labels,

    floor_keys: floor.keys,
    floor_labels: floor.labels,

    seat_type_keys: seat.keys,
    seat_type_labels: seat.labels,

    smoking_keys: smoking.keys,
    smoking_labels: smoking.labels,

    environment_keys: environment.keys,
    environment_labels: environment.labels,

    other_keys: other.keys,
    other_labels: other.labels,

    pricing_system_keys: pricing.keys,
    pricing_system_labels: pricing.labels,

    discount_keys: discount.keys,
    discount_labels: discount.labels,

    vip_keys: vip.keys,
    vip_labels: vip.labels,

    payment_method_keys: payment.keys,
    payment_method_labels: payment.labels,

    sound_keys: sound.keys,
    sound_labels: sound.labels,

    lighting_keys: lighting.keys,
    lighting_labels: lighting.labels,

    production_keys: production.keys,
    production_labels: production.labels,

    customer_keys: customers.keys,
    customer_labels: customers.labels,

    atmosphere_keys: atmos.keys,
    atmosphere_labels: atmos.labels,

    food_keys: food.keys,
    food_labels: food.labels,

    service_keys: service.keys,
    service_labels: service.labels,

    drink_keys: drinks.keys,
    drink_labels: drinks.labels,
    drink_categories: drinks.drink_categories,

    hospitality_key: raw.hospitality,
    hospitality_label,

    size_key: raw.size,
    size_label,

    // メディア・受賞（有無だけ）
    hasAward: Array.isArray(raw.store_awards) && raw.store_awards.length > 0,
    hasMedia: Array.isArray(raw.store_media_mentions) && raw.store_media_mentions.length > 0,
  }
}