"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function useGtag() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-EQGH0WDSTD", {
        page_path: pathname,
      });
    }
  }, [pathname]);
}
