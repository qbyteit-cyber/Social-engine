"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function ServiceHero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-brand-dark">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
                            Enabling Business Growth through <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-success">
                                Secure IT Infrastructure
                            </span>
                        </h1>
                        <p className="text-xl text-brand-mid mb-10 max-w-2xl mx-auto leading-relaxed">
                            Comprehensive IT solutions designed for resilience, compliance, and scalability. We manage your technology so you can focus on your core business.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Link href="/contact">
                                <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white min-w-[200px] h-12 text-base">
                                    Get a Custom Quote
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="#services-list">
                                <Button variant="outline" size="lg" className="border-brand-mid/50 text-white hover:bg-brand-mid/10 min-w-[200px] h-12 text-base">
                                    Explore Services
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-brand-mid/80">
                            <div className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 text-brand-success mr-2" />
                                24/7 Monitoring & Support
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 text-brand-success mr-2" />
                                ISO 27001 Certified Processes
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 text-brand-success mr-2" />
                                Proactive Threat Mitigation
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
