"use client";

import Link from "next/link";
import LogoutChecker from "@/components/LogoutChecker";

export default function Welcome() {
  return (
    <>
      <LogoutChecker />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[80vh] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h2 className="text-center">お気に入りの珈琲豆を管理しよう</h2>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#c18c38] text-background gap-2 hover:bg-[#d3d3d3] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto md:w-[190px]"
              href="/signup"
              rel="noopener noreferrer"
            >
              アカウントを作成
            </Link>
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              href="/login"
              rel="noopener noreferrer"
            >
              ログイン
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
