// src/hooks/home/useHomeSearchCount.ts
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Props = {
  storeTypeId: string | null
  filterKeys: string[]
}

export function useHomeSearchCount({ storeTypeId, filterKeys }: Props) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      let query = supabase
        .from("stores")
        .select("id", { count: "exact", head: true })

      if (storeTypeId) {
        query = query.eq("store_type_id", storeTypeId)
      }

      if (filterKeys.length > 0) {
        query = query.contains("filter_keys", filterKeys)
        // ↑ 実際のカラム構成に合わせて調整
      }

      const { count } = await query
      setCount(count ?? 0)
      setLoading(false)
    }

    load()
  }, [storeTypeId, filterKeys.join(",")])

  return { count, loading }
}