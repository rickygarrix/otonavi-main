import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <article className="text-sm leading-relaxed text-neutral-800 [&_h1]:mb-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-lg [&_h2]:font-semibold [&_hr]:my-8 [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </article>
    </main>
  );
}
