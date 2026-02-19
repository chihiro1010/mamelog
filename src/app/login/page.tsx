"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Coffee, Loader2 } from "lucide-react";
import LogoutChecker from "@/components/LogoutChecker";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch {
      setError("ログインに失敗しました。入力内容をご確認ください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="px-4 pb-8 pt-6">
      <LogoutChecker />
      <Card className="overflow-hidden rounded-2xl border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/95 to-[#8b5e3c] py-5 text-primary-foreground">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
            <Coffee className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">ログイン</CardTitle>
          <p className="text-sm text-primary-foreground/85">
            お気に入りのコーヒー記録を、いつでも見返せます。
          </p>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="h-11 w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ログイン中...
                </>
              ) : (
                "ログイン"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              アカウントをお持ちでない場合は{" "}
              <Link href="/signup" className="font-medium text-primary underline underline-offset-4">
                新規登録
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
