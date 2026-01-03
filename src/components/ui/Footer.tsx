'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-5 text-light-3 px-4 pt-8 pb-10">
      {/* ロゴ */}
      <Link href="/" className="ml-2 flex h-10 items-center">
        <Image src="/logo-white.svg" alt="オトナビ" width={133} height={40} />
      </Link>

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
