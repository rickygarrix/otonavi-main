// lib/normalizeStore.ts
import type { HomeStore } from "@/types/store"

// ================================
// 型ガード / util
// ================================
type Rec = Record<string, unknown>

const isRec = (v: unknown): v is Rec =>
  typeof v === "object" && v !== null && !Array.isArray(v)

const asString = (v: unknown): string | null => (typeof v === "string" ? v : null)
const asNumber = (v: unknown): number | null => (typeof v === "number" ? v : null)
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])

// ================================
// M2M definitions（key/label）
/**
 * 普通のdefinitionsは key/label で十分
 */
type DefinitionKV = {
  key: string
  label: string
}

type M2MRow = Record<string, unknown>

// ================================
// extract M2M
// ================================
function extractM2M(list: unknown, defKey: string): { keys: string[]; labels: string[] } {
  const rows = asArray(list)

  const keys: string[] = []
  const labels: string[] = []

  for (const row of rows) {
    if (!isRec(row)) continue
    const def = row[defKey]
    if (!isRec(def)) continue

    const key = asString(def.key)
    const label = asString(def.label)

    if (key) keys.push(key)
    if (label) labels.push(label)
  }

  return { keys, labels }
}

// ================================
// discount 用の型
// ================================
type DiscountDefinition = {
  id: string
  key: string
  label: string
}

type StoreDiscountDetail = {
  id: string
  discount_id: string
  text: string
}

// ================================
// normalize
// ================================
export function normalizeStore(raw: unknown): HomeStore {
  if (!isRec(raw)) {
    throw new Error("normalizeStore: raw is invalid")
  }

  const r = raw

  // =====================
  // 実績（StoreAward型に合わせる）
  // =====================
  const store_awards = asArray(r.store_awards)
    .filter(isRec)
    .map((a) => ({
      id: String(a.id ?? ""),
      title: String(a.title ?? ""),
      organization: asString(a.organization),
      year: asNumber(a.year),
      url: asString(a.url),
    }))

  const store_media_mentions = asArray(r.store_media_mentions)
    .filter(isRec)
    .map((m) => ({
      id: String(m.id ?? ""),
      media_name: String(m.media_name ?? ""),
      year: asNumber(m.year),
    }))

  // =====================
  // ★ ディスカウント（details優先表示）
  //  - 取得は StoreDetailPage で
  //    store_discounts(...) と store_discount_details(...) を別で取ってOK
  // =====================
  const discount_keys: string[] = []
  const discount_labels: string[] = []

  // 1) details を discount_id で index 化
  const detailsByDiscountId = new Map<string, string[]>()

  const details = asArray(r.store_discount_details)
    .filter(isRec)
    .map((d): StoreDiscountDetail | null => {
      const discount_id = asString(d.discount_id)
      const text = asString(d.text)
      if (!discount_id || !text) return null
      return {
        id: String(d.id ?? ""),
        discount_id,
        text,
      }
    })
    .filter((v): v is StoreDiscountDetail => v !== null)

  for (const d of details) {
    const arr = detailsByDiscountId.get(d.discount_id) ?? []
    arr.push(d.text)
    detailsByDiscountId.set(d.discount_id, arr)
  }

  // 2) store_discounts（= 定義の集合）を基準に組み立て
  const storeDiscountRows = asArray(r.store_discounts).filter(isRec)

  for (const row of storeDiscountRows) {
    const defRaw = row.discount_definitions
    if (!isRec(defRaw)) continue

    const def: DiscountDefinition | null = (() => {
      const id = asString(defRaw.id)
      const key = asString(defRaw.key)
      const label = asString(defRaw.label)
      if (!id || !key || !label) return null
      return { id, key, label }
    })()

    if (!def) continue

    // 検索用
    discount_keys.push(def.key)

    // 表示用（detailsがあれば text を出す）
    const detailTexts = detailsByDiscountId.get(def.id)
    if (detailTexts && detailTexts.length > 0) {
      discount_labels.push(...detailTexts)
    } else {
      discount_labels.push(def.label)
    }
  }

  // =====================
  // return
  // =====================
  return {
    id: asString(r.id) ?? "",
    name: asString(r.name) ?? "",
    name_kana: asString(r.name_kana),

    prefecture_id: asString(r.prefecture_id),
    prefecture_label: isRec(r.prefectures) ? asString(r.prefectures.name_ja) : null,

    area_id: asString(r.area_id),
    area_label: isRec(r.areas) ? asString(r.areas.name) : null,

    store_type_id: asString(r.store_type_id),
    type_label: isRec(r.store_types) ? asString(r.store_types.label) : null,

    price_range_id: asString(r.price_range_id),
    price_range_label: isRec(r.price_range_definitions)
      ? asString(r.price_range_definitions.label)
      : null,

    image_url: asString(r.image_url) ?? "",
    description: asString(r.description),

    instagram_url: asString(r.instagram_url),
    x_url: asString(r.x_url),
    facebook_url: asString(r.facebook_url),
    tiktok_url: asString(r.tiktok_url),
    official_site_url: asString(r.official_site_url),

    access: asString(r.access),
    google_map_url: asString(r.google_map_url),
    address: asString(r.address),

    open_hours: asArray(r.store_open_hours) as HomeStore["open_hours"],
    special_hours: asArray(r.store_special_open_hours) as HomeStore["special_hours"],
    business_hours: asString(r.business_hours),

    updated_at: asString(r.updated_at) ?? "",

    hasAward: store_awards.length > 0,
    hasMedia: store_media_mentions.length > 0,
    store_awards,
    store_media_mentions,

    event_trend_keys: extractM2M(r.store_event_trends, "event_trend_definitions").keys,
    event_trend_labels: extractM2M(r.store_event_trends, "event_trend_definitions").labels,

    rule_keys: extractM2M(r.store_rules, "rule_definitions").keys,
    rule_labels: extractM2M(r.store_rules, "rule_definitions").labels,

    baggage_keys: extractM2M(r.store_baggage, "baggage_definitions").keys,
    baggage_labels: extractM2M(r.store_baggage, "baggage_definitions").labels,

    security_keys: extractM2M(r.store_security, "security_definitions").keys,
    security_labels: extractM2M(r.store_security, "security_definitions").labels,

    toilet_keys: extractM2M(r.store_toilet, "toilet_definitions").keys,
    toilet_labels: extractM2M(r.store_toilet, "toilet_definitions").labels,

    floor_keys: extractM2M(r.store_floor, "floor_definitions").keys,
    floor_labels: extractM2M(r.store_floor, "floor_definitions").labels,

    seat_type_keys: extractM2M(r.store_seat_type, "seat_type_definitions").keys,
    seat_type_labels: extractM2M(r.store_seat_type, "seat_type_definitions").labels,

    smoking_keys: extractM2M(r.store_smoking, "smoking_definitions").keys,
    smoking_labels: extractM2M(r.store_smoking, "smoking_definitions").labels,

    environment_keys: extractM2M(r.store_environment, "environment_definitions").keys,
    environment_labels: extractM2M(r.store_environment, "environment_definitions").labels,

    other_keys: extractM2M(r.store_other, "other_definitions").keys,
    other_labels: extractM2M(r.store_other, "other_definitions").labels,

    pricing_system_keys: extractM2M(r.store_pricing_system, "pricing_system_definitions").keys,
    pricing_system_labels: extractM2M(r.store_pricing_system, "pricing_system_definitions").labels,

    // ✅ discount は details 優先の完成版
    discount_keys,
    discount_labels,

    vip_keys: extractM2M(r.store_vips, "vip_definitions").keys,
    vip_labels: extractM2M(r.store_vips, "vip_definitions").labels,

    payment_method_keys: extractM2M(r.store_payment_methods, "payment_method_definitions").keys,
    payment_method_labels: extractM2M(r.store_payment_methods, "payment_method_definitions").labels,

    sound_keys: extractM2M(r.store_sounds, "sound_definitions").keys,
    sound_labels: extractM2M(r.store_sounds, "sound_definitions").labels,

    lighting_keys: extractM2M(r.store_lightings, "lighting_definitions").keys,
    lighting_labels: extractM2M(r.store_lightings, "lighting_definitions").labels,

    production_keys: extractM2M(r.store_productions, "production_definitions").keys,
    production_labels: extractM2M(r.store_productions, "production_definitions").labels,

    customer_keys: extractM2M(r.store_customers, "customer_definitions").keys,
    customer_labels: extractM2M(r.store_customers, "customer_definitions").labels,

    atmosphere_keys: extractM2M(r.store_atmospheres, "atmosphere_definitions").keys,
    atmosphere_labels: extractM2M(r.store_atmospheres, "atmosphere_definitions").labels,

    food_keys: extractM2M(r.store_foods, "food_definitions").keys,
    food_labels: extractM2M(r.store_foods, "food_definitions").labels,

    service_keys: extractM2M(r.store_services, "service_definitions").keys,
    service_labels: extractM2M(r.store_services, "service_definitions").labels,

    // ドリンクは今回は未対応のまま
    drink_keys: [],
    drink_labels: [],
    drink_categories: {},

    hospitality_key: asString(r.hospitality),
    hospitality_label: isRec(r.hospitality_definitions) ? asString(r.hospitality_definitions.label) : null,

    size_key: asString(r.size),
    size_label: isRec(r.size_definitions) ? asString(r.size_definitions.label) : null,
  }
}