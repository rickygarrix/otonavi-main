"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type Env = {
  id: string
  key: string
  label: string
  description: string | null
  is_active: boolean
}

type Props = {
  onChange: (keys: string[]) => void
}

export default function EnvironmentSelector({ onChange }: Props) {
  const [items, setItems] = useState<Env[]>([])
  const [selected, setSelected] = useState<string[]>([])

  // 🔹 Load
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("environment_definitions")
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
      <h2 className="text-lg font-bold text-slate-900 mb-6">周辺環境</h2>

      <div className="grid grid-cols-2 gap-3">
        {items.map(env => (
          <Chip
            key={env.id}
            label={env.label}
            selected={selected.includes(env.key)}
            onClick={() => toggle(env.key)}
          />
        ))}
      </div>
    </div>
  )
}