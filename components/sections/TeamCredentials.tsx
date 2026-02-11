"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Users, GraduationCap } from "lucide-react";
import Image from "next/image";

const credentials = [
    { icon: Shield, label: "TISAX Qualified Professionals" },
    { icon: Award, label: "ISO 27001 Lead Auditors" },
    { icon: GraduationCap, label: "VDA ISA Experts" },
    { icon: Users, label: "500+ Assessments Guided" }
];

export function TeamCredentials() {
    return (
        <section className="py-24 bg-brand-light/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <Badge variant="outline" className="border-brand-primary text-brand-primary px-4 py-1 font-bold">
                                Meet the Experts
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold text-brand-dark tracking-tight leading-tight">
                                The European Specialists in <span className="text-brand-primary">Automotive Compliance.</span>
                            </h2>
                        </div>

                        <p className="text-lg text-brand-mid font-medium leading-relaxed">
                            Founded by <strong>Iulian Bozdoghina</strong>, ITIS Secure was born from a mission to simplify the complex landscape of automotive security for global suppliers.
                            Our team consists of veteran auditors and security designers who have sat on both sides of the assessment table.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                            {credentials.map((cred, index) => (
                                <div key={cred.label} className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-white shadow-sm text-brand-primary">
                                        <cred.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-brand-dark text-sm">{cred.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Abstract visual for team/authority */}
                        <div className="relative aspect-square max-w-md mx-auto">
                            <div className="absolute inset-0 bg-brand-primary rounded-3xl rotate-3" />
                            <div className="absolute inset-0 bg-white rounded-3xl border border-brand-light shadow-xl p-8 flex flex-col justify-end overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light rounded-full -mr-16 -mt-16" />
                                <div className="relative z-10 space-y-4">
                                    <div className="text-3xl font-black text-brand-primary uppercase italic tracking-tighter">
                                        "Compliance is the <br /> Gateway to Growth."
                                    </div>
                                    <div>
                                        <div className="font-bold text-brand-dark">Iulian Bozdoghina</div>
                                        <div className="text-sm font-semibold text-brand-mid">Founder & Lead Auditor</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
