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
  drinkCategoryRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  clearKey: number
}

export default function DrinkSelector({
  title,
  onChange,
  drinkCategoryRefs,
  clearKey,
}: Props) {
  const [items, setItems] = useState<DrinkItem[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // ✅ クリア時リセット
  useEffect(() => {
    setSelectedKeys([])
    onChange([])
  }, [clearKey])

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("drink_definitions")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("label", { ascending: true })

      if (error) return
      setItems((data ?? []) as DrinkItem[])
    }

    load()
  }, [])

  const groups = useMemo(() => {
    const map: Record<string, DrinkItem[]> = {}
    items.forEach((item) => {
      if (!map[item.category]) map[item.category] = []
      map[item.category].push(item)
    })
    return map
  }, [items])

  const toggle = (key: string) => {
    const next =
      selectedKeys.includes(key)
        ? selectedKeys.filter((k) => k !== key)
        : [...selectedKeys, key]

    setSelectedKeys(next)
    onChange(next)
  }

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">{title}</h2>

      {Object.entries(groups).map(([category, list]) => (
        <div key={category} className="mb-8">
          <div
            ref={(el) => {
              if (!el || !drinkCategoryRefs) return
              drinkCategoryRefs.current[category] = el
            }}
            className="scroll-mt-[90px]"
          />

          <p className="font-semibold text-slate-800 mb-3 text-base">
            {category}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {list.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                selected={selectedKeys.includes(item.key)}
                onClick={() => toggle(item.key)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}