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
// HomeStore
// ===============================
export type HomeStore = {
  id: string
  name: string
  name_kana: string | null

  prefecture: string | null
  area: string | null
  type: string | null

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

  // ---------- 既存 ----------
  event_trend_keys: string[]
  rule_keys: string[]
  hasAward: boolean
  hasMedia: boolean

  // ---------- 🔥 新規 ----------
  store_type_id: string | null
  seat_type_keys: string[]
  smoking_keys: string[]
  environment_keys: string[]
  other_keys: string[]
  baggage_keys: string[]
  security_keys: string[]
  toilet_keys: string[]
  floor_keys: string[]

  size_key: string | null
}