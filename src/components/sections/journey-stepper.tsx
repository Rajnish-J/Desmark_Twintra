"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Circle, Dot } from "lucide-react";
import { journeyIntro, phases, type PhaseStatus } from "@/content/journey";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusRing: Record<PhaseStatus, string> = {
  active: "border-forest-light bg-forest-light text-forest",
  planned: "border-cream/35 bg-transparent text-cream/80",
  vision: "border-cream/15 bg-transparent text-cream/35",
};

const statusText: Record<PhaseStatus, string> = {
  active: "text-forest-light",
  planned: "text-cream/70",
  vision: "text-cream/35",
};

function StepIcon({ status, step }: { status: PhaseStatus; step: number }) {
  if (status === "active") return <Check className="size-5" aria-hidden />;
  if (status === "vision") return <Circle className="size-3.5" aria-hidden />;
  return <span className="text-[15px] font-semibold">{step}</span>;
}

export function JourneyStepper() {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const phase = phases[selected];

  return (
    <Section id="journey" dark className="isolate overflow-hidden bg-forest">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 15% 0%, rgba(192,57,43,0.22) 0%, transparent 58%), radial-gradient(ellipse 60% 50% at 88% 92%, rgba(184,146,42,0.16) 0%, transparent 60%)",
        }}
      />

      <SectionHeading
        label={journeyIntro.label}
        title={journeyIntro.title}
        tone="dark"
        align="center"
        className="mx-auto"
      />

      {/* ─── Horizontal rail (md and up) ─── */}
      <div className="mt-16 hidden md:block">
        <ol className="relative flex items-start justify-between">
          {/* Base track */}
          <span
            aria-hidden
            className="absolute left-0 right-0 top-6 -z-10 h-px bg-cream/12"
          />
          {/* Progress up to the selected step */}
          <motion.span
            aria-hidden
            className="absolute left-0 top-6 -z-10 h-px origin-left bg-gradient-to-r from-forest-light to-chilli-warm"
            initial={false}
            animate={{
              width: `${(selected / (phases.length - 1)) * 100}%`,
            }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {phases.map((p, i) => {
            const isSelected = i === selected;

            return (
              <li key={p.step} className="flex flex-1 flex-col items-center px-3 text-center">
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-current={isSelected ? "step" : undefined}
                  className="group flex flex-col items-center focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full border-2 bg-forest transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-chilli-warm/40",
                      statusRing[p.status],
                      isSelected &&
                        "scale-105 shadow-[0_0_0_5px_color-mix(in_srgb,var(--color-chilli-warm)_22%,transparent)]",
                    )}
                  >
                    <StepIcon status={p.status} step={p.step} />
                  </span>

                  <span
                    className={cn(
                      "mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
                      isSelected ? "text-chilli-warm" : statusText[p.status],
                    )}
                  >
                    {p.badge}
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 font-display text-[1.15rem] leading-snug transition-colors",
                      isSelected
                        ? "text-cream"
                        : p.status === "vision"
                          ? "text-cream/40"
                          : "text-cream/70",
                    )}
                  >
                    {p.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ─── Detail card ─── */}
      <div className="mt-10 hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.step}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-cream/12 bg-cream/[0.04] p-8 backdrop-blur-sm lg:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chilli-warm">
                  {phase.badge}
                </p>
                <h3 className="mt-3 font-display text-[1.75rem] leading-tight text-cream">
                  {phase.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.75] text-cream/60">
                  {phase.description}
                </p>
              </div>

              <ul className="space-y-3.5 lg:border-l lg:border-cream/10 lg:pl-10">
                {phase.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[14px] leading-[1.6] text-cream/70">
                    <Dot className="mt-0.5 size-5 shrink-0 text-chilli-warm" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 flex items-center justify-between gap-4 border-t border-cream/10 pt-7">
              <Button
                variant="glass"
                size="md"
                onClick={() => setSelected((s) => Math.max(0, s - 1))}
                disabled={selected === 0}
              >
                <ArrowLeft className="size-4" aria-hidden />
                Go Back
              </Button>

              <span className="text-[12.5px] tracking-[0.06em] text-cream/40">
                Phase {selected + 1} of {phases.length}
              </span>

              <Button
                variant="primary"
                size="md"
                onClick={() =>
                  setSelected((s) => Math.min(phases.length - 1, s + 1))
                }
                disabled={selected === phases.length - 1}
              >
                Next Step
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Vertical timeline (below md) ─── */}
      <ol className="mt-12 md:hidden">
        {phases.map((p, i) => {
          const isLast = i === phases.length - 1;

          return (
            <li key={p.step} className="relative flex gap-5 pb-10 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[23px] top-12 h-[calc(100%-3rem)] w-px bg-cream/12"
                />
              )}

              <span
                className={cn(
                  "z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 bg-forest",
                  statusRing[p.status],
                )}
              >
                <StepIcon status={p.status} step={p.step} />
              </span>

              <div className="pt-1">
                <p
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-[0.16em]",
                    p.status === "active" ? "text-chilli-warm" : statusText[p.status],
                  )}
                >
                  {p.badge}
                </p>
                <h3
                  className={cn(
                    "mt-2 font-display text-[1.35rem] leading-snug",
                    p.status === "vision" ? "text-cream/50" : "text-cream",
                  )}
                >
                  {p.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-[14.5px] leading-[1.7]",
                    p.status === "vision" ? "text-cream/35" : "text-cream/60",
                  )}
                >
                  {p.description}
                </p>

                <ul className="mt-4 space-y-2">
                  {p.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-[13.5px] leading-[1.55] text-cream/50"
                    >
                      <Dot className="mt-px size-4 shrink-0 text-chilli-warm" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
