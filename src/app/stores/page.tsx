import type { Metadata } from 'next';
import { Suspense } from "react"
import StoresClient from "./StoresClient"
import { storesMeta } from '@/lib/metadata';

type SearchParams = Record<string, string | string[] | undefined>;

function asArray(v: string | string[] | undefined) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const filters = asArray(searchParams.filters);
  const storeTypeId = (searchParams.store_type_id as string | undefined) ?? undefined;

  return storesMeta({ filters, storeTypeId });
}

export default function StoresPage() {
  return (
    <Suspense fallback={null}>
      <StoresClient />
    </Suspense>
  )
}