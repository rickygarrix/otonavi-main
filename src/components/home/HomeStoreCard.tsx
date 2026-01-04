'use client';

import Image from "next/image"
import type { HomeStoreLite } from "@/types/store"

type Props = {
  store: HomeStoreLite
}

export default function HomeStoreCard({ store }: Props) {
  const imageUrl =
    store.image_url && store.image_url.trim() !== ""
      ? store.image_url
      : "/noshop.svg"

  // 「東京都 + エリア」 or 都道府県のみ
  const locationLabel =
    store.prefecture_label === "東京都" && store.area_label
      ? `東京 ${store.area_label}`
      : store.prefecture_label ?? ""

  return (
    <div className="flex w-full flex-col items-center text-center">
      {/* 正方形カード */}
      <div className="relative w-full aspect-square overflow-hidden rounded-3xl">
        <Image
          src={imageUrl}
          alt={store.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          priority
        />
      </div>

      {/* 店舗情報 */}
      <div className="mt-2 w-full text-white">
        <p className="text-xs font-bold line-clamp-1">
          {store.name}
        </p>

        <p className="mt-0.5 text-[10px] opacity-80 line-clamp-1">
          {locationLabel}
          {store.type_label && ` ・ ${store.type_label}`}
        </p>
      </div>
    </div>
  )
}