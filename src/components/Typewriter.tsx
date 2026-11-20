import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  /** ms per character */
  speed?: number;
  /** called once, when the last character has been typed */
  onDone?: () => void;
}

/**
 * Types `text` out with a blinking block caret.
 *
 * The not-yet-typed part is still rendered (just invisible), so the line breaks
 * and the size of the bubble are final from the first frame: nothing jumps or
 * re-wraps while letters arrive.
 */
export default function Typewriter({ text, speed = 34, onDone }: Props) {
  const chars = Array.from(text); // code points, so emoji aren't split
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    setCount(0);
    if (!text) return;
    const all = Array.from(text).length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(all);
      doneRef.current?.();
      return;
    }
    let i = 0;
    let timer = window.setTimeout(function step() {
      i += 1;
      setCount(i);
      if (i < all) {
        timer = window.setTimeout(step, speed);
      } else {
        doneRef.current?.();
      }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [text, speed]);

  return (
    <span className="tw">
      <span className="tw__sr">{text}</span>
      <span aria-hidden="true">
        {chars.slice(0, count).join("")}
        <span className="tw__caret" />
        <span className="tw__rest">{chars.slice(count).join("")}</span>
      </span>
    </span>
  );
}
