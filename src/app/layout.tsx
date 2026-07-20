import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FocusManager } from "@/components/providers/FocusManager";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  keywords: [
    "Accessibility",
    "Disability Inclusion",
    "WCAG",
    "Assistive Technology",
    "Inclusive Education",
    "Employment",
    "EqualEdge AI",
    "BuddyHub",
    "Digital Accessibility",
    "NGO India",
    "Section 8 Company",
    "ThriveFusion",
    "Disability Rights",
    "Hyderabad",
    "Telangana",
  ],

  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },

  alternates: {
    canonical: siteConfig.url,
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable, "font-sans")}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <ThemeProvider>
          {/* Skip to main content — WCAG 2.4.1 */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <FocusManager />
          <Header />

          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}