"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
    { label: "First-time Pass Rate", value: 98, suffix: "%" },
    { label: "Contracts Secured", value: 847, prefix: "€", suffix: "M" },
    { label: "Lead Auditors", value: 12, suffix: "" },
    { label: "GDPR Compliance", value: 100, suffix: "%" },
];

function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            const duration = 2; // seconds
            const increment = end / (duration * 60);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 1000 / 60);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export function StatsBar() {
    return (
        <section className="bg-brand-dark py-12 border-y border-brand-mid/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center space-y-2"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            </div>
                            <div className="text-xs md:text-sm font-semibold text-brand-mid uppercase tracking-widest">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
