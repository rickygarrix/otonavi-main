'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] px-6 py-10 text-white">
      {/* ロゴ */}
      <div className="mb-10">
        <Link href="/" className="inline-block">
          <Image
            src="/otnv_logo.svg"
            alt="Otonavi Logo"
            width={56} // ← ロゴ大きく
            height={56}
            priority
          />
        </Link>
      </div>

      {/* メニュー */}
      <nav className="flex flex-col">
        <FooterLink href="/lp">オトナビとは？</FooterLink>
        <FooterLink href="/contact">お問い合わせ</FooterLink>
        <FooterLink href="/terms">利用規約</FooterLink>
        <FooterLink href="/privacy">プライバシーポリシー</FooterLink>
        <FooterLink href="/tokusho">特定商取引法に基づく表記</FooterLink>
      </nav>

      {/* コピーライト */}
      <p className="mt-10 text-xs text-white/60">© Otonavi</p>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex h-12 items-center px-4 text-xs text-white/90 hover:opacity-70"
    >
      {children}
    </Link>
  );
}
