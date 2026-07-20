"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function FocusManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on subsequent route changes, not initial load
    const isFirstLoad = sessionStorage.getItem("initial_load") === null;
    
    if (isFirstLoad) {
      sessionStorage.setItem("initial_load", "true");
      return;
    }

    // Wait for the next tick to ensure DOM is updated
    const timeout = setTimeout(() => {
      // 1. Try to find the skip link target (main content)
      const main = document.getElementById("main-content");
      if (main) {
        main.focus({ preventScroll: true });
        return;
      }

      // 2. Fallback to the first h1
      const h1 = document.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabIndex", "-1");
        h1.focus({ preventScroll: true });
        return;
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
