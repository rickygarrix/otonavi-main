function DetailItem({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  const empty = !value?.trim()
  return (
    <div className="flex justify-between py-2 border-b border-slate-100">
      <span className={`font-semibold ${empty ? "text-slate-400" : "text-slate-900"}`}>
        {label}
      </span>
      <span className={`text-sm text-right ${empty ? "text-slate-400" : "text-slate-800"}`}>
        {empty ? "—" : value}
      </span>
    </div>
  )
}

type DetailRow = [label: string, value: string | null]

type Section = {
  title: string
  items: DetailRow[]
}

type Props = {
  sections: Section[]
}

export default function StoreDetailSections({ sections }: Props) {
  return (
    <div className="px-4 mt-10">
      {sections.map((sec) => (
        <div key={sec.title} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{sec.title}</h2>
          {sec.items.map(([label, value]) => (
            <DetailItem key={label} label={label} value={value} />
          ))}
        </div>
      ))}
    </div>
  )
}