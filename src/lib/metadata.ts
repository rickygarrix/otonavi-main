// src/lib/metadata.ts
import type { Metadata, Viewport } from 'next';
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESC } from '@/lib/site';

const ogImage = new URL('/ogp.png', SITE_URL).toString();

/* =========================
   Base Metadata
========================= */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: `%s｜${SITE_NAME}`,
  },

  description: SITE_DESC,

  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'ja_JP',
    images: [ogImage],
  },

  twitter: {
    card: 'summary_large_image',
    images: [ogImage],
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },

  appleWebApp: {
    capable: true,
    title: 'オトナビ',
    statusBarStyle: 'black-translucent',
  },
};

/* =========================
   Viewport
========================= */
export const baseViewport: Viewport = {
  themeColor: '#081624',
};

/* =========================
   Stores Page Metadata
========================= */
export function storesMeta(opts: {
  filters: string[];
  storeTypeId?: string;
}): Metadata {
  const title =
    !opts.filters.length && !opts.storeTypeId
      ? '検索結果'
      : '条件付き検索結果';

  const description =
    'オトナビの検索結果一覧。エリアやこだわり条件で音箱（クラブ・バー・ライブハウス等）を探せます。';

  const canonical = new URL('/stores', SITE_URL).toString();

  return {
    title,
    description,
    alternates: { canonical },

    openGraph: {
      url: canonical,
      title: `${title}｜${SITE_NAME}`,
      description,
      images: [ogImage],
      locale: 'ja_JP',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${title}｜${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}