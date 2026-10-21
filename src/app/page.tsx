import { MotionProvider } from "@/components/MotionProvider";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Philosophy } from "@/components/Philosophy";
import { HouseSection } from "@/components/motion/HouseSection";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <MotionProvider>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Philosophy />
        <HouseSection />
        <Services />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </MotionProvider>
  );
}
