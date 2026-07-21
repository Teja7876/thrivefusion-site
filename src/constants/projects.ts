export const projects = [
  {
    title: "Thrive Assist",
    description:
      "An accessibility-first platform connecting Persons with Disabilities (PwDs) with trusted helpers, volunteers, scribes, sign language interpreters, caregivers, mobility assistants, and mentors through real-time requests and location-aware assistance.",
    tagline: "Empowering independence through connected communities.",
    image: "/images/gallery/Two Colleagues Work on a Computer 2.jpg",
    imageAlt: "Two colleagues working together on a computer, representing community assistance.",
    href: "/projects#thrive-assist",
    status: "Active" as const,
    tags: ["Community", "Volunteers", "Scribes", "Real-time"],
    features: [
      "Real-time assistance requests",
      "Sign language interpreter network",
      "Location-aware matching",
      "Secure messaging & scheduling",
    ],
  },
  {
    title: "Meatly",
    description:
      "A modern accessibility-first video conferencing platform built as an inclusive alternative to Zoom and Teams. Features screen reader optimization, keyboard accessibility, AI meeting assistance, live captions, and sign language support.",
    tagline: "Meetings where everyone has a voice.",
    image: "/images/gallery/Rico in a Virtual Meeting.jpg",
    imageAlt: "Professional in a virtual meeting, representing accessible video conferencing.",
    href: "/projects#meatly",
    status: "Available" as const,
    tags: ["Video Conferencing", "Captions", "Accessible", "AI"],
    features: [
      "Screen reader & keyboard optimized",
      "Live captions & transcription",
      "Multilingual AI assistance",
      "Sign language pin & collaborative workspaces",
    ],
  },
  {
    title: "Thrive Learn",
    description:
      "A comprehensive accessibility-first education platform that helps Persons with Disabilities study, gain skills, and prepare for careers with AI learning assistance, OCR, text-to-speech, and accessible assessments.",
    tagline: "Education without barriers.",
    image: "/images/gallery/Deb Works on her Laptop.jpg",
    imageAlt: "Student working on a laptop, representing accessible learning technologies.",
    href: "/projects#thrive-learn",
    status: "In Development" as const,
    tags: ["Education", "eLearning", "OCR", "AI Tutor"],
    features: [
      "AI learning assistance & tutors",
      "Document readers & OCR",
      "Accessible notes & assessments",
      "Progress tracking & certification",
    ],
  }
] as const;

export type Project = (typeof projects)[number];
export type ProjectStatus = typeof projects[number]["status"];
