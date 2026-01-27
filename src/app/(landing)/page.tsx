import Features from "@/components/landing/Feature";
import About from "@/components/landing/About";
import Pricing from "@/components/landing/Pricing";
import Testimonial from "@/components/landing/Testimonial";
import FAQ from "@/components/landing/FAQ";
import Showcase from "@/components/landing/Showcase";
import Footer from "@/components/landing/Footer";
import { StructuredData } from "@/components/landing/StructuredData";
import { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://pingflow.com"),
  title: {
    default: "PingFlow - Real-Time SaaS Event Notifications | Discord, WhatsApp, Telegram",
    template: "%s | PingFlow"
  },
  description:
    "PingFlow delivers instant SaaS event notifications to Discord, WhatsApp, and Telegram. Track sales, signups, errors, and custom events in real-time. Free plan available. Easy API integration. Perfect for SaaS monitoring and business intelligence.",
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
    "saas monitoring",
    "event tracking",
    "notification service",
    "discord webhook",
    "whatsapp webhook",
    "telegram bot",
    "saas metrics",
    "real-time notifications",
    "event management",
    "api alerts",
    "business notifications",
    "saas dashboard",
    "event analytics",
    "webhook service",
    "notification platform",
  ],
  authors: [{ name: "Konhito aka Aditya" }],
  creator: "Konhito aka Aditya",
  publisher: "PingFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_WEBSITE_URL || "https://pingflow.com",
    siteName: "PingFlow",
    title: "PingFlow - Real-Time SaaS Event Notifications",
    description:
      "Get instant notifications for sales, signups, and milestones delivered to Discord, WhatsApp, and Telegram. Track any event in your SaaS application with beautiful, formatted messages.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "PingFlow - Real-Time SaaS Event Notifications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PingFlow - Real-Time SaaS Event Notifications",
    description:
      "Get instant notifications for sales, signups, and milestones delivered to Discord, WhatsApp, and Telegram.",
    site: "@pingflow",
    creator: "@pingflow",
    images: ["/opengraph-image.png"],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_WEBSITE_URL || "https://pingflow.com",
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
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
  category: "technology",
};

// Allow static generation but handle dynamic content gracefully
export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="font-satoshi container mx-auto min-h-screen max-w-6xl">
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
      </main>
    </>
  );
}
