"use client";

import Link from "next/link";
import LogoutChecker from "@/components/LogoutChecker";

export default function Welcome() {
  return (
    <>
      <LogoutChecker />
      <main className="mx-auto flex min-h-[calc(100svh-120px)] w-full max-w-md flex-col justify-center px-6 pb-24 pt-10 font-[family-name:var(--font-geist-sans)]">
        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">まめログ</h1>
          <p className="text-sm text-muted-foreground">
            お気に入りの珈琲豆を、いつでも見返せるように記録しよう。
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#c18c38] px-5 text-base font-semibold text-background transition-colors hover:bg-[#b57f2f]"
            href="/signup"
            rel="noopener noreferrer"
          >
            アカウントを作成
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-black/[.08] bg-white px-5 text-base font-semibold transition-colors hover:bg-[#f2f2f2]"
            href="/login"
            rel="noopener noreferrer"
          >
            ログイン
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border bg-background/70 p-4 text-sm text-muted-foreground">
          購入日・生産国・焙煎度・価格など、コーヒー豆の情報をまとめて管理できます。
        </div>
      </main>
    </>
  );
}
