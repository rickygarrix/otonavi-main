'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function ReturnHomeButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/')}
      className="bg-white/80 backdrop-blur-sm rounded-full shadow px-2.5 py-2 flex items-center justify-center hover:bg-white transition"
    >
      <ArrowLeft className="w-5 h-5 text-gray-800" />
    </button>
  )
}