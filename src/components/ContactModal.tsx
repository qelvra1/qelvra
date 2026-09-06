import { useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";
import emailjs from "@emailjs/browser";
import GradientCTA from "./GradientCTA";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_LETS_TALK_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "@/config/emailjs.config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

type FieldErrors = { from_name?: boolean; from_email?: boolean; message?: boolean };

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setIsSubmitted(false);
    setErrors({});
    setFormData({ from_name: "", from_email: "", message: "" });
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
    if (status === "error") setStatus("idle");
  };

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitted(true);
    if (status === "error") setStatus("idle");

    const next: FieldErrors = {};
    const name = formData.from_name.trim();
    const email = formData.from_email.trim();
    const message = formData.message.trim();

    if (!name) next.from_name = true;
    if (!email || !EMAIL_RE.test(email)) next.from_email = true;
    if (!message) next.message = true;

    setErrors(next);
    if (next.from_name || next.from_email || next.message) {
      return;
    }

    setStatus("sending");

    const serviceId = EMAILJS_SERVICE_ID;
    const templateId = EMAILJS_LETS_TALK_TEMPLATE_ID;
    const publicKey = EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("Missing EmailJS configuration:", {
        serviceId: Boolean(serviceId),
        templateId: Boolean(templateId),
        publicKey: Boolean(publicKey),
      });
      setStatus("error");
      return;
    }

    const templateParams = {
      from_name: name,
      name: name,
      user_name: name,

      from_email: email,
      email: email,
      reply_to: email,
      user_email: email,

      message: message,
      notes: message,
    };

    console.log("Submitting contact form data:", templateParams);

    try {
      const res = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );
      console.log("EmailJS Success:", res);

      setFormData({ from_name: "", from_email: "", message: "" });
      setStatus("sent");

      closeTimerRef.current = window.setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("EmailJS Send Failed:", err?.text || err?.message || err);
      setStatus("error");
    } finally {
      // Guarantee the button is never left in the loading/sending state
      setStatus((prev) => (prev === "sending" ? "error" : prev));
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
    >
      <div className="modal-card p-7 md:p-9">
        {status === "sent" ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-mint/15 text-mint shadow-[0_0_30px_-6px_rgba(52,211,153,0.6)]">
              <Check size={26} strokeWidth={2.4} />
            </span>
            <h3 className="font-display mt-5 text-xl font-bold text-snow">
              Message sent!
            </h3>
            <p className="mt-2 max-w-xs text-sm text-fog">
              Thanks for reaching out! I usually reply within 24 hours.
            </p>
            <button className="btn btn-ghost mt-7" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h3 id="contact-title" className="font-display text-xl font-bold text-snow">
                  Let&apos;s Talk
                </h3>
                <p className="mt-1.5 text-[13.5px] text-fog">
                  Tell me a little about your idea.
                </p>
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
                <X size={17} />
              </button>
            </div>

            <form className="mt-6 flex flex-col gap-4" onSubmit={submit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[12.5px] font-bold text-slate-400">
                  Name
                  <input
                    ref={firstFieldRef}
                    name="from_name"
                    value={formData.from_name}
                    className="field"
                    placeholder="Jane Doe"
                    aria-invalid={errors.from_name || undefined}
                    onChange={handleChange}
                  />
                  {isSubmitted && errors.from_name && (
                    <span className="text-xs text-rose-400 mt-1 font-normal">
                      Please fill in all required fields correctly before sending.
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1.5 text-[12.5px] font-bold text-slate-400">
                  Email
                  <input
                    name="from_email"
                    type="email"
                    value={formData.from_email}
                    className="field"
                    placeholder="jane@company.com"
                    aria-invalid={errors.from_email || undefined}
                    onChange={handleChange}
                  />
                  {isSubmitted && errors.from_email && (
                    <span className="text-xs text-rose-400 mt-1 font-normal">
                      Please fill in all required fields correctly before sending.
                    </span>
                  )}
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-[12.5px] font-bold text-slate-400">
                Message
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  className="field resize-none"
                  placeholder="A SaaS dashboard for..."
                  aria-invalid={errors.message || undefined}
                  onChange={handleChange}
                />
                {isSubmitted && errors.message && (
                  <span className="text-xs text-rose-400 mt-1 font-normal">
                    Please fill in all required fields correctly before sending.
                  </span>
                )}
              </label>

              {status === "error" && (
                <span className="text-xs text-rose-400 block text-center font-normal">
                  Failed to send. Please check your network or EmailJS settings.
                </span>
              )}

              <GradientCTA
                type="submit"
                size="sm"
                onClick={submit}
                loading={status === "sending"}
                disabled={status === "sending"}
                className="mt-1 w-full"
              >
                Send Message
              </GradientCTA>
              <p className="flex items-center justify-center gap-2 text-center text-[12px] font-semibold text-slate-400">
                <span
                  className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                  aria-hidden="true"
                />
                Always on services
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
