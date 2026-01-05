import type { HomeStoreLite } from "@/types/store"
import type { HomeStoreRow } from "@/types/store-db-home"

function selectImage(store_images: HomeStoreRow["store_images"]): string {
  if (!store_images?.length) return "/noshop.svg"

  const main = store_images.find((i) => i.is_main)
  if (main?.image_url) return main.image_url

  const sorted = [...store_images].sort(
    (a, b) => (a.order_num ?? 999) - (b.order_num ?? 999)
  )

  return sorted[0]?.image_url ?? "/noshop.svg"
}

export function normalizeHomeStore(raw: HomeStoreRow): HomeStoreLite {
  const prefecture = raw.prefectures
  const area = raw.areas
  const storeType = raw.store_types

  return {
    id: raw.id,
    name: raw.name,

    prefecture_id: prefecture?.id ?? null,
    prefecture_label: prefecture?.name_ja ?? null,

    area_id: area?.id ?? null,
    area_label: area?.name ?? null,

    store_type_id: storeType?.id ?? null,
    type_label: storeType?.label ?? null,

    image_url: selectImage(raw.store_images),
    updated_at: raw.updated_at,
  }
}