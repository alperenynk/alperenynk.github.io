import { useCallback, useEffect, useState } from "react";
import type { Lang } from "./content";

export type Theme = "dark" | "light";

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = safeGet("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    safeSet("theme", theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}

export function useLang() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = safeGet("lang");
    if (saved === "en" || saved === "tr") return saved;
    return navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    safeSet("lang", lang);
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === "en" ? "tr" : "en")), []);
  return { lang, toggle };
}

/** Fade-in sections as they scroll into view. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
