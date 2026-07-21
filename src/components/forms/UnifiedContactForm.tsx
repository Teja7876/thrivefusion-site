"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const enquiryOptions = [
  "General Contact",
  "Volunteer",
  "Partnership",
  "Donation Enquiry",
  "Request a Scribe",
  "Accessibility Support",
  "EqualEdge AI",
  "Resources",
  "Feedback",
  "Other",
] as const;

const formSchema = z.object({
  type: z.enum(enquiryOptions),
  name: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long."),
  // Volunteer
  role: z.string().optional(),
  // Partnership
  organization: z.string().optional(),
  partnershipType: z.string().optional(),
  // Donation
  amount: z.string().optional(),
  // Scribe & Accessibility
  serviceType: z.string().optional(),
  dateRequired: z.string().optional(),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UnifiedContactForm({ defaultType = "General Contact" }: { defaultType?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: (defaultType as FormValues["type"]) || "General Contact",
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (isSuccess && successRef.current) {
      successRef.current.focus();
    }
  }, [isSuccess]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setIsSuccess(false);

    try {
      await addDoc(collection(db, "contact_submissions"), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div 
        ref={successRef}
        tabIndex={-1}
        className="flex flex-col items-center justify-center rounded-3xl border border-green-200 bg-green-50 p-12 text-center shadow-sm dark:border-green-900/30 dark:bg-green-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-live="polite"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-2xl font-bold text-green-900 dark:text-green-50">Thank you!</h3>
        <p className="mt-2 text-green-800 dark:text-green-200">
          Your submission has been received securely. We will get back to you shortly.
        </p>
        <Button 
          variant="outline" 
          className="mt-8"
          onClick={() => setIsSuccess(false)}
        >
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {errorMessage && (
        <div 
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-200"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="type" className="block text-sm font-medium">
          How can we help you? <span className="text-red-500" aria-hidden="true">*</span>
          <span className="sr-only">(Required)</span>
        </label>
        <select
          id="type"
          {...register("type")}
          className="mt-2 flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          aria-invalid={!!errors.type}
          aria-describedby={errors.type ? "type-error" : undefined}
        >
          {enquiryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.type && (
          <p id="type-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.type.message}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name <span className="text-red-500" aria-hidden="true">*</span>
            <span className="sr-only">(Required)</span>
          </label>
          <Input 
            id="name" 
            type="text" 
            {...register("name")} 
            className="mt-2 h-11 rounded-xl"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address <span className="text-red-500" aria-hidden="true">*</span>
            <span className="sr-only">(Required)</span>
          </label>
          <Input 
            id="email" 
            type="email" 
            {...register("email")} 
            className="mt-2 h-11 rounded-xl"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Mobile Number (Optional)
          </label>
          <Input 
            id="phone" 
            type="tel" 
            {...register("phone")} 
            className="mt-2 h-11 rounded-xl"
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium">
            Subject (Optional)
          </label>
          <Input 
            id="subject" 
            type="text" 
            {...register("subject")} 
            className="mt-2 h-11 rounded-xl"
          />
        </div>
      </div>

      {/* Dynamic Fields Based on Type */}
      {selectedType === "Volunteer" && (
        <div>
          <label htmlFor="role" className="block text-sm font-medium">
            Preferred Role
          </label>
          <select
            id="role"
            {...register("role")}
            className="mt-2 flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <option value="">Select a role...</option>
            <option value="Accessibility Tester">Accessibility Tester</option>
            <option value="Educator / Mentor">Educator / Mentor</option>
            <option value="Sign Language Interpreter">Sign Language Interpreter</option>
            <option value="Scribe">Scribe</option>
            <option value="Tech Developer">Tech Developer</option>
            <option value="Event Volunteer">Event Volunteer</option>
          </select>
        </div>
      )}

      {selectedType === "Partnership" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="organization" className="block text-sm font-medium">
              Organization Name
            </label>
            <Input 
              id="organization" 
              type="text" 
              {...register("organization")} 
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <label htmlFor="partnershipType" className="block text-sm font-medium">
              Partnership Type
            </label>
            <select
              id="partnershipType"
              {...register("partnershipType")}
              className="mt-2 flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="">Select a type...</option>
              <option value="Corporate CSR">Corporate CSR</option>
              <option value="NGO Partner">NGO Partner</option>
              <option value="Academic Institution">Academic Institution</option>
              <option value="Technology Provider">Technology Provider</option>
            </select>
          </div>
        </div>
      )}

      {selectedType === "Donation Enquiry" && (
        <div>
          <label htmlFor="amount" className="block text-sm font-medium">
            Intended Donation Amount (INR)
          </label>
          <Input 
            id="amount" 
            type="text" 
            placeholder="e.g. 5000"
            {...register("amount")} 
            className="mt-2 h-11 rounded-xl"
          />
        </div>
      )}

      {(selectedType === "Request a Scribe" || selectedType === "Accessibility Support") && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium">
              Type of Support Needed
            </label>
            <Input 
              id="serviceType" 
              type="text" 
              placeholder={selectedType === "Request a Scribe" ? "e.g., Exam Scribe, Notes Scribe" : "e.g., Screen Reader Setup, Web Audit"}
              {...register("serviceType")} 
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <label htmlFor="dateRequired" className="block text-sm font-medium">
              Date Required
            </label>
            <Input 
              id="dateRequired" 
              type="date" 
              {...register("dateRequired")} 
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Location (City or Virtual)
            </label>
            <Input 
              id="location" 
              type="text" 
              placeholder="e.g., Hyderabad or Virtual/Zoom"
              {...register("location")} 
              className="mt-2 h-11 rounded-xl"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message <span className="text-red-500" aria-hidden="true">*</span>
          <span className="sr-only">(Required)</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-base" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
