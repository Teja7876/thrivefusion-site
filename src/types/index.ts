// Shared TypeScript types for ThriveFusion Alliance Foundation

export interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export interface FocusArea {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  imageAlt: string;
  slug: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  status: "Active" | "In Development" | "Available" | "Coming Soon";
  statusColor: string;
  tags: string[];
}

export interface ImpactStat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  organization: string;
  quote: string;
  image: string;
  imageAlt: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  bio: string;
}

export interface Resource {
  title: string;
  description: string;
  category: string;
  href: string;
  type: "Guide" | "Tool" | "Video" | "Article" | "Checklist";
}

export type PageMetadata = {
  title: string;
  description: string;
};
