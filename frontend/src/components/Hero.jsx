import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO_PANORAMA } from "../data/siteData";

// Panning phases mapped to scroll progress (0..1 within hero container).
// Text steps switch by scroll ranges.
const CAPTIONS = [
  { start: 0.0, end: 0.2, overline: "SUNTEK DESIGNS — SINCE 2007", title: "Spaces Designed\nAround You.", sub: "Interior design and renovation, crafted with precision since 2007." },
  { start: 0.2, end: 0.45, overline: "THE LIVING SPACE", title: "Designed for\nLiving.", sub: "Where light, texture and proportion come together." },
  { start: 0.45, end: 0.7, overline: "CRAFTSMANSHIP", title: "Crafted\nto Last.", sub: "Custom carpentry, considered detail, honest materials." },
  { start: 0.7, end: 1.0, overline: "THE VISION", title: "From Vision\nto Reality.", sub: "Every space we shape begins as a conversation." },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Simulate 360° camera pan by translating panorama horizontally from 0 to -50%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.15]);
  const vignette = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.55, 0.35, 0.35, 0.7]);

  return (
    <section
      ref={ref}
      id="top"
      data-testid="hero-section"
      className="relative w-full"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-charcoal">
        {/* Panorama — width is 200% so translating -50% pans across */}
        <motion.div
          className="absolute inset-y-0 left-0 h-full"
          style={{ width: "200%", x, scale }}
        >
          <img
            src={HERO_PANORAMA}
            alt="Modern luxury interior panorama"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        {/* Cinematic vignette overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
            opacity: vignette,
          }}
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal/60" />

        {/* Captions */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24">
          {CAPTIONS.map((c, i) => (
            <Caption
              key={i}
              index={i}
              scrollYProgress={scrollYProgress}
              start={c.start}
              end={c.end}
              overline={c.overline}
              title={c.title}
              sub={c.sub}
            />
          ))}

          {/* CTAs — visible only in first caption */}
          <CTAGroup scrollYProgress={scrollYProgress} />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-ivory/80">
          <span className="text-[10px] tracking-[0.4em] uppercase font-sans">Scroll to explore</span>
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4], y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-ivory/60"
          />
        </div>
      </div>
    </section>
  );
}

function Caption({ scrollYProgress, start, end, overline, title, sub, index }) {
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.03), start + 0.02, end - 0.03, Math.min(1, end + 0.02)],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [start, end], [20, -20]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute left-6 right-6 md:left-16 md:right-16 lg:left-24 lg:right-24 max-w-4xl"
      data-testid={`hero-caption-${index}`}
    >
      <div className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-bronze/90 mb-4 md:mb-6 font-sans">
        {overline}
      </div>
      <h1 className="font-serif font-light text-ivory text-[46px] sm:text-6xl md:text-7xl lg:text-[104px] leading-[0.98] tracking-tight whitespace-pre-line">
        {title}
      </h1>
      <p className="mt-6 md:mt-8 text-ivory/80 text-[15px] md:text-lg font-sans font-light max-w-xl leading-relaxed">
        {sub}
      </p>
    </motion.div>
  );
}

function CTAGroup({ scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [0, 0.14, 0.18], [1, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute left-6 right-6 md:left-16 lg:left-24 bottom-32 md:bottom-24 flex flex-col sm:flex-row gap-4 sm:gap-6"
    >
      <a
        href="#projects"
        data-testid="hero-cta-explore"
        className="inline-flex items-center gap-3 bg-ivory text-charcoal px-7 py-4 text-[12px] tracking-[0.25em] uppercase hover:bg-bronze hover:text-ivory transition-colors duration-500"
      >
        Explore Our Work
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </a>
      <a
        href="#contact"
        data-testid="hero-cta-consultation"
        className="inline-flex items-center gap-3 border border-ivory/70 text-ivory px-7 py-4 text-[12px] tracking-[0.25em] uppercase hover:bg-ivory hover:text-charcoal transition-colors duration-500"
      >
        Book a Consultation
      </a>
    </motion.div>
  );
}
