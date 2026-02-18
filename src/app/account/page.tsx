"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";
import { deleteCurrentUser } from "@/lib/firebase/auth";
import { deleteMamelogsByUser } from "@/lib/firebase/mamelog";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Loader2, TriangleAlert } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }

    if (confirmText !== "削除") {
      toast.error("確認のため「削除」と入力してください");
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteMamelogsByUser(user.uid);
      await deleteCurrentUser();
      toast.success("アカウントを削除しました");
      router.replace("/welcome");
    } catch {
      toast.error(
        "アカウント削除に失敗しました。再ログイン後にもう一度お試しください。"
      );
    } finally {
      setDeleteLoading(false);
      setConfirmText("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <Toaster position="top-right" richColors />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">アカウント情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
            <span className="font-semibold">メールアドレス:</span>{" "}
            {user.email ?? "ゲストユーザー"}
          </div>
          <LogoutButton />
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base text-red-700 flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" /> 危険な操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                退会（アカウント削除）
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>アカウントを削除しますか？</AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <span className="block">
                    この操作は取り消せません。登録済みのまめログもすべて削除されます。
                  </span>
                  <span className="block">確認のため、下に「削除」と入力してください。</span>
                </AlertDialogDescription>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="削除"
                />
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText("")}>
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "削除中..." : "削除する"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </main>
  );
}
