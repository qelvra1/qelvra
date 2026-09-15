import LocalPreviewImage from "./LocalPreviewImage";

interface SmartImageProps {
  folder: string;
  name?: string;
  image?: string;
  alt: string;
  className?: string;
}

/**
 * Backward-compatible SmartImage wrapper around LocalPreviewImage.
 */
export default function SmartImage({
  folder,
  name,
  alt,
  className,
}: SmartImageProps) {
  return (
    <LocalPreviewImage
      folderName={folder}
      title={name}
      alt={alt}
      className={className}
    />
  );
}
