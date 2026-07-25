
import Link from '@/components/ui/link';
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[92vh] flex-col overflow-hidden"
      aria-label="Hero"
    >
      {/* Clean Premium Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60" />


      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="container mx-auto px-4 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm">
              <span
                className="h-2 w-2 rounded-full bg-green-500"
                aria-hidden="true"
              />
              Accessibility · Inclusion · Innovation
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Empowering{" "}
              <span className="relative">
                <span className="relative z-10 text-primary-foreground">
                  Every
                </span>
                <span
                  className="absolute inset-x-0 bottom-1 z-0 h-3 rounded bg-primary/70"
                  aria-hidden="true"
                />
              </span>{" "}
              Ability
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              Creating accessible opportunities through education, assistive technology, employment, advocacy, and inclusive innovation.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-border bg-background/50 px-8 text-base font-semibold text-foreground backdrop-blur-sm hover:bg-muted hover:text-foreground"
              >
                <Link href="/volunteer">
                  Volunteer
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-border bg-background/50 px-8 text-base font-semibold text-foreground backdrop-blur-sm hover:bg-muted hover:text-foreground"
              >
                <Link href="/partner-with-us">
                  Partner With Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="relative z-10 flex justify-center pb-8"
        aria-hidden="true"
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-muted-foreground" />
      </div>
    </section>
  );
}