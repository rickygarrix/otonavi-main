"use client"

import Image from "next/image"
import type { HomeStore } from "@/types/store"

type Props = {
  store: HomeStore
}

export default function StoreBasicInfo({ store }: Props) {
  return (
    <div className="px-4 py-5">
      <p className="text-sm text-slate-600">
        {store.prefecture_label} {store.area_label}・{store.type_label}
      </p>

      {/* 店舗名 */}
      <h1 className="text-2xl font-extrabold mt-1">
        {store.name}
      </h1>

      {/* 読み仮名 */}
      {store.name_kana && (
        <p className="mt-1 text-sm text-slate-500 tracking-wide">
          {store.name_kana}
        </p>
      )}

      {/* 説明文 */}
      {store.description && (
        <p className="mt-4 whitespace-pre-line text-slate-700">
          {store.description}
        </p>
      )}

      {/* SNS / Web */}
      <div className="flex gap-5 mt-6 items-center">
        {/* ① 公式サイト */}
        {store.official_site_url && (
          <IconLink
            href={store.official_site_url}
            off="/WebOff.svg"
            on="/WebOn.svg"
            alt="Official Site"
          />
        )}

        {/* ② Instagram */}
        {store.instagram_url && (
          <IconLink
            href={store.instagram_url}
            off="/InstagramOff.svg"
            on="/InstagramOn.svg"
            alt="Instagram"
          />
        )}

        {/* ③ X */}
        {store.x_url && (
          <IconLink
            href={store.x_url}
            off="/XOff.svg"
            on="/XOn.svg"
            alt="X"
          />
        )}

        {/* ④ Facebook */}
        {store.facebook_url && (
          <IconLink
            href={store.facebook_url}
            off="/FacebookOff.svg"
            on="/FacebookOn.svg"
            alt="Facebook"
          />
        )}

        {/* ⑤ TikTok */}
        {store.tiktok_url && (
          <IconLink
            href={store.tiktok_url}
            off="/TikTokOff.svg"
            on="/TikTokOn.svg"
            alt="TikTok"
          />
        )}
      </div>
    </div>
  )
}

function IconLink({
  href,
  off,
  on,
  alt,
}: {
  href: string
  off: string
  on: string
  alt: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt}
      className="relative w-[26px] h-[26px] transition-transform hover:scale-110"
    >
      <Image
        src={off}
        alt={alt}
        fill
        className="object-contain transition-opacity duration-200 hover:opacity-0"
      />
      <Image
        src={on}
        alt={alt}
        fill
        className="object-contain opacity-0 transition-opacity duration-200 hover:opacity-100"
      />
    </a>
  )
}