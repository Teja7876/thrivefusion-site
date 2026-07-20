import {
  Accessibility,
  BookOpen,
  Briefcase,
  Laptop,
  Scale,
  Users,
} from "lucide-react";

export const focusAreas = [
  {
    title: "Digital Accessibility",
    description:
      "Creating accessible websites, mobile applications, documents, and digital services that comply with WCAG and international accessibility standards.",
    tagline: "Websites and apps for everyone.",
    icon: Accessibility,
    image: "/images/gallery/Businesswoman in an Office.jpg",
    imageAlt:
      "A businesswoman working confidently in an office, representing digital accessibility.",
    slug: "digital-accessibility",
  },
  {
    title: "Inclusive Education",
    description:
      "Supporting students with disabilities through accessible learning resources, training, mentorship, and inclusive education programs.",
    tagline: "Learning without barriers.",
    icon: BookOpen,
    image: "/images/gallery/A Mentor and Mentee Work Together.jpg",
    imageAlt:
      "A mentor and mentee working together, representing inclusive education and mentorship.",
    slug: "inclusive-education",
  },
  {
    title: "Assistive Technology",
    description:
      "Promoting assistive technologies that enable independent learning, communication, mobility, and employment for persons with disabilities.",
    tagline: "Tools that enable independence.",
    icon: Laptop,
    image: "/images/gallery/Businessman Uses Text to Speech on his Phone.jpg",
    imageAlt:
      "A businessman using text-to-speech on his phone, demonstrating assistive technology.",
    slug: "assistive-technology",
  },
  {
    title: "Employment & Skills",
    description:
      "Providing digital skills, career guidance, accessibility training, and employment opportunities for persons with disabilities.",
    tagline: "Careers that are truly accessible.",
    icon: Briefcase,
    image: "/images/gallery/Mike Works in an Office.jpg",
    imageAlt:
      "Mike working productively in an office, representing inclusive employment opportunities.",
    slug: "employment",
  },
  {
    title: "Advocacy",
    description:
      "Working with governments, organizations, and communities to promote accessibility, equal rights, and disability inclusion at all levels.",
    tagline: "Rights, policy, and systemic change.",
    icon: Scale,
    image: "/images/gallery/Paul Presents in a Conference Room.jpg",
    imageAlt:
      "Paul presenting in a conference room, illustrating advocacy and leadership in disability rights.",
    slug: "advocacy",
  },
  {
    title: "Community Support",
    description:
      "Building an inclusive community through volunteers, partnerships, awareness programs, and peer support initiatives across India.",
    tagline: "Together, we are stronger.",
    icon: Users,
    image:
      "/images/gallery/A Group of Diverse Colleagues Work Together in an Office.jpg",
    imageAlt:
      "A diverse group of colleagues collaborating in an office, showing inclusive community support.",
    slug: "community",
  },
] as const;

export type FocusArea = (typeof focusAreas)[number];