'use client'

import React, { useEffect, useRef } from 'react'
import { useResultState } from '../store/useResultState'
import type { Store } from '../types/storeTypes'

interface MapViewProps {
  sortMode: 'price' | 'station'
  stores: Store[]
}

export default function MapView({ sortMode, stores }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const { selectedStore, setSelectedStore } = useResultState()  // ✅ stores は props からのみ受け取る！

  useEffect(() => {
    if (!mapRef.current || stores.length === 0) return

    const initMap = async () => {
      await loadGoogleMapsApi()
      if (!window.google?.maps) return

      const map = new window.google.maps.Map(mapRef.current!, {
        center: { lat: stores[0].latitude, lng: stores[0].longitude },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      const bounds = new window.google.maps.LatLngBounds()
      const markers: google.maps.Marker[] = []

      // ✅ ソート済み stores に基づいてピン配置
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

        marker.addListener('click', () => {
          setSelectedStore(store)
          updateMarkerIcons(markers, store)
          map.panTo({ lat: store.latitude, lng: store.longitude })
        })

        markers.push(marker)
        bounds.extend(marker.getPosition()!)
      })

      map.fitBounds(bounds, { top: 40, right: 40, bottom: 80, left: 40 })

        ; (mapRef.current as any)._mapInstance = map
        ; (mapRef.current as any)._markers = markers

      // ✅ 修正：selectedStore が未設定なら props の先頭（＝安い順1件目）を選ぶ
      const initial = selectedStore ?? stores[0]
      updateMarkerIcons(markers, initial)
      if (!selectedStore) setSelectedStore(initial)
    }

    initMap()
  }, [stores])

  // ✅ 選択切り替え時（ピン同期）
  useEffect(() => {
    const map: google.maps.Map = (mapRef.current as any)?._mapInstance
    const markers: google.maps.Marker[] = (mapRef.current as any)?._markers
    if (!map || !markers) return

    updateMarkerIcons(markers, selectedStore)

    if (selectedStore) {
      const pos = new window.google.maps.LatLng(selectedStore.latitude, selectedStore.longitude)
      const bounds = map.getBounds()
      if (!bounds || !bounds.contains(pos)) map.panTo(pos)
    }
  }, [selectedStore])

  return <div ref={mapRef} className="absolute inset-0" />
}

/** ピン更新関数 */
function updateMarkerIcons(markers: google.maps.Marker[], activeStore?: Store | null) {
  markers.forEach((marker) => {
    const isActive = marker.getTitle() === activeStore?.name
    marker.setIcon({
      url: isActive
        ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new google.maps.Size(isActive ? 40 : 30, isActive ? 40 : 30),
    })
  })
}

/** Google Maps API ロード */
async function loadGoogleMapsApi(): Promise<void> {
  if (typeof window === 'undefined') return
  if (window.google?.maps) return
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
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