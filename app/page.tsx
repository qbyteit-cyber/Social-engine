import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { ValueProps } from "@/components/sections/ValueProps";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CaseStudySpotlight } from "@/components/sections/CaseStudySpotlight";
import { TeamCredentials } from "@/components/sections/TeamCredentials";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <ClientLogos />
        <ValueProps />
        <ServicesOverview />
        <HowItWorks />
        <CaseStudySpotlight />
        <TeamCredentials />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
