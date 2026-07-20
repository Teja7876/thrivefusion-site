import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "BuddyHub",
    description:
      "An accessible community platform connecting persons with disabilities, volunteers, scribes, and sign language interpreters.",
    image: "/images/gallery/Two Colleagues Work on a Computer 2.jpg",
    imageAlt:
      "Two colleagues working on a computer together, representing the BuddyHub community platform.",
    href: "/projects#buddyhub",
    status: "Active" as const,
    tags: ["Community", "Accessibility", "Platform"],
  },
  {
    title: "EqualEdge AI",
    description:
      "AI-powered accessibility assistant improving digital inclusion, document understanding, and WCAG testing.",
    image: "/images/gallery/Deb Works on her Laptop.jpg",
    imageAlt:
      "Deb working on her laptop, representing AI-powered accessibility technology.",
    href: "/ai",
    status: "In Development" as const,
    tags: ["AI", "WCAG", "Productivity"],
  },
  {
    title: "Accessibility Services",
    description:
      "Professional WCAG audits, compliance consulting, and inclusive digital transformation for organizations.",
    image: "/images/gallery/Rico in a Virtual Meeting.jpg",
    imageAlt:
      "Rico in a virtual meeting, showing remote accessibility consulting services.",
    href: "/focus-areas#digital-accessibility",
    status: "Available" as const,
    tags: ["Consulting", "WCAG", "Audit"],
  },
  {
    title: "Future Initiatives",
    description:
      "Upcoming programs focused on education, employment, assistive technology, and disability innovation.",
    image: "/images/gallery/Young Woman Wearing Headphones Works on a Laptop.jpg",
    imageAlt:
      "A young woman wearing headphones working on a laptop, representing future technology initiatives.",
    href: "/projects#future",
    status: "Coming Soon" as const,
    tags: ["Education", "Employment", "Innovation"],
  },
] as const;

const statusConfig: Record<
  typeof projects[number]["status"],
  { label: string; className: string }
> = {
  Active: {
    label: "Active",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  "In Development": {
    label: "In Development",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  Available: {
    label: "Available",
    className: "bg-primary/10 text-primary",
  },
  "Coming Soon": {
    label: "Coming Soon",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

export default function ProjectsSection() {
  return (
    <section className="py-24" aria-labelledby="projects-heading">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Projects
          </span>
          <h2
            id="projects-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Creating Real Impact
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Technology and community initiatives driving meaningful change.
          </p>
        </div>

        {/* Project Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {projects.map((project) => {
            const statusStyle = statusConfig[project.status];

            return (
              <article
                key={project.title}
                className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Status badge overlay */}
                  <div className="absolute right-3 top-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.className}`}
                    >
                      <span
                        className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"
                        aria-hidden="true"
                      />
                      {statusStyle.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold">{project.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button asChild variant="outline" size="sm" className="mt-6">
                    <Link href={project.href}>
                      Learn More
                      <ArrowRight
                        className="ml-2 h-4 w-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}