import type { Metadata } from "next";

import PageContainer from "@/components/layout/PageContainer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service | ThriveFusion Alliance Foundation",
  description: "Terms of Service for using the ThriveFusion Alliance Foundation website and platforms.",
};

export default function TermsPage() {
  const lastUpdated = "July 20, 2026";

  return (
    <main className="py-24">
      <PageContainer narrow>
        <div className="prose prose-slate dark:prose-invert max-w-none lg:prose-lg">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="text-muted-foreground font-medium">Last Updated: {lastUpdated}</p>
          
          <p className="mt-8">
            Please read these Terms of Service ("Terms") carefully before using the {siteConfig.name} 
            website and any related platforms (collectively, the "Services").
          </p>

          <h2 className="mt-12 text-2xl font-bold">1. Acceptance of Terms</h2>
          <p className="mt-4">
            By accessing or using our Services, you agree to be bound by these Terms. If you disagree 
            with any part of the terms, then you may not access the Services.
          </p>

          <h2 className="mt-12 text-2xl font-bold">2. Use of Services</h2>
          <p className="mt-4">
            Our mission is to empower persons with disabilities through accessibility and inclusion. 
            You agree to use our Services only for lawful purposes and in a way that does not infringe 
            the rights of, restrict, or inhibit anyone else's use and enjoyment of the Services.
          </p>

          <h2 className="mt-12 text-2xl font-bold">3. Intellectual Property</h2>
          <p className="mt-4">
            The content, features, and functionality of the Services are and will remain the exclusive 
            property of {siteConfig.name} and its licensors. Our trademarks and trade dress may not be 
            used in connection with any product or service without our prior written consent. Open-source 
            projects (like EqualEdge AI) are governed by their respective licenses.
          </p>

          <h2 className="mt-12 text-2xl font-bold">4. Donations</h2>
          <p className="mt-4">
            All donations are voluntary and non-refundable. Tax exemption receipts under Section 80G 
            (where applicable) will be issued based on the details provided during the transaction. 
            We are not responsible for errors resulting from incorrect information supplied by the donor.
          </p>

          <h2 className="mt-12 text-2xl font-bold">5. Limitation of Liability</h2>
          <p className="mt-4">
            In no event shall {siteConfig.name}, nor its directors, employees, partners, agents, suppliers, 
            or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
            resulting from your access to or use of or inability to access or use the Services.
          </p>

          <h2 className="mt-12 text-2xl font-bold">6. Governing Law</h2>
          <p className="mt-4">
            These Terms shall be governed and construed in accordance with the laws of India, without regard 
            to its conflict of law provisions. Any disputes will be subject to the exclusive jurisdiction of 
            the courts in Hyderabad, Telangana.
          </p>

          <h2 className="mt-12 text-2xl font-bold">7. Changes to Terms</h2>
          <p className="mt-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            By continuing to access or use our Services after those revisions become effective, you agree 
            to be bound by the revised terms.
          </p>

          <h2 className="mt-12 text-2xl font-bold">8. Contact Us</h2>
          <p className="mt-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="mt-4 rounded-xl bg-muted/50 p-6">
            <p className="font-semibold">{siteConfig.name}</p>
            <p className="mt-2">Email: <a href={`mailto:${siteConfig.email.primary}`} className="text-primary hover:underline">{siteConfig.email.primary}</a></p>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
