"use client";

import { motion } from "framer-motion";

const logos = [
    "BMW GROUP", "VOLKSWAGEN", "MERCEDES-BENZ", "AUDI", "PORSCHE", "CONTINENTAL", "ZF GROUP", "ROBERT BOSCH"
];

export function ClientLogos() {
    return (
        <section className="py-16 bg-white overflow-hidden border-b border-brand-light">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-bold text-brand-mid uppercase tracking-[0.2em]">
                    Empowering Leading Automotive Suppliers
                </p>
            </div>

            <div className="relative flex overflow-x-hidden">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-16 items-center"
                >
                    {/* Double the logos for seamless scroll */}
                    {[...logos, ...logos].map((logo, index) => (
                        <span
                            key={index}
                            className="text-2xl md:text-3xl font-black text-brand-mid/20 hover:text-brand-primary transition-colors cursor-default select-none tracking-tighter"
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
