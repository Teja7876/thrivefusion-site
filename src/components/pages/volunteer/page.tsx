
import Image from '@/components/ui/image';
import {
  Heart,
  BookOpen,
  MonitorPlay,
  Users,
  Code,
  CalendarHeart,
} from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import { UnifiedContactForm } from "@/components/forms/UnifiedContactForm";



const roles = [
  {
    title: "Accessibility Tester",
    description: "Help test websites and apps using screen readers and keyboard navigation.",
    icon: MonitorPlay,
  },
  {
    title: "Educator / Mentor",
    description: "Provide mentorship and training to students with disabilities.",
    icon: BookOpen,
  },
  {
    title: "Sign Language Interpreter",
    description: "Facilitate communication at our events and in online programs.",
    icon: Users,
  },
  {
    title: "Scribe",
    description: "Assist students during examinations and important documentation.",
    icon: Code, // Fallback icon
  },
  {
    title: "Tech Developer",
    description: "Contribute code to our open-source accessibility tools like EqualEdge.",
    icon: Code,
  },
  {
    title: "Event Volunteer",
    description: "Support logistics and coordination for our inclusive community events.",
    icon: CalendarHeart,
  },
];

export default function VolunteerPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-muted">
        <Image
          src="/images/gallery/A Small Group of Colleagues Work Together.jpg"
          alt="Diverse team of volunteers collaborating on a project"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <PageContainer className="relative flex h-full items-center">
          <div className="max-w-2xl text-white">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
              Join Our Community
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Make a Difference
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              Your time and skills can break down barriers. Volunteer with us to 
              create accessible spaces and empower persons with disabilities.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 py-24 text-center">
        <PageContainer>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            The Process
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            How It Works
          </h2>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Apply", desc: "Fill out our volunteer interest form below." },
              { step: "2", title: "Get Matched", desc: "We'll match your skills with our active programs." },
              { step: "3", title: "Start Serving", desc: "Begin making a real impact in the community." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Volunteer Roles */}
      <section className="py-24" aria-labelledby="roles-heading">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="roles-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Opportunities to Serve
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We need diverse skills to support our initiatives.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.title}
                  className="rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="mt-6 text-xl font-bold">{role.title}</h3>
                  <p className="mt-2 text-muted-foreground">{role.description}</p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* Volunteer Form Section */}
      <section className="bg-muted/30 py-24" aria-labelledby="volunteer-form-heading">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative hidden h-full min-h-[500px] overflow-hidden rounded-3xl shadow-xl lg:block">
              <Image
                src="/images/gallery/Three Colleagues Chat in an Office.jpg"
                alt="Colleagues chatting in an office, illustrating our welcoming community"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
            </div>

            <div className="rounded-3xl border bg-card p-8 shadow-sm sm:p-10">
              <h2 id="volunteer-form-heading" className="text-3xl font-extrabold tracking-tight">
                Apply to Volunteer
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tell us about yourself and how you'd like to help.
              </p>

              <UnifiedContactForm defaultType="Volunteer" />
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
