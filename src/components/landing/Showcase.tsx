"use client";

import React from "react";
import { motion } from "framer-motion";
import { MockDiscordUI } from "../mock-discord-ui";
import { DiscordMessage } from "../discord-message";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const mockVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
    },
  },
};

export default function Showcase() {
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
          <motion.h2
            className="font-regular font-excon mx-auto mb-6 max-w-4xl text-center text-4xl leading-tight font-black tracking-tighter md:text-5xl lg:text-6xl"
            variants={titleVariants}
          >
            Beautiful Notifications
          </motion.h2>
          <motion.p
            className="text-secondary font-satoshi mx-auto max-w-3xl text-center text-lg leading-relaxed tracking-tight md:text-xl"
            variants={titleVariants}
          >
            See how your events come to life with rich, formatted messages
            delivered straight to Discord, WhatsApp, or Telegram
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center px-4"
          variants={mockVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <MockDiscordUI>
            <DiscordMessage
              avatarSrc="/brand-asset-profile-picture.png"
              avatarAlt="PingFlow"
              username="PingFlow"
              timestamp="Today at 12:35 PM"
              badgeText="Sale"
              badgeColor="#43b581"
              title="🎉 New Sale"
              content={{
                "Customer": "John Doe",
                "Plan": "Pro Plan",
                "Revenue": "$49.00",
                "MRR Impact": "+$49/month"
              }}
            />
            <DiscordMessage
              avatarSrc="/brand-asset-profile-picture.png"
              avatarAlt="PingFlow"
              username="PingFlow"
              timestamp="Today at 12:38 PM"
              badgeText="Signup"
              badgeColor="#43b581"
              title="🚀 New Signup"
              content={{
                "User": "Sarah Miller",
                "Email": "sarah@example.com",
                "Plan": "Free Trial",
                "Source": "Organic Search"
              }}
            />
            <DiscordMessage
              avatarSrc="/brand-asset-profile-picture.png"
              avatarAlt="PingFlow"
              username="PingFlow"
              timestamp="Today at 12:42 PM"
              badgeText="Alert"
              badgeColor="#faa61a"
              title="⚠️ High CPU Usage"
              content={{
                "Server": "prod-1",
                "Current Usage": "89%",
                "Threshold": "80%",
                "Duration": "5 minutes"
              }}
            />
          </MockDiscordUI>
        </motion.div>
      </div>
    </section>
  );
}

