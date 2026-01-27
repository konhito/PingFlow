"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  delay?: number;
}

function TestimonialCard({
  name,
  role,
  image,
  content,
  rating,
  delay = 0,
}: TestimonialCardProps) {
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
      <div className="relative rounded-md border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000] dark:border-white/20 dark:shadow-[8px_8px_0px_0px_#fff] dark:hover:shadow-[12px_12px_0px_0px_#fff]">
        <div className="relative z-10">
          {/* Quote Icon */}
          <div className="mb-4">
            <Quote
              className="h-8 w-8 text-black dark:text-white"
            />
          </div>

          {/* Rating */}
          <div className="mb-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < rating
                    ? "fill-black dark:fill-white text-black dark:text-white"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <p className="font-satoshi mb-6 leading-relaxed font-medium text-black dark:text-white">
            &quot;{content}&quot;
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <Image
              src={image}
              alt={`${name} - ${role} - PingFlow customer testimonial`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-md border-4 border-black dark:border-white"
            />
            <div>
              <h4 className="font-excon font-bold text-black dark:text-white">
                {name}
              </h4>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO, TechStart Inc.",
    image: "/avatar/1.jpg",
    content:
      "PingFlow transformed how we monitor our SaaS. Real-time notifications helped us catch and fix issues before customers even noticed.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Founder, CloudSync",
    image: "/avatar/2.jpg",
    content:
      "The multi-channel notifications are game-changing. Our team stays informed whether they're on Discord, WhatsApp, or Telegram.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Product Manager, DataFlow",
    image: "/avatar/3.jpg",
    content:
      "Finally, a notification platform that just works. Setup took 5 minutes and we've been happily monitoring ever since.",
    rating: 5,
  },
  {
    name: "David Martinez",
    role: "Engineering Lead, StartupHub",
    image: "/avatar/4.jpg",
    content:
      "The event history and analytics features are incredibly useful. We can track patterns and make data-driven decisions.",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "CEO, GrowthLabs",
    image: "/avatar/5.jpg",
    content:
      "Clean, organized, and reliable. PingFlow helped us scale our monitoring without the complexity. Worth every penny.",
    rating: 5,
  },
  {
    name: "James Taylor",
    role: "DevOps Engineer, CloudBase",
    image: "/avatar/6.jpg",
    content:
      "The API is beautiful and the documentation is excellent. Integration was seamless and notifications are instant.",
    rating: 5,
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

export default function Testimonial() {
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
            What Developers Say
          </motion.h2>
          <motion.p
            className="text-secondary font-satoshi mx-auto max-w-3xl text-center text-lg leading-relaxed tracking-tight md:text-xl"
            variants={titleVariants}
          >
            Join thousands of developers who have transformed their monitoring
            experience with PingFlow
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              image={testimonial.image}
              content={testimonial.content}
              rating={testimonial.rating}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
