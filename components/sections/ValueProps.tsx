"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, TrendingUp } from "lucide-react";


// Actually I'll just use the Card from ui/card I previously customized
import { Card as UICard, CardHeader as UICardHeader, CardTitle as UICardTitle, CardContent as UICardContent } from "@/components/ui/card";

const props = [
    {
        title: "Speed & Efficiency",
        description: "Our proprietary framework gets you TISAX-ready in less than 4 months, compared to the industry average of 9-12 months.",
        icon: Zap,
        color: "text-brand-accent",
        bg: "bg-brand-accent/10"
    },
    {
        title: "Expert Precision",
        description: "Led by ISO 27001 Lead Auditors with 500+ successful assessments. We know exactly what auditors look for in AL3 environments.",
        icon: ShieldCheck,
        color: "text-brand-primary",
        bg: "bg-brand-primary/10"
    },
    {
        title: "Revenue-First Compliance",
        description: "We don't just secure your data; we secure your contracts. Win Tier 1 status and maintain your competitive edge in the OEM supply chain.",
        icon: TrendingUp,
        color: "text-brand-success",
        bg: "bg-brand-success/10"
    }
];

export function ValueProps() {
    return (
        <section className="py-24 bg-brand-light/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark tracking-tight">
                        Compliance Built for <span className="text-brand-primary">Automotive Growth.</span>
                    </h2>
                    <p className="text-lg text-brand-mid font-medium">
                        We move at the speed of the industry, ensuring your security roadmap aligns perfectly with your business goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {props.map((prop, index) => (
                        <motion.div
                            key={prop.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <UICard className="h-full border-none shadow-none bg-white">
                                <UICardHeader className="pb-4">
                                    <div className={`w-14 h-14 rounded-lg ${prop.bg} flex items-center justify-center mb-4`}>
                                        <prop.icon className={`w-8 h-8 ${prop.color}`} />
                                    </div>
                                    <UICardTitle className="text-2xl font-bold text-brand-dark">{prop.title}</UICardTitle>
                                </UICardHeader>
                                <UICardContent className="text-brand-mid leading-relaxed font-medium">
                                    {prop.description}
                                </UICardContent>
                            </UICard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
