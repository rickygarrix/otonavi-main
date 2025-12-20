// components/store/StoreDetailSections.tsx
"use client"

type DetailRow = [label: string, value: string | null]

type Props = {
  items: DetailRow[]
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  const empty = !value?.trim()

  return (
    <div className="flex justify-between gap-6 py-3 border-b border-slate-100">
      <span className="font-semibold text-slate-900 shrink-0">
        {label}
      </span>
      <span
        className={`text-sm text-right leading-relaxed ${empty ? "text-slate-400" : "text-slate-800"
          }`}
      >
        {empty ? "—" : value}
      </span>
    </div>
  )
}

export default function StoreDetailSections({ items }: Props) {
  return (
    <div className="px-4 mt-10">
      {items.map(([label, value]) => (
        <DetailItem key={label} label={label} value={value} />
      ))}
    </div>
  )
}