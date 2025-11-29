"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type Baggage = {
  id: string
  key: string
  label: string
  is_active: boolean
}

type Props = {
  onChange: (selectedKeys: string[]) => void
}

export default function BaggageSelector({ onChange }: Props) {
  const [items, setItems] = useState<Baggage[]>([])
  const [selected, setSelected] = useState<string[]>([])

  // 🔹 マスタ読み込み
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("baggage_definitions")
        .select("*")
        .eq("is_active", true)
        .order("label", { ascending: true })

      if (error) return console.error(error)
      setItems(data ?? [])
    }

    load()
  }, [])

  // 🔹 変更通知
  useEffect(() => {
    onChange(selected)
  }, [selected, onChange])

  // 🔹 チップ切替
  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    )
  }

  return (
    <div className="w-full px-6 py-6">
      {/* 見出し（統一デザイン） */}
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        荷物預かり
      </h2>

      {/* 常時表示のチップ一覧 */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={selected.includes(item.key)}
            onClick={() => toggle(item.key)}
          />
        ))}
      </div>
    </div>
  )
}