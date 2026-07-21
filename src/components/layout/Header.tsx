"use client";

import { useState, useEffect } from "react";
import Link from '@/components/ui/link';
import { usePathname } from '@/components/ui/navigation';
import {
  Menu,
  Heart,
  X,
  Home,
  Info,
  Briefcase,
  FolderKanban,
  BookOpen,
  Users,
  Handshake,
  Mail,
  Bot,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "About", href: "/about", icon: Info },
  { title: "Focus Areas", href: "/focus-areas", icon: Briefcase },
  { title: "Projects", href: "/projects", icon: FolderKanban },
  { title: "Blog", href: "/blog", icon: BookOpen },
  { title: "Resources", href: "/resources", icon: BookOpen },
  { title: "EqualEdge AI", href: "/ai", icon: Bot },
  { title: "Volunteer", href: "/volunteer", icon: Users },
  { title: "Partner", href: "/partner-with-us", icon: Handshake },
  { title: "Contact", href: "/contact", icon: Mail },
] as const;

import { AuthProvider, useAuth } from '@/components/auth/AuthContext';

function HeaderContent() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/85"
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="ThriveFusion Alliance Foundation — Home"
        >
          <span className="text-lg font-extrabold tracking-tight text-primary">
            {siteConfig.shortName}
          </span>
          <span className="text-[11px] font-medium leading-none text-muted-foreground">
            Alliance Foundation
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {!loading && user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">Profile</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">Dashboard</Link>
              </Button>
            </div>
          ) : !loading ? (
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link href="/login">Log In</Link>
            </Button>
          ) : null}

          {/* Donate CTA */}
          <Button asChild size="sm" className="hidden sm:flex ml-2">
            <Link href="/donate">
              <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
              Donate
            </Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 p-0"
            >
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle className="text-left text-base font-extrabold text-primary">
                  {siteConfig.shortName}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    Alliance Foundation
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col p-4 overflow-y-auto max-h-[calc(100vh-80px)]"
              >
                <ul className="space-y-1" role="list">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setMobileOpen(false)}
                        >
                          <Icon
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
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

                <div className="mt-6 border-t pt-6 space-y-3">
                  {!loading && user ? (
                    <>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/profile" onClick={() => setMobileOpen(false)}>
                          My Profile
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/admin" onClick={() => setMobileOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                    </>
                  ) : !loading ? (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                  ) : null}

                  <Button asChild className="w-full" size="lg">
                    <Link href="/donate" onClick={() => setMobileOpen(false)}>
                      <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
                      Donate Now
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <AuthProvider>
      <HeaderContent />
    </AuthProvider>
  );
}