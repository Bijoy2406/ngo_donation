"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface TermsAndConditionsProps {
  email?: string;
  phone?: string;
}

interface TermSection {
  id: string;
  number: string;
  title: string;
  body: React.ReactNode;
}

const DEFAULT_EMAIL = "farhanaafrozfoundation@gmail.com";
const DEFAULT_PHONE = "+8801712422246";

export default function TermsAndConditions({
  email,
  phone,
}: TermsAndConditionsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const resolvedEmail = email || DEFAULT_EMAIL;
  const resolvedPhone = phone || DEFAULT_PHONE;
  const telHref = `tel:${resolvedPhone.replace(/\s+/g, "")}`;

  const sections: TermSection[] = [
    {
      id: "acceptance",
      number: "01",
      title: "Acceptance of Terms",
      body: (
        <>
          <p>
            These Terms &amp; Conditions (&quot;Terms&quot;) form a binding
            agreement between you and Farhana Afroz Foundation
            (&quot;FAF,&quot; &quot;the Foundation,&quot; &quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;) governing your access to and
            use of farhanaafrozfoundation.org (the &quot;Site&quot;) and any
            related services, including online donations, volunteer
            registration, and event information.
          </p>
          <p>
            By using the Site in any way, you confirm that you have read,
            understood, and agree to these Terms, along with any policies
            referenced herein. We may update these Terms from time to time,
            as described in Section 15.
          </p>
        </>
      ),
    },
    {
      id: "about",
      number: "02",
      title: "About the Foundation",
      body: (
        <>
          <p>
            Farhana Afroz Foundation is a humanitarian organization
            established in 2009 and based in Dhaka, Bangladesh. We work to
            support underprivileged communities and families through rural
            education, housing support, women&apos;s hygiene initiatives,
            food and iftar distribution, disaster relief, healthcare
            assistance, and winter clothing distribution.
          </p>
          <p>
            Descriptions of our programs, impact figures, and event details
            on this Site are provided for general informational purposes and
            are updated periodically; they do not constitute a guarantee of
            specific outcomes.
          </p>
        </>
      ),
    },
    {
      id: "use",
      number: "03",
      title: "Eligibility & Use of the Site",
      body: (
        <>
          <p>
            You may use this Site if you are legally capable of entering
            into a binding agreement under applicable law, or you have the
            consent of a parent or guardian. By using the Site, you agree
            not to:
          </p>
          <ul>
            <li>
              Use the Site for any unlawful purpose or in violation of these
              Terms;
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the Site or
              its underlying systems;
            </li>
            <li>
              Upload or transmit viruses, malware, or any code intended to
              disrupt the Site;
            </li>
            <li>
              Impersonate any person or misrepresent your affiliation with
              the Foundation;
            </li>
            <li>
              Scrape, harvest, or misuse data from the Site, including donor
              or volunteer information.
            </li>
          </ul>
          <p>
            We may suspend or restrict access to the Site for anyone who
            violates these Terms.
          </p>
        </>
      ),
    },
    {
      id: "donations",
      number: "04",
      title: "Donations",
      body: (
        <>
          <p>
            Donations made through the Site are voluntary contributions in
            support of our mission. Unless otherwise required by law,
            donations are non-refundable, except where a genuine processing
            error has occurred, in which case we will review the matter in
            good faith.
          </p>
          <p>
            Donations are generally applied at the Foundation&apos;s
            discretion toward the programs and communities that need them
            most. If you wish to direct a donation toward a specific
            program, we will make reasonable efforts to honor that request,
            but it is not guaranteed unless confirmed by us in writing.
          </p>
          <p>
            Online payments are processed through third-party payment
            providers. We do not store your full payment card details, and
            we are not responsible for outages, delays, or errors caused by
            these third-party services. Where reasonably practicable, we aim
            to issue an acknowledgment or receipt for donations received.
          </p>
          <div className="mt-3.5 rounded-[8px] bg-sage-100 px-4 py-3.5 text-[13px] leading-relaxed text-sage-800">
            Tax treatment of donations depends on your country of residence
            and applicable law. Donors should consult their own tax advisor
            regarding deductibility; we do not guarantee tax-exempt status of
            contributions.
          </div>
        </>
      ),
    },
    {
      id: "volunteering",
      number: "05",
      title: "Volunteering",
      body: (
        <>
          <p>
            Registering as a volunteer, including through our online sign-up
            form, does not create an employment, agency, or partnership
            relationship with the Foundation. We review volunteer
            registrations and reserve the right to accept, decline, or set
            conditions for participation in specific programs or field
            activities.
          </p>
          <p>
            Volunteers participating in on-the-ground activities, such as
            distribution drives or disaster relief, agree to follow the
            safety instructions of Foundation staff and coordinators at all
            times. Information you provide when registering is used only to
            coordinate volunteer activities and communicate with you.
          </p>
        </>
      ),
    },
    {
      id: "events",
      number: "06",
      title: "Events & Programs",
      body: (
        <>
          <p>
            Details about ongoing and past events, including dates,
            locations, and beneficiary numbers, are provided for
            informational purposes and are subject to change without prior
            notice due to the nature of humanitarian and disaster-response
            work.
          </p>
          <p>
            Eligibility for aid or support under any Foundation program
            (such as housing, hygiene supplies, or medical assistance) is
            determined solely by the Foundation based on our own
            need-assessment criteria, and inclusion on this Site does not
            constitute a promise of assistance to any individual.
          </p>
        </>
      ),
    },
    {
      id: "ip",
      number: "07",
      title: "Intellectual Property",
      body: (
        <>
          <p>
            All text, images, photographs, graphics, and the Farhana Afroz
            Foundation name and logo on this Site are owned by or licensed
            to the Foundation and are protected under the copyright and
            trademark laws of Bangladesh and applicable international
            treaties.
          </p>
          <p>
            You may view and share Site content for personal, non-commercial
            purposes, including linking back to this Site. Reproduction,
            redistribution, or commercial use of our content without prior
            written permission is not permitted.
          </p>
          <p>
            Photographs of the communities we serve are used with consent
            obtained at the time of the program. If you believe your image
            appears on this Site without appropriate consent, please contact
            us using the details in Section 16 so we can review the matter.
          </p>
        </>
      ),
    },
    {
      id: "submissions",
      number: "08",
      title: "User Submissions",
      body: (
        <>
          <p>
            If you submit a message, testimonial, comment, or other content
            to us through the Site (for example, via a contact form), you
            grant the Foundation a non-exclusive, royalty-free license to
            use, reproduce, and publish that content for informational and
            promotional purposes related to our mission.
          </p>
          <p>
            You agree not to submit content that is unlawful, defamatory, or
            infringes the rights of any third party.
          </p>
        </>
      ),
    },
    {
      id: "thirdparty",
      number: "09",
      title: "Third-Party Links & Services",
      body: (
        <>
          <p>
            This Site links to third-party platforms, including our
            Instagram and Facebook pages, our online volunteer registration
            form, and payment processors used for donations. These services
            are operated independently of the Foundation and are governed by
            their own terms and privacy practices.
          </p>
          <p>
            We are not responsible for the content, security, or practices
            of any third-party site or service, and your use of them is at
            your own discretion.
          </p>
        </>
      ),
    },
    {
      id: "privacy",
      number: "10",
      title: "Privacy",
      body: (
        <>
          <p>
            Personal information collected through donations, volunteer
            registration, or our contact form (such as your name, email
            address, or phone number) is used only to operate the Site,
            process donations, coordinate volunteer activities, and respond
            to inquiries. We do not sell personal information to third
            parties.
          </p>
          <p>
            For further detail on how we collect, use, and safeguard your
            information, please refer to our Privacy Policy on this Legal
            &amp; Policy page, or contact us directly with any questions.
          </p>
        </>
      ),
    },
    {
      id: "disclaimers",
      number: "11",
      title: "Disclaimers",
      body: (
        <p>
          This Site and its content are provided &quot;as is&quot; and
          &quot;as available,&quot; without warranties of any kind, whether
          express or implied. While we strive for accuracy, we do not
          guarantee that the Site will be error-free, uninterrupted, or
          fully up to date at all times.
        </p>
      ),
    },
    {
      id: "liability",
      number: "12",
      title: "Limitation of Liability",
      body: (
        <p>
          To the fullest extent permitted by applicable law, Farhana Afroz
          Foundation, its trustees, staff, and volunteers shall not be
          liable for any indirect, incidental, or consequential damages
          arising from your use of the Site, your donation, or your
          participation in any Foundation program or event, except where
          such liability arises from our gross negligence or willful
          misconduct.
        </p>
      ),
    },
    {
      id: "indemnity",
      number: "13",
      title: "Indemnification",
      body: (
        <p>
          You agree to indemnify and hold harmless the Foundation, its
          trustees, staff, and volunteers from any claim, loss, or demand,
          including reasonable legal fees, arising out of your violation of
          these Terms or your misuse of the Site.
        </p>
      ),
    },
    {
      id: "law",
      number: "14",
      title: "Governing Law & Jurisdiction",
      body: (
        <p>
          These Terms are governed by the laws of the People&apos;s Republic
          of Bangladesh. Any disputes arising out of or relating to these
          Terms or the Site shall be subject to the exclusive jurisdiction
          of the courts of Dhaka, Bangladesh.
        </p>
      ),
    },
    {
      id: "changes",
      number: "15",
      title: "Changes to These Terms",
      body: (
        <p>
          We may revise these Terms from time to time to reflect changes in
          our programs, legal requirements, or operations. Updates take
          effect as soon as they are posted on this page, with the
          &quot;Effective date&quot; updated accordingly. Continued use of
          the Site after changes are posted constitutes your acceptance of
          the revised Terms.
        </p>
      ),
    },
    {
      id: "contact",
      number: "16",
      title: "Contact Us",
      body: (
        <>
          <p>If you have questions about these Terms, please reach out to us:</p>
          <ul>
            <li>
              Email:{" "}
              <a
                href={`mailto:${resolvedEmail}`}
                className="text-sage-600 underline decoration-sage-300 underline-offset-2 hover:text-sage-800"
              >
                {resolvedEmail}
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href={telHref}
                className="text-sage-600 underline decoration-sage-300 underline-offset-2 hover:text-sage-800"
              >
                {resolvedPhone}
              </a>
            </li>
            <li>Location: Dhaka, Bangladesh</li>
          </ul>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-10 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal>
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-2">
              Farhana Afroz Foundation
            </p>
            <h1 className="text-[30px] md:text-[42px] font-bold text-sage-900 leading-tight max-w-3xl">
              Terms &amp; Conditions
            </h1>
            <p className="text-[14px] md:text-[15px] text-sage-600 leading-relaxed max-w-2xl mt-3">
              These Terms govern your use of farhanaafrozfoundation.org and
              your participation in our donation, volunteering, and
              community programs. Please read them before using the site.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-sage-600 mt-5">
              <span>
                <strong className="text-sage-900 font-semibold">
                  Effective date:
                </strong>{" "}
                August 4, 2026
              </span>
              <span>
                <strong className="text-sage-900 font-semibold">
                  Applies to:
                </strong>{" "}
                Visitors, donors, and volunteers
              </span>
              <span>
                <strong className="text-sage-900 font-semibold">
                  Organization based in:
                </strong>{" "}
                Dhaka, Bangladesh
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Layout */}
      <section className="pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* TOC */}
            <nav
              aria-label="Table of contents"
              className="lg:col-span-3 lg:sticky lg:top-28 rounded-[14px] border border-sage-100 bg-white p-5 shadow-card"
            >
              <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-3">
                On this page
              </p>
              <ol className="space-y-1 list-none m-0 p-0">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`block text-[13px] py-1 pl-3 border-l-2 transition-colors ${
                        activeId === s.id
                          ? "border-sage-400 text-sage-900 font-semibold"
                          : "border-sage-100 text-sage-600 hover:text-sage-900 hover:border-sage-400"
                      }`}
                    >
                      {s.number} &middot; {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Content */}
            <div className="lg:col-span-9">
              <p className="rounded-r-[8px] border-l-[3px] border-sage-400 bg-sage-50 px-5 py-4 text-[14px] text-sage-700 leading-relaxed mb-10">
                By visiting this website, making a donation, registering to
                volunteer, or otherwise using our services, you agree to be
                bound by the following Terms &amp; Conditions. If you do not
                agree, please discontinue use of the site.
              </p>

              {sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className={`grid grid-cols-[40px_1fr] gap-4 scroll-mt-28 ${
                    i === sections.length - 1
                      ? ""
                      : "pb-8 mb-8 border-b border-sage-100"
                  }`}
                >
                  <div className="flex justify-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-sage-300 text-[13px] font-bold text-sage-700">
                      {s.number}
                    </span>
                  </div>
                  <div className="[&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-1.5 text-[14px] md:text-[15px] leading-[1.8] text-gray-600">
                    <h2 className="text-[20px] font-bold text-sage-900 mb-3 mt-0.5">
                      {s.title}
                    </h2>
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
