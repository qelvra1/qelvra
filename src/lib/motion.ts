import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Single Lenis instance synced to the GSAP ticker.
 * Every Lenis scroll frame pushes ScrollTrigger.update so triggers stay
 * pixel-accurate while the smooth scroll owns the rAF loop.
 */
export function initSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1,
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Programmatic anchor scrolling that respects Lenis. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: -90, duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Scroll reveals, scoped with gsap.context() for clean teardown.
 * Initialization is deferred one frame past mount so it never competes
 * with critical first paint, and only GPU-friendly properties
 * (opacity / y transforms) are animated to hold 60fps.
 */
export function initReveals(scope?: Element | null): () => void {
  if (prefersReducedMotion()) return () => {};

  document.documentElement.classList.add("motion");

  const ctx = gsap.context(() => {
    // Defer trigger creation until the browser is idle post-paint.
    const setup = () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? "0");
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      requestAnimationFrame(setup);
    } else {
      window.addEventListener("load", () => requestAnimationFrame(setup), {
        once: true,
      });
    }
  }, scope ?? document.body);

  ScrollTrigger.config({ ignoreMobileResize: true });

  return () => ctx.revert(); // kills scoped tweens + their ScrollTriggers
}

/**
 * Vercel Analytics bootstrap.
 * Only activates when actually deployed on Vercel so local/preview
 * builds never emit failed network requests.
 */
export function initAnalytics() {
  try {
    const onVercel =
      typeof window !== "undefined" &&
      (window.location.hostname.endsWith(".vercel.app") ||
        Boolean((window as unknown as { __VERCEL__?: unknown }).__VERCEL__));
    if (onVercel) {
      import("@vercel/analytics").then(({ inject }) => inject());
    }
  } catch {
    /* analytics must never break the experience */
  }
}
