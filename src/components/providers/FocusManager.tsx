"use client";

import { useEffect } from "react";

export function FocusManager() {
  useEffect(() => {
    const handleRouteChange = () => {
      const main = document.getElementById("main-content");
      if (main) {
        main.focus({ preventScroll: true });
        return;
      }
      const h1 = document.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabIndex", "-1");
        h1.focus({ preventScroll: true });
      }
    };

    document.addEventListener("astro:after-swap", handleRouteChange);
    return () => document.removeEventListener("astro:after-swap", handleRouteChange);
  }, []);

  return null;
}
