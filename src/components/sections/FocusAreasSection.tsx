import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  BookOpen,
  Briefcase,
  Laptop,
  Scale,
  Users,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const focusAreas = [
  {
    title: "Digital Accessibility",
    tagline: "Websites and apps for everyone.",
    icon: Accessibility,
    image: "/images/gallery/Businesswoman in an Office.jpg",
    imageAlt:
      "A businesswoman working confidently in an office, representing digital inclusion.",
    href: "/focus-areas#digital-accessibility",
    color: "from-violet-500/20 to-primary/10",
  },
  {
    title: "Inclusive Education",
    tagline: "Learning without barriers.",
    icon: BookOpen,
    image: "/images/gallery/A Mentor and Mentee Work Together.jpg",
    imageAlt:
      "A mentor and mentee collaborating, representing inclusive and accessible education.",
    href: "/focus-areas#inclusive-education",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    title: "Assistive Technology",
    tagline: "Tools that enable independence.",
    icon: Laptop,
    image: "/images/gallery/Businessman Uses Text to Speech on his Phone.jpg",
    imageAlt:
      "A businessman using text-to-speech on his phone, demonstrating assistive technology in action.",
    href: "/focus-areas#assistive-technology",
    color: "from-teal-500/20 to-green-500/10",
  },
  {
    title: "Employment & Skills",
    tagline: "Careers that are truly accessible.",
    icon: Briefcase,
    image: "/images/gallery/Mike Works in an Office.jpg",
    imageAlt:
      "Mike working productively in an office, representing inclusive employment opportunities.",
    href: "/focus-areas#employment",
    color: "from-amber-500/20 to-orange-500/10",
  },
  {
    title: "Advocacy",
    tagline: "Rights, policy, and systemic change.",
    icon: Scale,
    image: "/images/gallery/Paul Presents in a Conference Room.jpg",
    imageAlt:
      "Paul presenting in a conference room, illustrating advocacy and leadership in disability rights.",
    href: "/focus-areas#advocacy",
    color: "from-rose-500/20 to-pink-500/10",
  },
  {
    title: "Community Support",
    tagline: "Together, we're stronger.",
    icon: Users,
    image:
      "/images/gallery/A Group of Diverse Colleagues Work Together in an Office.jpg",
    imageAlt:
      "A diverse group of colleagues collaborating in an office, showing inclusive community support.",
    href: "/focus-areas#community",
    color: "from-indigo-500/20 to-violet-500/10",
  },
] as const;

export default function FocusAreasSection() {
  return (
    <section
      className="bg-muted/20 py-24"
      aria-labelledby="focus-areas-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            What We Do
          </span>
          <h2
            id="focus-areas-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Our Focus Areas
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Six interconnected pillars working together to build a truly
            inclusive society.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {focusAreas.map((area) => {
            const Icon = area.icon;

            return (
              <article
                key={area.title}
                className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={area.image}
                    alt={area.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  {/* Icon badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
                      <Icon
                        className="h-5 w-5 text-primary-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold">{area.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {area.tagline}
                  </p>

                  <Link
                    href={area.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    aria-label={`Learn more about ${area.title}`}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/focus-areas">
              View All Focus Areas
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}