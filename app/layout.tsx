import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Farzana Afroz Foundation",
  description:
    "Empowering communities through education, health, and meaningful action.",
  openGraph: {
    title: "Farzana Afroz Foundation",
    description: "Empowering communities through meaningful action.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
