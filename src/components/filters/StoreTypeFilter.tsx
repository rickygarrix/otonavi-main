"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Disc3, Martini, MicVocal, Music } from "lucide-react"

type StoreType = {
  id: string
  label: string
}

type Props = {
  activeTypeId: string | null
  onChange: (id: string | null) => void
}

const ICON_MAP: Record<string, any> = {
  クラブ: Disc3,
  バー: Martini,
  ライブハウス: MicVocal,
  その他: Music,
}

export default function StoreTypeFilter({ activeTypeId, onChange }: Props) {
  const [types, setTypes] = useState<StoreType[]>([])

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("store_types")
        .select("id, label")
        .eq("is_active", true)
        .order("label")

      if (error) {
        console.error("StoreTypeFilter load error:", error)
        return
      }

      setTypes(data ?? [])
    }

    load()
  }, [])

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-[720px] h-14 rounded-full flex items-center px-1 border bg-white">
        {types.map((t) => {
          const isActive = activeTypeId === t.id
          const Icon = ICON_MAP[t.label] ?? Music

          return (
            <button
              key={t.id}
              onClick={() => onChange(isActive ? null : t.id)}
              className={`
                flex-1 h-full flex flex-col items-center justify-center rounded-full
                transition-colors
                ${isActive ? "bg-blue-100 text-blue-900" : "text-slate-700 hover:bg-slate-100"}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-0.5">{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}