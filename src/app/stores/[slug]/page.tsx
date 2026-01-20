import type { Metadata } from 'next';
import StoreClient from './storeClient';
import { SITE_URL, SITE_NAME, SITE_DESC } from '@/lib/site';
import { getSupabaseServer } from '@/lib/supabaseServer';

type Props = {
  params: Promise<{ slug: string }>;
};

/* =========================
   Metadata
========================= */
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Next.js 15 では params は Promise
  const { slug } = await params;

  const supabase = getSupabaseServer();

  // meta 用：最小限の取得（重い join はしない）
  const { data } = await supabase
    .from('stores')
    .select('name, slug, description, og_image_url, is_active')
    .eq('slug', slug)
    .maybeSingle();

  // 非公開 or 存在しない
  if (!data || !data.is_active) {
    return {
      title: '店舗が見つかりません',
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      },
    };
  }

  return {
    title: `${data.name} | ${SITE_NAME}`,
    description: data.description ?? SITE_DESC,
    openGraph: {
      title: data.name,
      description: data.description ?? SITE_DESC,
      url: `${SITE_URL}/stores/${data.slug}`,
      images: data.og_image_url ? [data.og_image_url] : [],
    },
  };
}

/* =========================
   Page
========================= */
export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <StoreClient slug={slug} />;
}