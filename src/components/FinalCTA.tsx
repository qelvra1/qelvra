import { Check } from "lucide-react";
import GradientCTA from "./GradientCTA";

const STEPS = [
  "Discuss your idea",
  "Plan and Strategy",
  "Design and Develop",
  "Deliver and Support",
];

interface FinalCTAProps {
  onStart: () => void;
}

export default function FinalCTA({ onStart }: FinalCTAProps) {
  return (
    <section id="contact" className="relative pb-20 pt-4 md:pb-28">
      <div className="q-container">
        <div className="cta-panel px-7 py-10 md:px-12 md:py-14" data-reveal>
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
            <div>
              <p className="text-[13.5px] font-semibold text-fog">
                Have a project in mind?
              </p>
              <h2 className="font-display mt-3 text-[clamp(1.8rem,4.2vw,3rem)] font-bold leading-[1.12] tracking-tight text-snow">
                <span className="block">Let&apos;s build something</span>
                <span className="block">
                  <span className="text-gradient">amazing</span> together.
                </span>
              </h2>
            </div>

            <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-7 md:p-9">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <ul className="flex flex-col gap-4">
                  {STEPS.map((s) => (
                    <li key={s} className="check-row">
                      <span className="check-ic">
                        <Check size={12} strokeWidth={2.6} />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col items-stretch gap-4 sm:items-center">
                  <GradientCTA onClick={onStart} className="w-full sm:w-auto">
                    Start a Project
                  </GradientCTA>
                  <p className="flex items-center gap-2 text-[12.5px] font-semibold text-fog">
                    <span className="dot inline-block h-2 w-2 rounded-full bg-mint shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                    Usually replies within 24h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
