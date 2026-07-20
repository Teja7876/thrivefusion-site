"use client";

import { useState } from "react";
import Image from '@/components/ui/image';
import { ChevronDown, Target, Eye, HeartHandshake } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: string[] | readonly string[];
}

interface MissionBlock {
  id: string;
  eyebrow: string;
  heading: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  imageAlt: string;
  imageOnLeft: boolean;
  items: AccordionItem[];
}

const blocks: MissionBlock[] = [
  {
    id: "mission",
    eyebrow: "Who We Are",
    heading: "Our Mission",
    icon: Target,
    image:
      "/images/gallery/Deb and Israel in an Accessibility Solutions Center.jpg",
    imageAlt:
      "Deb and Israel working together in an accessibility solutions center.",
    imageOnLeft: true,
    items: [
      {
        id: "mission-what",
        title: "What We Do",
        content: [
          "Remove barriers for persons with disabilities",
          "Deliver accessible technology solutions",
          "Provide inclusive education and mentorship",
          "Advocate for disability rights at every level",
        ],
      },
      {
        id: "mission-how",
        title: "How We Work",
        content: [
          "Community-centered, grassroots approach",
          "Technology-driven accessibility programs",
          "Collaboration with governments and NGOs",
          "Evidence-based impact measurement",
        ],
      },
      {
        id: "mission-why",
        title: "Why It Matters",
        content: [
          siteConfig.mission,
        ],
      },
    ],
  },
  {
    id: "vision",
    eyebrow: "Where We're Going",
    heading: "Our Vision",
    icon: Eye,
    image: "/images/gallery/Jonathan Speaks in a Meeting.jpg",
    imageAlt:
      "Jonathan speaking confidently in a meeting, representing inclusive leadership.",
    imageOnLeft: false,
    items: [
      {
        id: "vision-india",
        title: "Inclusive India 2030",
        content: [
          "Equal access to education for every disability type",
          "Technology accessible to all income levels",
          "Disability-inclusive workplaces nationwide",
          "Barrier-free public infrastructure",
        ],
      },
      {
        id: "vision-global",
        title: "Global Impact",
        content: [
          "Open-source accessibility tools adopted worldwide",
          "International partnerships for disability inclusion",
          "Research and policy advocacy at global forums",
        ],
      },
    ],
  },
  {
    id: "values",
    eyebrow: "What Guides Us",
    heading: "Our Values",
    icon: HeartHandshake,
    image: "/images/gallery/Tricia Presents Data to her Team.jpg",
    imageAlt:
      "Tricia presenting data to her team, reflecting transparency and shared goals.",
    imageOnLeft: true,
    items: [
      {
        id: "values-core",
        title: "Core Principles",
        content: siteConfig.values,
      },
      {
        id: "values-approach",
        title: "Our Approach",
        content: [
          "Nothing about us without us — disability-led decisions",
          "Universal design in everything we build",
          "Continuous learning and adaptation",
          "Open, transparent reporting to stakeholders",
        ],
      },
    ],
  },
];

interface SimpleAccordionProps {
  items: AccordionItem[];
  blockId: string;
}

function SimpleAccordion({ items, blockId }: SimpleAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `${blockId}-trigger-${item.id}`;
        const panelId = `${blockId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            <button
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={cn(
                "flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                "hover:bg-accent/50",
                isOpen && "bg-primary/5 text-primary"
              )}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180 text-primary"
                )}
                aria-hidden="true"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn(
                "overflow-hidden transition-all duration-200",
                isOpen ? "max-h-96" : "max-h-0"
              )}
            >
              <ul className="space-y-2 px-5 pb-5 pt-2">
                {item.content.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MissionSection() {
  return (
    <section className="py-24" aria-label="Mission, Vision and Values">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            About ThriveFusion
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Building an Inclusive Society
          </h2>
        </div>

        {/* Alternating blocks */}
        <div className="mt-20 space-y-24">
          {blocks.map((block) => {
            const Icon = block.icon;

            return (
              <article
                key={block.id}
                className={cn(
                  "grid items-center gap-12 lg:grid-cols-2",
                  !block.imageOnLeft && "lg:[&>*:first-child]:order-2"
                )}
              >
                {/* Image */}
                <div
                  className={cn(
                    "overflow-hidden rounded-3xl shadow-xl",
                    !block.imageOnLeft && "lg:order-2"
                  )}
                >
                  <Image
                    src={block.image}
                    alt={block.imageAlt}
                    width={800}
                    height={560}
                    className="h-72 w-full object-cover sm:h-96 lg:h-[420px]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Content */}
                <div className={cn(!block.imageOnLeft && "lg:order-1")}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {block.eyebrow}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {block.heading}
                  </h3>

                  <div className="mt-6">
                    <SimpleAccordion items={block.items} blockId={block.id} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}