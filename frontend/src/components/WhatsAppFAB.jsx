import { MessageCircle } from "lucide-react";
import { SITE } from "../data/siteData";

export default function WhatsAppFAB() {
  return (
    <a
      href={SITE.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      data-testid="whatsapp-fab"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 group"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-bronze/30 blur-lg group-hover:bg-bronze/50 transition-colors" />
      <span className="relative flex items-center gap-2 bg-charcoal text-ivory rounded-full pl-4 pr-5 py-3 border border-bronze/40 hover:border-bronze transition-colors">
        <MessageCircle size={16} className="text-bronze" />
        <span className="text-[11px] tracking-[0.25em] uppercase font-sans">WhatsApp</span>
      </span>
    </a>
  );
}
