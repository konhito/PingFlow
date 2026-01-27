import Features from "@/components/landing/Feature";
import About from "@/components/landing/About";
import Pricing from "@/components/landing/Pricing";
import Testimonial from "@/components/landing/Testimonial";
import FAQ from "@/components/landing/FAQ";
import Showcase from "@/components/landing/Showcase";
import Footer from "@/components/landing/Footer";
import { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";

export const metadata: Metadata = {
  title: "PingFlow - Real-Time SaaS Event Notifications",
  description:
    "Get instant notifications for sales, signups, and milestones delivered to Discord, WhatsApp, and Telegram. Track any event in your SaaS application with beautiful, formatted messages.",
  keywords: [
    "saas notifications",
    "discord integration",
    "whatsapp alerts",
    "telegram messages",
    "event monitoring",
    "real-time alerts",
    "saas analytics",
    "webhook notifications",
    "api monitoring",
    "business intelligence",
  ],
  openGraph: {
    title: "PingFlow - Real-Time SaaS Event Notifications",
    description:
      "Get instant notifications for sales, signups, and milestones delivered to Discord, WhatsApp, and Telegram.",
    url: process.env.NEXT_PUBLIC_WEBSITE_URL || "https://pingflow.com",
    siteName: "PingFlow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PingFlow - Real-Time SaaS Event Notifications",
    description:
      "Get instant notifications for sales, signups, and milestones delivered to Discord, WhatsApp, and Telegram.",
    site: "@pingflow",
    creator: "@pingflow",
  },
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_WEBSITE_URL || "https://pingflow.com",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Force static generation
export const dynamic = "force-static";

export default function Home() {
  return (
    <div className="font-satoshi container mx-auto min-h-screen max-w-6xl">
      <div className="mx-4">
        <HeroSection />
        <About />
        <Features />
        <Showcase />
        <Pricing />
        <Testimonial />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
