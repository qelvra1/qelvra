import { useEffect, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

/* Ultra-slow corner-to-corner glide (0.9s expo-out) */
const glide: Transition = { duration: 0.9, ease: [0.16, 1, 0.3, 1] };
const fade: Transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

const PAD = 6; /* badge rests flush against the inner pill edge */

interface GradientCTAProps {
  children: ReactNode;
  onClick?: () => void;
  /** Renders an <a> wrapper instead of a <button> when provided. */
  href?: string;
  className?: string;
  type?: "button" | "submit";
  /** "sm" renders the compact modal-scale button. */
  size?: "md" | "sm";
  loading?: boolean;
  disabled?: boolean;
  /** Associate a submit button with an external <form id>. */
  form?: string;
}

/**
 * Primary CTA — edge-to-edge dock.
 *  Idle  — transparent pill (space-between, p-1.5), subtle gradient
 *          border, white arrow badge flush at the far-left inner edge.
 *  Hover — blue→purple→pink fill + glow aura; the badge glides flush
 *          to the far-right inner edge while the label stays balanced
 *          and centered in the remaining space.
 * The badge width is measured live, so the "sm" variant docks exactly too.
 */
export default function GradientCTA({
  children,
  onClick,
  href,
  className = "",
  type = "button",
  size = "md",
  loading = false,
  disabled = false,
  form,
}: GradientCTAProps) {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const [width, setWidth] = useState(0);
  const [badgeW, setBadgeW] = useState(40);
  const active = (hovered || loading) && !disabled;
  const inert = disabled || loading;
  const sm = size === "sm";

  /* Live measurements so the badge anchors exactly at either inner edge,
     across sizes and breakpoints */
  useEffect(() => {
    const el = btnRef.current;
    const badge = badgeRef.current;
    if (!el) return;
    const measure = () => {
      setWidth(el.offsetWidth);
      if (badge) setBadgeW(badge.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (badge) ro.observe(badge);
    return () => ro.disconnect();
  }, []);

  const interaction = {
    onHoverStart: () => setHovered(true),
    onHoverEnd: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
    whileTap: inert ? undefined : { scale: 0.96 },
  };

  const content = (
    <>
      {/* Gradient fill — #3B82F6 → #8B5CF6 → #EC4899 */}
      <motion.span
        aria-hidden="true"
        className="gcta-fill"
        variants={{ idle: { opacity: 0, scale: 0.94 }, hover: { opacity: 1, scale: 1 } }}
        transition={fade}
      />

      {/* Label — in flow as the sizer, balanced in the remaining space */}
      <span className="gcta-label">{children}</span>

      {/* Badge — docks flush left, glides flush right on hover */}
      <motion.span
        ref={badgeRef}
        className="gcta-badge"
        aria-hidden="true"
        initial={false}
        animate={{
          x: active ? Math.max(width - badgeW - PAD, PAD) : PAD,
          scale: active ? [1, 1.1, 1.05] : 1,
        }}
        transition={{
          x: glide,
          scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1], times: [0, 0.55, 1] },
        }}
      >
        {loading ? (
          <Loader2 size={sm ? 15 : 20} strokeWidth={2.5} className="animate-spin" />
        ) : (
          <ArrowRight size={sm ? 15 : 20} strokeWidth={2.6} />
        )}
      </motion.span>
    </>
  );

  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <motion.a
        ref={btnRef as never}
        layout
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={onClick}
        initial="idle"
        whileHover="hover"
        animate={active ? "hover" : "idle"}
        variants={{
          idle: { boxShadow: "0 0 0px rgba(139, 92, 246, 0)" },
          hover: {
            boxShadow:
              "0 0 25px rgba(139, 92, 246, 0.5), 0 0 58px -8px rgba(59, 130, 246, 0.45)",
          },
        }}
        transition={fade}
        {...interaction}
        className={`gcta ${sm ? "gcta-sm" : ""} ${className}`.trim()}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={btnRef as never}
      layout
      type={type}
      form={form}
      onClick={onClick}
      disabled={inert}
      aria-busy={loading || undefined}
      initial="idle"
      whileHover="hover"
      animate={active ? "hover" : "idle"}
      variants={{
        idle: { boxShadow: "0 0 0px rgba(139, 92, 246, 0)" },
        hover: {
          boxShadow:
            "0 0 25px rgba(139, 92, 246, 0.5), 0 0 58px -8px rgba(59, 130, 246, 0.45)",
        },
      }}
      transition={fade}
      {...interaction}
      className={`gcta ${sm ? "gcta-sm" : ""} ${className}`.trim()}
    >
      {content}
    </motion.button>
  );
}
