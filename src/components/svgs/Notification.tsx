import React from "react";
import Image from "next/image";

export default function Notification({ className }: { className: string }) {
  return (
    <div>
      <Image
        width={50}
        height={50}
        className={`${className}`}
        src="/brand-asset-notification.png"
        alt="Notification"
      />
    </div>
  );
}

