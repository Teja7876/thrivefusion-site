import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import { projects } from "@/constants/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Projects & Initiatives | ThriveFusion Alliance Foundation",
  description:
    "Discover our active programs, including BuddyHub, EqualEdge AI, and accessibility services driving impact across India.",
};

const statusConfig = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "In Development": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Available: "bg-primary/10 text-primary",
  "Coming Soon": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
} as const;

export default function ProjectsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-muted/30 py-20 text-center">
        <PageContainer narrow>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Work
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Projects & Initiatives
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            From community platforms to AI-powered accessibility tools, 
            explore the solutions we're building for a more inclusive world.
          </p>
        </PageContainer>
      </section>

      {/* Projects List */}
      <section className="py-24">
        <PageContainer>
          <div className="flex flex-col gap-24">
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;
              const statusClass = statusConfig[project.status];
              // Use a sanitized ID from title for anchors if slug is missing
              const sectionId = project.title.toLowerCase().replace(/\s+/g, '-');

              return (
                <article
                  key={project.title}
                  id={sectionId}
                  className="group scroll-mt-24"
                >
                  <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                    {/* Image */}
                    <div
                      className={`relative h-[300px] sm:h-[400px] w-full overflow-hidden rounded-3xl shadow-xl lg:h-[500px] ${
                        !isEven ? "lg:col-start-7 lg:col-end-13 lg:order-2" : "lg:col-start-1 lg:col-end-7 lg:order-1"
                      }`}
                    >
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    {/* Content */}
                    <div
                      className={`${
                        !isEven ? "lg:col-start-1 lg:col-end-6 lg:order-1" : "lg:col-start-8 lg:col-end-13 lg:order-2"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                        >
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                          {project.status}
                        </span>
                      </div>

                      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        {project.title}
                      </h2>
                      
                      <p className="mt-2 text-lg font-medium text-primary">
                        {project.tagline}
                      </p>

                      <p className="mt-6 text-lg text-muted-foreground">
                        {project.description}
                      </p>

                      <Separator className="my-8" />

                      <div>
                        <h3 className="font-semibold">Key Features</h3>
                        <ul className="mt-4 space-y-3">
                          {project.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                              </span>
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-10">
                        <Button asChild size="lg">
                          {project.href.startsWith("http") ? (
                            <a href={project.href} target="_blank" rel="noopener noreferrer">
                              Visit Project Site
                              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                            </a>
                          ) : (
                            <Link href={project.href}>
                              Learn More
                              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                            </Link>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </PageContainer>
      </section>
    </main>
  );
}