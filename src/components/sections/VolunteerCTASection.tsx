import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function VolunteerCTASection() {
  return (
    <section
      className="py-24"
      aria-labelledby="volunteer-cta-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/gallery/A Small Group of Colleagues Work Together.jpg"
              alt="A small group of diverse colleagues working together, representing inclusive teamwork."
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.10 0.02 265 / 0.88) 0%, oklch(0.10 0.02 265 / 0.75) 60%, oklch(0.25 0.15 195 / 0.65) 100%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 text-center text-white sm:px-12 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
                Join Our Community
              </div>

              <h2
                id="volunteer-cta-heading"
                className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl"
              >
                Be the Change You
                <br />
                Want to See
              </h2>

              <p className="mt-6 text-lg text-white/85">
                Volunteer with ThriveFusion and help us build an India where
                every person with a disability has equal access to opportunity.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white px-8 text-base font-semibold text-primary shadow-lg hover:bg-white/90"
                >
                  <Link href="/volunteer">
                    Become a Volunteer
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
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

              {/* Small credibility note */}
              <p className="mt-8 text-sm text-white/60">
                120+ volunteers · 15+ active programs · Hyderabad, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
