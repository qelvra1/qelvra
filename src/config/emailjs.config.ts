/**
 * EmailJS configuration — single source of truth.
 *
 * Values are read once at module load from Vite's compile-time env
 * substitution. No other file should reference import.meta.env or
 * process.env for EmailJS keys; import from here instead.
 */
export const EMAILJS_SERVICE_ID: string =
  import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";

export const EMAILJS_PUBLIC_KEY: string =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";

export const EMAILJS_LETS_TALK_TEMPLATE_ID: string =
  import.meta.env.VITE_EMAILJS_LETS_TALK_TEMPLATE_ID ?? "";

export const EMAILJS_START_PROJECT_TEMPLATE_ID: string =
  import.meta.env.VITE_EMAILJS_START_PROJECT_TEMPLATE_ID ?? "";
