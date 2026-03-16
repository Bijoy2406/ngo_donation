import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; message?: string } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = body;

  // Input validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  // Email format validation
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 }
    );
  }

  // Sanitize inputs to avoid log injection
  const safeName = name.replace(/[\r\n]/g, " ").slice(0, 200);
  const safeEmail = email.slice(0, 200);
  const safeMessage = message.slice(0, 2000);

  const serviceId =
    process.env.EMAILJS_SERVICE_ID ?? process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId =
    process.env.EMAILJS_TEMPLATE_ID ?? process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey =
    process.env.EMAILJS_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error("[Contact Form] EmailJS env vars are missing.");
    return NextResponse.json(
      { error: "Contact service is not configured." },
      { status: 500 }
    );
  }

  const emailJsPayload: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      name: safeName,
      email: safeEmail,
      message: safeMessage,
    },
  };

  // Optional but recommended for server-side calls.
  if (privateKey) {
    emailJsPayload.accessToken = privateKey;
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailJsPayload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Contact Form] EmailJS send failed", {
        status: response.status,
        response: errorText,
      });

      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 502 }
      );
    }

    console.info("[Contact Form] Email sent", { name: safeName, email: safeEmail });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact Form] EmailJS request error", error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 502 }
    );
  }
}
