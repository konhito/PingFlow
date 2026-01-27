"use client";

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

interface PricingTier {
  title: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  highlight?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    title: "Free",
    price: 0,
    originalPrice: 0,
    description: "Perfect for side projects and testing",
    features: [
      "100 events per month",
      "3 event categories",
      "Discord integration",
      "Email support",
    ],
  },
  {
    title: "Pro",
    price: 49,
    originalPrice: 99,
    description: "Best for growing SaaS businesses",
    features: [
      "10,000 events per month",
      "Unlimited categories",
      "Discord, WhatsApp & Telegram",
      "Advanced analytics",
      "Priority support",
      "Custom fields",
    ],
    highlight: true,
  },
];

function PricingCard({
  tier,
}: {
  tier: PricingTier;
}) {
  return (
    <motion.div
      className={`bg-card relative flex flex-col rounded-md border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000] ${
        tier.highlight ? "z-10 scale-105" : ""
      }`}
    >
      {/* Tag */}
      {tier.highlight && (
        <div
          className="absolute top-6 right-6 rounded-md border-2 border-black bg-white px-3 py-1 text-xs font-bold dark:bg-black"
        >
          Most Popular
        </div>
      )}
      {/* Price */}
      <div className="mb-2 flex items-end gap-2">
        <span className="font-excon text-4xl font-black">
          {tier.price === 0 ? "Free" : `$${tier.price}/-`}
        </span>
      </div>
      {tier.originalPrice > 0 && (
        <div className="text-muted-foreground mb-2 text-sm">
          Original Price:{" "}
          <span className="line-through">
            ${tier.originalPrice}/-
          </span>
        </div>
      )}
      {/* Title & Desc */}
      <div className="mb-2 text-lg font-bold">{tier.title}</div>
      <div className="text-muted-foreground mb-4 text-sm">
        {tier.description}
      </div>
      {/* Features */}
      <ul className="mb-6 flex flex-col gap-2">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-5 w-5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link className="mt-auto w-full" href={tier.price === 0 ? "/sign-up" : "/sign-up?intent=upgrade"}>
        <Button
          className="w-full rounded-md border-4 border-black bg-white px-6 py-2 font-bold text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-gray-100 hover:shadow-[6px_6px_0px_0px_#000]"
        >
          {tier.price === 0 ? "Get Started" : "Upgrade to Pro"}
        </Button>
      </Link>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden py-20 lg:py-32">
      <div className="relative z-10 container mx-auto">
        <Image
          src="/brand-asset-profile-picture.png"
          alt="PingFlow pricing plans - Affordable SaaS notification service"
          width={50}
          height={50}
          className="absolute -top-16 left-0 size-16 md:-top-20 md:size-28"
          aria-hidden="true"
        />
        <Image
          src="/brand-asset-heart.png"
          alt="PingFlow pricing - Choose your plan"
          width={50}
          height={50}
          className="absolute -top-14 right-0 size-16 md:-top-16 md:size-28"
          aria-hidden="true"
        />
        <div className="mb-16 text-center md:mb-20">
          <h2 className="font-regular font-excon mx-auto mb-6 max-w-4xl text-center text-4xl leading-tight font-black tracking-tighter md:text-5xl lg:text-6xl">
            Simple Pricing
          </h2>
          <p className="text-secondary font-satoshi mx-auto max-w-3xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
            Choose the perfect plan for your SaaS monitoring needs
          </p>
        </div>
        <div className="mx-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.title}
              tier={tier}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
