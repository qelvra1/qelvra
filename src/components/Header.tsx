import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, Mail, CalendarDays } from "lucide-react";
import { NAV_ITEMS } from "../data";
import { scrollToId } from "../lib/motion";
import { LogoImage } from "./Logo";

/* ------------------------------------------------------------------ */
/* Single source of truth for the quick-contact actions. The same      */
/* icons, labels and URLs power both the desktop popover tiles and     */
/* the mobile floating card rows.                                      */
/* ------------------------------------------------------------------ */
const WhatsAppGlyph = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.9 7c0 5.44-4.45 9.87-9.9 9.87m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41" />
  </svg>
);

const CONTACT_ACTIONS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/212719936288",
    external: true,
    tint: "wa",
    icon: WhatsAppGlyph,
  },
  {
    key: "email",
    label: "Email",
    href: "mailto:qelvra.labs@gmail.com",
    external: false,
    tint: "mail",
    icon: <Mail size={20} />,
  },
  {
    key: "calendly",
    label: "Book a call",
    href: "https://calendly.com",
    external: true,
    tint: "cal",
    icon: <CalendarDays size={20} />,
  },
] as const;

/**
 * Compact contact card: WhatsApp + Mail tiles and a Calendly button.
 *  - default: anchored beneath the desktop Contact Me CTA.
 *  - placement="inline": in-flow inside the mobile drawer, arrow pointing
 *    down at the Contact Me button.
 */
function ContactCard({
  placement = "down",
  subtext,
}: {
  /** "down" anchors below the trigger; "inline" renders in-flow (drawer) */
  placement?: "down" | "inline";
  /** Optional footnote rendered inside the card, under the actions */
  subtext?: string;
}) {
  if (placement === "inline") {
    /* In-flow compact card for the mobile drawer — lives inside the menu
       layout, arrow at the bottom pointing down at the Contact Me button */
    return (
      <div className="contact-pop-inline" role="dialog" aria-label="Contact options">
        <div className="flex items-center justify-center gap-3">
          {CONTACT_ACTIONS.slice(0, 2).map((a) => (
            <a
              key={a.key}
              className={`pop-action ${a.tint === "wa" ? "wa" : ""}`}
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={a.label}
            >
              {a.icon}
            </a>
          ))}
        </div>
        <a
          className="pop-cal"
          href={CONTACT_ACTIONS[2].href}
          target="_blank"
          rel="noopener noreferrer"
          role="button"
        >
          <span className="cal-ic">
            <CalendarDays size={13} />
          </span>
          {CONTACT_ACTIONS[2].label}
        </a>
        {subtext && (
          <p className="pop-sub">
            <span className="pop-sub-dot" aria-hidden="true" />
            {subtext}
          </p>
        )}
        <span className="inline-arrow" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="contact-pop right" role="dialog" aria-label="Contact options">
      <span className="contact-pop-arrow" aria-hidden="true" />
      <div className="flex items-center justify-center gap-4">
        {CONTACT_ACTIONS.slice(0, 2).map((a) => (
          <a
            key={a.key}
            className={`pop-action ${a.tint === "wa" ? "wa" : ""}`}
            href={a.href}
            {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={a.label}
          >
            {a.icon}
          </a>
        ))}
      </div>
      <a
        className="pop-cal"
        href={CONTACT_ACTIONS[2].href}
        target="_blank"
        rel="noopener noreferrer"
        role="button"
      >
        <span className="cal-ic">
          <CalendarDays size={15} />
        </span>
        {CONTACT_ACTIONS[2].label}
      </a>
      {subtext && (
        <p className="pop-sub">
          <span className="pop-sub-dot" aria-hidden="true" />
          {subtext}
        </p>
      )}
    </div>
  );
}

export default function Header() {
  const islandRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [drawerCta, setDrawerCta] = useState(false);

  /* Scroll-activated glass: transparent at top, frosted island past 20px */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Click-outside closes any open contact popover */
  useEffect(() => {
    if (!ctaOpen && !drawerCta) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-cta-pop-root]")) {
        setCtaOpen(false);
        setDrawerCta(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [ctaOpen, drawerCta]);

  /* Escape closes topmost layer first: mobile card → drawer CTA → drawer → popover */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (drawerCta) setDrawerCta(false);
      else if (drawerOpen) setDrawerOpen(false);
      else if (ctaOpen) setCtaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerCta, drawerOpen, ctaOpen]);

  /* Drawer locks body scroll while open; resets the CTA card on close */
  useEffect(() => {
    if (!drawerOpen) {
      setDrawerCta(false);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  /* Cursor-driven border aurora with smoothed follow + soft frame reflection */
  useEffect(() => {
    const island = islandRef.current;
    if (!island) return;

    const target = { x: island.offsetWidth / 2, y: island.offsetHeight / 2 };
    const current = { ...target };
    let raf = 0;
    let live = false;

    const loop = () => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      island.style.setProperty("--ax", `${current.x}px`);
      island.style.setProperty("--ay", `${current.y}px`);
      if (live || Math.hypot(target.x - current.x, target.y - current.y) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onEnter = () => {
      live = true;
      island.classList.add("is-live");
      kick();
    };
    const onMove = (e: PointerEvent) => {
      const r = island.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      kick();
    };
    const onLeave = () => {
      live = false;
      island.classList.remove("is-live");
      kick();
    };

    island.addEventListener("pointerenter", onEnter);
    island.addEventListener("pointermove", onMove);
    island.addEventListener("pointerleave", onLeave);
    return () => {
      island.removeEventListener("pointerenter", onEnter);
      island.removeEventListener("pointermove", onMove);
      island.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (target: string, label: string) => {
    setActive(label);
    setDrawerOpen(false);
    setCtaOpen(false);
    scrollToId(target);
  };

  return (
    <>
      <header className={`q-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="q-container">
          <div
            className={`header-bar flex items-center justify-between whitespace-nowrap rounded-full transition-all duration-300 ${scrolled
              ? "is-scrolled gap-3 border border-white/10 bg-black/40 px-4 py-2.5 shadow-2xl backdrop-blur-xl md:gap-4 md:px-6 md:py-3"
              : "gap-3 border border-transparent px-0 py-0 md:gap-4"
              }`}
          >
            {/* Logo */}
            <button
              onClick={() => go("home", "Home")}
              className="flex shrink-0 cursor-pointer items-center py-1"
              aria-label="QELVRA back to top"
            >
              <LogoImage height={36} alt="QELVRA" />
            </button>

            {/* DESKTOP / TABLET navigation — strictly >= 768px */}
            <nav
              ref={islandRef}
              className="nav-island hidden min-w-0 md:flex"
              aria-label="Primary"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => go(item.target, item.label)}
                  className={`nav-link ${active === item.label ? "is-active" : ""}`}
                  aria-current={active === item.label ? "page" : undefined}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right side: CTA + popover (>=768) | hamburger (<768) */}
            <div className="flex shrink-0 items-center gap-2.5 md:gap-3">
              <div className="relative hidden md:block" data-cta-pop-root>
                <button
                  onClick={() => setCtaOpen((v) => !v)}
                  className="contact-btn px-5! text-[14px]!"
                  aria-expanded={ctaOpen}
                  aria-haspopup="true"
                >
                  Contact Me
                  <span className="pulse" aria-hidden="true" />
                </button>
                {ctaOpen && <ContactCard />}
              </div>

              {/* MOBILE menu trigger — strictly < 768px */}
              <button
                className="contact-btn flex md:hidden px-3.5!"
                onClick={() => setDrawerOpen(true)}
                aria-expanded={drawerOpen}
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE drawer — strictly < 768px */}
        <div
          className={`q-drawer-overlay md:hidden ${drawerOpen ? "is-open" : ""}`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
        <aside
          className={`q-drawer md:hidden ${drawerOpen ? "is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Menu
            </span>
            <button
              className="icon-btn"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <X size={17} />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-1.5" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.target, item.label)}
                className={`drawer-link ${active === item.label ? "is-active" : ""}`}
              >
                {item.label}
                <ArrowUpRight size={16} className="opacity-40" />
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            {/* Contact Me CTA — toggles the quick-contact card above it */}
            <div className="relative z-10" data-cta-pop-root>
              {drawerCta && (
                <ContactCard placement="inline" subtext="Usually replies within 24h" />
              )}
              <button
                className="btn btn-primary w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setDrawerCta((v) => !v);
                }}
                aria-expanded={drawerCta}
                aria-haspopup="true"
              >
                Contact Me
              </button>
            </div>
          </div>
        </aside>
      </header>
    </>
  );
}
