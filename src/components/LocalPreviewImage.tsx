import { useState, useEffect } from "react";
import { previewCandidates } from "../assets";

interface LocalPreviewImageProps {
  /** Lowercase folder name inside /assets/demos/ */
  folderName: string;
  /** Display title for accessibility and fallback presentation */
  title?: string;
  /** Accessible alt text */
  alt?: string;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Dynamic Local Asset Preview Loader Component
 *
 * Loads preview images locally from `./assets/demos/${folderName}/${folderName}.${ext}`.
 * Automatically falls back across extensions (.avif -> .webp -> .png -> .jpg -> .jpeg)
 * until the model preview renders (e.g. aurelia.webp, oak-blade.webp).
 * Uses strictly local assets with no external fetches.
 */
export default function LocalPreviewImage({
  folderName,
  title,
  alt,
  className = "w-full h-full object-cover object-top",
}: LocalPreviewImageProps) {
  const [extIndex, setExtIndex] = useState<number>(0);

  useEffect(() => {
    setExtIndex(0);
  }, [folderName]);

  const candidatePaths = previewCandidates(folderName, title);

  if (extIndex >= candidatePaths.length) {
    const displayInitial = (title || folderName).charAt(0).toUpperCase();
    return (
      <div
        className="relative flex h-full w-full select-none items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-center shadow-inner"
        role="img"
        aria-label={alt || `${title || folderName} preview`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-slate-800/80 font-display text-2xl font-bold text-cyan-400 shadow-lg backdrop-blur-md">
            {displayInitial}
          </div>
          <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {title || folderName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      key={candidatePaths[extIndex]}
      className={className}
      src={candidatePaths[extIndex]}
      alt={alt || `${title || folderName} preview`}
      loading="lazy"
      decoding="async"
      onError={() => {
        setExtIndex((prev) => prev + 1);
      }}
    />
  );
}
