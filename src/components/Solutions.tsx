import {
  PenTool,
  Rocket,
  Code2,
  MonitorSmartphone,
  ShieldCheck,
  Headphones,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { scrollToId } from "../lib/motion";

const FEATURES: { icon: LucideIcon; title: string; desc: string; grad: string }[] = [
  {
    icon: PenTool,
    title: "Modern Design",
    desc: "Clean, minimal and user-centered interfaces.",
    grad: "linear-gradient(135deg,#2563EB,#3B82F6)",
  },
  {
    icon: Rocket,
    title: "Performance",
    desc: "Optimized for speed, SEO and best practices.",
    grad: "linear-gradient(135deg,#7C3AED,#A855F7)",
  },
  {
    icon: Code2,
    title: "Scalable Code",
    desc: "Clean, maintainable and future-ready code.",
    grad: "linear-gradient(135deg,#2563EB,#60A5FA)",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive",
    desc: "Perfect experience on all devices and screen sizes.",
    grad: "linear-gradient(135deg,#4F46E5,#818CF8)",
  },
  {
    icon: ShieldCheck,
    title: "Secure",
    desc: "Best security practices to protect your data.",
    grad: "linear-gradient(135deg,#4338CA,#6366F1)",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    desc: "Always here to support and grow with you.",
    grad: "linear-gradient(135deg,#2563EB,#3B82F6)",
  },
];

export default function Solutions() {
  return (
    <section id="services" className="relative py-16 md:py-24">
      <div className="q-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
          {/* Left intro */}
          <div data-reveal>
            <span className="q-badge">
              <span className="dot violet" />
              Why Work With Me
            </span>
            <h2 className="font-display mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-bold leading-[1.12] tracking-tight text-snow">
              <span className="block">Modern Solutions</span>
              <span className="block">
                Built for the <span className="text-gradient">Future</span>
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-fog">
              I combine design, development and strategy to deliver products
              that are not only beautiful, but also functional, scalable and
              impactful.
            </p>
            <button className="btn btn-ghost mt-8" onClick={() => scrollToId("contact")}>
              About Me
              <UserRound size={16} />
            </button>
          </div>

          {/* Feature panel — seamless 2×3 on mobile/tablet, 3×2 on desktop */}
          <div
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-800"
            data-reveal
            data-reveal-delay="0.1"
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-cell p-3.5 sm:p-6">
                <div
                  className="feature-icon h-9 w-9 sm:h-11 sm:w-11"
                  style={{ background: f.grad }}
                >
                  <f.icon strokeWidth={2} className="h-[18px] w-[18px] sm:h-[21px] sm:w-[21px]" />
                </div>
                <h3 className="font-display mt-3 text-[13px] font-bold leading-snug text-snow sm:mt-4 sm:text-[15px]">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-fog sm:mt-2 sm:text-[13px]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
