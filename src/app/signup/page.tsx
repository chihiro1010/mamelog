"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { register, guestLogin, googleLogin } from "@/lib/firebase/auth";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      router.push("/");
    } catch (err: unknown) {
      // `any`を`unknown`に変更
      if (err instanceof Error) {
        // `Error`型であることを確認
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました");
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
      router.push("/");
    } catch (err: unknown) {
      // `any`を`unknown`に変更
      if (err instanceof Error) {
        // `Error`型であることを確認
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      router.push("/");
    } catch (err: unknown) {
      // `any`を`unknown`に変更
      if (err instanceof Error) {
        // `Error`型であることを確認
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました");
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label className="mb-2" htmlFor="email">
              メールアドレス
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="password">
              パスワード
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 mt-4">
          <Button type="submit" className="w-full">
            新規登録
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full"
          >
            Googleでログイン
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleGuestLogin}
            className="w-full"
          >
            おためしログイン（ログアウトするとデータが削除されます）
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
