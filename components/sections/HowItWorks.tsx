"use client";

import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        title: "Gap Analysis",
        description: "A comprehensive assessment of your current ISMS status against TISAX/ISO requirements. We identify precisely what's missing."
    },
    {
        number: "02",
        title: "Roadmap Design",
        description: "We build a customized implementation plan with clear milestones, resource allocation, and a 95-day target for readiness."
    },
    {
        number: "03",
        title: "Implementation",
        description: "Hands-on support for policy creation, technical controls, and employee training. We do the heavy lifting for you."
    },
    {
        number: "04",
        title: "Final Audit Support",
        description: "Pre-audit verification and on-site support during the official assessment. We ensure a 98% first-time pass rate."
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-brand-dark text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Our Proven <span className="text-brand-accent">Success Path.</span>
                    </h2>
                    <p className="text-lg text-brand-mid font-medium">
                        A standardized, 4-step methodology designed for speed, accuracy, and minimum business disruption.
                    </p>
                </div>

                <div className="relative">
                    {/* Horizontal Line for Desktop */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-brand-mid/20 hidden lg:block -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div className="relative">
                                    <div className="text-6xl font-black text-brand-mid/10 tabular-nums">
                                        {step.number}
                                    </div>
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-accent shadow-[0_0_15px_rgba(255,107,53,0.5)]" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                    <p className="text-brand-mid text-sm leading-relaxed font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
