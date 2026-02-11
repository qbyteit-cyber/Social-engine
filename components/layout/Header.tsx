"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { MobileNav } from "./MobileNav";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold tracking-tight text-primary">
                        ITIS <span className="text-secondary">SECURE</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/services" className="text-sm font-medium transition-colors hover:text-primary">
                        Services
                    </Link>
                    <Link href="/resources" className="text-sm font-medium transition-colors hover:text-primary">
                        Resources
                    </Link>
                    <Link href="/case-studies" className="text-sm font-medium transition-colors hover:text-primary">
                        Case Studies
                    </Link>
                    <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                        About
                    </Link>
                    <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <Button variant="default" size="sm" className="hidden md:flex font-semibold">
                        Get Started
                    </Button>
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
