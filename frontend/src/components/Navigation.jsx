import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "../data/siteData";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bg = scrolled
    ? "bg-ivory/85 backdrop-blur-xl border-b border-stone/15"
    : "bg-transparent";

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bg}`}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16 h-[72px] md:h-[84px] flex items-center justify-between">
        <a
          href="#top"
          data-testid="nav-logo"
          className="flex items-baseline gap-2 group"
          aria-label="Suntek Designs — Home"
        >
          <span className="font-serif text-[22px] md:text-[26px] tracking-[0.02em] text-charcoal leading-none">
            Suntek
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-bronze font-sans hidden md:inline">
            Designs
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="link-underline text-[13px] tracking-[0.15em] uppercase text-charcoal/85 hover:text-charcoal font-sans"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            data-testid="nav-cta-consult"
            className="hidden md:inline-flex items-center gap-2 border border-charcoal text-charcoal px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase hover:bg-charcoal hover:text-ivory transition-colors duration-500"
          >
            Book a Consultation
          </a>
          <button
            data-testid="nav-mobile-toggle"
            className="md:hidden text-charcoal"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-ivory border-t border-stone/20">
          <div className="px-6 py-8 flex flex-col gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                className="text-charcoal text-[15px] tracking-[0.15em] uppercase"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              data-testid="mobile-nav-cta"
              className="mt-2 border border-charcoal text-charcoal px-5 py-3 text-[12px] tracking-[0.2em] uppercase inline-block w-max"
            >
              Book a Consultation
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
