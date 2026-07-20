import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Accessibility Statement | ThriveFusion Alliance Foundation",
  description: "Our commitment to digital accessibility and WCAG 2.2 AA compliance.",
};

export default function AccessibilityPage() {
  const lastUpdated = "July 20, 2026";

  return (
    <main className="py-24">
      <PageContainer narrow>
        <div className="prose prose-slate dark:prose-invert max-w-none lg:prose-lg">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Accessibility Statement</h1>
          <p className="text-muted-foreground font-medium">Last Updated: {lastUpdated}</p>
          
          <p className="mt-8">
            {siteConfig.name} is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant accessibility standards 
            as core principles of our organization.
          </p>

          <h2 className="mt-12 text-2xl font-bold">Conformance Status</h2>
          <p className="mt-4 flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-green-500" aria-hidden="true" />
            <span>
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve 
              accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. 
              <strong> The {siteConfig.name} website is partially conformant with WCAG 2.2 level AA. </strong> 
              Partially conformant means that some parts of the content do not fully conform to the accessibility standard yet, 
              though we are actively working to resolve these known issues.
            </span>
          </p>

          <h2 className="mt-12 text-2xl font-bold">Feedback</h2>
          <p className="mt-4">
            We welcome your feedback on the accessibility of our website and digital tools. Please let us know if you 
            encounter accessibility barriers on any of our platforms:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Phone: <a href={`tel:${siteConfig.phone.primary.replace(/\s/g, "")}`}>{siteConfig.phone.primary}</a></li>
            <li>E-mail: <a href={`mailto:${siteConfig.email.primary}`}>{siteConfig.email.primary}</a></li>
            <li>Postal Address: {siteConfig.address.city}, {siteConfig.address.state}, {siteConfig.address.country}</li>
          </ul>
          <p className="mt-4">We try to respond to feedback within 2 business days.</p>

          <h2 className="mt-12 text-2xl font-bold">Technical Specifications</h2>
          <p className="mt-4">
            Accessibility of our website relies on the following technologies to work with the particular combination of web browser 
            and any assistive technologies or plugins installed on your computer:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>HTML</li>
            <li>WAI-ARIA</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
          <p className="mt-4">
            These technologies are relied upon for conformance with the accessibility standards used.
          </p>

          <h2 className="mt-12 text-2xl font-bold">Known Limitations</h2>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/20">
            <h3 className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
              Current areas of improvement:
            </h3>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-amber-900 dark:text-amber-200">
              <li>Some older PDF documents may not be fully optimized for screen readers. We are in the process of converting these to accessible HTML pages.</li>
              <li>Certain third-party embedded videos may lack comprehensive audio descriptions.</li>
            </ul>
            <p className="mt-4 text-sm text-amber-800 dark:text-amber-300">
              If you need assistance with any of these items, please contact us for an alternative format.
            </p>
          </div>

          <h2 className="mt-12 text-2xl font-bold">Assessment Approach</h2>
          <p className="mt-4">
            {siteConfig.name} assessed the accessibility of this website by the following approaches:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Self-evaluation by our internal accessibility engineering team.</li>
            <li>Testing with popular screen readers (NVDA, JAWS, VoiceOver).</li>
            <li>Automated testing using our upcoming <Link href="/ai" className="text-primary hover:underline">EqualEdge AI</Link> toolset.</li>
          </ul>
        </div>
      </PageContainer>
    </main>
  );
}
