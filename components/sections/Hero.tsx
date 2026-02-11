"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Download } from "lucide-react";
import dynamic from "next/dynamic";

const HeroBackground = dynamic(() => import("./HeroBackground"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-slate-950" />
});

const LOG_ENTRIES = [
    "INITIALIZING_TLS_1.3_HANDSHAKE...",
    "NODE_ALPHA_VALIDATED_SESSION_77X",
    "ENCRYPTING_PACKET_STREAM_AES_256",
    "BYPASS_ATEMPT_BLOCKED_IP_REDACTED",
    "AUT_COMM_PROTOCOL_STABLE",
    "VDA_ISA_REQUIREMENTS_SYNCED",
    "TISAX_LEVEL_3_ENFORCED",
    "REALTIME_THREAT_SCAN_ACTIVE",
    "INTRUSION_PREV_SYSTEM_ONLINE",
    "BUFFER_OVERFLOW_SHIELD_DEPLOYED"
];

function SystemLog() {
    const [logs, setLogs] = React.useState<string[]>([]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => {
                const next = [...prev, LOG_ENTRIES[Math.floor(Math.random() * LOG_ENTRIES.length)]];
                if (next.length > 8) return next.slice(1);
                return next;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-1/2 left-8 -translate-y-1/2 z-10 hidden xl:block">
            <div className="font-mono text-[10px] space-y-2 text-brand-accent/40 w-48">
                {logs.map((log, i) => (
                    <motion.div
                        key={`${log}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="truncate"
                    >
                        <span className="text-white/20 mr-2">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                        {log}
                    </motion.div>
                ))}
                <div className="w-1.5 h-3 bg-brand-accent/60 animate-pulse inline-block" />
            </div>
        </div>
    );
}

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20">
            {/* WebGL Background */}
            <HeroBackground />

            {/* Industry: Streaming System Log */}
            <SystemLog />

            {/* System Status Bar */}
            <div className="absolute top-24 right-8 z-10 hidden lg:block">
                <div className="font-mono text-[10px] text-brand-mid uppercase tracking-widest space-y-1 border-r-2 border-brand-accent pr-4">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Node_Alpha:</span>
                        <span className="text-brand-success">Active</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">AES_256:</span>
                        <span className="text-brand-success">Validated</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Sec_Protocol:</span>
                        <span className="text-slate-300">V5.0</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-brand-accent animate-pulse">Provisioned</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="px-4 py-1 border-brand-accent text-brand-accent font-semibold mb-6 bg-brand-accent/10">
                            #1 Automotive Compliance Partner
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                            Get TISAX AL3 Certified in <span className="text-brand-accent shadow-[0_0_20px_rgba(0,243,255,0.3)]">95 Days.</span>
                        </h1>
                        <p className="text-4xl md:text-5xl font-bold text-slate-300 mt-4">
                            Win Contracts with BMW, VW, and Mercedes.
                        </p>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium"
                    >
                        European TISAX specialists with a <span className="text-brand-success underline decoration-brand-success/30 underline-offset-4">98% first-time pass rate</span>.
                        We've secured €847M in contracts for automotive suppliers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Button size="lg" className="w-full sm:w-auto text-base group bg-brand-accent text-brand-dark hover:bg-white transition-all duration-300">
                            Book Free Gap Assessment
                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto text-base border-slate-700 text-white hover:bg-white/10">
                            <Download className="mr-2 h-4 w-4" />
                            Download TISAX Checklist
                        </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-12 text-sm font-semibold text-slate-400 uppercase tracking-wider"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-brand-success">✓</span> ISO/IEC 27001 Lead Auditors
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-brand-success">✓</span> ENX Portal Registered
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-brand-success">✓</span> 5 Years, Zero Major Non-Conformities
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 cursor-pointer hidden md:block"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-brand-accent rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
