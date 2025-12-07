"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

// -------------------------------
// マスタ型
// -------------------------------
type Item = {
  id: string
  key?: string | null
  label: string
  description?: string | null
  is_active: boolean
}

// -------------------------------
// Props
// -------------------------------
type BaseProps = {
  title: string
  table: string
  columns?: 2 | 3
}

type SingleProps = BaseProps & {
  selection: "single"
  onChange: (value: string | null) => void   // ✅ id を返す
}

type MultiProps = BaseProps & {
  selection: "multi"
  onChange: (value: string[]) => void        // ✅ id の配列を返す
}

type Props = SingleProps | MultiProps

// -------------------------------
export default function GenericSelector(props: Props) {
  const { title, table, selection, onChange, columns = 2 } = props

  const [items, setItems] = useState<Item[]>([])
  const [selectedIds, setSelectedIds] = useState<string[] | string | null>(
    selection === "single" ? null : []
  )

  // -------------------------------
  // マスタ読込
  // -------------------------------
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

      setItems((data ?? []) as Item[])
    }

    load()
  }, [table])

  // -------------------------------
  // テーブル切替時リセット
  // -------------------------------
  useEffect(() => {
    if (selection === "single") {
      setSelectedIds(null)
      onChange(null)
    } else {
      setSelectedIds([])
      onChange([])
    }
  }, [table])

  // -------------------------------
  // ✅ 選択トグル（id 管理・再タップ解除）
  // -------------------------------
  const toggle = (id: string) => {
    if (selection === "single") {
      const next = selectedIds === id ? null : id
      setSelectedIds(next)
      onChange(next)
      return
    }

    const prev = Array.isArray(selectedIds) ? selectedIds : []
    const next = prev.includes(id)
      ? prev.filter((v) => v !== id)
      : [...prev, id]

    setSelectedIds(next)
    onChange(next)
  }

  const isSelected = (id: string) =>
    selection === "single"
      ? selectedIds === id
      : Array.isArray(selectedIds) && selectedIds.includes(id)

  // -------------------------------
  // description 表示（label用）
  // -------------------------------
  const selectedDescriptions = (() => {
    if (!items.some((i) => i.description)) return null

    if (selection === "single") {
      const id = selectedIds as string | null
      const found = items.find((i) => i.id === id)
      return found?.description ?? null
    }

    const ids = Array.isArray(selectedIds) ? selectedIds : []
    const descs = ids
      .map((id) => items.find((i) => i.id === id)?.description)
      .filter(Boolean)

    return descs.length > 0 ? descs.join(" / ") : null
  })()

  // -------------------------------
  // ✅ UI（表示は label のみ）
  // -------------------------------
  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">{title}</h2>

      <div className={`grid gap-3 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {items.map((item) => (
          <Chip
            key={item.id}
            label={item.label}                // ✅ 表示は label
            selected={isSelected(item.id)}   // ✅ 判定は id
            onClick={() => toggle(item.id)}  // ✅ トグルは id
          />
        ))}
      </div>

      {selectedDescriptions && (
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          {selectedDescriptions}
        </p>
      )}
    </div>
  )
}