"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Lock, FileCheck, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const services = [
    {
        title: "TISAX Assessment",
        description: "End-to-end guidance for VDA ISA compliance. Achieve AL3 status and secure your position in the automotive supply chain.",
        icon: Shield,
        link: "/services/tisax-assessment",
        popular: true,
        tags: ["VDA ISA", "AL2/AL3"]
    },
    {
        title: "ISO 27001 Certification",
        description: "Design and implement an international standard ISMS. Comprehensive support from gap analysis to successful audit.",
        icon: Lock,
        link: "/services/iso-27001",
        tags: ["ISMS", "Accredited"]
    },
    {
        title: "TPISR Compliance",
        description: "Third-party information security requirements for major OEMs. Specialized assessments for BMW and VW suppliers.",
        icon: FileCheck,
        link: "/services/tpisr",
        tags: ["OEM Specific"]
    },
    {
        title: "GDPR & Data Privacy",
        description: "Seamless integration of data protection requirements into your IT infrastructure. Compliant with EU regulations.",
        icon: Users,
        link: "/services/gdpr",
        tags: ["EU Lex"]
    }
];

function ParallaxCard({ children, index }: { children: React.ReactNode; index: number }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Create different parallax speeds for even/odd cards to create depth
    const y = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 20 : -20, index % 2 === 0 ? -20 : 20]);

    return (
        <motion.div ref={ref} style={{ y }} className="flex h-full relative group">
            {/* Industry Trace: Scanning Line */}
            <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-brand-accent/30 z-20 pointer-events-none group-hover:bg-brand-accent/60"
            />
            {children}
        </motion.div>
    );
}

export function ServicesOverview() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark tracking-tight leading-tight">
                            Enterprise-Grade <span className="text-brand-primary">Security Solutions.</span>
                        </h2>
                        <p className="text-lg text-brand-mid font-medium">
                            Tailored compliance strategies for Tier 1 and Tier 2 automotive suppliers. We handle the complexity, you focus on the manufacturing.
                        </p>
                    </div>
                    <Button variant="outline" className="hidden md:flex">
                        View All Services
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <ParallaxCard key={service.title} index={index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="w-full"
                            >
                                <Card className="group border-brand-light flex flex-col hover:border-brand-primary hover:shadow-xl transition-all duration-500 h-full">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 rounded-lg bg-brand-light/50 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                                                <service.icon className="w-6 h-6" />
                                            </div>
                                            {service.popular && (
                                                <Badge variant="default" className="bg-brand-accent text-[10px] uppercase font-bold text-brand-dark">
                                                    Most Popular
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl font-bold group-hover:text-brand-primary transition-colors">
                                            {service.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-brand-mid text-sm leading-relaxed font-medium mb-6">
                                            {service.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-white">
                                            {service.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold text-brand-mid/60 bg-brand-light px-2 py-1 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Link href={service.link} className="w-full">
                                            <Button variant="ghost" className="w-full justify-between group/btn text-brand-primary font-bold hover:bg-brand-primary hover:text-white">
                                                Explore Service
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </ParallaxCard>
                    ))}
                </div>

                <div className="mt-12 md:hidden">
                    <Button variant="outline" className="w-full">
                        View All Services
                    </Button>
                </div>
            </div>
        </section>
    );
}
