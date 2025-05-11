"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchMamelogs } from "@/lib/firebase/mamelog";
import PostForm from "@/components/PostForm";
import MamelogList from "@/components/MamelogList";
import LoginChecker from "@/components/LoginChecker";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { Mamelog } from "@/types/mamelog";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  const [mamelogs, setMamelogs] = useState<Mamelog[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadMamelogs = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const data = await fetchMamelogs(user.uid);
      setMamelogs(data);
    }
  };

  useEffect(() => {
    const auth = getAuth();
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
      <div className="absolute top-6 right-2">
        <LogoutButton></LogoutButton>
      </div>
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
        className="fixed bottom-6 right-6 bg-primary text-white p-5 rounded-full shadow-lg hover:bg-primary/90 transition"
        onClick={() => {
          setOpen(true);
        }}
      >
        <SquarePen />
      </Button>
    </div>
  );
}
