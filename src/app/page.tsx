"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMamelogs } from "@/lib/firebase/mamelog";
import PostForm from "@/components/PostForm";
import MamelogList from "@/components/MamelogList";
import { Loader2, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mamelog } from "@/types/mamelog";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mamelogs, setMamelogs] = useState<Mamelog[]>([]);
  const [loadingMamelogs, setLoadingMamelogs] = useState(true);
  const [open, setOpen] = useState(false);

  const loadMamelogs = useCallback(async () => {
    if (!user) {
      setMamelogs([]);
      setLoadingMamelogs(false);
      return;
    }

    const data = await fetchMamelogs(user.uid);
    setMamelogs(data);
    setLoadingMamelogs(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      setLoadingMamelogs(false);
      return;
    }

    if (user) {
      loadMamelogs();
    }
  }, [user, authLoading, router, loadMamelogs]);

  if (authLoading || loadingMamelogs) {
    return (
      <div className="flex min-h-[calc(100svh-220px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4 px-4 pb-6 pt-4">
      <section className="rounded-xl border border-border/70 bg-card p-4">
        <h1 className="text-xl font-semibold tracking-tight">ホーム</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          いつもの一杯を、買った豆からていねいに記録しましょう。
        </p>
      </section>

      <PostForm
        onSuccess={() => {
          setOpen(false);
          loadMamelogs();
        }}
        isOpen={open}
        onOpenChange={setOpen}
      />
      <MamelogList mamelogs={mamelogs} onSuccess={loadMamelogs} />
      <Button
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/90"
        onClick={() => {
          setOpen(true);
        }}
      >
        <SquarePen />
      </Button>
    </div>
  );
}
