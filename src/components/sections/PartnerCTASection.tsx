import Image from '@/components/ui/image';
import Link from '@/components/ui/link';
import { ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PartnerCTASection() {
  return (
    <section className="bg-primary/5 py-24" aria-labelledby="partner-cta-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Collaboration
            </div>
            <h2
              id="partner-cta-heading"
              className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Partner With Us
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              True inclusion requires collaboration. We partner with corporations, educational institutions, NGOs, and government bodies to amplify our impact. Whether through CSR initiatives, joint research, or community outreach, we can achieve more together.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/partner-with-us">
                  Explore Partnership Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Image */}
          <div className="order-1 overflow-hidden rounded-3xl shadow-xl lg:order-2">
            <Image
              src="/images/gallery/Two Colleagues in a Meeting.jpg"
              alt="Two colleagues discussing partnership opportunities in a meeting"
              width={800}
              height={560}
              className="h-72 w-full object-cover sm:h-96 lg:h-[420px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
