"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function FooterNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "工事中",
      href: "#",
      icon: <span className="text-2xl">-</span>,
      match: /^\/mamelog/,
      enabled: false,
    },
    {
      label: "ホーム",
      href: "/",
      icon: <Home size={24} />,
      match: /^\/$/,
      enabled: true,
    },
    {
      label: "工事中",
      href: "#",
      icon: <span className="text-2xl">-</span>,
      match: /^\/profile/,
      enabled: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t-1 border-border shadow-lg">
      <ul className="flex justify-around items-center h-13">
        {navItems.map((item, i) => {
          // enabledがtrueのもののみアクティブ判定
          const isActive = item.enabled && item.match.test(pathname);
          return (
            <li key={i} className="flex-1">
              {item.enabled ? (
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
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    toast("工事中です。リリースをお待ちください。")
                  }
                  className="flex flex-col items-center justify-center w-full h-full py-1 mx-2 rounded-lg transition text-muted-foreground hover:bg-accent/30 active:bg-accent/50 cursor-not-allowed"
                  tabIndex={-1}
                >
                  <span className="mb-1 opacity-70">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
