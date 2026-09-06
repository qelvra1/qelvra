import { MessageSquare } from "lucide-react";
import HeroVisual from "./HeroVisual";
import GradientCTA from "./GradientCTA";
import { scrollToId } from "../lib/motion";
import { getAssetPath } from "../assets";

/**
 * Configurable "TRUSTED BY" Local Logo Array
 * Points strictly to local SVG logo paths in /assets/logos/ without asset modification
 */
const TRUSTED_LOGOS = [
  { name: "Google", src: getAssetPath("logos", "google", "svg") },
  { name: "Microsoft", src: getAssetPath("logos", "microsoft", "svg") },
  { name: "Adobe", src: getAssetPath("logos", "adobe", "svg") },
  { name: "AWS", src: getAssetPath("logos", "aws", "svg") },
  { name: "Vercel", src: getAssetPath("logos", "vercel", "svg") },
];

function TrustedLogos() {
  return (
    <div className="flex flex-wrap items-center gap-6 sm:gap-8">
      {TRUSTED_LOGOS.map((logo) => (
        <img
          key={logo.name}
          src={logo.src}
          alt={`${logo.name} logo`}
          className="h-5 sm:h-6 w-auto object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
        />
      ))}
    </div>
  );
}

interface HeroProps {
  onContact: () => void;
}

/**
 * React Hero Section Component
 */
export default function Hero({ onContact }: HeroProps) {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen overflow-hidden bg-[#030712] pt-36 pb-16 md:pt-44 md:pb-24"
    >
      <div className="hero-glow" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-6">
          {/* Left Column (lg:col-span-5) */}
          <div className="relative z-10 lg:col-span-5 max-w-xl">
            <span className="q-badge" data-reveal>
              <span className="dot" />
              Available for new projects
            </span>

            <h1 className="headline mt-6 text-snow" data-reveal data-reveal-delay="0.08">
              <span className="block">Digital Products</span>
              <span className="block">
                That <span className="text-gradient">Drive Results</span>
              </span>
            </h1>

            <p
              className="mt-6 text-[15.5px] leading-relaxed text-fog md:text-[17px]"
              data-reveal
              data-reveal-delay="0.16"
            >
              I design and build modern digital experiences. Websites, Web Apps,
              SaaS Platforms, Dashboards and Mobile Apps that help businesses
              grow.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4" data-reveal data-reveal-delay="0.24">
              <GradientCTA onClick={() => scrollToId("portfolio")}>
                View My Work
              </GradientCTA>
              <button className="btn btn-ghost" onClick={onContact}>
                Let&apos;s Talk
                <MessageSquare size={16} />
              </button>
            </div>

            <div className="mt-12" data-reveal data-reveal-delay="0.32">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Trusted by
              </p>
              <TrustedLogos />
            </div>
          </div>

          {/* Right Column (lg:col-span-7) */}
          <div className="relative lg:col-span-7 w-full" data-reveal data-reveal-delay="0.15">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
