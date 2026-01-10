'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeButton from '@/components/ui/HomeButton';
import Footer from '@/components/ui/Footer';

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export default function ContactConfirmPage() {
  const router = useRouter();
  const [form, setForm] = useState<ContactForm | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('contactForm');
    if (!stored) {
      router.replace('/contact');
      return;
    }
    setForm(JSON.parse(stored));
  }, [router]);

  const submit = async () => {
    if (!form || !agreed || sending) return;

    try {
      setSending(true);

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // ★ 完了時にクリア（重要）
      sessionStorage.removeItem('contactForm');

      router.push('/contact/complete');
    } finally {
      setSending(false);
    }
  };

  if (!form) return null;

  return (
    <div className="bg-Brand-Light-2 min-h-screen">
      <div className="fixed top-0 left-0 z-100 flex w-full justify-center">
        <header className="m-auto flex h-20 w-full max-w-105 items-center gap-4 px-4">
          <HomeButton />
        </header>
      </div>

      {/* 固定ヘッダー */}
      <div className="fixed top-0 right-0 left-0 z-50 flex h-20 items-center gap-4 bg-white/70 px-4 backdrop-blur">
        <HomeButton onHome={() => router.push('/')} />
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-slate-300" />
          <div className="h-[2px] w-16 bg-slate-200" />
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            確認
          </div>
          <div className="h-[2px] w-16 bg-blue-400" />
          <div className="h-3 w-3 rounded-full bg-slate-300" />
        </div>
      </div>

      <div className="h-20" />

      {/* 本文 */}
      <div className="flex flex-col gap-6 px-6 py-10">
        <h1 className="text-Brand-Dark-1 text-xl font-bold tracking-widest">
          お問い合わせ内容の確認
        </h1>

        <p className="text-Brand-Dark-1 text-sm">入力した内容に間違いがないかご確認ください。</p>

        {/* 名前 */}
        <div>
          <label className="text-sm">お名前 *</label>
          <div className="flex h-12 items-center rounded-3xl bg-slate-200 px-4">{form.name}</div>
        </div>

        {/* メール */}
        <div>
          <label className="text-sm">メールアドレス *</label>
          <div className="flex h-12 items-center rounded-3xl bg-slate-200 px-4">{form.email}</div>
        </div>

        {/* 内容 */}
        <div>
          <label className="text-sm">お問い合わせ内容 *</label>
          <div className="min-h-[160px] rounded-2xl bg-slate-200 px-4 py-3 whitespace-pre-wrap">
            {form.message}
          </div>
        </div>

        {/* 同意 */}
        <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm outline outline-1 outline-slate-300">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-5 w-5"
          />
          <span>
            <a href="/privacy" className="text-blue-600 underline">
              プライバシーポリシー
            </a>
            に同意します。
          </span>
        </label>

        {/* ボタン */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => router.back()}
            className="h-12 rounded-xl bg-white text-sm outline outline-1 outline-slate-300"
          >
            書き直す ✎
          </button>

          <button
            disabled={!agreed || sending}
            onClick={submit}
            className={`h-12 rounded-xl bg-white text-sm outline outline-1 outline-slate-300 ${
              !agreed || sending ? 'opacity-40' : ''
            }`}
          >
            {sending ? '送信中…' : '送信 ✈'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
