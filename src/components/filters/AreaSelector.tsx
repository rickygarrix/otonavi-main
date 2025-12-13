"use client"

import { useEffect, useMemo, useState, RefObject } from "react"
import { supabase } from "@/lib/supabase"
import PrefectureChip from "./PrefectureChip"
import Chip from "@/components/ui/Chip"
import { RegionKey } from "@/app/page"

// ================================
// 型
// ================================
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
  onChange: (prefectureIds: string[], areaIds: string[]) => void
  regionRefs?: Record<RegionKey, RefObject<HTMLDivElement | null>>
  areaRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  clearKey: number
}

// ================================
// 定数
// ================================
const TOKYO_NAME = "東京都"

const REGION_ORDER: RegionKey[] = [
  "北海道・東北",
  "関東",
  "中部",
  "近畿",
  "中国・四国",
  "九州・沖縄",
]

// ================================
// Component
// ================================
export default function AreaSelector({
  onChange,
  regionRefs,
  areaRefs,
  clearKey,
}: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  const [selectedPrefectureIds, setSelectedPrefectureIds] = useState<string[]>([])
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([])

  // ============================
  // 初期ロード（都道府県）
  // ============================
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

  // ============================
  // 東京判定
  // ============================
  const tokyoPrefecture = useMemo(
    () => prefectures.find((p) => p.name_ja === TOKYO_NAME),
    [prefectures]
  )

  const isTokyoSelected =
    !!tokyoPrefecture &&
    selectedPrefectureIds.includes(tokyoPrefecture.id)

  // ============================
  // 東京エリアロード
  // ============================
  useEffect(() => {
    const loadTokyoAreas = async () => {
      if (!isTokyoSelected || !tokyoPrefecture) {
        setAreas([])
        setSelectedAreaIds([])
        return
      }

      const { data } = await supabase
        .from("areas")
        .select("*")
        .eq("prefecture_id", tokyoPrefecture.id)
        .order("name")

      setAreas(data ?? [])
    }

    loadTokyoAreas()
  }, [isTokyoSelected, tokyoPrefecture])

  // ============================
  // 全クリア（唯一の副作用）
  // ============================
  useEffect(() => {
    setSelectedPrefectureIds([])
    setSelectedAreaIds([])
    onChange([], [])
  }, [clearKey, onChange])

  // ============================
  // 表示用整理
  // ============================
  const groupedPrefectures = useMemo(() => {
    return prefectures.reduce<Record<string, Prefecture[]>>((acc, p) => {
      acc[p.region] ??= []
      acc[p.region].push(p)
      return acc
    }, {})
  }, [prefectures])

  const tokyoWards = areas.filter((a) => a.is_23ward)
  const tokyoOthers = areas.filter((a) => !a.is_23ward)

  // ============================
  // handlers（event-driven）
  // ============================
  const togglePrefecture = (id: string) => {
    const next = selectedPrefectureIds.includes(id)
      ? selectedPrefectureIds.filter((v) => v !== id)
      : [...selectedPrefectureIds, id]

    setSelectedPrefectureIds(next)
    onChange(next, selectedAreaIds)
  }

  const toggleArea = (id: string) => {
    const next = selectedAreaIds.includes(id)
      ? selectedAreaIds.filter((v) => v !== id)
      : [...selectedAreaIds, id]

    setSelectedAreaIds(next)
    onChange(selectedPrefectureIds, next)
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="w-full px-6 py-6">
      {REGION_ORDER.map((region) => {
        const list = groupedPrefectures[region]
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
                  selected={selectedPrefectureIds.includes(p.id)}
                  onClick={() => togglePrefecture(p.id)}
                />
              ))}
            </div>

            {region === "関東" && isTokyoSelected && (
              <>
                {/* 東京23区 */}
                <div
                  ref={(el) => {
                    if (!el || !areaRefs) return
                    areaRefs.current["東京23区"] = el
                  }}
                  className="scroll-mt-[90px]"
                />

                <h3 className="font-semibold text-slate-800 mt-8 mb-3">
                  東京23区
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {tokyoWards.map((a) => (
                    <Chip
                      key={a.id}
                      label={a.name}
                      selected={selectedAreaIds.includes(a.id)}
                      onClick={() => toggleArea(a.id)}
                    />
                  ))}
                </div>

                {/* 東京23区以外 */}
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
                      selected={selectedAreaIds.includes(a.id)}
                      onClick={() => toggleArea(a.id)}
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