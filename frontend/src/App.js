import "@/index.css";
import Navigation from "@/components/Navigation";
import GoldenCursor from "@/components/GoldenCursor";
import ImmersiveHero from "@/components/ImmersiveHero";
import DoorTransition from "@/components/DoorTransition";
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
      <GoldenCursor />
      <Navigation />
      <main>
        <ImmersiveHero />
        <DoorTransition />
        <SelectedProjects />
        <Introduction />
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
            background: "#11110F",
            color: "#F3F0E8",
            border: "1px solid #B89A5B",
            borderRadius: 0,
            fontFamily: "Outfit, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
