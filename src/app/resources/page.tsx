import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Monitor, Smartphone, Video, FileText, CheckSquare, ExternalLink } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Accessibility Resources | ThriveFusion Alliance Foundation",
  description:
    "Curated guides, tools, tutorials, and checklists for building accessible digital experiences.",
};

const categories = ["All", "Guides", "Tools", "Videos", "Checklists"];

const resources = [
  {
    title: "WCAG 2.2 AA Developer Guide",
    category: "Guides",
    description: "A practical developer's handbook for implementing WCAG 2.2 criteria in modern web frameworks.",
    icon: CodeIcon,
  },
  {
    title: "Screen Reader Testing Basics",
    category: "Videos",
    description: "Learn how to use NVDA and VoiceOver to validate your digital products.",
    icon: Video,
  },
  {
    title: "Accessible Document Publishing",
    category: "Guides",
    description: "Step-by-step instructions for creating accessible PDFs from Word and Google Docs.",
    icon: FileText,
  },
  {
    title: "Color Contrast Analyzer",
    category: "Tools",
    description: "A free tool to test foreground/background contrast ratios for web and mobile.",
    icon: Monitor,
  },
  {
    title: "Mobile Accessibility Checklist",
    category: "Checklists",
    description: "Essential checks for iOS and Android app accessibility compliance.",
    icon: Smartphone,
  },
  {
    title: "Keyboard Navigation Tester",
    category: "Tools",
    description: "Automated scanner for focus traps, missing focus outlines, and logical tab order.",
    icon: KeyboardIcon,
  },
  {
    title: "Designing for Cognitive Disabilities",
    category: "Guides",
    description: "Best practices for writing clear copy, simplifying navigation, and reducing cognitive load.",
    icon: BookOpen,
  },
  {
    title: "Component Accessibility Audit",
    category: "Checklists",
    description: "Audit template for testing UI components like modals, dropdowns, and accordions.",
    icon: CheckSquare,
  },
  {
    title: "Intro to ARIA Roles",
    category: "Videos",
    description: "Understanding when (and when not) to use ARIA attributes in HTML.",
    icon: Video,
  }
];

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  );
}
function KeyboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 12h.01"/><path d="M11 12h.01"/><path d="M15 12h.01"/><path d="M18 12h.01"/><path d="M9 16h6"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
  );
}

export default function ResourcesPage() {
  return (
    <main>
      <section className="bg-muted/30 py-20 text-center">
        <PageContainer narrow>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Knowledge Base
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Accessibility Resources
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            Tools, guides, and checklists to help you build an inclusive digital world.
          </p>
        </PageContainer>
      </section>

      <section className="py-24" aria-labelledby="resources-heading">
        <PageContainer>
          <h2 id="resources-heading" className="sr-only">Resource Collection</h2>
          
          {/* Static categories for UI (filter logic would normally be client-side) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.title}
                  className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <Badge variant="secondary">{resource.category}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold">{resource.title}</h3>
                  <p className="mt-2 flex-1 text-muted-foreground">
                    {resource.description}
                  </p>
                  
                  <a
                    href="#"
                    className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Access Resource
                    <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      <section className="bg-primary/5 py-24" aria-labelledby="featured-resource">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge>Featured Resource</Badge>
              <h2 id="featured-resource" className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                The State of Digital Inclusion in India (2025)
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our comprehensive annual report analyzing the accessibility landscape across 
                government services, educational platforms, and private sector applications.
              </p>
              <a
                href="#"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Download Full Report (PDF)
              </a>
            </div>

            <div className="relative h-80 overflow-hidden rounded-3xl shadow-xl lg:h-[400px]">
              <Image
                src="/images/gallery/Woman Navigates a Tablet.jpg"
                alt="Woman navigating a tablet device comfortably using accessible gestures"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
