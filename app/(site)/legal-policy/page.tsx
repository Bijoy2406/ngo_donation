import type { Metadata } from "next";
import TermsAndConditions from "@/components/legal/TermsAndConditions";
import { getSiteSettings } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Terms & Conditions | Farhana Afroz Foundation",
  description:
    "Terms & Conditions governing use of farhanaafrozfoundation.org and participation in our donation, volunteering, and community programs.",
};

export default async function LegalPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <TermsAndConditions email={settings?.email} phone={settings?.phone} />
  );
}
