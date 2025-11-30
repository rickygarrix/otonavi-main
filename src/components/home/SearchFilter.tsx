'use client'

import {
  BuildingStorefrontIcon,
  KeyIcon,
  BanknotesIcon,
  MegaphoneIcon,
  BeakerIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

export default function SearchFilter({
  onScrollStore,
  onScrollEquipment,
  onScrollPrice,
  onScrollSound,
  onScrollDrink,
  onScrollCustomer,
}: {
  onScrollStore: () => void
  onScrollEquipment: () => void
  onScrollPrice: () => void
  onScrollSound: () => void
  onScrollDrink: () => void
  onScrollCustomer: () => void
}) {
  const filters = [
    { label: '店舗', icon: BuildingStorefrontIcon, action: onScrollStore },
    { label: '設備', icon: KeyIcon, action: onScrollEquipment },
    { label: '料金', icon: BanknotesIcon, action: onScrollPrice },
    { label: '音響', icon: MegaphoneIcon, action: onScrollSound },
    { label: '飲食', icon: BeakerIcon, action: onScrollDrink },
    { label: '客層', icon: UserGroupIcon, action: onScrollCustomer },
  ]

  return (
    <div className="w-full flex justify-center px-4">
      <div
        className="
          w-full max-w-[800px]
          bg-slate-50/90 rounded-xl backdrop-blur-sm border border-slate-200
          flex justify-between items-center px-3 py-3 shadow-sm
        "
      >
        {filters.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            onClick={action}
            className="flex-1 flex flex-col items-center justify-center text-slate-700 hover:opacity-70 active:scale-95 transition-all py-1"
          >
            <Icon className="w-6 h-6 stroke-[1.5]" />
            <span className="text-[11px] mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}