"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type Floor = {
  id: string
  key: string
  label: string
  description: string | null
  is_active: boolean
}

type Props = {
  onChange: (keys: string[]) => void
}

export default function FloorSelector({ onChange }: Props) {
  const [items, setItems] = useState<Floor[]>([])
  const [selected, setSelected] = useState<string[]>([])

  // 🔹 マスタ読み込み
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("floor_definitions")
        .select("*")
        .eq("is_active", true)
        .order("label", { ascending: true })

      if (error) {
        console.error(error)
        return
      }

      setItems(data ?? [])
    }

    load()
  }, [])

  // 🔹 chip の切り替え（toggle）
  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    )
  }

  // 🔥 親への通知は useEffect で行う（安全）
  useEffect(() => {
    onChange(selected)
  }, [selected, onChange])

  return (
    <div className="w-full px-6 py-6 border-slate-200">
      {/* 見出し */}
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        フロア位置
      </h2>

      {/* Chip 一覧（常時表示） */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={selected.includes(f.key)}
            onClick={() => toggle(f.key)}
          />
        ))}
      </div>
    </div>
  )
}