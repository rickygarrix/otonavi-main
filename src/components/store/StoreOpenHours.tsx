"use client"

type Props = {
  businessHours?: string | null
}

export default function StoreOpenHours({ businessHours }: Props) {
  if (!businessHours) return null

  return (
    <div className="px-4 mt-10">
      <h2 className="text-xl font-bold mb-3">営業時間</h2>

      <div className="whitespace-pre-line text-slate-700 leading-relaxed">
        {businessHours}
      </div>

      {/* 注意文言 */}
      <p className="mt-3 text-xs text-slate-500">
        ※ 日によって変動する可能性があります。最新情報は公式サイトやSNSをご確認ください。
      </p>
    </div>
  )
}