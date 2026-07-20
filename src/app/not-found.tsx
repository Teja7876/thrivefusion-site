import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Large 404 */}
        <p className="text-9xl font-extrabold text-primary/20 select-none">
          404
        </p>

        <div className="-mt-4">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Page Not Found
          </h1>

          <p className="mt-4 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Return Home
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/contact">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Quick links */}
          <div className="mt-10">
            <p className="text-sm text-muted-foreground">Popular pages:</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {[
                { title: "About", href: "/about" },
                { title: "Focus Areas", href: "/focus-areas" },
                { title: "Projects", href: "/projects" },
                { title: "Volunteer", href: "/volunteer" },
                { title: "Donate", href: "/donate" },
              ].map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}