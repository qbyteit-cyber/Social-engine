"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const SecurityShield = dynamic(() => import("./SecurityShield"), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] flex items-center justify-center text-brand-accent/50">Initializing Secure Proto...</div>
});

export function FinalCTA() {
    return (
        <section className="py-24 bg-brand-dark relative overflow-hidden">
            {/* Dark Tech Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.05),transparent_70%)]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-left space-y-8 order-2 lg:order-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                        >
                            Ready to Secure Your <br />
                            <span className="text-brand-accent italic drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">Automotive Future?</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-xl md:text-2xl text-slate-400 font-medium"
                        >
                            Join 200+ Tier 1 suppliers who have scaled their business through proven information security. We don't just protect data; we protect growth.
                        </motion.p>

                        <motion.div
                            id="gap-assessment-trigger"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="flex flex-col sm:flex-row items-center gap-6 pt-4"
                        >
                            <Button size="lg" className="w-full sm:w-auto bg-brand-accent hover:bg-white text-brand-dark font-black text-lg px-12 h-16 rounded-lg group shadow-[0_10px_20px_rgba(0,243,255,0.2)] transition-all duration-300">
                                Book Free Gap Assessment
                                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <div className="text-white font-bold flex flex-col items-center sm:items-start group cursor-pointer">
                                <span className="text-xs text-slate-500 uppercase tracking-widest">Call Directly</span>
                                <a href="tel:+40741711770" className="text-xl group-hover:text-brand-accent transition-colors">+40 741 711 770</a>
                            </div>
                        </motion.div>
                    </div>

                    <div className="order-1 lg:order-2 flex justify-center">
                        <SecurityShield />
                    </div>
                </div>
            </div>
        </section>
    );
}
