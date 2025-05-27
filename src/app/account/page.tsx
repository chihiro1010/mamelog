"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">アカウント情報</h1>
      <div className="mb-2">
        <span className="font-semibold">メールアドレス：</span>
        {user.email}
      </div>
      <LogoutButton></LogoutButton>
    </main>
  );
}
