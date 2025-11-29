'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { HomeStore } from '@/types/store'

export function useHomeStores() {
  const [stores, setStores] = useState<HomeStore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          id,
          name,
          name_kana,
          description,
          access,
          google_map_url,
          address,
          instagram_url,
          x_url,
          facebook_url,
          tiktok_url,
          official_site_url,

          open_hours:store_open_hours (
            day_of_week,
            open_time,
            close_time,
            last_order_time,
            is_closed
          ),

          special_hours:store_special_open_hours (
            date,
            open_time,
            close_time,
            last_order_time,
            is_closed,
            reason
          ),

          prefecture:prefecture_id ( name_ja ),
          area:area_id ( name ),
          store_type:store_type_id ( label ),

          store_images (
            image_url,
            is_main,
            order_num
          ),

          event_trends:store_event_trends (
            event_trend_definitions ( key )
          ),
          rules:store_rules (
            rule_definitions ( key )
          ),

          seat_types:store_seat_type (
            seat_type_definitions ( key )
          ),
          smoking:store_smoking (
            smoking_definitions ( key )
          ),
          environments:store_environment (
            environment_definitions ( key )
          ),
          others:store_other (
            other_definitions ( key )
          ),
          baggage:store_baggage (
            baggage_definitions ( key )
          ),
          security:store_security (
            security_definitions ( key )
          ),
          toilets:store_toilet (
            toilet_definitions ( key )
          ),
          floors:store_floor (
            floor_definitions ( key )
          ),

          size:size ( key ),

          awards:store_awards ( id ),
          media:store_media_mentions ( id )
        `)

      if (error) {
        console.error('Supabase error:', error)
        setLoading(false)
        return
      }

      const formatted: HomeStore[] = (data ?? []).map((s: any) => {
        // =========================
        // メイン画像の取得
        // =========================
        let imageUrl: string | null = null
        if (Array.isArray(s.store_images) && s.store_images.length > 0) {
          const main = s.store_images.find((img: any) => img.is_main)
          if (main) imageUrl = main.image_url
          else {
            const sorted = [...s.store_images].sort(
              (a, b) => (a.order_num ?? 999) - (b.order_num ?? 999)
            )
            imageUrl = sorted[0]?.image_url ?? null
          }
        }
        if (!imageUrl) imageUrl = '/default_shop.svg'

        const arr = (src: any, field: string) =>
          Array.isArray(src)
            ? src.map((v: any) => v[field]?.key).filter(Boolean)
            : []

        return {
          id: s.id,
          name: s.name,
          name_kana: s.name_kana ?? null,

          prefecture: s.prefecture?.name_ja ?? null,
          area: s.area?.name ?? null,
          type: s.store_type?.label ?? null,

          image_url: imageUrl,
          description: s.description ?? null,
          instagram_url: s.instagram_url ?? null,
          x_url: s.x_url ?? null,
          facebook_url: s.facebook_url ?? null,
          tiktok_url: s.tiktok_url ?? null,
          official_site_url: s.official_site_url ?? null,
          access: s.access ?? null,
          google_map_url: s.google_map_url ?? null,
          address: s.address ?? null,

          open_hours: s.open_hours ?? [],
          special_hours: s.special_hours ?? [],

          // -------- 既存 --------
          event_trend_keys: arr(s.event_trends, 'event_trend_definitions'),
          rule_keys: arr(s.rules, 'rule_definitions'),
          hasAward: Array.isArray(s.awards) && s.awards.length > 0,
          hasMedia: Array.isArray(s.media) && s.media.length > 0,

          // -------- 🔥 新規フィルタすべて --------
          seat_type_keys: arr(s.seat_types, 'seat_type_definitions'),
          smoking_keys: arr(s.smoking, 'smoking_definitions'),
          environment_keys: arr(s.environments, 'environment_definitions'),
          other_keys: arr(s.others, 'other_definitions'),
          baggage_keys: arr(s.baggage, 'baggage_definitions'),
          security_keys: arr(s.security, 'security_definitions'),
          toilet_keys: arr(s.toilets, 'toilet_definitions'),
          floor_keys: arr(s.floors, 'floor_definitions'),

          size_key: s.size?.key ?? null,
        }
      })

      setStores(formatted)
      setLoading(false)
    }

    load()
  }, [])

  return { stores, loading }
}