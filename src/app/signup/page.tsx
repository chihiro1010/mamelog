"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { register, guestLogin, googleLogin } from "@/lib/firebase/auth";
import { Loader2, Sparkles } from "lucide-react";
import LogoutChecker from "@/components/LogoutChecker";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingType, setLoadingType] = useState<"email" | "google" | "guest" | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || password.length < 6) {
      setError("有効なメールアドレスと6文字以上のパスワードを入力してください。");
      return;
    }

    setLoadingType("email");
    try {
      await register(email, password);
      router.replace("/");
    } catch {
      setError("新規登録に失敗しました。入力内容をご確認ください。");
    } finally {
      setLoadingType(null);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setLoadingType("guest");
    try {
      await guestLogin();
      router.replace("/");
    } catch {
      setError("おためしログインに失敗しました。");
    } finally {
      setLoadingType(null);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoadingType("google");
    try {
      await googleLogin();
      router.replace("/");
    } catch {
      setError("Googleログインに失敗しました。");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <main className="px-4 pb-8 pt-6">
      <LogoutChecker />
      <Card className="mx-auto w-full overflow-hidden rounded-2xl border-primary/20">
        <CardHeader className="bg-gradient-to-r from-[#5c2e13] to-[#9c7458] py-5 text-primary-foreground">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">新規登録</CardTitle>
          <p className="text-sm text-primary-foreground/85">
            まめログをはじめて、コーヒー体験を積み上げましょう。
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="6文字以上"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="mt-2 flex flex-col space-y-2 px-5 pb-5">
            <Button type="submit" className="h-11 w-full" disabled={loadingType !== null}>
              {loadingType === "email" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 登録中...
                </>
              ) : (
                "メールアドレスで登録"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="h-11 w-full"
              disabled={loadingType !== null}
            >
              {loadingType === "google" ? "Googleでログイン中..." : "Googleでログイン"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleGuestLogin}
              className="h-11 w-full"
              disabled={loadingType !== null}
            >
              {loadingType === "guest" ? "おためしログイン中..." : "おためしログイン"}
            </Button>

            <p className="pt-2 text-center text-sm text-muted-foreground">
              すでにアカウントをお持ちですか？{" "}
              <Link href="/login" className="font-medium text-primary underline underline-offset-4">
                ログイン
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
