"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

// マスタ行の型
type Item = {
  id: string
  key?: string        // store_types の場合は key が無い可能性があるので optional
  label: string
  is_active: boolean
}

// Base
type BaseProps = {
  title: string
  table: string
}

// Single
type SingleProps = BaseProps & {
  selection: "single"
  onChange: (value: string | null) => void
}

// Multi
type MultiProps = BaseProps & {
  selection: "multi"
  onChange: (value: string[]) => void
}

type Props = SingleProps | MultiProps

export default function GenericSelector(props: Props) {
  const { title, table, selection, onChange } = props

  const [items, setItems] = useState<Item[]>([])
  const [selected, setSelected] = useState<string | string[] | null>(
    selection === "single" ? null : []
  )

  // 🔹 Supabase マスタ読み込み
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("is_active", true)
        .order("label", { ascending: true })

      if (error) {
        console.error(`GenericSelector load error (${table}):`, error)
        return
      }

      setItems(data ?? [])
    }

    load()
  }, [table])

  // 🔹 選択トグル
  const toggle = (id: string) => {
    if (selection === "single") {
      const next = selected === id ? null : id
      setSelected(next)
      onChange(next as string | null)
      return
    }

    // multi
    const prevArray = Array.isArray(selected) ? selected : []
    const next = prevArray.includes(id)
      ? prevArray.filter((x) => x !== id)
      : [...prevArray, id]

    setSelected(next)
    onChange(next as string[])
  }

  const isSelected = (id: string) => {
    if (selection === "single") return selected === id
    return Array.isArray(selected) && selected.includes(id)
  }

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">{title}</h2>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={isSelected(item.id)}
            onClick={() => toggle(item.id)}
          />
        ))}
      </div>
    </div>
  )
}