import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MainLayout wraps page content with consistent padding and max-width.
 * Use this inside page components that need a contained layout.
 */
export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn("container mx-auto px-4 py-12 lg:px-8", className)}>
      {children}
    </div>
  );
}
