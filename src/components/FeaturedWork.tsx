import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, Play } from "lucide-react";
import type { FilterKey, Project } from "../data";
import { useProjects } from "../data/projectsStore";
import { scrollToId } from "../lib/motion";
import LocalPreviewImage from "./LocalPreviewImage";

const BATCH_SIZE = 6;
/* Above this many items the grid switches to windowed virtual rendering
   so only viewport-visible rows live in the DOM. */
const VIRTUALIZE_AT = 18;
const COLS = 3;
const ROW_HEIGHT = 420;

/* Horizontal pill filters — matches the reference composition */
const H_FILTERS: FilterKey[] = [
  "All",
  "Websites",
  "Marketplace",
  "Web Apps",
  "SaaS",
  "Dashboards",
  "Mobile Apps",
];

function Card({
  p,
  enterIndex,
  leaving,
  onPreview,
}: {
  p: Project;
  enterIndex?: number;
  leaving?: boolean;
  onPreview: (project: Project) => void;
}) {
  return (
    <article
      className={`project-card ${leaving ? "card-leave" : ""} ${
        enterIndex !== undefined ? "card-enter" : ""
      }`}
      style={enterIndex !== undefined ? { animationDelay: `${enterIndex * 70}ms` } : undefined}
    >
      {/* Thumbnail — clicking opens the in-page preview modal */}
      <div
        className="media"
        role="button"
        tabIndex={0}
        aria-label={`Preview ${p.title}`}
        onClick={() => onPreview(p)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPreview(p)}
      >
        <LocalPreviewImage
          folderName={p.folderName}
          title={p.title}
          alt={`${p.title} preview`}
        />

        {/* Hover CTA — opens modal */}
        <span className="card-cta card-cta--preview" aria-hidden="true">
          <Play size={13} style={{ fill: "currentColor" }} />
          Preview Demo
        </span>
      </div>

      <div className="flex flex-col p-4 pt-3.5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[16px] font-bold text-snow leading-tight">{p.title}</h3>
          {/* Open in new tab */}
          <a
            href={p.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card-arrow flex-none"
            title={`Open ${p.title} in new tab`}
            aria-label={`Open ${p.title} live demo in a new tab`}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        </div>
        <p className="mt-1.5 text-[13px] leading-snug text-fog line-clamp-2">{p.description}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="chip text-[10.5px] px-2.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* Animated empty state for categories still in the workshop */
function ComingSoon({ category }: { category: FilterKey }) {
  return (
    <motion.div
      className="coming-soon"
      role="status"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top: orbital rings with glowing planets */}
      <div className="coming-soon-orbit" aria-hidden="true">
        <span className="orbit-dot d1" />
        <span className="orbit-dot d2" />
        <span className="orbit-dot d3" />
      </div>

      {/* Middle: tag badge */}
      <span className="mt-6 rounded-full border border-slate-700/70 bg-slate-800/40 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
        In the workshop
      </span>

      {/* Header */}
      <h3 className="font-display mt-3 text-[clamp(1.4rem,3vw,2rem)] font-bold tracking-tight text-snow">
        {category} Coming Soon
      </h3>

      {/* Description */}
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-fog">
        Fresh {category.toLowerCase()} builds are being crafted right now.
        They&apos;ll drop into this grid the moment they ship. Check back soon.
      </p>

      {/* Bottom: animated progress indicator */}
      <div className="mt-6 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="ml-1 normal-case tracking-normal text-slate-400">
          Building in progress
        </span>
      </div>
    </motion.div>
  );
}

/* TanStack Virtual row windowing for large catalogs */
function VirtualGrid({ items, onPreview }: { items: Project[]; onPreview: (p: Project) => void }) {
  const rows = useMemo(() => {
    const out: Project[][] = [];
    for (let i = 0; i < items.length; i += COLS) out.push(items.slice(i, i + COLS));
    return out;
  }, [items]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => document.scrollingElement as HTMLElement,
    estimateSize: () => ROW_HEIGHT,
    overscan: 1,
  });

  return (
    <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
      {virtualizer.getVirtualItems().map((vr) => (
        <div
          key={vr.key}
          data-index={vr.index}
          ref={virtualizer.measureElement}
          className="absolute inset-x-0 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          style={{ top: 0, transform: `translateY(${vr.start}px)` }}
        >
          {rows[vr.index].map((p) => (
            <Card key={p.id} p={p} onPreview={onPreview} />
          ))}
        </div>
      ))}
    </div>
  );
}

interface FeaturedWorkProps {
  /** Called when the user clicks "Preview Demo" on a card */
  onPreview: (project: Project) => void;
}

export default function FeaturedWork({ onPreview }: FeaturedWorkProps) {
  const all = useProjects();
  const [filter, setFilter] = useState<FilterKey>("All");
  const [page, setPage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const filtered = all.filter((p) => filter === "All" || p.category === filter);
  const populated = filtered.length > 0;
  const virtualized = filtered.length > VIRTUALIZE_AT;

  const pageCount = Math.max(1, Math.ceil(filtered.length / BATCH_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = populated
    ? filtered.slice(safePage * BATCH_SIZE, safePage * BATCH_SIZE + BATCH_SIZE)
    : [];
  const isLast = safePage === pageCount - 1;

  const goTo = (next: number) => {
    if (leaving || next === safePage || next < 0 || next >= pageCount) return;
    setLeaving(true);
    timer.current = window.setTimeout(() => {
      setPage(next);
      setLeaving(false);
      scrollToId("portfolio");
    }, 300);
  };

  const pick = (f: FilterKey) => {
    window.clearTimeout(timer.current);
    setLeaving(false);
    setPage(0);
    setFilter(f);
  };

  return (
    <section id="portfolio" className="relative py-16 md:py-24">
      <div className="q-container">
        <div data-reveal>
          <span className="q-badge">
            <span className="dot" />
            Selected Projects
          </span>
          <h2 className="font-display mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-bold tracking-tight text-snow">
            Featured Work
          </h2>
        </div>

        {/* Horizontal pill filter bar */}
        <div
          className="mt-9 flex flex-wrap gap-2.5"
          role="tablist"
          aria-label="Project filters"
          data-reveal
        >
          {H_FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`filter-tab ${filter === f ? "is-active" : ""}`}
              onClick={() => pick(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8" data-reveal>
          {!populated ? (
            <ComingSoon category={filter} />
          ) : virtualized ? (
            <VirtualGrid items={filtered} onPreview={onPreview} />
          ) : (
            <>
              <div
                key={`${filter}-${safePage}`}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visible.map((p, i) => (
                  <Card
                    key={p.id}
                    p={p}
                    leaving={leaving}
                    enterIndex={leaving ? undefined : i}
                    onPreview={onPreview}
                  />
                ))}
              </div>

              {pageCount > 1 && (
                <div className="mt-10 flex justify-center" data-reveal>
                  <button
                    className="btn btn-ghost"
                    onClick={() => goTo(isLast ? 0 : safePage + 1)}
                    aria-label={isLast ? "Show less projects" : "Show more projects"}
                  >
                    {isLast ? "Show Less" : "Show More"}
                    {isLast ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
