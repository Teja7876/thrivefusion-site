import type { Metadata } from "next";
import Image from "next/image";
import { CreditCard, HeartHandshake, ShieldCheck, FileText } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Donate | ThriveFusion Alliance Foundation",
  description:
    "Support ThriveFusion Alliance Foundation. Your tax-deductible donation empowers persons with disabilities through accessibility, education, and technology.",
};

const donationTiers = [
  { amount: "₹500", desc: "Provides learning materials for one student" },
  { amount: "₹1,000", desc: "Funds accessibility training for a developer" },
  { amount: "₹2,500", desc: "Supports assistive technology setup" },
  { amount: "₹5,000", desc: "Sponsors a student's technical education" },
];

export default function DonatePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-muted">
        <Image
          src="/images/gallery/Businesswoman in an Office.jpg"
          alt="Businesswoman confidently working in her office, empowered by accessible technology"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <PageContainer className="relative flex h-full items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Make an Impact
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              Your donation empowers persons with disabilities through inclusive 
              education, assistive technology, and career opportunities.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Donation Tiers */}
      <section className="bg-muted/30 py-24 text-center">
        <PageContainer>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Support Our Work
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Choose Your Contribution
          </h2>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {donationTiers.map((tier) => (
              <div
                key={tier.amount}
                className="group relative flex flex-col rounded-3xl border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
              >
                <div className="flex-1">
                  <p className="text-4xl font-extrabold text-primary">{tier.amount}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{tier.desc}</p>
                </div>
                <Button className="mt-8 w-full group-hover:bg-primary" variant="outline">
                  Donate {tier.amount}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button size="lg" className="rounded-full px-8 text-lg">
              <CreditCard className="mr-2 h-5 w-5" aria-hidden="true" />
              Custom Amount / General Donation
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              You will be redirected to our secure payment gateway (Razorpay).
            </p>
          </div>
        </PageContainer>
      </section>

      {/* How Donations Are Used & Legal */}
      <section className="py-24" aria-labelledby="transparency-heading">
        <PageContainer>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 id="transparency-heading" className="text-3xl font-extrabold tracking-tight">
                Financial Transparency
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We believe in complete transparency. Here is how your contributions are allocated to maximize impact:
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Program Delivery & Education</span>
                    <span>60%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: "60%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Operations & Staff</span>
                    <span>25%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary/70" style={{ width: "25%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>R&D (Assistive Tech & EqualEdge AI)</span>
                    <span>15%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary/40" style={{ width: "15%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-muted/20 p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <ShieldCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
                Tax Exemption & Legal
              </h3>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  ThriveFusion Alliance Foundation is registered as a {siteConfig.registration}. 
                  All donations are strictly utilized for charitable purposes.
                </p>
                <div className="flex items-start gap-3 rounded-xl bg-card p-4 border">
                  <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">80G Tax Exemption</p>
                    <p className="mt-1 text-sm">
                      Donations made by Indian residents are eligible for tax deduction under Section 80G of the Income Tax Act.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-card p-4 border">
                  <HeartHandshake className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">Bank Transfer Details</p>
                    <div className="mt-2 text-sm space-y-1 font-mono">
                      <p>Name: ThriveFusion Alliance Foundation</p>
                      <p>A/C: XXXXXXXXXXXXXXXX</p>
                      <p>IFSC: XXXXX0000XXX</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Feature Image Section */}
      <section className="pb-24">
        <PageContainer>
          <div className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/gallery/Two Colleagues Collaborate on a Computer.jpg"
              alt="Colleagues collaborating, showing the human impact of your donations"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 p-8 text-white sm:p-12">
              <p className="text-2xl font-bold sm:text-3xl">
                "Together, we build a world where ability is not defined by barriers."
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
