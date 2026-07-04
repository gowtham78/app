import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const CHAPTERS = ["Entrance", "Living", "Kitchen", "Craft", "Reimagined", "Projects", "Services"];

/**
 * Header — strict shared-grid alignment. Cinema mode during dark hero (gold logo,
 * ivory menu). Transitions to charcoal on light sections. Chapter indicator + Menu
 * anchored to the same right gutter.
 */
export default function Navigation() {
  const [cinemaMode, setCinemaMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const chapterRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const winH = window.innerHeight;
      // Hero (220vh) + transition (120vh) ≈ 3.4 viewports of pinned scroll before ivory
      setCinemaMode(y < winH * 3.0);
      setScrolled(y > 60);

      // Chapter progression across the whole page — very subtle
      let idx = 0;
      const heroEnd = winH * 2.2;
      const transEnd = winH * 3.4;
      if (y < heroEnd) idx = Math.min(4, Math.floor((y / heroEnd) * 5));
      else if (y < transEnd) idx = 5;
      else idx = 6;
      if (chapterRef.current) chapterRef.current.textContent = `0${idx + 1} / 0${CHAPTERS.length}`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoColor = cinemaMode ? "text-[#D2B879]" : "text-charcoal";
  const menuColor = cinemaMode ? "text-[#F3F0E8]" : "text-charcoal";
  const bg = cinemaMode
    ? "bg-transparent"
    : scrolled
    ? "bg-ivory/85 backdrop-blur-xl border-b border-stone/25"
    : "bg-transparent";

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-700 ${bg}`}
    >
      {/* Shared grid: 6vw gutter on both sides, max 1800px, 28-32px top padding */}
      <div className="mx-auto max-w-[1800px] px-[6vw] pt-6 md:pt-7 pb-4 flex items-baseline justify-between">
        <a
          href="#top"
          data-testid="nav-logo"
          data-cursor="expand"
          className={`flex items-baseline gap-3 ${logoColor}`}
          aria-label="Suntek Designs — Home"
        >
          <span className="font-display leading-none" style={{ fontSize: "clamp(24px, 2vw, 34px)", letterSpacing: "-0.01em", fontWeight: 400 }}>
            Suntek
          </span>
          <span className={`text-[9px] tracking-[0.45em] uppercase font-sans ${cinemaMode ? "text-[#B89A5B]" : "text-bronze"} hidden sm:inline`} style={{ letterSpacing: "0.4em" }}>
            Designs
          </span>
        </a>

        <div className={`flex items-baseline gap-6 md:gap-10 ${menuColor}`}>
          <span
            ref={chapterRef}
            data-testid="header-chapter"
            className="text-[10px] tracking-[0.4em] uppercase font-sans opacity-80 hidden sm:inline"
          >
            01 / 07
          </span>
          <span className="hidden md:inline w-8 h-px bg-current/40" />
          <button
            data-testid="nav-menu-toggle"
            data-cursor="expand"
            className="inline-flex items-baseline gap-2 magnetic"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="text-[11px] tracking-[0.35em] uppercase font-sans">Menu</span>
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* Full-screen architectural overlay menu */}
      <div
        data-testid="menu-overlay"
        className={`fixed inset-0 bg-[#11110F] z-[60] transition-opacity duration-700 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="grain absolute inset-0" />
        <div className="relative h-full w-full flex flex-col">
          <div className="mx-auto max-w-[1800px] w-full px-[6vw] pt-6 md:pt-7 flex items-center justify-between border-b border-[#F3F0E8]/10 pb-4">
            <div className="text-[10px] tracking-[0.4em] uppercase text-[#B89A5B] font-sans">
              Suntek Designs — Since 2007
            </div>
            <button onClick={() => setOpen(false)} data-testid="menu-close" data-cursor="expand"
                    className="inline-flex items-center gap-2 text-[#F3F0E8]" aria-label="Close menu">
              <span className="text-[10px] tracking-[0.35em] uppercase font-sans">Close</span>
              <X size={16} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center mx-auto max-w-[1800px] w-full px-[6vw] gap-2 md:gap-4">
            {links.map((l, i) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                 data-testid={`overlay-link-${l.label.toLowerCase()}`}
                 data-cursor="expand"
                 className="group flex items-baseline gap-6 md:gap-8">
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#B89A5B] font-sans w-8">
                  0{i + 1}
                </span>
                <span className="font-display text-[#F3F0E8] group-hover:text-[#D2B879] transition-colors duration-500"
                      style={{ fontSize: "clamp(3rem, 9vw, 8rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {l.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="mx-auto max-w-[1800px] w-full px-[6vw] py-8 border-t border-[#F3F0E8]/10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-[#F3F0E8]/80 text-sm font-sans font-light">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#B89A5B] mb-2">Contact</div>
              <a href="tel:+6584637889" className="link-underline">+65 8463 7889</a><br />
              <a href="mailto:suntekdesigns@gmail.com" className="link-underline">suntekdesigns@gmail.com</a>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#B89A5B] mb-2">Showroom</div>
              160 Changi Rd, #04-04 HexaCube<br />Singapore 419728
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#B89A5B] mb-2">Workshop</div>
              1 Tampines North Dr. 1, #03-18<br />Singapore 528559
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
