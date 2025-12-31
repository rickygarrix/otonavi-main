"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

type Props = {
  onHome?: () => void   // ← optional にする
  size?: number
  iconSize?: number
  className?: string
}

export default function HomeButton({
  onHome,
  size = 40,
  iconSize = 20,
  className = "",
}: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (onHome) {
      onHome()
    } else {
      router.push("/") // ★ デフォルトでホームへ
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center rounded-full bg-white shadow ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/symbol.svg"
        alt="Home"
        width={iconSize}
        height={iconSize}
      />
    </button>
  )
}