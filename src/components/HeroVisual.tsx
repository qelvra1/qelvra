import { useState } from "react";

/** Order of supported raster image extensions for hero showcase probing */
const HERO_EXTENSIONS = ["webp", "jpg", "png", "avif", "jpeg"] as const;

/**
 * Dynamic Local Hero Showcase Image Loader — Frameless & Seamless
 *
 * Renders hero-dashboard image seamlessly on top of the section background
 * with no surrounding card border, no background box, and full transparency support.
 */
export function HeroShowcaseImage() {
  const [extIndex, setExtIndex] = useState<number>(0);

  const candidatePaths = [
    ...HERO_EXTENSIONS.map((ext) => `./assets/images/hero-dashboard.${ext}`),
    ...HERO_EXTENSIONS.map((ext) => `/assets/images/hero-dashboard.${ext}`),
    ...HERO_EXTENSIONS.map((ext) => `./assets/hero-dashboard.${ext}`),
    ...HERO_EXTENSIONS.map((ext) => `/assets/hero-dashboard.${ext}`),
  ];

  if (extIndex >= candidatePaths.length) {
    return (
      <div className="relative w-full aspect-[16/10] bg-transparent flex flex-col justify-between p-6 overflow-hidden select-none">
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-mono text-xs text-slate-400 font-medium">QELVRA Hero Analytics</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/10] bg-transparent flex items-center justify-center transition-transform duration-500 hover:scale-[1.01]">
      <img
        key={candidatePaths[extIndex]}
        src={candidatePaths[extIndex]}
        alt="QELVRA Hero Showcase Dashboard"
        className="w-full h-full object-contain bg-transparent filter drop-shadow-2xl"
        loading="eager"
        decoding="async"
        onError={(e) => {
          console.error("Failed to load asset:", e.currentTarget.src);
          setExtIndex((prev) => prev + 1);
        }}
      />
    </div>
  );
}

/** Dynamic Local Phone Mockup Loader — Frameless & Seamless */
export function HeroPhoneImage() {
  const [extIndex, setExtIndex] = useState<number>(0);

  const candidatePaths = [
    ...HERO_EXTENSIONS.map((ext) => `./assets/images/hero-phone.${ext}`),
    ...HERO_EXTENSIONS.map((ext) => `/assets/images/hero-phone.${ext}`),
    ...HERO_EXTENSIONS.map((ext) => `./assets/hero-phone.${ext}`),
    ...HERO_EXTENSIONS.map((ext) => `/assets/hero-phone.${ext}`),
  ];

  if (extIndex >= candidatePaths.length) {
    return null;
  }

  return (
    <img
      key={candidatePaths[extIndex]}
      src={candidatePaths[extIndex]}
      alt="Mobile App Preview Mockup"
      className="w-full h-auto object-contain bg-transparent drop-shadow-2xl"
      loading="eager"
      decoding="async"
      onError={(e) => {
        console.error("Failed to load asset:", e.currentTarget.src);
        setExtIndex((prev) => prev + 1);
      }}
    />
  );
}

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-3xl mx-auto flex justify-center items-center py-4">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-indigo-500/10 blur-3xl rounded-full -z-10 pointer-events-none" />

      {/* Main Container — Frameless & Transparent */}
      <div className="relative w-full bg-transparent">
        {/* Dynamic Hero Showcase Image */}
        <HeroShowcaseImage />

        {/* Mobile Phone Mockup Image - Floating frameless position */}
        <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 w-1/3 min-w-[130px] max-w-[200px] z-20 transition-transform duration-500 hover:scale-105 pointer-events-none">
          <HeroPhoneImage />
        </div>
      </div>
    </div>
  );
}
