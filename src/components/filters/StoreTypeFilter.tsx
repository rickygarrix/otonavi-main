"use client"

import {
  Disc3,
  Martini,
  MicVocal,
  Music,
} from "lucide-react"

type StoreType = "club" | "bar" | "livehouse" | "other"

type Props = {
  activeType: StoreType
  onChange: (type: StoreType) => void
}

const STORE_TYPES = [
  { label: "クラブ", value: "club", icon: Disc3 },
  { label: "バー", value: "bar", icon: Martini },
  { label: "ライブハウス", value: "livehouse", icon: MicVocal },
  { label: "その他", value: "other", icon: Music },
] as const

export default function StoreTypeFilter({
  activeType,
  onChange,
}: Props) {
  return (
    <div className="w-full flex justify-center px-4">
      <div
        className="
          w-full max-w-[720px] h-14
          bg-slate-50
          border border-slate-200
          rounded-full
          flex items-center
          px-1
        "
      >
        {STORE_TYPES.map(({ label, value, icon: Icon }) => {
          const isActive = activeType === value

          return (
            <button
              key={value}
              onClick={() => onChange(value)}
              className={`
                flex-1 h-full
                flex flex-col items-center justify-center
                rounded-full
                transition-colors
                ${isActive
                  ? "bg-blue-100 text-blue-900"
                  : "text-slate-700 hover:bg-slate-100"
                }
              `}
            >
              <Icon
                className={`
                  w-5 h-5
                  ${isActive ? "stroke-[2]" : "stroke-[1.75]"}
                `}
              />
              <span
                className={`
                  text-xs mt-0.5
                  ${isActive ? "font-semibold" : "font-normal"}
                `}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}