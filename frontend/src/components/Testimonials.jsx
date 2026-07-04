import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "../data/siteData";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];

  const go = (dir) => {
    setI((prev) => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section
      data-testid="testimonials-section"
      className="relative bg-beige/25 py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-14 md:mb-20">
          Client Stories
        </div>

        <div className="min-h-[280px] md:min-h-[360px] relative">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              data-testid={`testimonial-${i}`}
              className="max-w-5xl"
            >
              <p className="font-serif font-light italic text-charcoal text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-10 md:mt-14 flex items-baseline gap-4">
                <div className="w-10 h-px bg-bronze" />
                <div>
                  <div className="font-sans text-[13px] tracking-[0.15em] uppercase text-charcoal">
                    {t.name}
                  </div>
                  <div className="text-charcoal/60 text-sm font-sans mt-1">{t.meta}</div>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-14 md:mt-20 flex items-center justify-between border-t border-charcoal/15 pt-6">
          <div className="text-xs tracking-[0.3em] uppercase text-charcoal/60 font-sans">
            {String(i + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => go(-1)}
              data-testid="testimonial-prev"
              className="w-12 h-12 border border-charcoal/30 hover:border-bronze hover:text-bronze transition-colors flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => go(1)}
              data-testid="testimonial-next"
              className="w-12 h-12 border border-charcoal/30 hover:border-bronze hover:text-bronze transition-colors flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
