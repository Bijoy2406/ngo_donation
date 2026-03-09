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

  // TODO: Integrate your email service here.
  // Options: Nodemailer + SMTP, Resend (resend.com), SendGrid, AWS SES.
  //
  // Example with Resend:
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@yourdomain.com',
  //   to: 'contact@yourdomain.com',
  //   subject: `Contact form: ${safeName}`,
  //   text: `From: ${safeName} <${safeEmail}>\n\n${safeMessage}`,
  // });

  console.info("[Contact Form]", { name: safeName, email: safeEmail, message: safeMessage });

  return NextResponse.json({ success: true });
}
