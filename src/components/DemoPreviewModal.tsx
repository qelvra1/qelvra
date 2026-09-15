import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Loader } from "lucide-react";
import type { Project } from "../data/projects";
import { DEMO_MODELS, type DemoModelKey } from "../config/demoModels";

interface DemoPreviewModalProps {
  project: Project | null;
  onClose: () => void;
}

const PORTFOLIO_FAVICON = "/favicon.ico";

function setFavicon(href: string) {
  let el = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!el) {
    el = document.createElement("link");
    el.rel = "icon";
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function DemoPreviewModal({ project, onClose }: DemoPreviewModalProps) {
  const open = project !== null;
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeModel = (project?.folderName || "") as DemoModelKey;
  const modelConfig = DEMO_MODELS[activeModel];

  /* ── Favicon switching ─────────────────────────────────────── */
  useEffect(() => {
    if (!open || !modelConfig) return;
    setLoading(true);
    const modelFavicon = `${modelConfig.assetsDir}favicons/favicon.ico`;
    setFavicon(modelFavicon);
    return () => {
      setFavicon(PORTFOLIO_FAVICON);
    };
  }, [open, modelConfig]);

  /* ── Body scroll lock + Escape key ─────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !project || !modelConfig) return null;

  const entryUrl = DEMO_MODELS[activeModel].entry;

  return (
    <div
      id="demo-preview-modal"
      className="demo-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} demo preview`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="demo-modal-shell">
        {/* ── Top bar ───────────────────────────────────────────── */}
        <header className="demo-modal-bar">
          <div className="demo-modal-bar-left">
            <span className="demo-modal-dot demo-modal-dot--red" />
            <span className="demo-modal-dot demo-modal-dot--yellow" />
            <span className="demo-modal-dot demo-modal-dot--green" />
          </div>

          <div className="demo-modal-url-pill">
            <span className="demo-modal-url-icon" aria-hidden="true">
              🔒
            </span>
            <span className="demo-modal-url-text">{project.title}</span>
          </div>

          <div className="demo-modal-bar-actions">
            <a
              href={entryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-modal-action-btn"
              title="Open in new tab"
              aria-label={`Open ${project.title} in new tab`}
            >
              <ExternalLink size={15} />
            </a>
            <button
              id="demo-modal-close"
              className="demo-modal-action-btn demo-modal-close-btn"
              onClick={onClose}
              title="Close preview"
              aria-label="Close demo preview"
            >
              <X size={15} />
            </button>
          </div>
        </header>

        {/* ── Iframe viewport ──────────────────────────────────── */}
        <div className="demo-modal-viewport">
          {loading && (
            <div className="demo-modal-loader" aria-label="Loading demo…">
              <Loader size={32} className="demo-modal-spinner" />
              <p className="demo-modal-loader-text">Loading {project.title}…</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            key={activeModel}
            src={DEMO_MODELS[activeModel].entry}
            className="w-full h-full border-0"
            title={`${activeModel} Demo`}
            style={{ opacity: loading ? 0 : 1 }}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        </div>
      </div>
    </div>
  );
}
