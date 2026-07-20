import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const formSchema = z.object({
  type: z.string().min(1, "Form type is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  // Form-specific fields
  role: z.string().optional(), // Volunteer
  organization: z.string().optional(), // Partnership
  partnershipType: z.string().optional(), // Partnership
  amount: z.string().optional(), // Donation
  serviceType: z.string().optional(), // Scribe / Accessibility Support
  dateRequired: z.string().optional(), // Scribe
  location: z.string().optional(), // Scribe
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = formSchema.parse(body);

    const {
      type,
      name,
      email,
      phone,
      subject,
      message,
      ...specificFields
    } = validatedData;

    // Validate environment variables
    const requiredEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
    const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
    
    if (missingEnvVars.length > 0) {
      console.error(`[Contact API] Missing required SMTP environment variables: ${missingEnvVars.join(", ")}`);
      return NextResponse.json(
        { success: false, message: "Unable to send your enquiry right now. Please try again in a few minutes." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("[Contact API] SMTP Verification Failed:", verifyError);
      return NextResponse.json(
        { success: false, message: "Unable to send your enquiry right now. Please try again in a few minutes." },
        { status: 500 }
      );
    }

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Format specific fields for the email
    const specificFieldsHtml = Object.entries(specificFields)
      .filter(([_, value]) => value !== undefined && value !== "")
      .map(
        ([key, value]) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; text-transform: capitalize;">
              ${key.replace(/([A-Z])/g, " $1").trim()}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td>
          </tr>`
      )
      .join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto; color: #333;">
        <h2 style="color: #4f46e5;">New Submission: ${type}</h2>
        <p><strong>Date & Time:</strong> ${now}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Full Name</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email Address</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Mobile Number</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject || "N/A"}</td>
          </tr>
          ${specificFieldsHtml}
        </table>

        <h3 style="margin-top: 24px;">Message</h3>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #eee; white-space: pre-wrap;">
          ${message}
        </div>
      </div>
    `;

    // 1. Send notification to the organization
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"ThriveFusion Website" <${process.env.SMTP_USER}>`,
      to: "info@thrivefusion.org",
      subject: `New ${type} Form Submission from ${name}`,
      html: emailHtml,
    });

    // 2. Send automatic acknowledgement to the user
    const ackEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto; color: #333; line-height: 1.6;">
        <h2 style="color: #4f46e5;">We've received your enquiry – ThriveFusion Alliance Foundation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for contacting ThriveFusion Alliance Foundation regarding <strong>${type}</strong>.</p>
        <p>This is an automated confirmation that we have successfully received your enquiry. Our team is reviewing your message and will respond to you within 2-3 business days.</p>
        <p>At ThriveFusion Alliance Foundation, our mission is to empower individuals with disabilities by removing barriers and fostering equal opportunities across education, employment, and technology.</p>
        <p>Learn more about our work:</p>
        <ul>
          <li><a href="https://thrivefusion.org" style="color: #4f46e5;">Visit our Website</a></li>
          <li><a href="https://www.linkedin.com/company/thrivefusion-alliance-foundation/" style="color: #4f46e5;">Follow us on LinkedIn</a></li>
        </ul>
        <br/>
        <p>Best regards,</p>
        <p><strong>The ThriveFusion Alliance Foundation Team</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"ThriveFusion Alliance Foundation" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We've received your enquiry – ThriveFusion Alliance Foundation",
      html: ackEmailHtml,
    });

    return NextResponse.json({ success: true, message: "Submission successful" });
  } catch (error) {
    console.error("[Contact API] Form submission error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: "Unable to send your enquiry right now. Please try again in a few minutes." },
      { status: 500 }
    );
  }
}
