"use client";

import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("ログアウトしました");
      router.push("/login");
    } catch (error) {
      toast.error("ログアウトに失敗しました");
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      logout
    </Button>
  );
}
