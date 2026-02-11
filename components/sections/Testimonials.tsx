"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        quote: "ITIS Secure didn't just help us pass TISAX; they transformed how we think about information security. Their expert precision is unmatched.",
        author: "CEO, Tier 1 Electronic Systems Provider",
        rating: 5
    },
    {
        quote: "Securing an AL3 status in under 3 months seemed impossible until we met Iulian and his team. A truly revenue-generating partnership.",
        author: "IT Director, Automotive Logistics Group",
        rating: 5
    },
    {
        quote: "The gap assessment was eye-opening. They identified critical vulnerabilities that others missed, ensuring we were 100% ready for the audit.",
        author: "Security Manager, Chassis Components Mfg",
        rating: 5
    }
];

export function Testimonials() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark tracking-tight">
                        Trusted by the <span className="text-brand-secondary">Best in Automotive.</span>
                    </h2>
                    <p className="text-lg text-brand-mid font-medium">
                        Hear from the leaders who have secured their future in the OEM supply chain with our guidance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-brand-light/30 p-8 rounded-2xl relative flex flex-col"
                        >
                            <Quote className="absolute top-6 right-8 text-brand-secondary/20 w-12 h-12" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                                ))}
                            </div>
                            <p className="text-brand-dark font-medium leading-relaxed italic mb-8 flex-1">
                                "{t.quote}"
                            </p>
                            <div>
                                <div className="font-bold text-brand-primary">{t.author}</div>
                                <div className="text-xs font-semibold text-brand-mid uppercase tracking-widest mt-1">Verified Partner</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
