"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type Other = {
  id: string
  key: string
  label: string
  description: string | null
  is_active: boolean
}

type Props = {
  onChange: (keys: string[]) => void
}

export default function OtherSelector({ onChange }: Props) {
  const [items, setItems] = useState<Other[]>([])
  const [selected, setSelected] = useState<string[]>([])

  // 🔹 Load
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("other_definitions")
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

  // 🔹 Toggle
  const toggle = (key: string) => {
    setSelected(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  // 🔥 親へ通知
  useEffect(() => {
    onChange(selected)
  }, [selected, onChange])

  return (
    <div className="w-full px-6 py-6 border-b border-slate-200">
      <h2 className="text-lg font-bold text-slate-900 mb-6">その他</h2>

      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
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