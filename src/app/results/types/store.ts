export interface Store {
  id: string
  name: string
  area?: { name: string }
  store_type?: { label: string }
  walk_minutes?: number
  price_range?: { label: string }
  image_url?: string
  description?: string
  latitude: number   // ← 追加
  longitude: number  // ← 追加
}