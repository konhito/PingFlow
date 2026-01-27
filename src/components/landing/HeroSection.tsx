"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import HandDrawnArrow from "../svgs/HandDrawnArrow";
import Notification from "../svgs/Notification";
import Wave from "../svgs/Wave";

interface Testimonial {
  name: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "User 1",
    image: "/avatar/1.jpg",
  },
  {
    name: "User 2",
    image: "/avatar/2.jpg",
  },
  {
    name: "User 3",
    image: "/avatar/3.jpg",
  },
  {
    name: "User 4",
    image: "/avatar/4.jpg",
  },
  {
    name: "User 5",
    image: "/avatar/5.jpg",
  },
  {
    name: "User 6",
    image: "/avatar/6.jpg",
  },
  {
    name: "User 7",
    image: "/avatar/7.jpg",
  },
];

export default function HeroSection() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["instant", "real-time", "smart", "powerful", "seamless"],
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="relative flex flex-col items-center justify-center gap-8 py-0 lg:py-10">
          <Notification className="absolute top-4 left-4 size-24 md:size-32" aria-hidden="true" />
          <Wave className="absolute right-10 -bottom-16 size-24 md:bottom-10 md:size-32 lg:bottom-0" aria-hidden="true" />
          <div className="flex flex-col gap-6">
            <h1 className="font-regular max-w-3xl text-center text-4xl leading-tight tracking-tight md:text-6xl md:leading-tight lg:text-7xl">
              <span className="font-excon relative font-extrabold block">
                Real-Time Event Monitoring
                <HandDrawnArrow className="absolute right-2 mx-auto mt-4 size-8 md:-right-8 md:size-12" />
              </span>
              <span className="font-ranade relative flex w-full justify-center overflow-hidden text-center py-2 md:py-4">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.div
                    key={index}
                    className="absolute font-light italic"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.div>
                ))}
              </span>
              <span className="font-excon relative font-extrabold block">
                For Your SaaS
              </span>
            </h1>

            <p className="text-muted-foreground font-satoshi max-w-2xl mx-auto text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
              Get instant notifications for sales, signups, and milestones delivered to Discord, WhatsApp, or Telegram.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="gap-4 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:text-white hover:shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[2px_2px_0px_0px_#757373]"
              >
                Get Started <Bell className="size-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="gap-4 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[2px_2px_0px_0px_#757373]"
              >
                Learn More <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {testimonials.map((testimonial, index) => (
                  <Image
                    key={testimonial.image}
                    src={testimonial.image}
                    alt={`PingFlow user ${index + 1} - Trusted by developers worldwide`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-white transition-all duration-300 hover:scale-150 hover:cursor-pointer"
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-sm">
                Trusted by 1000+ developers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
