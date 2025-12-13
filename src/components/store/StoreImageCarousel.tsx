"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

type Props = {
  storeId: string
  storeName: string
}

type StoreImage = {
  id: string
  image_url: string
}

export default function StoreImageCarousel({ storeId, storeName }: Props) {
  const [images, setImages] = useState<StoreImage[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!storeId) return

    supabase
      .from("store_images")
      .select("id, image_url")
      .eq("store_id", storeId)
      .order("order_num")
      .then(({ data }) => setImages(data ?? []))
  }, [storeId])

  const mainImages =
    images.length > 0
      ? images
      : [{ id: "default", image_url: "/noshop.svg" }]

  return (
    <div className="relative h-72 overflow-hidden">
      <div
        className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-none"
        onScroll={(e) => {
          const el = e.currentTarget
          setCurrent(Math.round(el.scrollLeft / el.clientWidth))
        }}
      >
        {mainImages.map((img) => (
          <div
            key={img.id}
            className="min-w-full relative h-72"
          >
            <Image
              src={img.image_url}
              alt={storeName}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
        {mainImages.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${i === current ? "bg-white" : "bg-white/40"
              }`}
          />
        ))}
      </div>
    </div>
  )
}