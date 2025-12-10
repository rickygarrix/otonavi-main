"use client"

import { useEffect, useState, useMemo, RefObject } from "react"
import { supabase } from "@/lib/supabase"
import PrefectureChip from "./PrefectureChip"
import Chip from "@/components/ui/Chip"
import { RegionKey } from "@/app/page"

type Prefecture = {
  id: string
  name_ja: string
  region: string
}

type Area = {
  id: string
  name: string
  prefecture_id: string
  is_23ward: boolean
}

type Props = {
  onChange: (prefId: string | null, areaId: string | null) => void
  regionRefs?: Record<RegionKey, RefObject<HTMLDivElement | null>>
  areaRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  clearKey: number
}

export default function AreaSelector({
  onChange,
  regionRefs,
  areaRefs,
  clearKey,
}: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null)
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)

  // ✅ クリア時にUI完全リセット
  useEffect(() => {
    setSelectedPrefecture(null)
    setSelectedArea(null)
    setAreas([])
    onChange(null, null)
  }, [clearKey])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("prefectures")
        .select("*")
        .order("code")

      setPrefectures(data ?? [])
    }

    load()
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!selectedPrefecture) return

      if (selectedPrefecture.name_ja !== "東京都") {
        setAreas([])
        onChange(selectedPrefecture.id, null)
        return
      }

      const { data } = await supabase
        .from("areas")
        .select("*")
        .eq("prefecture_id", selectedPrefecture.id)
        .order("name")

      setAreas(data ?? [])
      onChange(selectedPrefecture.id, selectedArea?.id ?? null)
    }

    load()
  }, [selectedPrefecture])

  const grouped = useMemo(() => {
    return prefectures.reduce((acc: Record<string, Prefecture[]>, p) => {
      if (!acc[p.region]) acc[p.region] = []
      acc[p.region].push(p)
      return acc
    }, {})
  }, [prefectures])

  const REGION_ORDER: RegionKey[] = [
    "北海道・東北",
    "関東",
    "中部",
    "近畿",
    "中国・四国",
    "九州・沖縄",
  ]

  const tokyoWards = areas.filter((a) => a.is_23ward)
  const tokyoOthers = areas.filter((a) => !a.is_23ward)

  return (
    <div className="w-full px-6 py-6">
      {REGION_ORDER.map((region) => {
        const list = grouped[region]
        if (!list) return null

        return (
          <div key={region} className="mb-10">
            <div ref={regionRefs?.[region]} className="scroll-mt-[90px]" />

            <h3 className="font-semibold text-slate-800 mb-3">
              {region}（{list.length}県）
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {list.map((p) => (
                <PrefectureChip
                  key={p.id}
                  label={p.name_ja}
                  selected={selectedPrefecture?.id === p.id}
                  onClick={() => setSelectedPrefecture(p)}
                />
              ))}
            </div>

            {region === "関東" && selectedPrefecture?.name_ja === "東京都" && (
              <>
                <div
                  ref={(el) => {
                    if (!el || !areaRefs) return
                    areaRefs.current["東京23区"] = el
                  }}
                  className="scroll-mt-[90px]"
                />

                <h3 className="font-semibold text-slate-800 mt-8 mb-3">東京23区</h3>

                <div className="grid grid-cols-3 gap-3">
                  {tokyoWards.map((a) => (
                    <Chip
                      key={a.id}
                      label={a.name}
                      selected={selectedArea?.id === a.id}
                      onClick={() => {
                        setSelectedArea(a)
                        onChange(selectedPrefecture.id, a.id)
                      }}
                    />
                  ))}
                </div>

                <div
                  ref={(el) => {
                    if (!el || !areaRefs) return
                    areaRefs.current["東京23区以外"] = el
                  }}
                  className="scroll-mt-[90px]"
                />

                <h3 className="font-semibold text-slate-800 mt-8 mb-3">
                  東京23区以外
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {tokyoOthers.map((a) => (
                    <Chip
                      key={a.id}
                      label={a.name}
                      selected={selectedArea?.id === a.id}
                      onClick={() => {
                        setSelectedArea(a)
                        onChange(selectedPrefecture.id, a.id)
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}