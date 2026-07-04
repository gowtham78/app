import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CTA_IMAGE, SITE } from "../data/siteData";

export default function CinematicCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1.05, 1.0]);
  const overlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.65, 0.5, 0.55]);

  return (
    <section
      ref={ref}
      data-testid="cinematic-cta-section"
      className="relative h-[100vh] w-full overflow-hidden bg-charcoal"
    >
      <motion.img
        src={CTA_IMAGE}
        alt="Completed premium interior"
        style={{ scale }}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <motion.div
        className="absolute inset-0 bg-charcoal"
        style={{ opacity: overlay }}
      />
      <div className="absolute inset-0 grain" />

      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-6 md:mb-10">
              Begin the Conversation
            </div>
            <h2 className="font-serif font-light text-ivory text-5xl sm:text-6xl md:text-7xl lg:text-[112px] leading-[0.98] tracking-tight">
              Your Space.<br />
              <span className="italic text-bronze/95">Reimagined.</span>
            </h2>
            <p className="mt-8 md:mt-10 text-ivory/80 text-lg md:text-xl font-sans font-light max-w-xl leading-relaxed">
              Tell us about the home or space you want to create. We&rsquo;ll take it from there.
            </p>

            <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <a
                href="#contact"
                data-testid="cta-start-project"
                className="inline-flex items-center gap-3 bg-ivory text-charcoal px-8 py-4 text-[12px] tracking-[0.25em] uppercase hover:bg-bronze hover:text-ivory transition-colors duration-500"
              >
                Start Your Project
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="cta-whatsapp"
                className="inline-flex items-center gap-3 border border-ivory/60 text-ivory px-8 py-4 text-[12px] tracking-[0.25em] uppercase hover:bg-ivory hover:text-charcoal transition-colors duration-500"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
