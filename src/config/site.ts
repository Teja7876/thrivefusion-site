export const siteConfig = {
  // Organization
  name: "ThriveFusion Alliance Foundation",
  shortName: "ThriveFusion",
  tagline: "Empowering Every Ability",

  // Website
  url: "https://thrivefusion.org",

  // SEO
  title: "ThriveFusion Alliance Foundation",
  description:
    "Empowering persons with disabilities through accessibility, education, assistive technology, skill development, employment, advocacy, and inclusive innovation.",

  // Mission
  mission:
    "Empowering persons with disabilities through accessibility, education, assistive technology, skill development, employment, advocacy, and inclusive innovation.",

  // Vision
  vision:
    "To build an inclusive India where every person with a disability has equal access to education, technology, employment, and opportunities.",

  // Values
  values: [
    "Accessibility First",
    "Inclusion & Equality",
    "Innovation with Purpose",
    "Community Empowerment",
    "Transparency & Trust",
    "Dignity & Respect",
  ],

  // Registration
  registration: "Section 8 Company",
  cin: "U88100TG2025NPL189754",
  pan: "AAICT7598M",
  founded: "2025",

  email: {
    primary: "info@thrivefusion.org",
    secondary: "info@thrivefusion.org",
  },

  phone: {
    primary: "+91 8142857483",
    secondary: "+91 9502588232",
  },

  address: {
    line1: "Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500001",
  },

  // Social Links
  social: {
    linkedin: "https://www.linkedin.com/company/thrivefusion-alliance-foundation/",
    github: "",
    x: "",
    youtube: "",
    instagram: "",
    facebook: "",
  },

  // Impact Numbers
  impact: {
    personsReached: 5000,
    volunteersActive: 120,
    programsRunning: 15,
    partnersCount: 30,
  },
} as const;

export type SiteConfig = typeof siteConfig;