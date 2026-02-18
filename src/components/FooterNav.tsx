"use client";

import { Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "ホーム",
      href: "/",
      icon: <Home size={24} />,
      match: /^\/$/,
      enabled: true,
    },
    {
      label: "アカウント",
      href: "/account",
      icon: <User size={24} />,
      match: /^\/account/,
      enabled: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t-1 border-border shadow-lg">
      <ul className="flex justify-around items-center h-13">
        {navItems.map((item, i) => {
          const isActive = item.match.test(pathname);
          return (
            <li key={i} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 transition
                  ${
                    isActive
                      ? "border-t-3 border-[#5c2e13] text-[#5c2e13] bg-transparent font-bold"
                      : "border-t-3 border-transparent text-muted-foreground bg-transparent"
                  }
                  hover:bg-accent/20 active:bg-accent/30`}
              >
                <span className="mb-1">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
