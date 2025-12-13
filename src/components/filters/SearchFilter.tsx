"use client"

import {
  BuildingStorefrontIcon,
  KeyIcon,
  BanknotesIcon,
  MegaphoneIcon,
  BeakerIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"

type SectionKey =
  | "店舗"
  | "設備"
  | "料金"
  | "音響・照明・演出"
  | "飲食・サービス"
  | "客層・雰囲気"

type FilterItem = {
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  section: SectionKey
}

type Props = {
  onScroll: (section: SectionKey) => void
}

export default function SearchFilter({ onScroll }: Props) {
  const filters: FilterItem[] = [
    { label: "店舗", icon: BuildingStorefrontIcon, section: "店舗" },
    { label: "設備", icon: KeyIcon, section: "設備" },
    { label: "料金", icon: BanknotesIcon, section: "料金" },
    { label: "音響", icon: MegaphoneIcon, section: "音響・照明・演出" },
    { label: "飲食", icon: BeakerIcon, section: "飲食・サービス" },
    { label: "客層", icon: UserGroupIcon, section: "客層・雰囲気" },
  ]

  return (
    <div className="w-full flex justify-center px-4">
      <div
        className="
          w-full max-w-[800px]
          bg-slate-50/90 rounded-xl backdrop-blur-sm border border-slate-200
          flex justify-between items-center px-3 py-3 shadow-sm
        "
      >
        {filters.map(({ label, icon: Icon, section }) => (
          <button
            key={label}
            onClick={() => onScroll(section)}
            className="
              flex-1 flex flex-col items-center justify-center
              text-slate-700 hover:opacity-70 active:scale-95
              transition-all py-1
            "
          >
            <Icon className="w-6 h-6 stroke-[1.5]" />
            <span className="text-[11px] mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}