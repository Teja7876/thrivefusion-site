"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

/**
 * MainNavigation — desktop horizontal navigation bar.
 * Renders navigation items from the shared navigation constant.
 */
export default function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="flex items-center gap-1">
      {navigation
        .filter((item) => !item.highlight)
        .map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isActive ? "bg-primary/10 text-primary" : "text-foreground/70"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.title}
            </Link>
          );
        })}
    </nav>
  );
}
