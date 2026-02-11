"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function CaseStudySpotlight() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-brand-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
                    {/* Content Side */}
                    <div className="flex-1 p-8 md:p-16 lg:p-20 space-y-8 flex flex-col justify-center">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-sm">
                                <span className="w-8 h-px bg-brand-accent" />
                                Case Study Spotlight
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                                Achieving TISAX AL3 <br />
                                <span className="text-brand-secondary">for a Global Tier 1 Supplier.</span>
                            </h2>
                        </div>

                        <p className="text-brand-mid text-lg font-medium leading-relaxed">
                            When a major German steering systems manufacturer faced an urgent AL3 requirement for a new BMW contract,
                            we stepped in to overhaul their ISMS in record time.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                "100% Pass Rate",
                                "Compliance in 88 Days",
                                "Zero Major Deviations",
                                "€120M Contract Secured"
                            ].map(item => (
                                <div key={item} className="flex items-center gap-3 text-white font-semibold">
                                    <CheckCircle2 className="text-brand-success h-5 w-5 shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button size="lg" className="w-full sm:w-auto bg-brand-secondary hover:bg-brand-secondary/90 text-white font-bold group">
                                Read Full Success Story
                                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Visualization Side */}
                    <div className="flex-1 bg-brand-light/10 relative min-h-[400px] flex items-center justify-center p-8 md:p-16">
                        {/* Abstract Representation of Security Mastery */}
                        <div className="relative w-full max-w-md aspect-square">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-brand-mid/20"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 rounded-full border border-dashed border-brand-mid/40"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="text-6xl font-black text-brand-secondary">95</div>
                                <div className="text-sm font-bold text-brand-mid uppercase tracking-widest">Readiness Score</div>
                                <div className="w-1/2 h-2 bg-brand-mid/20 rounded-full overflow-hidden mt-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "95%" }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-brand-success shadow-[0_0_10px_rgba(6,214,160,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
