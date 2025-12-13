import type { HomeStore } from "@/types/store"

type Props = {
  store: HomeStore
}

export default function StoreAccess({ store }: Props) {
  if (!store.access && !store.address) return null

  return (
    <div className="px-4 mt-10">
      <h2 className="text-xl font-bold mb-3">アクセス</h2>

      {store.access && (
        <p className="text-slate-700 whitespace-pre-line mb-3">
          {store.access}
        </p>
      )}

      {store.address && (
        <p className="text-slate-700 whitespace-pre-line">
          {store.address}
        </p>
      )}
    </div>
  )
}