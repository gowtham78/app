import { Facebook, Instagram, Youtube } from "lucide-react";
import { SITE } from "../data/siteData";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-charcoal text-ivory pt-24 md:pt-32 pb-10"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 pb-20 md:pb-28">
          <div className="md:col-span-5">
            <div className="text-[10px] tracking-[0.4em] uppercase text-bronze font-sans mb-6">
              Since 2007
            </div>
            <p className="font-serif font-light text-3xl md:text-4xl leading-tight max-w-md">
              Interior design and renovation, crafted with precision in Singapore.
            </p>
            <div className="mt-8 flex gap-4">
              <a
                href={SITE.socials.facebook}
                target="_blank"
                rel="noreferrer"
                data-testid="footer-social-facebook"
                className="w-10 h-10 border border-ivory/25 hover:border-bronze hover:text-bronze flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noreferrer"
                data-testid="footer-social-instagram"
                className="w-10 h-10 border border-ivory/25 hover:border-bronze hover:text-bronze flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={SITE.socials.youtube}
                target="_blank"
                rel="noreferrer"
                data-testid="footer-social-youtube"
                className="w-10 h-10 border border-ivory/25 hover:border-bronze hover:text-bronze flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] tracking-[0.3em] uppercase text-ivory/50 font-sans mb-5">
              Explore
            </div>
            <ul className="space-y-3 font-sans text-[15px] font-light">
              <li><a href="#projects" className="link-underline text-ivory/85 hover:text-ivory">Projects</a></li>
              <li><a href="#services" className="link-underline text-ivory/85 hover:text-ivory">Services</a></li>
              <li><a href="#about" className="link-underline text-ivory/85 hover:text-ivory">About</a></li>
              <li><a href="#process" className="link-underline text-ivory/85 hover:text-ivory">Process</a></li>
              <li><a href="#contact" className="link-underline text-ivory/85 hover:text-ivory">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] tracking-[0.3em] uppercase text-ivory/50 font-sans mb-5">
              Contact
            </div>
            <ul className="space-y-3 font-sans text-[15px] font-light text-ivory/85">
              <li><a href={SITE.phoneHref} className="link-underline">{SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`} className="link-underline">{SITE.email}</a></li>
              <li><a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="link-underline">WhatsApp</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-[10px] tracking-[0.3em] uppercase text-ivory/50 font-sans mb-5">
              Studios
            </div>
            <address className="not-italic space-y-4 text-ivory/85 font-sans text-[15px] font-light leading-relaxed">
              <div>
                <div className="text-bronze/90 text-[10px] tracking-[0.3em] uppercase mb-1">Showroom</div>
                {SITE.addresses.showroom}
              </div>
              <div>
                <div className="text-bronze/90 text-[10px] tracking-[0.3em] uppercase mb-1">Workshop</div>
                {SITE.addresses.workshop}
              </div>
            </address>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="border-t border-ivory/10 pt-14">
          <div
            data-testid="footer-wordmark"
            className="font-serif italic text-ivory text-[22vw] md:text-[18vw] leading-[0.85] tracking-[-0.02em] select-none"
          >
            Suntek
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-ivory/45 font-sans">
          <div>© {new Date().getFullYear()} Suntek Designs Pte Ltd. All rights reserved.</div>
          <div>BCA & HDB Registered · Singapore</div>
        </div>
      </div>
    </footer>
  );
}
