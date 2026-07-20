"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navigation } from "@/constants/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * MobileNavigation — slide-out drawer navigation for mobile viewports.
 * Uses shadcn/ui Sheet for WCAG-compliant dialog behavior.
 */
export default function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-left text-base font-extrabold text-primary">
            {siteConfig.shortName}
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="p-4">
          <ul className="space-y-1" role="list">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{item.title}</span>
                    <ChevronRight
                      className="ml-auto h-4 w-4 opacity-40"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t pt-6">
            <Button asChild className="w-full" size="lg">
              <Link href="/donate" onClick={() => setOpen(false)}>
                <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
                Donate Now
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
