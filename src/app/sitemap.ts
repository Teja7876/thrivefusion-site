import { siteConfig } from "@/config/site";

export default function sitemap() {
  const routes = [
    "",
    "/about",
    "/focus-areas",
    "/projects",
    "/resources",
    "/ai",
    "/volunteer",
    "/partner-with-us",
    "/donate",
    "/contact",
    "/accessibility",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "weekly" : "monthly" as const,
    priority: route === "" ? 1 : route === "/about" || route === "/donate" ? 0.9 : 0.8,
  }));

  return routes;
}
