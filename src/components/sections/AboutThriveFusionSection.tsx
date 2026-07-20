import Image from '@/components/ui/image';
import Link from '@/components/ui/link';
import { ArrowRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AboutThriveFusionSection() {
  return (
    <section className="bg-muted/10 py-24" aria-labelledby="about-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/gallery/Two Colleagues Review Documents.jpg"
              alt="Two colleagues reviewing accessible documents together"
              width={800}
              height={560}
              className="h-72 w-full object-cover sm:h-96 lg:h-[420px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Info className="h-4 w-4" aria-hidden="true" />
              About Us
            </div>
            <h2
              id="about-heading"
              className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              ThriveFusion Alliance Foundation
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We are a Section 8 non-profit organization dedicated to building a truly inclusive society. Operating out of Hyderabad, India, our mission is to empower individuals with disabilities by removing barriers and fostering equal opportunities across education, employment, and technology.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              We believe that accessibility is a fundamental human right. Through our grassroots initiatives, innovative projects, and dedicated community, we strive to transform lives and ensure that every person has the chance to reach their full potential.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/about">
                  Discover Our Story
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
