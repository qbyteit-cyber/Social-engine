import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServicesList } from "@/components/sections/ServicesList";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function ServicesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <ServiceHero />
                <ServicesList />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    );
}
