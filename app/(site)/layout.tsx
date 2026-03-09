import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import DonationModal from "@/components/ui/DonationModal";
import { DonationModalProvider } from "@/lib/context/DonationModalContext";
import ImageProtectionProvider from "@/components/providers/ImageProtectionProvider";
import { getDonationSettings, getSiteSettings } from "@/sanity/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [donationSettings, siteSettings] = await Promise.all([
    getDonationSettings(),
    getSiteSettings(),
  ]);

  return (
    <DonationModalProvider>
      <ImageProtectionProvider />
      <Navbar />
      <main>{children}</main>
      <Footer settings={siteSettings} />
      <FloatingActions whatsapp={siteSettings?.whatsappNumber} />
      <DonationModal settings={donationSettings} />
    </DonationModalProvider>
  );
}
