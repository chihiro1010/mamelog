"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fetchMamelogs } from "@/lib/firebase/mamelog";
import PostForm from "@/components/PostForm";
import MamelogList from "@/components/MamelogList";
import LoginChecker from "@/components/LoginChecker";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { Mamelog } from "@/types/mamelog";
import { auth } from "@/lib/firebase/firebase";

export default function Home() {
  const [mamelogs, setMamelogs] = useState<Mamelog[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadMamelogs = async () => {
    const user = auth?.currentUser;
    if (user) {
      const data = await fetchMamelogs(user.uid);
      setMamelogs(data);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await fetchMamelogs(user.uid);
        setMamelogs(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <LoginChecker />
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
        className="fixed bottom-18 right-6 bg-primary text-white w-13 h-13 rounded-full shadow-lg hover:bg-primary/90 transition"
        onClick={() => {
          setOpen(true);
        }}
      >
        <SquarePen />
      </Button>
    </div>
  );
}
