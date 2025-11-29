"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type Size = {
  id: string
  key: string
  label: string
  capacity_range: string | null
  description: string | null
  is_active: boolean
}

type Props = {
  onChange: (key: string | null) => void
}

export default function SizeSelector({ onChange }: Props) {
  const [items, setItems] = useState<Size[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  // 🔹 マスタ読み込み
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("size_definitions")
        .select("*")
        .eq("is_active", true)
        .order("label", { ascending: true })

      if (error) return console.error(error)
      setItems(data ?? [])
    }

    load()
  }, [])

  // 🔹 選択（単一）
  const toggle = (key: string) => {
    const next = key === selected ? null : key
    setSelected(next)
    onChange(next)
  }

  return (
    <div className="w-full px-6 py-6">

      {/* 見出し（AreaSelector と揃える） */}
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        広さ
      </h2>

      {/* Chip 一覧（常に表示） */}
      <div className="grid grid-cols-3 gap-3">
        {items.map((s) => (
          <Chip
            key={s.id}
            label={s.label}
            selected={selected === s.key}
            onClick={() => toggle(s.key)}
          />
        ))}
      </div>
    </div>
  )
}