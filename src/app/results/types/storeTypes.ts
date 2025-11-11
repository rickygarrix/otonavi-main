/** 店舗データの型定義 */
export interface Store {
  id: string
  name: string
  area: { name: string }
  store_type: { label: string }
  walk_minutes: number
  price_range: { label: string }
  latitude: number
  longitude: number
  image_url?: string
}