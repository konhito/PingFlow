import React from "react";
import Image from "next/image";

export default function Wave({ className }: { className: string }) {
  return (
    <div>
      <Image
        width={50}
        height={50}
        className={`${className}`}
        src="/brand-asset-wave.png"
        alt="Wave"
      />
    </div>
  );
}

