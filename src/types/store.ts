// ===============================
// OpenHour
// ===============================
export type OpenHour = {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  last_order_time: string | null
  is_closed: boolean
}

// ===============================
// SpecialOpenHour
// ===============================
export type SpecialOpenHour = {
  date: string
  open_time: string | null
  close_time: string | null
  last_order_time: string | null
  is_closed: boolean
  reason: string | null
}

// ===============================
// HomeStore（🔥 全フィルタ対応完全版）
// ===============================
export type HomeStore = {
  id: string
  name: string
  name_kana: string | null

  prefecture: string | null
  area: string | null

  // ---------- 店舗タイプ（単一） ----------
  store_type_id: string | null
  type: string | null // ラベル

  // ---------- 価格帯（単一） ----------
  price_range_id: string | null
  price_range_label: string | null

  image_url: string | null
  description: string | null

  instagram_url: string | null
  x_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  official_site_url: string | null

  access: string | null
  google_map_url: string | null
  address: string | null

  open_hours: OpenHour[]
  special_hours: SpecialOpenHour[]

  // ======================================================
  // 既存 M2M（イベント / ルール / 設備）
  // ======================================================
  event_trend_keys: string[]
  rule_keys: string[]
  seat_type_keys: string[]
  smoking_keys: string[]
  environment_keys: string[]
  other_keys: string[]
  baggage_keys: string[]
  security_keys: string[]
  toilet_keys: string[]
  floor_keys: string[]

  // ======================================================
  // 🔥 新規 M2M（料金系）
  // ======================================================
  pricing_system_keys: string[]
  discount_keys: string[]
  vip_keys: string[]
  payment_method_keys: string[]

  // ======================================================
  // 🔥 音響・照明・演出
  // ======================================================
  sound_keys: string[]
  lighting_keys: string[]
  production_keys: string[]

  // ======================================================
  // 🔥 客層・雰囲気
  // ======================================================
  customer_keys: string[]
  atmosphere_keys: string[]

  // ======================================================
  // 🔥 フード・サービス
  // ======================================================
  food_keys: string[]
  service_keys: string[]

  // ======================================================
  // 🔥 接客（単一）
  // ======================================================
  hospitality_key: string | null
  hospitality_label: string | null

  // ======================================================
  // 🔥 ドリンク（M2M）カテゴリ別
  // ======================================================
  drink_keys: string[]               // 全 key（例: ["beer_craft", "wine_sparkling"]）
  drink_categories: Record<string, string[]>


  // ---------- 単一 ----------
  size_key: string | null

  // ---------- 実績 ----------
  hasAward: boolean
  hasMedia: boolean
}