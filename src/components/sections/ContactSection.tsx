import { UnifiedContactForm } from "@/components/forms/UnifiedContactForm";

export default function ContactSection() {
  return (
    <section className="py-24" aria-labelledby="contact-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Get In Touch
          </span>
          <h2
            id="contact-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            How Can We Help You?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you want to volunteer, partner with us, request accessibility support, or simply ask a question, we are here to help.
          </p>
        </div>
        
        <div className="mt-16 mx-auto max-w-3xl rounded-3xl border bg-card p-8 shadow-sm sm:p-10">
          <UnifiedContactForm />
        </div>
      </div>
    </section>
  );
}
