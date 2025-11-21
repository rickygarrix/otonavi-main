'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import PrefectureChip from './PrefectureChip'

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
  onChange: (pref: string | null, area: string | null) => void
}

export default function AreaSelector({ onChange }: Props) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null)
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)

  // 都道府県読み込み
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('prefectures')
        .select('*')
        .order('code')

      if (error) return console.error(error)
      setPrefectures(data)

      // 初期値：東京都
      const tokyo = data.find((p) => p.name_ja === '東京都') ?? null
      setSelectedPrefecture(tokyo)
      onChange(tokyo?.name_ja ?? null, null)
    }

    load()
  }, [onChange])

  // エリア読み込み
  useEffect(() => {
    const load = async () => {
      if (!selectedPrefecture) return

      if (selectedPrefecture.name_ja !== '東京都') {
        setAreas([])
        setSelectedArea(null)
        onChange(selectedPrefecture.name_ja, null)
        return
      }

      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('prefecture_id', selectedPrefecture.id)
        .order('name')

      if (error) return console.error(error)
      setAreas(data)

      // 初期値は渋谷 or 23区の先頭
      const first =
        data.find((a) => a.name.includes('渋谷')) ??
        data.find((a) => a.is_23ward) ??
        data[0] ??
        null

      setSelectedArea(first)
      onChange(selectedPrefecture.name_ja, first?.name ?? null)
    }

    load()
  }, [selectedPrefecture, onChange])

  // 地方ごとに分類
  const grouped = prefectures.reduce((acc: Record<string, Prefecture[]>, p) => {
    if (!acc[p.region]) acc[p.region] = []
    acc[p.region].push(p)
    return acc
  }, {})

  const REGION_ORDER = [
    '北海道・東北',
    '関東',
    '中部',
    '近畿',
    '中国',
    '四国',
    '九州・沖縄'
  ]

  const tokyoWards = areas.filter((a) => a.is_23ward)
  const tokyoOthers = areas.filter((a) => !a.is_23ward)

  return (
    <div className="w-full px-6 py-6">

      <h2 className="text-lg font-bold text-slate-900 mb-6">
        店舗情報
      </h2>

      {REGION_ORDER.map((region) => {
        const list = grouped[region]
        if (!list) return null

        return (
          <div key={region} className="mb-10">
            <h3 className="font-semibold text-slate-800 mb-3">
              {region}（{list.length}県）
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {list.map((p) => (
                <PrefectureChip
                  key={p.id}
                  label={p.name_ja}
                  selected={selectedPrefecture?.id === p.id}
                  onClick={() => {
                    setSelectedPrefecture(p)
                    setSelectedArea(null)
                  }}
                />
              ))}
            </div>

            {/* 東京都の時だけ表示 */}
            {region === '関東' && selectedPrefecture?.name_ja === '東京都' && (
              <>
                {tokyoWards.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-slate-800 mb-3">東京23区</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {tokyoWards.map((a) => (
                        <PrefectureChip
                          key={a.id}
                          label={a.name}
                          selected={selectedArea?.id === a.id}
                          onClick={() => {
                            setSelectedArea(a)
                            onChange(selectedPrefecture.name_ja, a.name)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {tokyoOthers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-slate-800 mb-3">東京23区以外</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {tokyoOthers.map((a) => (
                        <PrefectureChip
                          key={a.id}
                          label={a.name}
                          selected={selectedArea?.id === a.id}
                          onClick={() => {
                            setSelectedArea(a)
                            onChange(selectedPrefecture.name_ja, a.name)
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