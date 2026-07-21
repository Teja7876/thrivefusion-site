import Image from '@/components/ui/image';
import Link from '@/components/ui/link';
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FeaturedProjectSection() {
  return (
    <section className="bg-muted/30 py-24" aria-labelledby="featured-project-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Flagship Platform
            </div>
            <h2
              id="featured-project-heading"
              className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Thrive Assist
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our revolutionary accessibility-first platform connecting Persons with Disabilities (PwDs) with trusted helpers, volunteers, scribes, sign language interpreters, and caregivers through real-time requests and location-aware assistance.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/projects#thrive-assist">
                  Discover Thrive Assist
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Image */}
          <div className="order-1 overflow-hidden rounded-3xl shadow-xl lg:order-2">
            <Image
              src="/images/gallery/Two Colleagues Collaborate in an Accessibility Solutions Center.jpg"
              alt="Two colleagues collaborating in an accessibility solutions center, demonstrating the power of Thrive Assist."
              width={800}
              height={560}
              className="h-72 w-full object-cover sm:h-96 lg:h-[420px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
