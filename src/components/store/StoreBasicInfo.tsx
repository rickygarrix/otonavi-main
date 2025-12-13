import Image from "next/image"
import type { HomeStore } from "@/types/store"

type Props = {
  store: HomeStore
}

export default function StoreBasicInfo({ store }: Props) {
  return (
    <div className="px-4 py-5">
      <p className="text-sm text-slate-600">
        {store.prefecture_label} {store.area_label} {store.type_label}
      </p>

      <h1 className="text-2xl font-extrabold mt-1">{store.name}</h1>

      {store.description && (
        <p className="mt-4 whitespace-pre-line text-slate-700">
          {store.description}
        </p>
      )}

      {/* SNS */}
      <div className="flex gap-5 mt-6">
        {[
          ["instagram_url", "/instagram.svg"],
          ["x_url", "/x.svg"],
          ["facebook_url", "/facebook.svg"],
          ["tiktok_url", "/tiktok.svg"],
          ["official_site_url", "/website.svg"],
        ].map(([key, icon]) => {
          const url = store[key as keyof HomeStore] as string | null
          if (!url) return null

          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={icon}
                alt={key}
                width={28}
                height={28}
                className="opacity-80 hover:opacity-100 transition"
              />
            </a>
          )
        })}
      </div>
    </div>
  )
}