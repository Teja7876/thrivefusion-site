import {
  Home,
  Info,
  Briefcase,
  FolderKanban,
  BookOpen,
  Users,
  Handshake,
  Heart,
  Mail,
  Bot,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  icon: any;
  highlight?: boolean;
};

export const navigation: NavigationItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "Focus Areas",
    href: "/focus-areas",
    icon: Briefcase,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: BookOpen,
  },
  {
    title: "EqualEdge AI",
    href: "/ai",
    icon: Bot,
  },
  {
    title: "Volunteer",
    href: "/volunteer",
    icon: Users,
  },
  {
    title: "Partner",
    href: "/partner-with-us",
    icon: Handshake,
  },
  {
    title: "Donate",
    href: "/donate",
    icon: Heart,
    highlight: true,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
  },
];