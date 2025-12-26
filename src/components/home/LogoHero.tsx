// src/components/home/LogoHero.tsx
'use client'

import Image from 'next/image'
import React from 'react'

export default function LogoHero() {
  return (
    <Image
      src="/logo-white.svg"
      alt="オトナビ"
      width={200}
      height={60}
      className="drop-shadow-lg"
    />
  )
}