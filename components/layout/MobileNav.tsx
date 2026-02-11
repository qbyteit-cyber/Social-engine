"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden">
            <button onClick={toggle} className="p-2 text-primary" aria-label="Toggle menu">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-background pt-20 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="container mx-auto px-4 flex flex-col space-y-8">
                        <Link href="/" onClick={toggle} className="flex items-center space-x-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold tracking-tight text-primary">
                                ITIS <span className="text-secondary">SECURE</span>
                            </span>
                        </Link>

                        <nav className="flex flex-col space-y-6">
                            <Link href="/services" onClick={toggle} className="text-xl font-semibold border-b pb-4">Services</Link>
                            <Link href="/resources" onClick={toggle} className="text-xl font-semibold border-b pb-4">Resources</Link>
                            <Link href="/case-studies" onClick={toggle} className="text-xl font-semibold border-b pb-4">Case Studies</Link>
                            <Link href="/about" onClick={toggle} className="text-xl font-semibold border-b pb-4">About</Link>
                            <Link href="/contact" onClick={toggle} className="text-xl font-semibold border-b pb-4">Contact</Link>
                        </nav>

                        <Button variant="default" size="lg" className="w-full" onClick={toggle}>
                            Get Started
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
