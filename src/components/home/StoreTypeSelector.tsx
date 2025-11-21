'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type StoreType = {
  id: string
  label: string
  is_active: boolean
}

type Props = {
  onChange: (type: string | null) => void
}

export default function StoreTypeSelector({ onChange }: Props) {
  const [types, setTypes] = useState<StoreType[]>([])
  const [selected, setSelected] = useState<StoreType | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('store_types')
        .select('*')
        .eq('is_active', true)
        .order('label')

      if (error) return console.error(error)
      setTypes(data ?? [])

      const first = data?.[0] ?? null
      setSelected(first)
      onChange(first?.label ?? null)
    }

    load()
  }, [onChange])

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        店舗タイプ
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelected(t)
              onChange(t.label)
            }}
            className={`
              h-14 rounded-[40px] border text-lg font-medium transition
              flex items-center justify-center
              ${selected?.id === t.id
                ? 'border-blue-600 text-blue-700 bg-blue-50 shadow-sm'
                : 'border-slate-200 text-slate-400 bg-white'
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}