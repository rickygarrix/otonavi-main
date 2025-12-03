"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Chip from "@/components/ui/Chip"

type Props = {
  onChange: (selected: { hasAward: boolean; hasMedia: boolean }) => void
}

export default function AchievementSelector({ onChange }: Props) {
  const [hasAward, setHasAward] = useState(false)
  const [hasMedia, setHasMedia] = useState(false)

  // 選択が変わるたびに親へ返す
  useEffect(() => {
    onChange({ hasAward, hasMedia })
  }, [hasAward, hasMedia, onChange])

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">実績</h2>

      <div className="grid grid-cols-2 gap-4">
        <Chip
          label="受賞歴あり"
          selected={hasAward}
          onClick={() => setHasAward(!hasAward)}
        />

        <Chip
          label="メディア掲載あり"
          selected={hasMedia}
          onClick={() => setHasMedia(!hasMedia)}
        />
      </div>
    </div>
  )
}