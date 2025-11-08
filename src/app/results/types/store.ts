// /app/results/types/store.ts

export interface Store {
  id: string
  name: string
  description?: string
  access?: string
  address?: string
  nearest_station?: string        // 最寄駅名
  walk_minutes?: number           // 最寄駅から徒歩何分
  google_map_url?: string
  google_place_id?: string
  latitude?: number
  longitude?: number
  instagram_url?: string
  official_site_url?: string

  // --- リレーション ---
  prefecture?: {
    name: string
  }
  area?: {
    name: string
  }
  store_type?: {
    label: string
  }
  size?: {
    label: string
  }
  price_range?: {
    label: string
  }
  hospitality?: {
    label: string
  }

  // --- メタデータ ---
  created_at?: string
  updated_at?: string
}