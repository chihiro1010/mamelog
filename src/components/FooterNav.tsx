"use client";

import { Home, LogIn, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function FooterNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = user
    ? [
        {
          label: "ホーム",
          href: "/",
          icon: <Home size={22} />,
          match: /^\/$/,
        },
        {
          label: "アカウント",
          href: "/account",
          icon: <User size={22} />,
          match: /^\/account/,
        },
      ]
    : [
        {
          label: "ログイン",
          href: "/login",
          icon: <LogIn size={22} />,
          match: /^\/login/,
        },
        {
          label: "新規登録",
          href: "/signup",
          icon: <UserPlus size={22} />,
          match: /^\/signup/,
        },
      ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-border/90 bg-background/95 backdrop-blur-lg">
      <ul className="mx-auto flex h-14 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.match.test(pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 transition ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`mb-0.5 rounded-full p-1.5 ${
                    isActive ? "bg-primary/12" : "bg-transparent"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-medium tracking-wide">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
