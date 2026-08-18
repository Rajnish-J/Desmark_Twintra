"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { EnquiryForm } from "./enquiry-form";
import { getProduct } from "@/content/products";
import { useScrollViewport } from "@/components/scroll-viewport-context";

export function QuoteDrawer({
  open,
  product,
  onClose,
}: {
  open: boolean;
  product?: string;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useScrollViewport();

  // Close on Escape, and keep Tab focus inside the panel while it is open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Lock app scroll behind the drawer.
  useEffect(() => {
    if (!open) return;
    const el = viewportRef.current;
    closeRef.current?.focus();
    if (!el) return;
    const previous = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = previous;
    };
  }, [open, viewportRef]);

  const matched = product ? getProduct(product) : undefined;
  const displayName = matched?.name ?? product;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.button
            type="button"
            aria-label="Close quote panel"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-forest/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-drawer-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[540px] flex-col bg-surface shadow-[-24px_0_60px_-20px_rgba(27,58,45,0.35)]"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="relative shrink-0 overflow-hidden bg-forest px-6 py-7 sm:px-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 90% at 88% 10%, rgba(224,95,58,0.35) 0%, transparent 62%)",
                }}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-chilli-warm">
                    Request a Quote
                  </p>
                  <h2
                    id="quote-drawer-title"
                    className="mt-2 font-display text-2xl leading-tight text-cream sm:text-[1.75rem]"
                  >
                    {displayName ?? "Tell us what you need"}
                  </h2>
                  {matched && (
                    <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-cream/60">
                      {matched.summary}
                    </p>
                  )}
                </div>

                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="on-dark -mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-cream/70 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-cream"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
              <EnquiryForm
                presetProduct={matched?.name ?? product}
                compact
                onSuccess={() => {
                  // Leave the confirmation on screen; the user closes when ready.
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
