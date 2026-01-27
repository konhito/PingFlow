"use client";

import {
  Bell,
  Zap,
  Settings,
  Clock,
  Shield,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: delay,
      },
    },
  };

  return (
    <motion.div
      className="group relative"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="bg-card relative rounded-2xl border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative z-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:bg-black">
            {icon}
          </div>
          <h3 className="text-foreground font-excon mb-3 text-xl font-semibold">
            {title}
          </h3>
          <p className="text-muted-foreground font-satoshi leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

const features = [
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Multi-Channel Delivery",
    description:
      "Send notifications to Discord, WhatsApp, and Telegram. Reach your team wherever they are.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Real-Time Events",
    description:
      "Track sales, signups, errors, and custom events in real-time with instant delivery.",
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Custom Categories",
    description:
      "Organize events into categories with custom colors and emojis for better visibility.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Event History",
    description:
      "Access complete event history with timestamps and detailed information for analysis.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with encrypted API keys and reliable message delivery.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Beautiful Formatting",
    description:
      "Rich text formatting and custom fields make your notifications clear and actionable.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Features() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0" />
      <div className="relative z-10 container mx-auto">
        <motion.div
          className="mb-16 text-center md:mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="font-regular font-excon relative mx-auto mb-6 max-w-4xl text-center text-4xl leading-tight font-black tracking-tighter md:text-5xl lg:text-6xl">
            Features of PingFlow
            <Image
              width={50}
              height={50}
              src="/brand-asset-heart.png"
              alt="PingFlow"
              className="absolute -top-16 left-0 size-16 md:-top-20 md:size-28"
            />
          </h2>
          <p className="text-secondary font-satoshi mx-auto max-w-3xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
            Everything you need to stay on top of your SaaS metrics
          </p>
        </motion.div>
        <motion.div
          className="mx-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
