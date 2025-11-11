'use client'

import React, { useEffect, useRef } from 'react'
import { useResultState } from '../store/useResultState'
import type { Store } from '../types/storeTypes'

interface MapViewProps {
  sortMode: 'price' | 'station'
}

/**
 * Google Map 表示コンポーネント
 */
export default function MapView({ sortMode }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const { stores, selectedStore, setSelectedStore } = useResultState()

  // ✅ マップ初期化（storesが変わったら再生成）
  useEffect(() => {
    if (!mapRef.current || stores.length === 0) return

    const initMap = async () => {
      await loadGoogleMapsApi()
      if (!window.google?.maps) return

      // 最初の店舗を中心に
      const first = stores[0]
      const map = new window.google.maps.Map(mapRef.current!, {
        center: { lat: first.latitude, lng: first.longitude },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      const bounds = new window.google.maps.LatLngBounds()
      const markers: google.maps.Marker[] = []

      // ピンを生成
      stores.forEach((store) => {
        const marker = new window.google.maps.Marker({
          position: { lat: store.latitude, lng: store.longitude },
          map,
          title: store.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(30, 30),
          },
        })

        // クリックしたら選択状態にする
        marker.addListener('click', () => {
          setSelectedStore(store)
        })

        markers.push(marker)
        bounds.extend(marker.getPosition()!)
      })

      // 地図を全ピンにフィット
      map.fitBounds(bounds)

        // ✅ map と markers を DOM に保存（再利用用）
        ; (mapRef.current as any)._mapInstance = map
        ; (mapRef.current as any)._markers = markers

      // ✅ 初期状態で一件目を選択（青ピン反映）
      if (stores[0]) setSelectedStore(stores[0])
    }

    initMap()
  }, [stores])

  // ✅ selectedStore の変更を反映（青ピン切替）
  useEffect(() => {
    const map = (mapRef.current as any)?._mapInstance
    const markers: google.maps.Marker[] = (mapRef.current as any)?._markers
    if (!map || !markers) return

    markers.forEach((marker) => {
      const isActive = marker.getTitle() === selectedStore?.name
      marker.setIcon({
        url: isActive
          ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(isActive ? 40 : 30, isActive ? 40 : 30),
      })
    })
  }, [selectedStore])

  return <div ref={mapRef} className="absolute inset-0" />
}

/** ✅ Google Maps API ロード関数 */
async function loadGoogleMapsApi(): Promise<void> {
  if (typeof window === 'undefined') return
  if (window.google?.maps) return // すでにロード済みならスキップ

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