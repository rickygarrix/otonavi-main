"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import PrefectureChip from "./PrefectureChip"
import Chip from "@/components/ui/Chip"

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
  // ✅ id で返す
  onChange: (prefId: string | null, areaId: string | null) => void
}

export default function AreaSelector({ onChange }: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [selectedPrefecture, setSelectedPrefecture] =
    useState<Prefecture | null>(null)
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)

  // ============================
  // 都道府県ロード
  // ============================
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("prefectures")
        .select("*")
        .order("code")

      if (error) {
        console.error("prefectures load error:", error)
        return
      }

      setPrefectures(data ?? [])
      setSelectedPrefecture(null)
      setSelectedArea(null)
      onChange(null, null)
    }

    load()
  }, []) // ✅ onChange は依存に入れない

  // ============================
  // 都道府県選択時
  // ============================
  useEffect(() => {
    const load = async () => {
      if (!selectedPrefecture) return

      if (selectedPrefecture.name_ja !== "東京都") {
        setAreas([])
        onChange(selectedPrefecture.id, null)
        return
      }

      const { data, error } = await supabase
        .from("areas")
        .select("*")
        .eq("prefecture_id", selectedPrefecture.id)
        .order("name")

      if (error) {
        console.error("areas load error:", error)
        return
      }

      setAreas(data ?? [])
      onChange(selectedPrefecture.id, selectedArea?.id ?? null)
    }

    load()
  }, [selectedPrefecture])

  // ============================
  // 地方ごとに分類
  // ============================
  const grouped = useMemo(() => {
    return prefectures.reduce((acc: Record<string, Prefecture[]>, p) => {
      if (!acc[p.region]) acc[p.region] = []
      acc[p.region].push(p)
      return acc
    }, {})
  }, [prefectures])

  const REGION_ORDER = [
    "北海道・東北",
    "関東",
    "中部",
    "近畿",
    "中国",
    "四国",
    "九州・沖縄",
  ]

  const tokyoWards = areas.filter((a) => a.is_23ward)
  const tokyoOthers = areas.filter((a) => !a.is_23ward)

  // ============================
  // UI
  // ============================
  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">店舗情報</h2>

      {REGION_ORDER.map((region) => {
        const list = grouped[region]
        if (!list) return null

        return (
          <div key={region} className="mb-10">
            <h3 className="font-semibold text-slate-800 mb-3">
              {region}（{list.length}県）
            </h3>

            {/* ✅ 都道府県（再タップで解除） */}
            <div className="grid grid-cols-3 gap-3">
              {list.map((p) => (
                <PrefectureChip
                  key={p.id}
                  label={p.name_ja}
                  selected={selectedPrefecture?.id === p.id}
                  onClick={() => {
                    // ✅ もう一度押したら解除
                    if (selectedPrefecture?.id === p.id) {
                      setSelectedPrefecture(null)
                      setSelectedArea(null)
                      setAreas([])
                      onChange(null, null)
                      return
                    }

                    setSelectedPrefecture(p)
                    setSelectedArea(null)
                  }}
                />
              ))}
            </div>

            {/* ✅ 東京の時だけエリア表示 */}
            {region === "関東" &&
              selectedPrefecture?.name_ja === "東京都" && (
                <>
                  {/* 23区 */}
                  {tokyoWards.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-semibold text-slate-800 mb-3">
                        東京23区
                      </h3>

                      <div className="grid grid-cols-3 gap-3">
                        {tokyoWards.map((a) => (
                          <Chip
                            key={a.id}
                            label={a.name}
                            selected={selectedArea?.id === a.id}
                            onClick={() => {
                              // ✅ 再タップで解除
                              if (selectedArea?.id === a.id) {
                                setSelectedArea(null)
                                onChange(selectedPrefecture.id, null)
                                return
                              }

                              setSelectedArea(a)
                              onChange(selectedPrefecture.id, a.id)
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 23区以外 */}
                  {tokyoOthers.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-semibold text-slate-800 mb-3">
                        東京23区以外
                      </h3>

                      <div className="grid grid-cols-3 gap-3">
                        {tokyoOthers.map((a) => (
                          <Chip
                            key={a.id}
                            label={a.name}
                            selected={selectedArea?.id === a.id}
                            onClick={() => {
                              if (selectedArea?.id === a.id) {
                                setSelectedArea(null)
                                onChange(selectedPrefecture.id, null)
                                return
                              }

                              setSelectedArea(a)
                              onChange(selectedPrefecture.id, a.id)
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
          </div>
        )
      })}
    </div>
  )
}