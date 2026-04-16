import Link from "next/link";
import { Shield, Mail, Phone } from "lucide-react";

function Linkedin({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

export function Footer() {
    return (
        <footer className="bg-brand-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <Shield className="h-8 w-8 text-brand-secondary" />
                            <span className="text-2xl font-bold tracking-tight">
                                ITIS <span className="text-brand-secondary">SECURE</span>
                            </span>
                        </Link>
                        <p className="text-brand-mid text-sm leading-relaxed max-w-xs">
                            European TISAX and ISO 27001 compliance specialists. Win contracts with major automotive OEMs through proven security excellence.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://linkedin.com/company/itis-secure" className="text-brand-mid hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Services</h4>
                        <ul className="space-y-4 text-sm text-brand-mid">
                            <li><Link href="/services/tisax-assessment" className="hover:text-white transition-colors">TISAX Assessment</Link></li>
                            <li><Link href="/services/iso-27001" className="hover:text-white transition-colors">ISO 27001 Certification</Link></li>
                            <li><Link href="/services/tpisr" className="hover:text-white transition-colors">TPISR Compliance</Link></li>
                            <li><Link href="/services/gdpr" className="hover:text-white transition-colors">GDPR Compliance</Link></li>
                            <li><Link href="/services/isms-implementation" className="hover:text-white transition-colors">ISMS Implementation</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-brand-mid">
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Insights</Link></li>
                            <li><Link href="/resources/guides" className="hover:text-white transition-colors">Compliance Guides</Link></li>
                            <li><Link href="/resources/tools/readiness-quiz" className="hover:text-white transition-colors">TISAX Readiness Quiz</Link></li>
                            <li><Link href="/resources/tools/cost-calculator" className="hover:text-white transition-colors">Cost Calculator</Link></li>
                            <li><Link href="/resources/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-brand-mid">
                            <li className="flex items-center space-x-3">
                                <Mail className="h-4 w-4" />
                                <a href="mailto:Iulian.Bozdoghina@itis-secure.com" className="hover:text-white transition-colors">Iulian.Bozdoghina@itis-secure.com</a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-4 w-4" />
                                <a href="tel:+40741711770" className="hover:text-white transition-colors">+40 741 711 770</a>
                            </li>
                            <li className="pt-2">
                                <p>Sibiu & Brasov, Romania</p>
                                <p>Mon - Fri: 9:00 - 18:00 EET</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-brand-mid/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-mid space-y-4 md:space-y-0">
                    <p>© {new Date().getFullYear()} ITIS Secure. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
