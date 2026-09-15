import { getAssetPath } from "../assets";

interface LogoProps {
  /** Height of the logo in pixels */
  height?: number;
  /** Custom CSS classes */
  className?: string;
  /** Accessible alt text */
  alt?: string;
}

/**
 * Brand Logo Component rendering the local qelvra-logo.png image asset.
 */
export function LogoImage({
  height = 36,
  className = "",
  alt = "QELVRA",
}: LogoProps) {
  const logoUrl = getAssetPath("logos", "qelvra-logo", "png");

  return (
    <img
      src={logoUrl}
      alt={alt}
      style={{ height: `${height}px` }}
      className={`w-auto object-contain transition-opacity hover:opacity-90 ${className}`}
      loading="eager"
      decoding="async"
      onError={(e) => console.error("Failed to load asset:", e.currentTarget.src)}
    />
  );
}

export function LogoMark({ size = 40 }: { size?: number }) {
  return <LogoImage height={size} />;
}
