"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type DrinkItem = {
  id: string
  key: string
  category: string
  label: string
  description?: string | null
  is_active: boolean
}

type Props = {
  title: string
  onChange: (keys: string[]) => void
}

export default function DrinkSelector({ title, onChange }: Props) {
  const [items, setItems] = useState<DrinkItem[]>([])
  const [selected, setSelected] = useState<string[]>([])

  // ----------------------------------------
  // Supabase から取得
  // ----------------------------------------
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("drink_definitions")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("label", { ascending: true })

      if (error) {
        console.error("DrinkSelector load error:", error)
        return
      }

      setItems((data ?? []) as DrinkItem[])
    }

    load()
  }, [])

  // ----------------------------------------
  // カテゴリごとにグループ化
  // ----------------------------------------
  const groups = useMemo(() => {
    const map: Record<string, DrinkItem[]> = {}

    items.forEach((item) => {
      if (!map[item.category]) map[item.category] = []
      map[item.category].push(item)
    })

    return map
  }, [items])

  // ----------------------------------------
  // 選択トグル
  // ----------------------------------------
  const toggle = (key: string) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key]

    setSelected(next)
    onChange(next)
  }

  const isSelected = (key: string) => selected.includes(key)

  // ----------------------------------------
  // description 表示
  // ----------------------------------------
  const selectedDescriptions = useMemo(() => {
    const descs = selected
      .map((k) => items.find((i) => i.key === k)?.description)
      .filter(Boolean)

    return descs.length > 0 ? descs.join(" / ") : null
  }, [selected, items])

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">{title}</h2>

      {/* 全カテゴリを順に描画 */}
      {Object.entries(groups).map(([category, list]) => (
        <div key={category} className="mb-8">
          <p className="font-semibold text-slate-800 mb-3 text-base">
            {category}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {list.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                selected={isSelected(item.key)}
                onClick={() => toggle(item.key)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* description */}
      {selectedDescriptions && (
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          {selectedDescriptions}
        </p>
      )}
    </div>
  )
}