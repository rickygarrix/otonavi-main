"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type DrinkItem = {
  id: string
  key: string
  label: string
  is_active: boolean
}

type Props = {
  title: string
  onChange: (keys: string[]) => void
  clearKey: number
}

// 🔽 最後尾＆2列表示したいドリンク
const SPECIAL_DRINK_LABELS = [
  "ノンアルコール",
  "ソフトドリンク",
  "オリジナルドリンク",
  "水無料",
]

export default function DrinkSelector({
  title,
  onChange,
  clearKey,
}: Props) {
  const [items, setItems] = useState<DrinkItem[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // ============================
  // 選択変更 → 親に通知
  // ============================
  useEffect(() => {
    onChange(selectedKeys)
  }, [selectedKeys, onChange])

  // ============================
  // クリア同期
  // ============================
  useEffect(() => {
    setSelectedKeys([])
    onChange([])
  }, [clearKey, onChange])

  // ============================
  // マスタ読込
  // ============================
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("drink_definitions")
        .select("id, key, label, is_active")
        .eq("is_active", true)

      if (error) {
        console.error("DrinkSelector load error:", error)
        return
      }

      setItems((data ?? []) as DrinkItem[])
    }

    load()
  }, [])

  // ============================
  // 並び替えロジック
  // ============================
  const { normalDrinks, specialDrinks } = useMemo(() => {
    const normal: DrinkItem[] = []
    const special: DrinkItem[] = []

    items.forEach((item) => {
      if (SPECIAL_DRINK_LABELS.includes(item.label)) {
        special.push(item)
      } else {
        normal.push(item)
      }
    })

    // 通常ドリンクは五十音順
    normal.sort((a, b) => a.label.localeCompare(b.label, "ja"))

    return {
      normalDrinks: normal,
      specialDrinks: special,
    }
  }, [items])

  // ============================
  // toggle
  // ============================
  const toggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    )
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        {title}
      </h2>

      {/* ===== 通常ドリンク（3列） ===== */}
      <div className="grid grid-cols-3 gap-3">
        {normalDrinks.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={selectedKeys.includes(item.key)}
            onClick={() => toggle(item.key)}
          />
        ))}
      </div>

      {/* ===== 特別ドリンク（2列・最後尾） ===== */}
      {specialDrinks.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {specialDrinks.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              selected={selectedKeys.includes(item.key)}
              onClick={() => toggle(item.key)}
            />
          ))}
        </div>
      )}
    </div>
  )
}