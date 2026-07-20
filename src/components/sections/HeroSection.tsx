import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[92vh] flex-col overflow-hidden"
      aria-label="Hero"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gallery/Two Colleagues Collaborate in an Accessibility Solutions Center.jpg"
          alt="Two colleagues collaborating in an accessibility solutions center, representing inclusive innovation."
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay — dark-to-transparent left-to-right + slight bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, oklch(0.10 0.02 265 / 0.90) 0%, oklch(0.10 0.02 265 / 0.72) 45%, oklch(0.10 0.02 265 / 0.28) 100%), linear-gradient(to top, oklch(0 0 0 / 0.35) 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="container mx-auto px-4 py-20 lg:px-8">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <span
                className="h-2 w-2 rounded-full bg-green-400"
                aria-hidden="true"
              />
              Accessibility · Inclusion · Innovation
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
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
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/85">
              Creating accessible opportunities through education, assistive technology, employment, advocacy, and inclusive innovation.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/30"
              >
                <Link href="/donate">
                  Donate
                  <Heart className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/40 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Link href="/volunteer">
                  Volunteer
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/40 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
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
        <ChevronDown className="h-6 w-6 animate-bounce text-white/60" />
      </div>
    </section>
  );
}