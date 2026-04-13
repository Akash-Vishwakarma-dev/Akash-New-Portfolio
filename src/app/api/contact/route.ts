import { NextRequest } from "next/server";
import { Resend } from "resend";
import { contactSubmissionSchema } from "@/lib/validations";
import { getContactSettings } from "@/lib/app-settings";
import { env } from "@/lib/env";
import {
  checkRateLimit,
  contactRateLimit,
  getClientIdentifier,
} from "@/lib/rate-limit";
import {
  errorResponse,
  handleApiError,
  parseRequestBody,
  sanitizeInput,
  successResponse,
} from "@/lib/api-utils";
import { prisma } from "@/lib/db";

type DeliveryStatus = "sent" | "queued" | "failed";

async function storeContactSubmission(input: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  recipientEmail?: string | null;
  deliveryStatus: DeliveryStatus;
  deliveryError?: string;
}) {
  try {
    await prisma.$runCommandRaw({
      insert: "contact_submissions",
      documents: [
        {
          name: input.name,
          email: input.email,
          subject: input.subject || null,
          message: input.message,
          recipientEmail: input.recipientEmail || null,
          deliveryStatus: input.deliveryStatus,
          deliveryError: input.deliveryError || null,
          createdAt: new Date(),
        },
      ],
    });
  } catch (error) {
    // Do not fail user submission if persistence logging fails.
    console.error("Failed to store contact submission", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(contactRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const parseResult = await parseRequestBody(request, contactSubmissionSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { name, email, subject, message } = parseResult.data;

    if (!env.RESEND_API_KEY) {
      await storeContactSubmission({
        name,
        email,
        subject,
        message,
        recipientEmail: env.ADMIN_EMAIL,
        deliveryStatus: "queued",
        deliveryError: "RESEND_API_KEY is not configured",
      });

      if (env.NODE_ENV === "development") {
        return successResponse({
          success: true,
          message: "Message received successfully (email delivery not configured in development)",
        });
      }

      return errorResponse("Email service is not configured", 503, "EMAIL_NOT_CONFIGURED");
    }

    const { contactFormEmail, emailNotifications } = await getContactSettings();
    const recipient =
      (contactFormEmail && contactFormEmail.trim()) ||
      (env.ADMIN_EMAIL && env.ADMIN_EMAIL.trim()) ||
      "";

    if (!recipient) {
      await storeContactSubmission({
        name,
        email,
        subject,
        message,
        deliveryStatus: "queued",
        deliveryError: "Recipient email is not configured",
      });

      if (env.NODE_ENV === "development") {
        return successResponse({
          success: true,
          message: "Message received successfully (recipient email not configured in development)",
        });
      }

      return errorResponse("Contact recipient email is not configured", 500, "MISSING_RECIPIENT");
    }

    if (!emailNotifications) {
      return successResponse({
        success: true,
        message: "Message received successfully",
      });
    }

    const resend = new Resend(env.RESEND_API_KEY);

    const safeName = sanitizeInput(name);
    const safeEmail = sanitizeInput(email);
    const safeSubject = sanitizeInput(subject || "New Contact Form Message");
    const safeMessage = sanitizeInput(message).replace(/\n/g, "<br />");

    const sendResult = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipient],
      reply_to: email,
      subject: `[Portfolio Contact] ${safeSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
      text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || "New Contact Form Message"}\n\nMessage:\n${message}`,
    });

    if (sendResult.error) {
      await storeContactSubmission({
        name,
        email,
        subject,
        message,
        recipientEmail: recipient,
        deliveryStatus: env.NODE_ENV === "development" ? "queued" : "failed",
        deliveryError: JSON.stringify(sendResult.error),
      });

      if (env.NODE_ENV === "development") {
        return successResponse({
          success: true,
          message: "Message received successfully (email delivery failed in development)",
        });
      }

      return errorResponse("Failed to send email", 500, "EMAIL_SEND_FAILED", sendResult.error);
    }

    await storeContactSubmission({
      name,
      email,
      subject,
      message,
      recipientEmail: recipient,
      deliveryStatus: "sent",
    });

    return successResponse({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
