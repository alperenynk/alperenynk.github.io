import { useEffect, useRef, type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** element to render, so <li>/<article> cards keep their semantics */
  as?: "div" | "li" | "article";
}

/* ---- one shared pointer listener for every card (instead of one per card) ---- */
const cards = new Set<HTMLElement>();
let pointer: { x: number; y: number } | null = null;
let frame = 0;

function paint() {
  frame = 0;
  const vh = window.innerHeight;

  // read all rects first, then write (avoids layout thrashing)
  const reads: Array<[HTMLElement, DOMRect]> = [];
  cards.forEach((el) => reads.push([el, el.getBoundingClientRect()]));

  for (const [el, r] of reads) {
    if (!pointer || r.bottom < -300 || r.top > vh + 300) {
      el.style.setProperty("--mx", "-9999");
      el.style.setProperty("--my", "-9999");
      continue;
    }
    // pointer position relative to the card, so it also works inside transformed
    // parents (.reveal) and on iOS where background-attachment: fixed is unsupported
    el.style.setProperty("--mx", (pointer.x - r.left).toFixed(1));
    el.style.setProperty("--my", (pointer.y - r.top).toFixed(1));
  }
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(paint);
};
const onMove = (e: PointerEvent) => {
  pointer = { x: e.clientX, y: e.clientY };
  schedule();
};
const onLeave = () => {
  pointer = null;
  schedule();
};

function subscribe(el: HTMLElement) {
  if (cards.size === 0) {
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointercancel", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", schedule, { passive: true });
  }
  cards.add(el);
  return () => {
    cards.delete(el);
    if (cards.size === 0) {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointercancel", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

export default function GlowCard({ children, className = "", as = "div" }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return subscribe(el);
  }, []);

  const Tag = as as "div";

  return (
    <Tag ref={ref} className={`glow-card ${className}`.trim()}>
      <div className="glow-card__halo" aria-hidden="true" />
      {children}
    </Tag>
  );
}
