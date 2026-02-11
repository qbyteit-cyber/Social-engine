import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://itis-secure.com"),
  title: {
    default: "ITIS Secure | TISAX & ISO 27001 Compliance Experts",
    template: "%s | ITIS Secure",
  },
  description: "European TISAX specialists with 98% first-time pass rate. Achieve TISAX AL3 certification for BMW, VW, Mercedes contracts. ISO 27001 Lead Auditors.",
  keywords: ["TISAX", "ISO 27001", "automotive compliance", "TISAX assessment", "VDA ISA", "information security", "ISMS"],
  authors: [{ name: "ITIS Secure" }],
  creator: "ITIS Secure",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://itis-secure.com",
    siteName: "ITIS Secure",
    title: "ITIS Secure | TISAX & ISO 27001 Compliance Experts",
    description: "European TISAX specialists with 98% first-time pass rate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITIS Secure | TISAX & ISO 27001 Compliance Experts",
    description: "European TISAX specialists with 98% first-time pass rate.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
