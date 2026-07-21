"use client";

import Image from '@/components/ui/image';
import { useEffect, useRef, useState } from "react";



export default function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-muted/20 py-24"
      aria-labelledby="impact-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/images/gallery/Three Colleagues Chat in an Office.jpg"
              alt="Three colleagues having an enthusiastic conversation in an accessible office environment."
              width={800}
              height={600}
              className="h-72 w-full object-cover sm:h-96 lg:h-[440px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Stats */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Why It Matters
            </span>
            <h2
              id="impact-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Why Accessibility Matters
            </h2>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                Accessibility is not just a checkbox or a compliance requirement—it is a fundamental human right. When digital and physical spaces are designed without considering the diverse needs of all people, we inadvertently exclude millions from participating fully in society.
              </p>
              <p>
                By building inclusive environments, we unlock human potential. Accessible technology ensures that students with disabilities can learn alongside their peers. Inclusive workplaces empower individuals to contribute their skills and achieve financial independence. Comprehensive advocacy drives systemic change, creating a society where dignity, respect, and equal opportunity are the norm.
              </p>
              <p>
                At ThriveFusion Alliance Foundation, we believe that an accessible world is a better world for everyone. When we remove barriers, we don't just help persons with disabilities—we enrich our entire community with diverse perspectives and incredible talent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
