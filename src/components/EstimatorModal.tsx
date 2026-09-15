import { useEffect, useRef, useState } from "react";
import { X, Check, ArrowLeft } from "lucide-react";
import emailjs from "@emailjs/browser";
import GradientCTA from "./GradientCTA";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_START_PROJECT_TEMPLATE_ID,
} from "@/config/emailjs.config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS = [
  {
    key: "type",
    question: "What kind of product do you need?",
    options: ["Website", "Web App", "SaaS Platform", "Dashboard", "Mobile App"],
  },
  {
    key: "budget",
    question: "What's your budget bracket?",
    options: [
      "Essential / Small Scope",
      "Growth / Standard Business",
      "Enterprise / Custom Build",
      "Flexible / To be estimated",
    ],
  },
  {
    key: "timeline",
    question: "How fast do you need to move?",
    options: [
      "Urgent (ASAP / Express delivery)",
      "Standard Timeline (Moderate pace)",
      "Flexible / Long-term strategy",
      "Not decided yet",
    ],
  },
] as const;

type StepKey = (typeof STEPS)[number]["key"];
type Selections = Partial<Record<StepKey, string>>;

interface EstimatorModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EstimatorModal({ open, onClose }: EstimatorModalProps) {
  const [step, setStep] = useState(0); // 0..2 option steps, 3 = contact
  const [sel, setSel] = useState<Selections>({});
  const [contact, setContact] = useState({ name: "", email: "", notes: "" });
  const [errors, setErrors] = useState<{ name?: boolean; email?: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const nameRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const totalSteps = STEPS.length + 1;
  const isContact = step === STEPS.length;

  const resetForm = () => {
    setStep(0);
    setSel({});
    setContact({ name: "", email: "", notes: "" });
    setErrors({});
    setIsSubmitted(false);
    setStatus("idle");
    setErrorMessage("");
  };

  useEffect(() => {
    if (!open) return;
    resetForm();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && isContact) {
      const t = window.setTimeout(() => nameRef.current?.focus(), 80);
      return () => window.clearTimeout(t);
    }
  }, [open, isContact]);

  if (!open) return null;

  const current = STEPS[step];
  const canContinue = isContact || Boolean(sel[current?.key ?? "type"]);

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitted(true);
    setErrorMessage("");

    const next: { name?: boolean; email?: boolean } = {};
    const name = contact.name.trim();
    const email = contact.email.trim();

    if (!name) next.name = true;
    if (!email || !EMAIL_RE.test(email)) next.email = true;

    setErrors(next);
    if (next.name || next.email) {
      return;
    }

    setStatus("sending");

    const serviceId = EMAILJS_SERVICE_ID;
    const templateId = EMAILJS_START_PROJECT_TEMPLATE_ID;
    const publicKey = EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      const missingKeys = [
        !serviceId && "VITE_EMAILJS_SERVICE_ID",
        !templateId && "VITE_EMAILJS_START_PROJECT_TEMPLATE_ID",
        !publicKey && "VITE_EMAILJS_PUBLIC_KEY",
      ]
        .filter(Boolean)
        .join(", ");
      const msg = `Missing EmailJS env vars: ${missingKeys}`;
      console.error(msg);
      setErrorMessage(msg);
      setStatus("error");
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      reply_to: email,
      product_type: sel.type || "Not specified",
      budget_bracket: sel.budget || "Not specified",
      timeline: sel.timeline || "Not specified",
      message: contact.notes.trim() || "No additional notes.",
    };

    console.log("[EstimatorModal] Sending:", { serviceId, templateId, templateParams });

    try {
      // Pass publicKey as 4th arg — no module-level init() needed
      const res = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log("[EstimatorModal] EmailJS success:", res.status, res.text);
      setStatus("sent");
      closeTimerRef.current = window.setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (err: unknown) {
      const e = err as { status?: number; text?: string; message?: string };
      console.error("[EstimatorModal] EmailJS error:", e);
      const msg =
        e?.text ||
        e?.message ||
        (typeof err === "string" ? err : "Failed to send. Please check your network or EmailJS settings.");
      setErrorMessage(
        e?.status ? `EmailJS error ${e.status}: ${msg}` : msg
      );
      setStatus("error");
    } finally {
      // Ensure the button is NEVER stuck in loading
      setStatus((prev) => (prev === "sending" ? "error" : prev));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#02060e]/75 p-4 backdrop-blur-md sm:p-6 animate-[fadeIn_0.25s_ease_both]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimator-title"
    >
      <div className="relative mx-auto my-auto w-full max-w-md rounded-3xl border border-slate-800/80 bg-[#080c16] p-5 shadow-2xl sm:max-w-lg sm:p-7 animate-[modalIn_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
        {status === "sent" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-mint/15 text-mint shadow-[0_0_30px_-6px_rgba(52,211,153,0.6)]">
              <Check size={26} strokeWidth={2.4} />
            </span>
            <h3 className="font-display mt-5 text-xl font-bold text-snow">
              Project brief received!
            </h3>
            <p className="mt-2 max-w-sm text-sm text-fog">
              I&apos;ll review your details and reply with a tailored estimate
              within 24 hours.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {STEPS.map((s) => (
                <span key={s.key} className="q-badge">
                  {sel[s.key]}
                </span>
              ))}
            </div>
            <button className="btn btn-ghost mt-7" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h3 id="estimator-title" className="font-display text-xl font-bold text-snow">
                  Start Your Project
                </h3>
                <p className="mt-1.5 text-[13.5px] text-fog">
                  {isContact
                    ? "Almost there! How can I reach you?"
                    : "A few quick questions to shape your estimate."}
                </p>
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
                <X size={17} />
              </button>
            </div>

            {/* Progress */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2" aria-hidden="true">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className={`step-dot ${i === step ? "is-active" : i < step ? "is-done" : ""}`}
                  />
                ))}
              </div>
              <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Step {step + 1} of {totalSteps}
              </span>
            </div>

            {/* Step body */}
            <div key={step} className="est-step mt-6">
              {!isContact ? (
                <>
                  <div>
                    <p className="font-display text-[16px] font-bold text-snow">
                      {current?.question}
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {current?.options.map((opt) => {
                        const selected = sel[current.key] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`opt-btn ${selected ? "is-selected" : ""}`}
                            aria-pressed={selected}
                            onClick={() => {
                              setSel((p) => ({ ...p, [current.key]: opt }));
                            }}
                          >
                            {opt}
                            {selected && (
                              <span className="opt-check">
                                <Check size={12} strokeWidth={3} />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 1-3 Navigation */}
                  <div className="mt-7 flex items-center justify-between gap-4">
                    {step > 0 ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setStep((s) => s - 1)}
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>
                    ) : (
                      <span />
                    )}

                    <GradientCTA
                      type="button"
                      disabled={!canContinue}
                      onClick={() => setStep((s) => s + 1)}
                    >
                      Continue
                    </GradientCTA>
                  </div>
                </>
              ) : (
                <form
                  id="estimator-form"
                  className="flex flex-col gap-4"
                  onSubmit={submit}
                  noValidate
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-[12.5px] font-bold text-slate-400">
                      Name
                      <input
                        ref={nameRef}
                        name="from_name"
                        value={contact.name}
                        onChange={(e) => {
                          setContact((p) => ({ ...p, name: e.target.value }));
                          setErrors((p) => ({ ...p, name: false }));
                          if (status === "error") setStatus("idle");
                        }}
                        className="field"
                        placeholder="Jane Doe"
                        aria-invalid={errors.name || undefined}
                      />
                      {isSubmitted && errors.name && (
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
                        value={contact.email}
                        onChange={(e) => {
                          setContact((p) => ({ ...p, email: e.target.value }));
                          setErrors((p) => ({ ...p, email: false }));
                          if (status === "error") setStatus("idle");
                        }}
                        className="field"
                        placeholder="jane@company.com"
                        aria-invalid={errors.email || undefined}
                      />
                      {isSubmitted && errors.email && (
                        <span className="text-xs text-rose-400 mt-1 font-normal">
                          Please fill in all required fields correctly before sending.
                        </span>
                      )}
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5 text-[12.5px] font-bold text-slate-400">
                    <span>
                      Anything else?{" "}
                      <span className="font-semibold text-slate-500">(optional)</span>
                    </span>
                    <textarea
                      name="message"
                      rows={3}
                      value={contact.notes}
                      onChange={(e) => {
                        setContact((p) => ({ ...p, notes: e.target.value }));
                        if (status === "error") setStatus("idle");
                      }}
                      className="field resize-none"
                      placeholder="Goals, references, must-have features..."
                    />
                  </label>

                  {status === "error" && (
                    <span className="text-xs text-rose-400 block text-center font-normal">
                      {errorMessage || "Failed to send. Please check your EmailJS settings."}
                    </span>
                  )}

                  {/* Step 4 Navigation */}
                  <div className="mt-7 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setStep((s) => s - 1)}
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>

                    <GradientCTA
                      type="submit"
                      onClick={submit}
                      loading={status === "sending"}
                      disabled={status === "sending"}
                      className="min-w-[160px]"
                    >
                      Submit
                    </GradientCTA>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
