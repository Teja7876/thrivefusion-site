

import PageContainer from "@/components/layout/PageContainer";
import { siteConfig } from "@/config/site";



export default function PrivacyPage() {
  const lastUpdated = "July 20, 2026";

  return (
    <main className="py-24">
      <PageContainer narrow>
        <div className="prose prose-slate dark:prose-invert max-w-none lg:prose-lg">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="text-muted-foreground font-medium">Last Updated: {lastUpdated}</p>
          
          <p className="mt-8">
            At {siteConfig.name}, we are committed to protecting your privacy. This Privacy 
            Policy explains how we collect, use, disclose, and safeguard your information when you 
            visit our website and use our services.
          </p>

          <h2 className="mt-12 text-2xl font-bold">1. Information We Collect</h2>
          <p className="mt-4">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Register as a volunteer or partner.</li>
            <li>Make a donation.</li>
            <li>Sign up for our newsletter.</li>
            <li>Contact us via our website forms or email.</li>
          </ul>
          <p className="mt-4">
            The personal information that we collect depends on the context of your interactions with us, 
            and may include your name, email address, phone number, organization name, and payment 
            information (processed securely by our payment gateway).
          </p>

          <h2 className="mt-12 text-2xl font-bold">2. How We Use Your Information</h2>
          <p className="mt-4">
            We use the information we collect or receive for the following purposes:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li><strong>To facilitate donations:</strong> Processing payments and issuing 80G tax receipts.</li>
            <li><strong>To manage volunteers:</strong> Organizing community programs and events.</li>
            <li><strong>To send administrative information:</strong> Sending you updates, newsletters, or policy changes.</li>
            <li><strong>To improve our services:</strong> Analyzing usage data to improve our website's accessibility and performance.</li>
          </ul>

          <h2 className="mt-12 text-2xl font-bold">3. Data Sharing and Disclosure</h2>
          <p className="mt-4">
            We do <strong>not</strong> sell your personal information to third parties. We only share information with your consent, 
            to comply with laws, to protect your rights, or to fulfill organizational obligations. We may share data with:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Payment processors (e.g., Razorpay) exclusively for completing donation transactions.</li>
            <li>Government authorities if required by law (e.g., FCRA or Income Tax compliance in India).</li>
          </ul>

          <h2 className="mt-12 text-2xl font-bold">4. Security of Your Information</h2>
          <p className="mt-4">
            We use administrative, technical, and physical security measures to help protect your personal 
            information. While we have taken reasonable steps to secure the personal information you provide to us, 
            please be aware that no electronic transmission over the Internet can be guaranteed to be 100% secure.
          </p>

          <h2 className="mt-12 text-2xl font-bold">5. Your Privacy Rights</h2>
          <p className="mt-4">
            Depending on your location, you may have the right to request access to the personal information we 
            collect from you, change that information, or delete it. To request to review, update, or delete your 
            personal information, please contact us.
          </p>

          <h2 className="mt-12 text-2xl font-bold">6. Contact Us</h2>
          <p className="mt-4">
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 rounded-xl bg-muted/50 p-6">
            <p className="font-semibold">{siteConfig.name}</p>
            <p className="mt-2">Email: <a href={`mailto:${siteConfig.email.primary}`} className="text-primary hover:underline">{siteConfig.email.primary}</a></p>
            <p>Address: {siteConfig.address.city}, {siteConfig.address.state}, {siteConfig.address.country}</p>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
