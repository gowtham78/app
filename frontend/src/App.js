import "@/index.css";
import Navigation from "@/components/Navigation";
import ImmersiveHero from "@/components/ImmersiveHero";
import HeroTransition from "@/components/HeroTransition";
import Introduction from "@/components/Introduction";
import SelectedProjects from "@/components/SelectedProjects";
import Services from "@/components/Services";
import WhySuntek from "@/components/WhySuntek";
import Process from "@/components/Process";
import BeforeAfter from "@/components/BeforeAfter";
import Testimonials from "@/components/Testimonials";
import CinematicCTA from "@/components/CinematicCTA";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { Toaster } from "@/components/ui/sonner";
import useLenis from "@/hooks/useLenis";

function App() {
  useLenis();
  return (
    <div className="App bg-ivory text-charcoal min-h-screen">
      <Navigation />
      <main>
        <ImmersiveHero />
        <HeroTransition />
        <Introduction />
        <SelectedProjects />
        <Services />
        <WhySuntek />
        <Process />
        <BeforeAfter />
        <Testimonials />
        <CinematicCTA />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppFAB />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#171714",
            color: "#F1EFE9",
            border: "1px solid #A68A64",
            borderRadius: 0,
            fontFamily: "Outfit, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
