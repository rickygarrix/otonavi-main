'use client'

import { useResultState } from '../store/useResultState'

export default function StoreGridList() {
  const { stores, selectedStore, setSelectedStore } = useResultState()

  if (!stores.length) return null

  return (
    <div className="p-4 grid grid-cols-2 gap-4 bg-white h-screen overflow-y-auto">
      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => setSelectedStore(store)}
          className={`rounded-xl overflow-hidden border cursor-pointer transition ${selectedStore?.id === store.id
              ? 'border-blue-500 shadow-md'
              : 'border-gray-200 hover:shadow'
            }`}
        >
          <img
            src={store.image_url ?? '/noimage.jpg'}
            alt={store.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-2">
            <p className="font-semibold text-sm truncate">{store.name}</p>
            <p className="text-xs text-gray-500 truncate">
              {store.area?.name}・{store.store_type?.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}