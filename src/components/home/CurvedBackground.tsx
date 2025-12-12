// src/components/home/CurvedBackground.tsx
"use client"

import Image from "next/image"

export default function CurvedBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src="/back.png"
        alt="background"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </div>
  )
}