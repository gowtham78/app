import { motion } from "framer-motion";
import { WHY } from "../data/siteData";

export default function WhySuntek() {
  return (
    <section
      data-testid="why-section"
      className="relative bg-ivory py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left large image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative aspect-[4/5] overflow-hidden"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1704040686428-7534b262d0d8?crop=entropy&cs=srgb&fm=jpg&q=90&w=2000"
              alt="Considered interior craftsmanship"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-ivory">
              <div className="text-[10px] tracking-[0.4em] uppercase font-sans">Since 2007</div>
              <div className="font-serif italic text-lg">by Suntek Designs</div>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="lg:col-span-6">
            <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-6">
              Why Suntek
            </div>
            <h2 className="font-serif font-light text-charcoal text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mb-12">
              Design excellence, backed by experience.
            </h2>

            <div className="space-y-8">
              {WHY.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  data-testid={`why-item-${i}`}
                  className="flex gap-6 border-t border-charcoal/15 pt-6"
                >
                  <div className="text-[11px] tracking-[0.3em] uppercase text-bronze font-sans pt-1 w-10">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="font-serif text-2xl text-charcoal mb-2">{w.title}</div>
                    <p className="text-charcoal/70 text-[15px] md:text-base font-sans font-light leading-relaxed max-w-xl">
                      {w.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
