'use client'

import { useEffect, useRef } from 'react'
import { useResultState } from '../store/useResultState'

interface MapViewProps {
  sortMode: 'price' | 'station'
}

export default function MapView({ sortMode }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const { stores, selectedStore, setSelectedStore } = useResultState()

  useEffect(() => {
    if (!mapRef.current || !stores.length) return

    const initMap = async () => {
      // ✅ Google Mapsスクリプトの読み込み完了を待つ
      await loadGoogleMapsApi()
      if (!window.google?.maps) return

      const first = stores[0]

      // ✅ 地図を初期化
      const map = new window.google.maps.Map(mapRef.current!, {
        center: { lat: first.latitude, lng: first.longitude },
        zoom: 13,
        gestureHandling: 'greedy',
        mapTypeControl: false,
        streetViewControl: false,
      })

      // ✅ マーカー設置
      stores.forEach((store) => {
        const marker = new window.google.maps.Marker({
          position: { lat: store.latitude, lng: store.longitude },
          map,
          title: store.name,
        })

        marker.addListener('click', () => {
          setSelectedStore(store)
          map.panTo({ lat: store.latitude, lng: store.longitude })
        })
      })
    }

    initMap()
  }, [stores, selectedStore, setSelectedStore])

  return <div ref={mapRef} className="absolute inset-0" />
}

/** ✅ Google Mapsを非同期ロードする関数 */
async function loadGoogleMapsApi(): Promise<void> {
  if (typeof window === 'undefined') return
  if (window.google?.maps) return // 既にロード済みならスキップ

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]'
    )
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}