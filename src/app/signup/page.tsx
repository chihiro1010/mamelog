"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { register, guestLogin, googleLogin } from "@/lib/firebase/auth";
import { Loader2 } from "lucide-react";

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
    <main className="p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">アカウントを作成</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 mt-4">
            <Button type="submit" className="w-full" disabled={loadingType !== null}>
              {loadingType === "email" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 登録中...
                </>
              ) : (
                "新規登録"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full"
              disabled={loadingType !== null}
            >
              {loadingType === "google" ? "Googleでログイン中..." : "Googleでログイン"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleGuestLogin}
              className="w-full"
              disabled={loadingType !== null}
            >
              {loadingType === "guest" ? "おためしログイン中..." : "おためしログイン"}
            </Button>

            <p className="pt-2 text-sm text-muted-foreground">
              すでにアカウントをお持ちですか？{" "}
              <Link href="/login" className="text-primary underline underline-offset-4">
                ログイン
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
