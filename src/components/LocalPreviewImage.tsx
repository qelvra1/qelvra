import { DEMO_MODELS, type DemoModelKey } from "../config/demoModels";

interface LocalPreviewImageProps {
  folderName: string;
  title?: string;
  alt?: string;
  className?: string;
}

export default function LocalPreviewImage({
  folderName,
  title,
  alt,
  className = "w-full h-full object-cover object-top",
}: LocalPreviewImageProps) {
  const modelKey = folderName as DemoModelKey;
  const model = DEMO_MODELS[modelKey];
  const src = model ? model.preview : "/placeholder.webp";

  return (
    <img
      src={src}
      alt={alt || `${title || folderName} preview`}
      className={className}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.src = "/placeholder.webp";
      }}
    />
  );
}
