"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

async function sendEmailJsFromBrowser(form: FormState): Promise<boolean> {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    return false;
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      },
    }),
    cache: "no-store",
  });

  return response.ok;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  function validate(): Partial<FormState> {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Please enter a valid email.";
    }
    if (!form.message.trim()) errs.message = "Message is required.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        // Fallback path when EmailJS blocks non-browser API calls from server routes.
        if (res.status === 502) {
          const sentFromBrowser = await sendEmailJsFromBrowser(form);
          if (sentFromBrowser) {
            setStatus("success");
            setForm({ name: "", email: "", message: "" });
            return;
          }
        }

        setStatus("error");
      }
    } catch {
      const sentFromBrowser = await sendEmailJsFromBrowser(form);
      if (sentFromBrowser) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        return;
      }
      setStatus("error");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  }

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-12 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal>
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-2">
              Contact
            </p>
            <h1 className="text-[28px] md:text-[36px] font-bold text-sage-900">
              Get In Touch
            </h1>
            <p className="text-gray-500 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
              Have a question or want to get involved? We&apos;d love to hear from you.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-[60px] bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
            {/* Info */}
            <ScrollReveal className="md:col-span-2 space-y-6">
              <div>
                <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-4">
                  Contact Info
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start text-sm text-gray-600">
                    <FiMail
                      size={16}
                      className="text-sage-500 mt-0.5 shrink-0"
                    />
                    <a
                      href="mailto:info@farzanaarozfoundation.org"
                      className="hover:text-sage-600 transition-colors"
                    >
                      info@farzanaarozfoundation.org
                    </a>
                  </li>
                
                  <li className="flex gap-3 items-start text-sm text-gray-600">
                    <FiMapPin
                      size={16}
                      className="text-sage-500 mt-0.5 shrink-0"
                    />
                    <span>Dhaka, Bangladesh</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={0.1} className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-sage-800 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`w-full border rounded-[8px] px-4 py-3 text-sm text-sage-900 placeholder-gray-400 outline-none transition-colors ${
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-sage-200 focus:border-sage-400"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-sage-800 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full border rounded-[8px] px-4 py-3 text-sm text-sage-900 placeholder-gray-400 outline-none transition-colors ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-sage-200 focus:border-sage-400"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-sage-800 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className={`w-full border rounded-[8px] px-4 py-3 text-sm text-sage-900 placeholder-gray-400 outline-none transition-colors resize-none ${
                      errors.message
                        ? "border-red-400 focus:border-red-500"
                        : "border-sage-200 focus:border-sage-400"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex items-center gap-2 bg-sage-500 text-white text-sm font-semibold px-7 py-3 rounded-[8px] hover:bg-sage-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      <FiSend size={14} />
                      Send Message
                    </>
                  )}
                </button>

                {/* Feedback */}
                {status === "success" && (
                  <p className="text-sm text-sage-600 font-medium">
                    Your message has been sent. We will be in touch soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm text-red-500">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
