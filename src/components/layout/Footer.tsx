import Link from '@/components/ui/link';
import {
  Mail,
  Phone,
  MapPin,
    } from "lucide-react";

import { siteConfig } from "@/config/site";

// SVG Icons for socials
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 7.1C2.5 7.1 2.5 7 2.6 6.9c.2-.8.8-1.4 1.6-1.6C6.1 5 12 5 12 5s5.9 0 7.8.3c.8.2 1.4.8 1.6 1.6.1.1.1.2.1.3C22 9.1 22 12 22 12s0 2.9-.5 4.8c-.1.1-.1.2-.1.3-.2.8-.8 1.4-1.6 1.6-1.9.3-7.8.3-7.8.3s-5.9 0-7.8-.3c-.8-.2-1.4-.8-1.6-1.6-.1-.1-.1-.2-.1-.3C2 14.9 2 12 2 12s0-2.9.5-4.8z"/><path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"/></svg>
);
import { Separator } from "@/components/ui/separator";

const aboutLinks = [
  { title: "About Us", href: "/about" },
  { title: "Focus Areas", href: "/focus-areas" },
  { title: "Our Projects", href: "/projects" },
  { title: "Resources", href: "/resources" },
  { title: "EqualEdge AI", href: "/ai" },
];

const getInvolvedLinks = [
  { title: "Volunteer", href: "/volunteer" },
  { title: "Partner With Us", href: "/partner-with-us" },
  { title: "Donate", href: "/donate" },
  { title: "Contact", href: "/contact" },
];

const legalLinks = [
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Service", href: "/terms" },
  { title: "Accessibility Statement", href: "/accessibility" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: LinkedinIcon,
  },
  {
    label: "YouTube",
    href: siteConfig.social.youtube,
    icon: YoutubeIcon,
  },
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    icon: FacebookIcon,
  },
].filter((s) => Boolean(s.href));

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/20" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Organization */}
          <section aria-labelledby="footer-org" className="lg:col-span-1">
            <h2
              id="footer-org"
              className="text-xl font-extrabold tracking-tight text-primary"
            >
              {siteConfig.shortName}
            </h2>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Alliance Foundation
            </p>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {siteConfig.description}
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${siteConfig.name} on ${label} (opens in new tab)`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* About */}
          <nav aria-labelledby="footer-about">
            <h2
              id="footer-about"
              className="text-sm font-semibold uppercase tracking-wider text-foreground"
            >
              About
            </h2>

            <ul className="mt-4 space-y-3" role="list">
              {aboutLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get Involved */}
          <nav aria-labelledby="footer-get-involved">
            <h2
              id="footer-get-involved"
              className="text-sm font-semibold uppercase tracking-wider text-foreground"
            >
              Get Involved
            </h2>

            <ul className="mt-4 space-y-3" role="list">
              {getInvolvedLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      item.title === "Donate" 
                        ? "text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
                        : "text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
                    }
                  >
                    {item.title === "Donate" ? "Donate Now ↗" : item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <section aria-labelledby="footer-contact">
            <h2
              id="footer-contact"
              className="text-sm font-semibold uppercase tracking-wider text-foreground"
            >
              Contact Us
            </h2>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <a
                    href={`mailto:${siteConfig.email.primary}`}
                    className="block text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {siteConfig.email.primary}
                  </a>
                  <a
                    href={`mailto:${siteConfig.email.secondary}`}
                    className="block text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {siteConfig.email.secondary}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <a
                    href={`tel:${siteConfig.phone.primary.replace(/\s/g, "")}`}
                    className="block text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {siteConfig.phone.primary}
                  </a>
                  <a
                    href={`tel:${siteConfig.phone.secondary.replace(/\s/g, "")}`}
                    className="block text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    {siteConfig.phone.secondary}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <address className="not-italic text-muted-foreground">
                  {siteConfig.address.city},{" "}
                  {siteConfig.address.state},{" "}
                  {siteConfig.address.country}
                </address>
              </div>
            </div>

            <div className="mt-6 space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">CIN:</span>{" "}
                {siteConfig.cin}
              </p>
              <p>
                <span className="font-medium">PAN:</span>{" "}
                {siteConfig.pan}
              </p>
            </div>
            
            <div className="mt-4 rounded-xl border bg-primary/5 p-4">
              <p className="text-xs font-semibold text-primary">
                {siteConfig.registration}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Founded {siteConfig.founded} · Hyderabad, India
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator />
      <div className="container mx-auto px-4 py-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground lg:flex-row">
          <p className="text-center lg:text-left">
            © {currentYear}{" "}
            <span className="font-medium text-foreground">
              {siteConfig.name}
            </span>
            . All rights reserved.
          </p>

          <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-4">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <p className="text-center lg:text-right max-w-sm">
            Building a more accessible and inclusive future through education, technology, employment, and advocacy.
          </p>
        </div>
      </div>
    </footer>
  );
}