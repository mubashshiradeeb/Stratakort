import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Gallery } from "@/components/landing/Gallery";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Gallery />
      <FAQ />
      <Footer />
    </main>
  );
}
