import type { Metadata } from "next";
import Image from "next/image";
import { Users, Globe, Zap } from "lucide-react";

import { siteConfig } from "@/config/site";
import PageContainer from "@/components/layout/PageContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "About Us | ThriveFusion Alliance Foundation",
  description:
    "Learn about our story, mission, and the passionate team driving digital accessibility and inclusion in India.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-muted">
        <Image
          src="/images/gallery/Paul Presents in a Conference Room.jpg"
          alt="Paul presenting our mission in a modern conference room"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <PageContainer className="relative flex h-full items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Our Story
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              Building an accessible digital future where every ability thrives, 
              starting right here in Hyderabad.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Story & Background Section */}
      <section className="py-24" aria-labelledby="story-heading">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Who We Are
              </span>
              <h2
                id="story-heading"
                className="mt-4 text-3xl font-extrabold tracking-tight"
              >
                Rooted in Inclusion
              </h2>
              <div className="mt-6 space-y-6 text-lg text-muted-foreground">
                <p>
                  ThriveFusion Alliance Foundation was established in 2025 as a Section 8 
                  nonprofit organization headquartered in Hyderabad, Telangana. We were 
                  born from a simple realization: in an increasingly digital world, 
                  accessibility is not a luxury—it is a fundamental human right.
                </p>
                <p>
                  Our founding team comprises accessibility engineers, advocates, and 
                  community leaders who have experienced the barriers of the digital 
                  divide firsthand. Today, we bridge that gap through technology, 
                  education, and collaborative partnerships.
                </p>
              </div>
            </div>

            <div className="relative h-96 overflow-hidden rounded-3xl lg:h-[500px]">
              <Image
                src="/images/gallery/Two Colleagues in a Supervisor Meeting.jpg"
                alt="Two colleagues collaborating in an accessible workspace"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-muted/30 py-24" aria-labelledby="mvw-heading">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="mvw-heading"
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Our Core Principles
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The driving force behind everything we do.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Mission */}
            <article className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="mt-4 text-muted-foreground">
                {siteConfig.mission}
              </p>
            </article>

            {/* Vision */}
            <article className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold">Our Vision</h3>
              <p className="mt-4 text-muted-foreground">
                {siteConfig.vision}
              </p>
            </article>

            {/* Values */}
            <article className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold">Our Values</h3>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                {siteConfig.values.map((value) => (
                  <li key={value} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {value}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </PageContainer>
      </section>

      {/* Leadership & Team */}
      <section className="py-24" aria-labelledby="leadership-heading">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 relative h-96 overflow-hidden rounded-3xl lg:h-[500px]">
              <Image
                src="/images/gallery/Zinyra in a Meeting with her Manager.jpg"
                alt="Leadership team discussing accessibility strategy"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Our Team
              </span>
              <h2
                id="leadership-heading"
                className="mt-4 text-3xl font-extrabold tracking-tight"
              >
                Led by Experience
              </h2>
              <div className="mt-6 text-lg text-muted-foreground">
                <p>
                  Our leadership team is united by a shared passion for digital equity. 
                  With decades of combined experience in software engineering, accessibility 
                  compliance, and non-profit management, we are uniquely positioned to drive 
                  systemic change.
                </p>
                <p className="mt-4">
                  We believe that the most effective solutions are built in collaboration 
                  with the communities they serve. That's why our advisory board includes 
                  persons with disabilities, educators, and industry experts.
                </p>
              </div>

              {/* Accessible Accordion for Registration Details */}
              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">Organization Details</h3>
                <Accordion className="w-full">
                  <AccordionItem value="registration">
                    <AccordionTrigger>Registration Information</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pt-2">
                        <li><strong>Type:</strong> {siteConfig.registration}</li>
                        <li><strong>Founded:</strong> {siteConfig.founded}</li>
                        <li><strong>CIN:</strong> {siteConfig.cin}</li>
                        <li><strong>PAN:</strong> {siteConfig.pan}</li>
                        <li><strong>Location:</strong> {siteConfig.address.city}, {siteConfig.address.state}, {siteConfig.address.country}</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
