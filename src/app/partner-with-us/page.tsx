import type { Metadata } from "next";
import Image from "next/image";
import { Building2, GraduationCap, HeartHandshake, Landmark, ArrowRight } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnifiedContactForm } from "@/components/forms/UnifiedContactForm";

export const metadata: Metadata = {
  title: "Partner With Us | ThriveFusion Alliance Foundation",
  description:
    "Partner with ThriveFusion Alliance Foundation. We collaborate with corporations, NGOs, governments, and academic institutions to drive accessibility and inclusion.",
};

const partnershipTypes = [
  {
    title: "Corporate CSR",
    description: "Fulfill your Corporate Social Responsibility mandate by funding digital accessibility and inclusive education programs.",
    icon: Building2,
  },
  {
    title: "NGO Collaboration",
    description: "Partner with us to bring accessibility solutions and assistive technology to the communities you serve.",
    icon: HeartHandshake,
  },
  {
    title: "Government & Policy",
    description: "Collaborate on policy advocacy, systemic accessibility improvements, and large-scale inclusion initiatives.",
    icon: Landmark,
  },
  {
    title: "Academic & Research",
    description: "Join forces to research assistive technologies, accessibility testing, and inclusive design standards.",
    icon: GraduationCap,
  },
];

export default function PartnerPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-muted">
        <Image
          src="/images/gallery/Two Colleagues in a Supervisor Meeting.jpg"
          alt="Colleagues discussing a partnership in an accessible meeting space"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <PageContainer className="relative flex h-full items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Partner With Us
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              True inclusion requires collaboration. Let's work together to dismantle 
              barriers and create a society where everyone thrives.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Why Partner / Partnership Types */}
      <section className="py-24" aria-labelledby="partnership-types-heading">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="partnership-types-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ways to Collaborate
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We offer flexible partnership models tailored to your organization's goals and strengths.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {partnershipTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.title}
                  className="group rounded-2xl border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold">{type.title}</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* Partnership Inquiry Form */}
      <section className="bg-muted/30 py-24" aria-labelledby="partnership-form-heading">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative hidden h-full min-h-[600px] overflow-hidden rounded-3xl shadow-xl lg:block">
              <Image
                src="/images/gallery/Jonathan Speaks in a Meeting.jpg"
                alt="Jonathan speaking passionately in a meeting about accessibility partnerships"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
            </div>

            <div className="rounded-3xl border bg-card p-8 shadow-sm sm:p-10">
              <h2 id="partnership-form-heading" className="text-3xl font-extrabold tracking-tight">
                Start a Conversation
              </h2>
              <p className="mt-4 text-muted-foreground">
                Leave your details and our partnership team will reach out within 2 business days.
              </p>

              <UnifiedContactForm defaultType="Partnership" />
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
