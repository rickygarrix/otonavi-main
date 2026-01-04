"use client";

import { useRouter, useSearchParams } from "next/navigation";

import StoreCard from "@/components/store/StoreCard";
import Footer from "@/components/ui/Footer";
import HomeButton from "@/components/ui/HomeButton";
import BackToHomeButton from "@/components/ui/BackToHomeButton";

import { useStoresForSearch, useStoreFilters } from "@/hooks/store";

export default function StoresClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ============================
  // ① 店舗一覧取得（検索用）
  // ============================
  const { stores, loading } = useStoresForSearch();

  // ============================
  // ② URL から検索条件を読む
  // ============================
  const selectedFilters = searchParams.getAll("filters"); // keys
  const storeTypeId = searchParams.get("store_type_id"); // ← ★重要

  // ============================
  // ③ フィルタリング
  // ============================
  const { filteredStores } = useStoreFilters(stores, {
    filters: selectedFilters,
    storeTypeId, // ← ★Homeから渡された店舗タイプ
  });

  const params = searchParams.toString();

  // ============================
  // ④ Loading
  // ============================
  if (loading) {
    return <div className="pt-20 text-center">Loading...</div>;
  }

  // ============================
  // ⑤ View
  // ============================
  return (
    <div className="text-dark-5 flex min-h-screen flex-col bg-white pt-20">
      {/* ===== Header ===== */}
      <div className="fixed top-0 left-0 z-100 flex w-full justify-center">
        <header className="m-auto flex h-20 w-full max-w-105 items-center gap-4 bg-white/80 px-4 backdrop-blur-lg">
          <HomeButton />

          <div className="shrink-0 text-lg font-bold tracking-widest">
            {filteredStores.length}
            <span className="ml-1 text-[10px]">件</span>
          </div>

          {(storeTypeId || selectedFilters.length > 0) && (
            <div className="line-clamp-2 flex-1 text-xs text-blue-700">
              {[storeTypeId, ...selectedFilters].filter(Boolean).join(", ")}
            </div>
          )}
        </header>
      </div>

      {/* ===== Store List ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filteredStores.map((store) => (
            <div key={store.id} className="flex min-h-[250px]">
              <StoreCard store={store} query={params} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <BackToHomeButton
        onClick={() => router.push("/")}
        className="px-6 pb-8"
      />
      <Footer />
    </div>
  );
}