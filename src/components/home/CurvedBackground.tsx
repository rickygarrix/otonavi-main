// src/components/home/CurvedBackground.tsx
"use client"

import Image from "next/image"

export default function CurvedBackground() {
  return (
    <div className="absolute inset-0 h-160">
      <Image
        src="/background-sp@2x.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </div>
  )
}