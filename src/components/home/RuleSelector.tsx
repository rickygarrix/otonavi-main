"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type Rule = {
  id: string
  key: string
  category: string
  label: string
  is_active: boolean
}

type Props = {
  onChange: (selectedKeys: string[]) => void
}

export default function RuleSelector({ onChange }: Props) {
  const [rules, setRules] = useState<Rule[]>([])
  const [selected, setSelected] = useState<string[]>([])

  // 🔹 Supabase から読み込み
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("rule_definitions")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("label", { ascending: true })

      if (error) return console.error(error)
      setRules(data ?? [])
    }

    load()
  }, [])

  // 🔹 選択変更 → 親へ通知（React的に正しいタイミング）
  useEffect(() => {
    onChange(selected)
  }, [selected, onChange])

  // 🔹 Chip toggle
  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    )
  }

  // 🔹 category グループ化
  const grouped = useMemo(() => {
    const map: Record<string, Rule[]> = {}
    rules.forEach((r) => {
      if (!map[r.category]) map[r.category] = []
      map[r.category].push(r)
    })
    return map
  }, [rules])

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">ルール／マナー</h2>

      {Object.keys(grouped).map((category) => (
        <div key={category} className="mb-10">
          <h3 className="text-slate-800 font-semibold mb-3">{category}</h3>

          <div className="grid grid-cols-2 gap-3">
            {grouped[category].map((rule) => (
              <Chip
                key={rule.id}
                label={rule.label}
                selected={selected.includes(rule.key)}
                onClick={() => toggle(rule.key)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}