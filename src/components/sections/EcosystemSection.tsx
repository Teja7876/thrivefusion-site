
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Smartphone, BookOpen, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EcosystemSection() {
  const products = [
    {
      title: 'Thrive Assist',
      description: 'An AI-powered mobile app designed to help persons with disabilities navigate their daily lives with independence.',
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      link: '/projects/thrive-assist',
    },
    {
      title: 'Thrive Learn',
      description: 'An inclusive learning platform offering accessible courses, skill development, and employment readiness programs.',
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      link: '/projects/thrive-learn',
    },
    {
      title: 'Meatly',
      description: 'Our sustainable initiative creating inclusive employment opportunities in the food tech and hospitality sectors.',
      icon: <Utensils className="h-10 w-10 text-primary" />,
      color: 'bg-green-50 dark:bg-green-900/20',
      link: '/projects/meatly',
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Our Ecosystem</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Empowering Independence
          </h2>
          <p className="max-w-[800px] text-lg text-muted-foreground">
            Explore our interconnected suite of products and platforms designed specifically to break down barriers and foster true inclusion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={product.title} className={`border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden ${product.color} animate-fade-in-up delay-${(index + 1) * 100}`}>
              <CardHeader className="pb-4">
                <div className="mb-4 inline-flex items-center justify-center p-3 bg-background rounded-2xl shadow-sm w-fit group-hover:scale-110 transition-transform">
                  {product.icon}
                </div>
                <CardTitle className="text-2xl">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CardDescription className="text-base text-foreground/80 min-h-[80px]">
                  {product.description}
                </CardDescription>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                  <a href={product.link}>
                    Explore {product.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
