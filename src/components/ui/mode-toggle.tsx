"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

function subscribeNever() {
  return () => {};
}

/**
 * True once hydrated, false on the server and on the first client render.
 * A `useEffect` + `setState` mount flag would work too, but forces an extra
 * render pass; this reads as "false" for the SSR/hydration snapshot and
 * "true" for every snapshot after, without ever calling setState directly.
 */
function useHasMounted() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

/** Cycle order. `system` is last so the two explicit choices are one tap apart. */
const ORDER = ["light", "dark", "system"] as const;
type Mode = (typeof ORDER)[number];

const META: Record<Mode, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  system: { icon: Monitor, label: "System" },
};

/**
 * Single-button theme switch, cycling light → dark → system.
 *
 * `tone="dark"` is for the header while it sits over the violet hero, where
 * the surrounding controls are white-on-transparent rather than inked.
 */
export function ModeToggle({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const reduced = useReducedMotion();

  // The server has no idea which theme will win, so nothing theme-dependent
  // may render until after hydration.
  const mounted = useHasMounted();

  const onDark = tone === "dark";
  const shell = cn(
    "flex size-10 items-center justify-center rounded-full border transition-colors",
    onDark
      ? "border-white/20 text-white hover:bg-white/10"
      : "border-outline/15 text-heading hover:bg-outline/[0.06]",
    className,
  );

  if (!mounted) {
    // Same box, no icon — keeps the header from reflowing on hydration.
    return <div className={shell} aria-hidden />;
  }

  const current = (ORDER.includes(theme as Mode) ? theme : "system") as Mode;
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

  // `system` shows whichever theme it resolved to, so the icon always matches
  // what is actually on screen.
  const shown: Mode =
    current === "system" ? (resolvedTheme === "dark" ? "dark" : "light") : current;
  const Icon = META[shown].icon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={shell}
      title={`Theme: ${META[current].label} — switch to ${META[next].label}`}
      aria-label={`Theme: ${META[current].label}. Switch to ${META[next].label}.`}
    >
      <span className="relative flex size-5 items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={shown}
            initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -70, scale: 0.6 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Icon className="size-5" aria-hidden />
          </motion.span>
        </AnimatePresence>
      </span>

      {/* `system` is invisible in the icon, so name it for screen readers. */}
      <span className="sr-only">
        {current === "system" ? "Following system theme" : `${META[current].label} theme`}
      </span>
    </button>
  );
}
