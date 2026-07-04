import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [cinemaMode, setCinemaMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const winH = window.innerHeight;
      // Hero (400vh) + transition (220vh) = ~620vh of pinned scroll
      // Enter "site" mode after ~5.6vh worth of scroll into the transition end
      setCinemaMode(y < winH * 5.6);
      setScrolled(y > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = cinemaMode ? "text-[#F1EFE9]" : "text-charcoal";
  const bg =
    cinemaMode
      ? "bg-transparent"
      : scrolled
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
          className={`flex items-baseline gap-2 group ${textColor}`}
          aria-label="Suntek Designs — Home"
        >
          <span className="font-display text-[22px] md:text-[24px] tracking-[-0.01em] leading-none">
            Suntek
          </span>
          <span className={`text-[9px] tracking-[0.4em] uppercase font-sans ${cinemaMode ? "text-[#B8B1A5]" : "text-bronze"} hidden md:inline`}>
            Designs
          </span>
        </a>

        {/* Center links — hidden in cinema mode */}
        {!cinemaMode && (
          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className="link-underline text-[12px] tracking-[0.2em] uppercase text-charcoal/85 hover:text-charcoal font-sans"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-5">
          {!cinemaMode && (
            <a
              href="#contact"
              data-testid="nav-cta-consult"
              className="hidden md:inline-flex items-center gap-2 border border-charcoal text-charcoal px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase hover:bg-charcoal hover:text-ivory transition-colors duration-500"
            >
              Book a Consultation
            </a>
          )}
          <button
            data-testid="nav-menu-toggle"
            className={`inline-flex items-center gap-2 ${textColor}`}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="text-[10px] tracking-[0.35em] uppercase font-sans hidden sm:inline">
              Menu
            </span>
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Full-screen architectural overlay menu */}
      <div
        data-testid="menu-overlay"
        className={`fixed inset-0 bg-[#0a0908] z-[60] transition-all duration-700 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="grain absolute inset-0" />
        <div className="relative h-full w-full flex flex-col">
          <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-[72px] md:h-[84px] border-b border-[#F1EFE9]/10">
            <div className="text-[10px] tracking-[0.4em] uppercase text-[#B8B1A5] font-sans">
              Suntek Designs — Since 2007
            </div>
            <button
              onClick={() => setOpen(false)}
              data-testid="menu-close"
              className="inline-flex items-center gap-2 text-[#F1EFE9]"
              aria-label="Close menu"
            >
              <span className="text-[10px] tracking-[0.35em] uppercase font-sans">Close</span>
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 gap-2 md:gap-4">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                data-testid={`overlay-link-${l.label.toLowerCase()}`}
                className="group flex items-baseline gap-6 md:gap-8"
              >
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#A68A64] font-sans w-8">
                  0{i + 1}
                </span>
                <span className="font-display text-[#F1EFE9] group-hover:text-[#B8B1A5] transition-colors duration-500" style={{ fontSize: "clamp(3rem, 9vw, 8rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {l.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="px-6 md:px-16 lg:px-24 py-8 border-t border-[#F1EFE9]/10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-[#F1EFE9]/80 text-sm font-sans font-light">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#A68A64] mb-2">Contact</div>
              <a href="tel:+6584637889" className="link-underline">+65 8463 7889</a>
              <br />
              <a href="mailto:suntekdesigns@gmail.com" className="link-underline">suntekdesigns@gmail.com</a>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#A68A64] mb-2">Showroom</div>
              160 Changi Rd, #04-04 HexaCube<br />Singapore 419728
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#A68A64] mb-2">Workshop</div>
              1 Tampines North Dr. 1, #03-18<br />Singapore 528559
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
