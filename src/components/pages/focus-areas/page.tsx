
import Image from '@/components/ui/image';
import Link from '@/components/ui/link';
import { ArrowRight } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import { focusAreas } from "@/constants/focusAreas";
import { Button } from "@/components/ui/button";



export default function FocusAreasPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-muted">
        <Image
          src="/images/gallery/Deb Works on her Phone and Laptop.jpg"
          alt="Professional working across multiple devices showcasing digital inclusion"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <PageContainer className="relative flex h-full items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Our Focus Areas
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              Comprehensive strategies to dismantle barriers and build an inclusive society.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Focus Areas List */}
      <section className="py-24" aria-labelledby="focus-areas-heading">
        <PageContainer>
          <h2 id="focus-areas-heading" className="sr-only">
            Detailed Focus Areas
          </h2>

          <div className="flex flex-col gap-24">
            {focusAreas.map((area, index) => {
              const isEven = index % 2 === 0;
              const Icon = area.icon;

              return (
                <div
                  key={area.slug}
                  id={area.slug}
                  className="grid items-center gap-12 lg:grid-cols-2 scroll-mt-24"
                >
                  <div
                    className={`relative h-96 overflow-hidden rounded-3xl lg:h-[500px] shadow-lg ${
                      !isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <Image
                      src={area.image}
                      alt={area.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  <div className={!isEven ? "lg:order-1" : "lg:order-2"}>
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                      <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                    
                    <h3 className="text-3xl font-bold tracking-tight">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-lg font-medium text-primary">
                      {area.tagline}
                    </p>
                    
                    <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                      {area.description}
                    </p>

                    <div className="mt-8 flex gap-4">
                      <Button asChild>
                        <Link href={`/projects#${area.slug}`}>
                          View Related Projects
                          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
