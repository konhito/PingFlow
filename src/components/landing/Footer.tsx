import React from "react";
import Link from "next/link";
import Image from "next/image";

const footerItems = [
  {
    label: "Documentation",
    href: "/docs",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Terms of Service",
    href: "/terms",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Footer() {
  return (
    <footer className="mt-10 mb-5 flex w-full flex-col items-center justify-center gap-6">
      <div className="w-full max-w-6xl h-[2px] bg-border dark:bg-white/10" />
      <div className="container mx-4 flex max-w-4xl flex-row flex-wrap items-center justify-center gap-4 md:mx-2">
        {footerItems.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className="neuro-button-sm rounded-full px-4 py-2 text-sm font-medium font-satoshi transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="text-muted-foreground text-sm font-satoshi">
        © {new Date().getFullYear()} PingFlow. All rights reserved.
      </div>
      <div className="font-excon relative text-5xl font-black tracking-tighter text-nowrap opacity-15 lg:text-9xl">
        <Image
          src="/brand-asset-notification.png"
          width={200}
          height={50}
          alt="PingFlow logo - Real-time SaaS notification platform"
          className="absolute -top-12 -right-14 size-16 md:-top-16 md:-right-22 md:size-28"
          aria-hidden="true"
        />
        PingFlow
      </div>
      <div className="group flex items-center gap-2">
        <Image
          className="size-12 rounded-2xl border-2 border-black group-hover:border-4 transition-all duration-300 shadow-[2px_2px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#000] dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]"
          src="/mylogo.jpg"
          width={48}
          height={48}
          alt="Konhito aka Aditya - PingFlow Creator"
        />
        <p className="opacity-50 transition-all duration-300 ease-in-out group-hover:opacity-100 font-satoshi">
          Built with ❤️ by{" "}
          <span className="transition-all duration-300 ease-in-out group-hover:underline font-excon font-bold">
            Konhito aka Aditya
          </span>
        </p>
      </div>
    </footer>
  );
}

