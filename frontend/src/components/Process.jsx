import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROCESS } from "../data/siteData";

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="process"
      data-testid="process-section"
      ref={ref}
      className="relative bg-beige/25 py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="mb-20 md:mb-28 max-w-3xl">
          <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-6">
            How It Works
          </div>
          <h2 className="font-serif font-light text-charcoal text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            A quiet, considered<br />
            process.
          </h2>
        </div>

        <div className="relative pl-8 md:pl-16">
          {/* Static track */}
          <div className="absolute left-2 md:left-8 top-0 bottom-0 w-px bg-charcoal/15" />
          {/* Animated progress line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-2 md:left-8 top-0 w-px bg-bronze origin-top"
          />

          <ol className="space-y-16 md:space-y-24">
            {PROCESS.map((p, i) => (
              <motion.li
                key={p.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
                data-testid={`process-step-${p.n}`}
              >
                <div className="absolute -left-[27px] md:-left-[41px] top-2 w-2.5 h-2.5 rounded-full bg-bronze ring-4 ring-beige/25" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                  <div className="md:col-span-3 font-serif text-3xl md:text-4xl text-charcoal/40 leading-none">
                    {p.n}
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-serif font-light text-charcoal text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-4 md:mt-5 text-charcoal/70 text-base md:text-lg font-sans font-light leading-relaxed max-w-2xl">
                      {p.body}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
