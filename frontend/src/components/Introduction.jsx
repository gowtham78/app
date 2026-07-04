import { motion } from "framer-motion";
import CountUp from "./CountUp";
import { STATS } from "../data/siteData";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Introduction() {
  return (
    <section
      id="about"
      data-testid="introduction-section"
      className="relative bg-ivory py-24 md:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* Overline */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={fadeUp}
          className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-8 md:mb-12"
        >
          Suntek Designs — Since 2007
        </motion.div>

        {/* Editorial statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={fadeUp}
            className="lg:col-span-8 font-serif font-light text-charcoal text-[38px] sm:text-5xl md:text-6xl lg:text-[76px] leading-[1.05] tracking-tight"
          >
            We don&rsquo;t just renovate spaces. <span className="text-bronze italic">We shape</span> the way people live.
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="lg:col-span-4 lg:pt-4"
          >
            <p className="text-charcoal/75 text-[15px] md:text-lg leading-relaxed font-sans font-light">
              Part of the Suntek Groups and rooted in Singapore, we are a BCA & HDB registered
              interior design studio. For over sixteen years we&rsquo;ve quietly built a reputation for
              considered residential and commercial spaces &mdash; designed with restraint,
              built with care.
            </p>
            <p className="mt-6 text-charcoal/75 text-[15px] md:text-lg leading-relaxed font-sans font-light">
              Everything from carpentry to finishing is handled in-house &mdash; so nothing is
              lost between the drawing and the door frame.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-24 md:mt-32 grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex flex-col gap-3 border-t border-charcoal/20 pt-6"
            >
              <div className="font-serif font-light text-charcoal text-5xl md:text-6xl lg:text-7xl leading-none">
                <CountUp to={s.value} suffix={s.suffix} duration={s.value > 500 ? 2.4 : 1.6} />
              </div>
              <div className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-charcoal/60 font-sans">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
