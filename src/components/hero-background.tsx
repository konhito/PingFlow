"use client"

import LightPillar from "@/components/light-pillar";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
  <LightPillar
    topColor="#FFFFFF"
    bottomColor="#000000"
    intensity={1.0}
    rotationSpeed={0.7}
    glowAmount={0.005}
    pillarWidth={2}
    pillarHeight={0.4}
    noiseIntensity={0.5}
    pillarRotation={0}
    interactive={false}
    mixBlendMode="normal"
  />
    </div>
  );
}

