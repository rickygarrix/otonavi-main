'use client'

type Props = {
  label: string
  selected?: boolean
  onClick?: () => void
}

export default function PrefectureChip({ label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full h-10 px-3 rounded-full
        flex items-center justify-center

        border
        ${selected ? 'bg-blue-100 text-blue-700 border-blue-400 shadow-sm'
          : 'bg-white text-slate-400 border-slate-200'}

        transition-all
        active:scale-[0.97]
      `}
    >
      <span className="text-sm">{label}</span>
    </button>
  )
}