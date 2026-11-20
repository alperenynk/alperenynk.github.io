import { useEffect, useRef, useState } from "react";
import Avatar, { type Scene } from "./Avatar";
import Typewriter from "./Typewriter";

interface Props {
  /** one message per section id */
  messages: Record<string, string>;
  openLabel: string;
  /** id of the section currently in view */
  section: string;
  scene: Scene;
}

const AUTO_HIDE_MS = 5000;

/**
 * Bottom-right avatar. Appears after the visitor scrolls a bit and says something
 * specific to each section as it comes into view. The speech bubble is always in
 * the DOM and just fades/scales in and out (`is-empty`), anchored to the avatar's
 * head; it closes itself 5 seconds after the message has finished typing.
 * Clicking the avatar repeats the message.
 */
export default function FloatingAvatar({ messages, openLabel, section, scene }: Props) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  // `run` changes on every (re)start so the same text can be typed again
  const [said, setSaid] = useState({ text: "", run: 0 });
  const hideTimer = useRef<number | undefined>(undefined);

  const message = messages[section] ?? "";

  const say = (text: string) => {
    setSaid((s) => ({ text, run: s.run + 1 }));
    setOpen(true);
  };

  // show after scrolling
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 5s countdown starts when the typing finishes
  const armAutoHide = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), AUTO_HIDE_MS);
  };

  // new section (or language) → fade the old bubble out, then say the new message
  // (short delay so fast scrolling doesn't flicker)
  useEffect(() => {
    window.clearTimeout(hideTimer.current);
    setOpen(false);
    if (!visible || !message) return;
    const t = window.setTimeout(() => say(message), 500);
    return () => window.clearTimeout(t);
  }, [section, message, visible]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const onAvatarClick = () => {
    window.clearTimeout(hideTimer.current);
    if (message) say(message);
  };

  return (
    <div className={`fab ${visible ? "fab--on" : ""}`}>
      <div className={`bubble fab__bubble ${open ? "" : "is-empty"}`} role="status" aria-hidden={!open}>
        <Typewriter key={said.run} text={said.text} onDone={armAutoHide} />
      </div>
      <button className="fab__btn" onClick={onAvatarClick} aria-label={openLabel} title={openLabel}>
        <Avatar size={140} scene={scene} />
      </button>
    </div>
  );
}
