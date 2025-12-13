"use client"

import type { HomeStore } from "@/types/store"

// =====================
// utils
// =====================
const DAY_LABEL_NUM: Record<number, string> = {
  1: "月",
  2: "火",
  3: "水",
  4: "木",
  5: "金",
  6: "土",
  7: "日",
}

const DAY_LABEL_STR: Record<string, string> = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
  sun: "日",
}

const formatTime = (t: string | null) => (t ? t.slice(0, 5) : "")

const getDayLabel = (d: unknown) => {
  if (typeof d === "number") return DAY_LABEL_NUM[d] ?? ""
  if (typeof d === "string") return DAY_LABEL_STR[d] ?? ""
  return ""
}

// =====================
// component
// =====================
type Props = {
  openHours?: HomeStore["open_hours"]
}

export default function StoreOpenHours({ openHours }: Props) {
  if (!openHours?.length) return null

  return (
    <div className="px-4 mt-10">
      <h2 className="text-xl font-bold mb-3">営業時間</h2>

      {openHours.map((h, idx) => (
        <div
          key={`${String(h.day_of_week)}-${idx}`}
          className="flex items-center py-1 text-slate-700"
        >
          {/* 曜日 */}
          <div className="min-w-[2.5rem] text-right font-semibold">
            {getDayLabel(h.day_of_week)}
          </div>

          {/* 時間 */}
          {h.is_closed ? (
            <span className="ml-4 text-slate-500">定休日</span>
          ) : (
            <span className="ml-4">
              {formatTime(h.open_time)}〜{formatTime(h.close_time)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}