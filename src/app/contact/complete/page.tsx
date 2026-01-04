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

export default function ContactCompletePage() {
  const router = useRouter();
  const [form, setForm] = useState<ContactForm | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('contactForm');
    if (stored) {
      setForm(JSON.parse(stored));
      sessionStorage.removeItem('contactForm');
    }
  }, []);

  return (
    <div className="bg-Brand-Light-2 flex min-h-screen flex-col">
      <div className="fixed top-0 left-0 z-100 flex w-full justify-center">
        <header className="m-auto flex h-20 w-full max-w-105 items-center gap-4 px-4">
          <HomeButton />
        </header>
      </div>

      <div className="fixed top-0 right-0 left-0 z-50 flex h-20 items-center gap-4 bg-white/70 px-4 backdrop-blur">
        <HomeButton onHome={() => router.push('/')} />

        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-slate-300" />
          <div className="h-[2px] w-16 bg-slate-200" />
          <div className="h-3 w-3 rounded-full bg-slate-300" />
          <div className="h-[2px] w-16 bg-slate-200" />
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800 text-xs font-bold text-white outline outline-4 outline-indigo-300">
            完了
          </div>
        </div>
      </div>

      <div className="h-20" />
      <div className="flex flex-col gap-6 px-6 py-10">
        <h1 className="text-Brand-Dark-1 text-xl font-bold tracking-widest">お問い合わせ完了</h1>

        <p className="text-Brand-Dark-1 text-sm leading-6">
          お問い合わせを受け付けました。確認用の自動送信メールが 届いているかご確認ください。
          <br />
          3営業日以内にメールにてお返事いたします。
        </p>

        <p className="text-Brand-Dark-5 text-xs leading-5">
          メールが届いていない場合、迷惑メールフォルダをご確認いただくか、 お手数ですが
          contact@otnv.jp に直接メールをお送りください。
        </p>

        {/* ホームへ */}
        <button
          onClick={() => router.push('/')}
          className="text-Brand-Light-1 from-Brand-Dark-4 to-Brand-Dark-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b text-sm outline outline-1 outline-offset-[-1px] outline-slate-300/50"
        >
          ホームへ
        </button>
      </div>
      {form && (
        <div className="bg-Brand-Light-2 flex flex-col gap-4 px-6 pt-10 pb-20">
          <h2 className="text-Brand-Dark-1 text-base font-bold tracking-wider">送信内容</h2>

          <div className="flex flex-col gap-2">
            <label className="text-Brand-Dark-1 text-sm">
              お名前 <span className="text-red-800">*</span>
            </label>
            <div className="flex h-12 items-center rounded-3xl bg-slate-900/10 px-4 text-slate-900/50">
              {form.name}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-Brand-Dark-1 text-sm">
              メールアドレス <span className="text-red-800">*</span>
            </label>
            <div className="flex h-12 items-center rounded-3xl bg-slate-900/10 px-4 text-slate-900/50">
              {form.email}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-Brand-Dark-1 text-sm">
              お問い合わせ内容 <span className="text-red-800">*</span>
            </label>
            <div className="min-h-[160px] rounded-2xl bg-slate-900/10 px-4 py-3 whitespace-pre-wrap text-slate-900/50">
              {form.message}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
