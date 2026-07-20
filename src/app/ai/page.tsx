
import Image from '@/components/ui/image';
import Link from '@/components/ui/link';
import { 
  Bot, 
  FileText, 
  Keyboard, 
  Type, 
  Palette, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



const features = [
  {
    title: "WCAG Accessibility Testing",
    description: "Automated analysis of web pages to identify and fix WCAG 2.2 AA conformance issues.",
    icon: CheckCircle2,
  },
  {
    title: "Document Accessibility",
    description: "Convert complex PDFs and documents into semantic, screen-reader friendly formats.",
    icon: FileText,
  },
  {
    title: "Keyboard Navigation Analysis",
    description: "Simulate and verify logical focus order and keyboard operability.",
    icon: Keyboard,
  },
  {
    title: "Alt Text Generation",
    description: "Context-aware AI generation of descriptive alternative text for complex images.",
    icon: Type,
  },
  {
    title: "Color Contrast Checking",
    description: "Advanced color contrast validation including text over images and gradients.",
    icon: Palette,
  },
];

export default function AIPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-muted">
        <Image
          src="/images/gallery/Deb Works on her Laptop.jpg"
          alt="Professional working efficiently with AI assistive technology"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <PageContainer className="relative flex h-full items-center">
          <div className="max-w-2xl text-white">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="bg-primary/20 text-white hover:bg-primary/30 border-white/10">
                <Bot className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                ThriveFusion Lab
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                In Development
              </Badge>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              EqualEdge AI
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              An open-source, AI-powered accessibility assistant designed to scale 
              digital inclusion and empower persons with disabilities.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8 font-semibold shadow-lg shadow-primary/30">
                <Link href="/contact">
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Features Section */}
      <section className="py-24" aria-labelledby="features-heading">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="features-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Intelligent Accessibility
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              EqualEdge AI acts as a co-pilot for developers, designers, and users, 
              automating the most time-consuming aspects of digital inclusion.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* Roadmap / Status Section */}
      <section className="bg-muted/30 py-24" aria-labelledby="status-heading">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative h-96 w-full overflow-hidden rounded-3xl shadow-lg lg:h-[500px]">
              <Image
                src="/images/gallery/Esmeralda Works on her Laptop.jpg"
                alt="Developer working on accessibility code and AI algorithms"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Development Roadmap
              </span>
              <h2 id="status-heading" className="mt-4 text-3xl font-extrabold tracking-tight">
                Current Status
              </h2>
              
              <div className="mt-8 space-y-8 text-muted-foreground">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="mt-2 h-full w-px bg-primary/30" />
                  </div>
                  <div className="pb-8">
                    <h3 className="text-lg font-bold text-foreground">Phase 1: Alpha Testing</h3>
                    <p className="mt-2">Internal testing of computer vision models for alt-text generation and layout analysis.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                    </div>
                    <div className="mt-2 h-full w-px bg-border" />
                  </div>
                  <div className="pb-8">
                    <h3 className="text-lg font-bold text-foreground">Phase 2: Private Beta</h3>
                    <p className="mt-2">Inviting select organizations to integrate EqualEdge AI into their CI/CD pipelines.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Phase 3: Public Release</h3>
                    <p className="mt-2">Open-source release of the core engine for the global accessibility community.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
