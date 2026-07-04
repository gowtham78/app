import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BEFORE_AFTER } from "../data/siteData";

export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const draggingRef = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function onMove(e) {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const p = Math.max(4, Math.min(96, (x / rect.width) * 100));
      setPos(p);
    }
    function onUp() {
      draggingRef.current = false;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <section
      data-testid="before-after-section"
      className="relative bg-ivory py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
        <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-6">
              Transformation
            </div>
            <h2 className="font-serif font-light text-charcoal text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              See the Transformation.
            </h2>
          </div>
          <p className="text-charcoal/70 text-base md:text-lg font-sans font-light max-w-md">
            Drag the handle to reveal the finished space — the same room, quietly reimagined.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          ref={containerRef}
          className="relative aspect-[16/10] w-full overflow-hidden select-none"
          data-testid="before-after-slider"
        >
          {/* After (base) */}
          <img
            src={BEFORE_AFTER.after}
            alt="After renovation"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            loading="lazy"
          />
          <div className="absolute top-6 right-6 text-[10px] tracking-[0.4em] uppercase text-ivory font-sans z-10">
            After
          </div>

          {/* Before (masked) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <img
              src={BEFORE_AFTER.before}
              alt="Before renovation"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
              loading="lazy"
            />
            <div className="absolute top-6 left-6 text-[10px] tracking-[0.4em] uppercase text-ivory font-sans">
              Before
            </div>
          </div>

          {/* Handle */}
          <div
            className="absolute top-0 bottom-0 w-px bg-ivory pointer-events-none"
            style={{ left: `${pos}%` }}
          />
          <button
            data-testid="before-after-handle"
            onMouseDown={() => (draggingRef.current = true)}
            onTouchStart={() => (draggingRef.current = true)}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-ivory border border-bronze shadow-[0_0_0_6px_rgba(253,251,247,0.15)] flex items-center justify-center cursor-ew-resize"
            style={{ left: `${pos}%` }}
            aria-label="Drag to reveal transformation"
          >
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
              <path d="M6 1L1 6l5 5M16 1l5 5-5 5" stroke="#A68A64" strokeWidth="1.4" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
