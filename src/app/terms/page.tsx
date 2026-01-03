'use client';

import Footer from '@/components/ui/Footer';
import HomeButton from '@/components/ui/HomeButton';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pt-20">
      {/* ===== 上部：ホームに戻る ===== */}
      <div className="fixed top-0 left-0 z-100 flex w-full justify-center">
        <header className="m-auto flex h-20 w-full max-w-105 items-center gap-4 px-4">
          <HomeButton />
        </header>
      </div>

      {/* ===== 本文 ===== */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12 leading-relaxed text-gray-800">
          <h1 className="mb-8 text-3xl font-bold">利用規約</h1>

          <p className="mb-6">
            この利用規約（以下、「本規約」といいます。）は、オトナビ（以下、「当サービス」といいます。）が提供するサービスの利用条件を定めるものです。
            ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って当サービスをご利用いただきます。
          </p>

          <h2 className="mt-10 mb-4 text-xl font-semibold">第1条（適用）</h2>
          <p className="mb-6">
            本規約は、ユーザーと当サービスとの間のサービス利用に関わる一切の関係に適用されるものとします。
          </p>

          <h2 className="mt-10 mb-4 text-xl font-semibold">第2条（禁止事項）</h2>
          <p>ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul className="mt-2 mb-6 list-disc space-y-2 pl-6">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>当サービスの運営を妨害する行為</li>
            <li>不正アクセスや情報改ざんを目的とする行為</li>
            <li>他のユーザーに不利益、損害、不快感を与える行為</li>
            <li>無断転載、スクレイピング等の知的財産侵害行為</li>
          </ul>

          <h2 className="mt-10 mb-4 text-xl font-semibold">第3条（サービス内容の変更）</h2>
          <p className="mb-6">
            当サービスは、ユーザーに事前に通知することなく、
            サービス内容の変更、追加、停止を行うことができるものとします。
          </p>

          <h2 className="mt-10 mb-4 text-xl font-semibold">第4条（免責事項）</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>
              当サービスの利用により生じた不利益・損害について、
              当サービスは一切の責任を負いません。
            </li>
            <li>掲載情報の正確性・完全性を保証するものではありません。</li>
            <li>店舗・イベント情報の最新性や品質に関する責任は負いません。</li>
          </ul>

          <h2 className="mt-10 mb-4 text-xl font-semibold">第5条（利用規約の変更）</h2>
          <p className="mb-6">
            当サービスは必要と判断した場合、
            ユーザーに通知することなく本規約を変更できるものとします。
            変更後の利用規約は、当サービスに掲載した時点で効力を生じるものとします。
          </p>

          <h2 className="mt-10 mb-4 text-xl font-semibold">第6条（準拠法・裁判管轄）</h2>
          <p className="mb-6">
            本規約の解釈は日本法に従います。 当サービスに関して紛争が生じた場合、
            運営者所在地を管轄する裁判所を専属的合意管轄とします。
          </p>

          <p className="mt-12 text-sm text-gray-500">制定日：2025年1月1日</p>
        </div>
      </main>

      {/* ===== フッター ===== */}
      <Footer />
    </div>
  );
}
