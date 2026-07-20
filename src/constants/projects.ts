export const projects = [
  {
    title: "BuddyHub",
    description:
      "An accessible community platform connecting persons with disabilities, volunteers, scribes, sign language interpreters, helpers, and organizations.",
    tagline: "Connecting abilities, building community.",
    image: "/images/gallery/Two Colleagues Work on a Computer 2.jpg",
    imageAlt:
      "Two colleagues working together on a computer, representing the BuddyHub community platform.",
    href: "/projects#buddyhub",
    status: "Active" as const,
    tags: ["Community", "Accessibility", "Platform", "Volunteering"],
    features: [
      "Connect with volunteers and scribes",
      "Sign language interpreter network",
      "Accessible event listings",
      "Peer support groups",
    ],
  },
  {
    title: "EqualEdge AI",
    description:
      "AI-powered accessibility assistant designed to improve digital inclusion, accessibility testing, document understanding, and productivity for persons with disabilities.",
    tagline: "AI that makes technology accessible.",
    image: "/images/gallery/Deb Works on her Laptop.jpg",
    imageAlt:
      "Deb working on her laptop, representing AI-powered accessibility technology.",
    href: "/ai",
    status: "In Development" as const,
    tags: ["AI", "WCAG", "Productivity", "Testing"],
    features: [
      "Automated WCAG compliance testing",
      "AI-generated alt text",
      "Document accessibility analysis",
      "Color contrast checking",
    ],
  },
  {
    title: "Accessibility Services",
    description:
      "Professional accessibility audits, WCAG compliance consulting, accessibility testing, training, and inclusive digital transformation services.",
    tagline: "Expert accessibility for every organization.",
    image: "/images/gallery/Rico in a Virtual Meeting.jpg",
    imageAlt:
      "Rico in a virtual meeting, representing remote accessibility consulting services.",
    href: "/focus-areas#digital-accessibility",
    status: "Available" as const,
    tags: ["Consulting", "WCAG", "Audit", "Training"],
    features: [
      "WCAG 2.2 AA audit reports",
      "Remediation guidance",
      "Developer training workshops",
      "Ongoing compliance monitoring",
    ],
  },
  {
    title: "Future Initiatives",
    description:
      "Upcoming programs focused on education, employment, assistive technology, digital literacy, entrepreneurship, and disability innovation.",
    tagline: "Building tomorrow's inclusive world today.",
    image: "/images/gallery/Young Woman Wearing Headphones Works on a Laptop.jpg",
    imageAlt:
      "A young woman wearing headphones working on a laptop, representing future technology initiatives.",
    href: "/projects#future",
    status: "Coming Soon" as const,
    tags: ["Education", "Employment", "Innovation", "Future"],
    features: [
      "Digital literacy bootcamps",
      "Disability entrepreneurship program",
      "Inclusive employment portal",
      "Assistive tech lending library",
    ],
  },
] as const;

export type Project = (typeof projects)[number];
export type ProjectStatus = typeof projects[number]["status"];
