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
      <main className="relative isolate overflow-hidden pt-2">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#0f6f68]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-[24rem] -right-20 h-80 w-80 rounded-full bg-[#8ab7aa]/16 blur-3xl" />
        <div className="pointer-events-none absolute bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#d9c8a5]/30 blur-2xl" />
        {children}
      </main>
      <Footer settings={siteSettings} />
      <FloatingActions whatsapp={siteSettings?.whatsappNumber} />
      <DonationModal settings={donationSettings} />
    </DonationModalProvider>
  );
}
