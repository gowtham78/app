import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICES } from "../data/siteData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative bg-ivory py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
        <div className="mb-16 md:mb-24 max-w-3xl">
          <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-6">
            What We Do
          </div>
          <h2 className="font-serif font-light text-charcoal text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            Everything under<br />
            one roof.
          </h2>
        </div>

        {/* Desktop — hover reveal list */}
        <div className="hidden md:grid grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="col-span-7">
            <ul>
              {SERVICES.map((s, i) => (
                <li
                  key={s.id}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  data-testid={`service-item-${s.id}`}
                  className="border-t border-charcoal/15 last:border-b py-8 lg:py-10 group cursor-pointer"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="text-xs tracking-[0.3em] uppercase text-charcoal/40 font-sans w-10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`font-serif font-light text-3xl lg:text-5xl leading-tight tracking-tight transition-colors duration-500 ${
                        active === i ? "text-bronze" : "text-charcoal group-hover:text-bronze"
                      }`}
                    >
                      {s.title}
                    </h3>
                  </div>
                  <AnimatePresence>
                    {active === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="pl-16 mt-4 text-charcoal/70 text-base md:text-lg font-sans font-light max-w-xl overflow-hidden"
                      >
                        {s.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-5 sticky top-24">
            <div className="relative aspect-[4/5] overflow-hidden bg-beige/40">
              <AnimatePresence mode="wait">
                <motion.img
                  key={SERVICES[active].id}
                  src={SERVICES[active].image}
                  alt={SERVICES[active].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] tracking-[0.3em] uppercase text-ivory font-sans">
                <span>{SERVICES[active].title}</span>
                <span>{String(active + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden">
          <Accordion type="single" collapsible defaultValue="item-0" data-testid="services-accordion">
            {SERVICES.map((s, i) => (
              <AccordionItem key={s.id} value={`item-${i}`} className="border-charcoal/15">
                <AccordionTrigger
                  className="text-left font-serif text-2xl text-charcoal py-6 hover:no-underline"
                  data-testid={`service-mobile-trigger-${s.id}`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-bronze font-sans">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-charcoal/70 text-base leading-relaxed pl-10 pb-8 font-sans font-light">
                  <div className="aspect-[4/3] mb-5 overflow-hidden -ml-10">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  {s.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
