import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import type { SiteSettings } from "@/types";

interface FooterProps {
  settings: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sage-900 text-sage-100">
      <div className="max-w-6xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p className="font-bold text-white text-base mb-3">
            Farzana Afroz Foundation
          </p>
          <p className="text-sm text-sage-300 leading-relaxed max-w-xs">
            Empowering communities through education, health, and meaningful
            action.
          </p>
          <div className="flex gap-4 mt-5">
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-sage-400 hover:text-white transition-colors"
              >
                <FiInstagram size={18} />
              </a>
            )}
            {settings?.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-sage-400 hover:text-white transition-colors"
              >
                <FiFacebook size={18} />
              </a>
            )}
            {settings?.twitterUrl && (
              <a
                href={settings.twitterUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="text-sage-400 hover:text-white transition-colors"
              >
                <FiTwitter size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-semibold text-white text-sm mb-4 uppercase tracking-wide">
            Quick Links
          </p>
          <ul className="space-y-2.5">
            {[
              { href: "/", label: "Home" },
              { href: "/#about", label: "About Us" },
              { href: "/events", label: "Events" },
              { href: "/#mission", label: "Our Mission" },
              { href: "/team", label: "Team" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-sage-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-semibold text-white text-sm mb-4 uppercase tracking-wide">
            Contact
          </p>
          <ul className="space-y-3">
            {settings?.email && (
              <li className="flex items-start gap-2.5 text-sm text-sage-300">
                <FiMail size={15} className="mt-0.5 shrink-0 text-sage-400" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.phone && (
              <li className="flex items-start gap-2.5 text-sm text-sage-300">
                <FiPhone size={15} className="mt-0.5 shrink-0 text-sage-400" />
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-2.5 text-sm text-sage-300">
                <FiMapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-sage-400"
                />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sage-800">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-sage-500">
          <p>&copy; {year} Farzana Afroz Foundation. All rights reserved.</p>
          <p>
            Built with dedication for a better community.
          </p>
        </div>
      </div>
    </footer>
  );
}
