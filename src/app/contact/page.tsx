
import Image from '@/components/ui/image';
import { Mail, Phone, MapPin } from "lucide-react";

import { siteConfig } from "@/config/site";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnifiedContactForm } from "@/components/forms/UnifiedContactForm";



export default function ContactPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-muted/30 py-20 text-center">
        <PageContainer narrow>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Connect With Us
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            Whether you want to partner, volunteer, or just learn more about our 
            accessibility initiatives, we'd love to hear from you.
          </p>
        </PageContainer>
      </section>

      <section className="py-24" aria-labelledby="contact-details">
        <PageContainer>
          <h2 id="contact-details" className="sr-only">Contact Details and Form</h2>
          
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Info & Image */}
            <div className="flex flex-col">
              <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-md sm:h-80">
                <Image
                  src="/images/gallery/Professional in a Virtual Meeting.jpg"
                  alt="Professional communicating in an accessible virtual meeting"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="mt-1 text-muted-foreground">
                      <a href={`mailto:${siteConfig.email.primary}`} className="hover:text-primary">
                        {siteConfig.email.primary}
                      </a>
                    </p>
                    {siteConfig.email.secondary && (
                      <p className="mt-1 text-muted-foreground">
                        <a href={`mailto:${siteConfig.email.secondary}`} className="hover:text-primary">
                          {siteConfig.email.secondary}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="mt-1 text-muted-foreground">
                      <a href={`tel:${siteConfig.phone.primary}`} className="hover:text-primary">
                        {siteConfig.phone.primary}
                      </a>
                    </p>
                    {siteConfig.phone.secondary && (
                      <p className="mt-1 text-muted-foreground">
                        <a href={`tel:${siteConfig.phone.secondary}`} className="hover:text-primary">
                          {siteConfig.phone.secondary}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Headquarters</h3>
                    <p className="mt-1 text-muted-foreground">
                      {siteConfig.address.city}, {siteConfig.address.state}<br />
                      {siteConfig.address.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border bg-card p-8 shadow-sm sm:p-10">
              <UnifiedContactForm defaultType="General Contact" />
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
