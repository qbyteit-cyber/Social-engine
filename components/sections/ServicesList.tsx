"use client";

import { motion } from "framer-motion";
import { Shield, Cloud, Server, Code, Headphones, Database, Network, Lock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
    {
        category: "Managed IT Services",
        items: [
            {
                title: "24/7 IT Support & Helpdesk",
                description: "Round-the-clock technical support for your team. We resolve issues fast to keep your operations running smoothly.",
                icon: Headphones
            },
            {
                title: "Network Infrastructure Management",
                description: "Design, implementation, and monitoring of robust corporate networks ensuring high availability and security.",
                icon: Network
            },
            {
                title: "Server & Device Management",
                description: "Proactive maintenance and patching of servers and endpoints to prevent downtime and security vulnerabilities.",
                icon: Server
            }
        ]
    },
    {
        category: "Cybersecurity Solutions",
        items: [
            {
                title: "TISAX & ISO 27001 Compliance",
                description: "Specialized consulting to help you achieve and maintain critical industry certifications.",
                icon: Shield
            },
            {
                title: "Threat Detection & Response (MDR)",
                description: "Advanced monitoring services to detect and neutralize cyber threats before they impact your business.",
                icon: Lock
            },
            {
                title: "Vulnerability Assessments",
                description: "Regular scanning and penetration testing to identify and fix security gaps in your infrastructure.",
                icon: Database
            }
        ]
    },
    {
        category: "Cloud & DevOps",
        items: [
            {
                title: "Cloud Migration & Strategy",
                description: "Seamless migration of on-premise workloads to Azure, AWS, or Private Cloud environments.",
                icon: Cloud
            },
            {
                title: "DevOps Automation",
                description: "Implementing CI/CD pipelines and infrastructure-as-code to accelerate software delivery.",
                icon: Code
            }
        ]
    }
];

export function ServicesList() {
    return (
        <section id="services-list" className="py-24 bg-brand-light/30">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-6">
                        Comprehensive IT Pillars
                    </h2>
                    <p className="text-lg text-brand-mid">
                        We structure our services around the core needs of modern enterprises: reliability, security, and innovation.
                    </p>
                </div>

                <div className="space-y-20">
                    {services.map((category, catIndex) => (
                        <div key={category.category}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-brand-border flex-1" />
                                <h3 className="text-2xl font-bold text-brand-primary px-4 border rounded-full py-2 bg-white shadow-sm">
                                    {category.category}
                                </h3>
                                <div className="h-px bg-brand-border flex-1" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {category.items.map((service, index) => (
                                    <motion.div
                                        key={service.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="h-full"
                                    >
                                        <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-brand-light bg-white">
                                            <CardHeader>
                                                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-4 text-brand-primary">
                                                    <service.icon className="w-6 h-6" />
                                                </div>
                                                <CardTitle className="text-xl font-bold text-brand-dark">
                                                    {service.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-brand-mid mb-6 leading-relaxed">
                                                    {service.description}
                                                </p>
                                                <Link href="/contact" className="text-brand-primary font-semibold text-sm hover:underline flex items-center">
                                                    Learn More <ArrowRight className="ml-1 w-3 h-3" />
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
