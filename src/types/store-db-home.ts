// src/types/store-db-home.ts
export type HomeStoreRow = {
  id: string
  name: string
  updated_at: string

  prefectures: {
    id: string
    name_ja: string
  } | null

  areas: {
    id: string
    name: string
  } | null

  store_types: {
    id: string
    label: string
  } | null

  store_images: {
    image_url: string
    is_main: boolean
    order_num: number | null
  }[]
}