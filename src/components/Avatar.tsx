import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { EYE_SHAPES } from "./avatarEyes";

export type Scene = "wave" | "mug" | "laptop" | "phone" | "chip" | "book" | "trophy" | "mail";

interface Props {
  size?: number;
  scene?: Scene;
}

/* palette sampled from public/avatar.webp */
const OUT = "#140d0a";
const SKIN = "#f2aa84";
const SHIRT_DARK = "#62513f";
const GOLD = "#fbbf24";


/* waving hand: palm centre (868, 668); four slightly fanned fingers + thumb */
const FINGER_W = 19;
const FINGER_DEFS = [
  { off: -28, a: -13, len: 56 },
  { off: -9.5, a: -4, len: 74 },
  { off: 9.5, a: 4, len: 70 },
  { off: 28, a: 13, len: 50 },
];
const WAVE_FINGERS = FINGER_DEFS.map(({ off, a, len }) => {
  const r = (a * Math.PI) / 180;
  const x1 = 868 + off;
  const y1 = 648;
  return { x1, y1, x2: x1 + len * Math.sin(r), y2: y1 - len * Math.cos(r) };
});
const WAVE_GAPS = FINGER_DEFS.slice(0, 3).map((f, i) => {
  const n = FINGER_DEFS[i + 1];
  const a = (((f.a + n.a) / 2) * Math.PI) / 180;
  const x1 = 868 + (f.off + n.off) / 2;
  const len = Math.min(f.len, n.len) - 16;
  return { x1, y1: 644, x2: x1 + len * Math.sin(a), y2: 644 - len * Math.cos(a) };
});

/* size of the waving hand (palm + fingers + thumb), scaled around the wrist so it stays attached to the sleeve.
   1 = original size; raise it to make the hand bigger, lower it to shrink it. */
const HAND_SCALE = 1.2;
const WRIST = { x: 868, y: 708 };

const EYE_L = { x: 433.8, y: 389 };
const EYE_R = { x: 589.4, y: 389 };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* The portrait is drawn twice: the body stays put, the head layer (everything above the collar plus the neck
   column) turns around the base of the neck. The head layer overlaps the body by a few px on the neck, where both
   layers hold identical pixels, so there is no visible seam while it moves. */
const NECK = { x: 512, y: 700 };
const HEAD_CLIP = "0,0 1024,0 1024,648 624,648 624,692 400,692 400,648 0,648";
const BODY_CLIP = "0,648 400,648 400,668 624,668 624,648 1024,648 1024,1024 0,1024";
/* While he waves, the right arm of the portrait (hanging down) is cut away along the torso side; a raised sleeve
   is drawn *under* the body layer instead, so the shoulder blends into the shirt without an outline between them. */
const BODY_CLIP_WAVE = "0,648 400,648 400,668 624,668 624,648 803,648 803,785 772,915 758,1024 0,1024";
const SHIRT = "#735e51"; // flat shirt colour of the portrait
const SLEEVE_PATH_UPPER = "M785 847 L896 885";
const SLEEVE_PATH_FOREARM = "M896 885 L872 722";
/** how far the head follows the pointer at full deflection */
const HEAD_ROT = 8; // degrees
const HEAD_DX = 2; // viewBox units
const HEAD_DY = 5;

const starPath = (cx: number, cy: number, R: number, r: number, n = 5) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI / n) * i - Math.PI / 2;
    const d = i % 2 ? r : R;
    return `${i ? "L" : "M"}${(cx + d * Math.cos(a)).toFixed(1)} ${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join(" ") + "Z";

/** Two-pass cartoon stroke: dark outline underneath, flat colour on top. */
function Limb({ d, w, fill }: { d: string; w: number; fill: string }) {
  return (
    <>
      <path d={d} stroke={OUT} strokeWidth={w + 14} strokeLinecap="round" fill="none" />
      <path d={d} stroke={fill} strokeWidth={w} strokeLinecap="round" fill="none" />
    </>
  );
}

/* Grip hand, built exactly like the waving hand: slim round-capped finger strokes + palm, drawn as one merged
   silhouette (outline pass, then skin pass) with thin creases between the fingers. */
const GRIP_W = 19;
const GRIP_FINGERS = [
  { y: -33, len: 40 },
  { y: -13.5, len: 47 },
  { y: 6, len: 45 },
  { y: 25.5, len: 36 },
];
const GRIP_GAPS = GRIP_FINGERS.slice(0, 3).map((f, i) => {
  const n = GRIP_FINGERS[i + 1];
  return { y: (f.y + n.y) / 2, x2: Math.min(f.len, n.len) - 4 };
});

function Fist({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  // drawn for the left hand (fingers wrap over the front of the object towards +x); the right hand is mirrored
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      {[true, false].map((outline) => {
        const grow = outline ? 14 : 0;
        const col = outline ? OUT : SKIN;
        return (
          <g key={String(outline)} stroke={col} strokeLinecap="round" fill={col}>
            {GRIP_FINGERS.map((f) => (
              <line key={f.y} x1={0} y1={f.y} x2={f.len} y2={f.y} strokeWidth={GRIP_W + grow} />
            ))}
            {/* thumb resting on top of the grip */}
            <line x1={-26} y1={-40} x2={4} y2={-50} strokeWidth={GRIP_W + 2 + grow} />
            <rect x={-40 - grow / 2} y={-40 - grow / 2} width={48 + grow} height={84 + grow} rx={24 + grow / 2} strokeWidth={0} />
          </g>
        );
      })}
      {GRIP_GAPS.map((g, i) => (
        <line key={i} x1={10} y1={g.y} x2={g.x2} y2={g.y} stroke={OUT} strokeWidth={4} strokeLinecap="round" />
      ))}
    </g>
  );
}

/**
 * Both arms + both fists around an object. `hw` = half the distance between the fists,
 * `hy` = fist height. Everything is drawn at 1× then scaled up around the chest so the
 * objects stay readable on the small floating avatar.
 */
const S = 1.3;
function Holder({ hw, hy = 905, children }: { hw: number; hy?: number; children: ReactNode }) {
  const lx = 512 - hw;
  const rx = 512 + hw;
  return (
    <g transform={`translate(512 905) scale(${S}) translate(-512 -905)`}>
      <Limb d={`M${lx - 120} 1090 C${lx - 90} 1020 ${lx - 40} ${hy + 20} ${lx} ${hy + 14}`} w={124} fill={SHIRT_DARK} />
      <Limb d={`M${rx + 120} 1090 C${rx + 90} 1020 ${rx + 40} ${hy + 20} ${rx} ${hy + 14}`} w={124} fill={SHIRT_DARK} />
      {children}
      <Fist x={lx} y={hy} />
      <Fist x={rx} y={hy} flip />
    </g>
  );
}

function Spark({ x, y, s = 1, delay = 0, color = "#fff7d6" }: { x: number; y: number; s?: number; delay?: number; color?: string }) {
  return (
    <path
      className="spark"
      style={{ animationDelay: `${delay}s` }}
      d={`M${x} ${y - 18 * s} Q${x} ${y} ${x + 18 * s} ${y} Q${x} ${y} ${x} ${y + 18 * s} Q${x} ${y} ${x - 18 * s} ${y} Q${x} ${y} ${x} ${y - 18 * s}Z`}
      fill={color}
    />
  );
}

/** small heart that floats up and fades (phone likes, incoming mail) */
function Heart({ x, y, delay = 0, color = "#fb7185", s = 1 }: { x: number; y: number; delay?: number; color?: string; s?: number }) {
  return (
    <path
      className="float-up"
      style={{ animationDelay: `${delay}s` }}
      d={`M${x} ${y + 7 * s} C${x - 17 * s} ${y - 5 * s} ${x - 10 * s} ${y - 19 * s} ${x} ${y - 9 * s} C${x + 10 * s} ${y - 19 * s} ${x + 17 * s} ${y - 5 * s} ${x} ${y + 7 * s}Z`}
      fill={color}
      stroke={OUT}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  );
}

/* binary digits that climb out of the laptop screen */
const BITS = [
  { x: 440, c: "1", d: 0, dx: -6 },
  { x: 560, c: "0", d: 0.5, dx: 6 },
  { x: 500, c: "1", d: 1, dx: -3 },
  { x: 592, c: "1", d: 1.5, dx: 5 },
  { x: 468, c: "0", d: 2, dx: -5 },
  { x: 528, c: "0", d: 2.5, dx: 3 },
];

/**
 * Illustrated avatar of Alperen built on top of the transparent raster portrait (public/avatar.webp).
 * - the baked-in eyes were painted out; sclera, pupils and eyelids are redrawn in SVG,
 *   so the pupils follow the pointer (and wander when idle) and he blinks
 * - the head (with eyes and cap) is a separate layer: it tilts and leans towards the pointer a beat after the
 *   eyes, nods when the scene changes and drifts a little when idle
 * - each `scene` swaps the object he is holding (trophy, laptop, …)
 */
export default function Avatar({ size = 220, scene = "wave" }: Props) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<SVGSVGElement>(null);
  const irisL = useRef<SVGGElement>(null);
  const irisR = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const pointer = useRef({ x: 0, y: 0, t: 0, has: false });
  const sceneChangedAt = useRef(0);

  // after a scene swap he glances down at the new object
  useEffect(() => {
    sceneChangedAt.current = performance.now();
  }, [scene]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, t: performance.now(), has: true };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const cur = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    const idle = { x: 0, y: 0, next: 0 };
    let raf = 0;
    const tick = () => {
      const svg = rootRef.current;
      if (svg && irisL.current && irisR.current) {
        const now = performance.now();
        let tx = 0;
        let ty = 0;
        let hx = 0;
        let hy = 0;
        if (!reduce) {
          const p = pointer.current;
          if (now - sceneChangedAt.current < 700) {
            ty = 0.9;
            hy = 0.8; // nod towards the new object
          } else if (p.has && now - p.t < 4000) {
            const r = svg.getBoundingClientRect();
            const cx = r.left + r.width * 0.5;
            const cy = r.top + r.height * 0.38;
            tx = clamp((p.x - cx) / 260, -1, 1);
            ty = clamp((p.y - cy) / 260, -1, 1);
            // the head reacts to a wider area than the eyes, so it turns smoothly rather than snapping
            hx = clamp((p.x - cx) / 420, -1, 1);
            hy = clamp((p.y - cy) / 420, -1, 1);
          } else {
            // pointer is still: glance around now and then
            if (now > idle.next) {
              idle.x = (Math.random() - 0.5) * 1.3;
              idle.y = (Math.random() - 0.5) * 0.6;
              idle.next = now + 1800 + Math.random() * 2600;
            }
            tx = idle.x;
            ty = idle.y;
            hx = idle.x * 0.45;
            hy = idle.y * 0.45;
          }
        }
        cur.x += (tx - cur.x) * 0.16;
        cur.y += (ty - cur.y) * 0.16;
        const t = `translate(${(cur.x * 12).toFixed(2)} ${(cur.y * 4.5).toFixed(2)})`;
        irisL.current.setAttribute("transform", t);
        irisR.current.setAttribute("transform", t);

        // head: slower than the eyes, so the gaze leads and the head follows
        head.x += (hx - head.x) * 0.07;
        head.y += (hy - head.y) * 0.07;
        headRef.current?.setAttribute(
          "transform",
          `translate(${(head.x * HEAD_DX).toFixed(2)} ${(head.y * HEAD_DY).toFixed(2)}) rotate(${(head.x * HEAD_ROT).toFixed(
            2,
          )} ${NECK.x} ${NECK.y})`,
        );
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const on = (s: Scene) => (scene === s ? "scene on" : "scene");
  const eyes = [
    { side: "L", c: EYE_L, ref: irisL, hl: -7, from: "#ffffff", to: "#fbfbfb" },
    { side: "R", c: EYE_R, ref: irisR, hl: 7, from: "#e3e6eb", to: "#d9dce1" },
  ] as const;

  return (
    <svg
      ref={rootRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      role="img"
      aria-label="Alperen Yanık illustrated avatar"
      style={{ display: "block", overflow: "hidden" }}
    >
      <defs>
        <radialGradient id={`${uid}-iris`} cx="50%" cy="62%" r="60%">
          <stop offset="0" stopColor="#3f6794" />
          <stop offset="1" stopColor="#27425f" />
        </radialGradient>
        <clipPath id={`${uid}-head`}>
          <polygon points={HEAD_CLIP} />
        </clipPath>
        <clipPath id={`${uid}-body`}>
          <polygon points={scene === "wave" ? BODY_CLIP_WAVE : BODY_CLIP} />
        </clipPath>
        <clipPath id={`${uid}-book`}>
          <rect x={404} y={752} width={216} height={170} rx={10} />
        </clipPath>
        {eyes.map((e) => (
          <clipPath key={e.side} id={`${uid}-eye${e.side}`}>
            <polygon points={EYE_SHAPES[e.side].sclera} />
          </clipPath>
        ))}
        {eyes.map((e) => (
          <linearGradient key={e.side} id={`${uid}-scl${e.side}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={e.from} />
            <stop offset="1" stopColor={e.to} />
          </linearGradient>
        ))}
      </defs>

      {/* ---------- raised right sleeve (wave): sits under the body layer so only the outer edge shows ---------- */}
      <g className={on("wave")} aria-hidden="true">
        {[true, false].map((outline) => (
          <g
            key={String(outline)}
            fill="none"
            stroke={outline ? OUT : SHIRT}
            strokeWidth={outline ? 138 : 122}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={SLEEVE_PATH_UPPER} />
            <path d={SLEEVE_PATH_FOREARM} />
          </g>
        ))}
      </g>

      {/* ---------- portrait, body layer (static) ---------- */}
      <image href="./avatar.webp" x={0} y={0} width={1024} height={1024} clipPath={`url(#${uid}-body)`} />

      {/* ---------- head: portrait head layer + eyes + cap, all turning together ---------- */}
      <g ref={headRef}>
        <image href="./avatar.webp" x={0} y={0} width={1024} height={1024} clipPath={`url(#${uid}-head)`} />

        {/* ---------- eyes: sclera → pupils (clipped, follow pointer) → upper lid ---------- */}
        <g className="blink">
          {eyes.map((e) => (
            <g key={e.side}>
              <polygon points={EYE_SHAPES[e.side].sclera} fill={`url(#${uid}-scl${e.side})`} />
              <g clipPath={`url(#${uid}-eye${e.side})`}>
                <g ref={e.ref}>
                  <circle cx={e.c.x} cy={e.c.y} r={19.5} fill={`url(#${uid}-iris)`} />
                  <circle cx={e.c.x} cy={e.c.y} r={19} fill="none" stroke="#1b2f4a" strokeWidth={3} />
                  <circle cx={e.c.x} cy={e.c.y} r={9} fill="#111113" />
                  <circle cx={e.c.x + e.hl} cy={e.c.y - 8} r={4.4} fill="#cfd6e0" opacity={0.95} />
                </g>
              </g>
              <polygon points={EYE_SHAPES[e.side].lid} fill="#110f14" />
            </g>
          ))}
        </g>

        {/* ---------- graduation cap (education) ---------- */}
        <g>
          <g className={scene === "book" ? "cap on" : "cap"} aria-hidden="true">
            <path d="M372 150 v62 q140 64 280 0 v-62 z" fill="#1c2433" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
            <path d="M262 132 L512 40 L762 132 L512 226 Z" fill="#2b3547" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
            <path d="M512 133 L738 136 V206" stroke={GOLD} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx={738} cy={214} r={11} fill={GOLD} stroke={OUT} strokeWidth={5} />
            <circle cx={512} cy={133} r={9} fill={GOLD} stroke={OUT} strokeWidth={4} />
          </g>
        </g>
      </g>

      {/* the portrait only has a short underarm tick on each side: continue it down as a full arm/torso separation */}
      <path d="M248 902 L264 1024" stroke={OUT} strokeWidth={8} strokeLinecap="round" fill="none" aria-hidden="true" />
      <path
        d={scene === "wave" ? "M772 915 L758 1024" : "M774 902 L760 1024"}
        stroke={OUT}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
        aria-hidden="true"
      />

      {/* ---------- scenes: arms + object + hands ---------- */}
      <g>
        <g className="breath">
          {/* wave (hero) */}
          <g className={on("wave")} aria-hidden="true">
            <g className="waver">
              <g transform={`translate(${WRIST.x} ${WRIST.y}) scale(${HAND_SCALE}) translate(${-WRIST.x} ${-WRIST.y})`}>
              {/* outline pass first, then the skin colour pass, so the fingers share one clean silhouette */}
              {[true, false].map((outline) => {
                const grow = outline ? 14 : 0;
                const col = outline ? OUT : SKIN;
                return (
                  <g key={String(outline)} stroke={col} strokeLinecap="round" fill={col}>
                    {WAVE_FINGERS.map((f, i) => (
                      <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} strokeWidth={FINGER_W + grow} />
                    ))}
                    <line x1={838} y1={672} x2={808} y2={640} strokeWidth={FINGER_W + 2 + grow} />
                    <rect x={830 - grow / 2} y={628 - grow / 2} width={76 + grow} height={80 + grow} rx={28 + grow / 2} strokeWidth={0} />
                  </g>
                );
              })}
              {/* creases between the fingers */}
              {WAVE_GAPS.map((g, i) => (
                <line key={i} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke={OUT} strokeWidth={4} strokeLinecap="round" />
              ))}
              </g>
            </g>
          </g>

          {/* mug (about) */}
          <g className={on("mug")} aria-hidden="true">
            <Holder hw={112}>
              <path d="M594 826 h24 a31 31 0 0 1 0 62 h-24" stroke={OUT} strokeWidth={24} fill="none" />
              <path d="M594 826 h24 a31 31 0 0 1 0 62 h-24" stroke="#f4f1ec" strokeWidth={10} fill="none" />
              <path d="M434 790 h156 v94 a46 46 0 0 1 -46 46 h-64 a46 46 0 0 1 -46 -46 z" fill="#f4f1ec" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
              <text
                x={512}
                y={870}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={64}
                fontWeight={800}
                fill="#6b4226"
                fontFamily="Inter, sans-serif"
              >
                §
              </text>
              <ellipse cx={512} cy={790} rx={78} ry={15} fill="#f4f1ec" stroke={OUT} strokeWidth={6} />
              <ellipse cx={512} cy={791} rx={66} ry={10} fill="#6b4226" />
              <path className="steam" d="M482 770 q-9 -12 0 -24 q9 -12 0 -24" stroke="#fff" strokeOpacity={0.85} strokeWidth={7} strokeLinecap="round" fill="none" />
              <path className="steam s2" d="M512 770 q-9 -12 0 -24 q9 -12 0 -24" stroke="#fff" strokeOpacity={0.85} strokeWidth={7} strokeLinecap="round" fill="none" />
              <path className="steam s3" d="M542 770 q-9 -12 0 -24 q9 -12 0 -24" stroke="#fff" strokeOpacity={0.85} strokeWidth={7} strokeLinecap="round" fill="none" />
            </Holder>
          </g>

          {/* laptop (experience) */}
          <g className={on("laptop")} aria-hidden="true">
            <Holder hw={118} hy={915}>
              <rect x={404} y={742} width={216} height={150} rx={14} fill="#cfd4dc" stroke={OUT} strokeWidth={7} />
              <rect x={418} y={756} width={188} height={120} rx={7} fill="#0f172a" />
              <rect className="screen-glow" x={418} y={756} width={188} height={120} rx={7} fill="#4ade80" />
              <text x={512} y={834} textAnchor="middle" fontSize={54} fontWeight={700} fill="#4ade80" fontFamily="'JetBrains Mono', ui-monospace, monospace">
                {"</>"}
              </text>
              <rect className="caret-blink" x={570} y={800} width={9} height={34} rx={2} fill="#4ade80" />
              <path d="M382 894 h260 l-12 30 h-236 z" fill="#aeb4be" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
              {BITS.map((b, i) => (
                <text
                  key={i}
                  className="bit"
                  x={b.x}
                  y={772}
                  textAnchor="middle"
                  fontSize={30}
                  fontWeight={700}
                  fill={i % 2 ? "#86efac" : "#4ade80"}
                  fontFamily="'JetBrains Mono', ui-monospace, monospace"
                  style={{ animationDelay: `${b.d}s`, "--dx": `${b.dx}px` } as CSSProperties}
                >
                  {b.c}
                </text>
              ))}
            </Holder>
          </g>

          {/* phone (projects) */}
          <g className={on("phone")} aria-hidden="true">
            <Holder hw={86}>
              <rect x={452} y={742} width={120} height={196} rx={24} fill="#111827" stroke={OUT} strokeWidth={7} />
              <rect x={462} y={764} width={100} height={152} rx={11} fill="#1f2937" />
              <rect x={490} y={749} width={44} height={8} rx={4} fill="#374151" />
              <rect className="tile" style={{ animationDelay: "0s" }} x={470} y={774} width={84} height={32} rx={8} fill="#6ee7b7" />
              <rect className="tile" style={{ animationDelay: "0.6s" }} x={470} y={818} width={38} height={38} rx={8} fill="#60a5fa" />
              <rect className="tile" style={{ animationDelay: "1.2s" }} x={516} y={818} width={38} height={38} rx={8} fill="#f472b6" />
              <rect className="tile" style={{ animationDelay: "1.8s" }} x={470} y={868} width={84} height={28} rx={8} fill="#a78bfa" />
              <circle className="notify" cx={568} cy={750} r={11} fill="#ef4444" stroke={OUT} strokeWidth={4} />
              <Heart x={488} y={738} delay={0} />
              <Heart x={536} y={738} delay={0.9} color="#f472b6" s={0.85} />
              <Heart x={512} y={738} delay={1.8} color="#fda4af" s={0.7} />
            </Holder>
          </g>

          {/* chip (skills) */}
          <g className={on("chip")} aria-hidden="true">
            <Holder hw={104}>
              <circle cx={512} cy={832} r={100} fill="#2dd4bf" opacity={0.16} />
              <g stroke="#2dd4bf" strokeWidth={9} strokeLinecap="round">
                {[460, 486, 512, 538, 564].map((x, i) => (
                  <path key={x} className="pin" style={{ animationDelay: `${(i * 0.37) % 1.8}s` }} d={`M${x} 742 v22 M${x} 900 v22`} />
                ))}
                {[792, 814, 836, 858, 880].map((y, i) => (
                  <path key={y} className="pin" style={{ animationDelay: `${(i * 0.53 + 0.2) % 1.8}s` }} d={`M420 ${y} h22 M582 ${y} h22`} />
                ))}
              </g>
              <rect x={440} y={762} width={144} height={142} rx={16} fill="#0f1a1c" stroke={OUT} strokeWidth={7} />
              <rect x={466} y={788} width={92} height={90} rx={10} fill="#2dd4bf" fillOpacity={0.25} stroke="#2dd4bf" strokeWidth={5} />
              <circle className="ripple" cx={512} cy={833} r={14} fill="none" stroke="#2dd4bf" strokeWidth={4} />
              <circle className="ripple r2" cx={512} cy={833} r={14} fill="none" stroke="#2dd4bf" strokeWidth={4} />
              <circle className="core" cx={512} cy={833} r={14} fill="#2dd4bf" />
              <Spark x={424} y={730} s={1} color="#99f6e4" />
              <Spark x={602} y={738} s={0.8} delay={0.8} color="#99f6e4" />
            </Holder>
          </g>

          {/* book (education) */}
          <g className={on("book")} aria-hidden="true">
            <Holder hw={114}>
              <rect x={404} y={752} width={216} height={170} rx={10} fill="#2563eb" stroke={OUT} strokeWidth={7} />
              <rect x={408} y={756} width={22} height={162} rx={6} fill="#1d4ed8" />
              <rect x={452} y={792} width={140} height={15} rx={7} fill={GOLD} />
              <rect x={468} y={824} width={108} height={10} rx={5} fill="#bfdbfe" />
              <rect x={484} y={846} width={76} height={10} rx={5} fill="#bfdbfe" />
              <rect x={414} y={904} width={196} height={16} rx={4} fill="#f4f1ec" stroke={OUT} strokeWidth={4} />
              <path className="ribbon" d="M556 918 h28 v42 l-14 -13 l-14 13 z" fill="#ef4444" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
              <g clipPath={`url(#${uid}-book)`}>
                <polygon className="shine" points="444,752 486,752 442,922 400,922" fill="#fff" fillOpacity={0.32} />
              </g>
              <Spark x={398} y={740} s={1} />
              <Spark x={628} y={748} s={0.8} delay={0.7} />
              <Spark x={512} y={728} s={0.9} delay={1.3} />
            </Holder>
          </g>

          {/* trophy (awards) */}
          <g className={on("trophy")} aria-hidden="true">
            <Holder hw={80} hy={915}>
              <path d="M446 764 h-38 a46 46 0 0 0 44 76" stroke={OUT} strokeWidth={22} strokeLinecap="round" fill="none" />
              <path d="M578 764 h38 a46 46 0 0 1 -44 76" stroke={OUT} strokeWidth={22} strokeLinecap="round" fill="none" />
              <path d="M446 764 h-38 a46 46 0 0 0 44 76" stroke={GOLD} strokeWidth={9} strokeLinecap="round" fill="none" />
              <path d="M578 764 h38 a46 46 0 0 1 -44 76" stroke={GOLD} strokeWidth={9} strokeLinecap="round" fill="none" />
              <rect x={496} y={876} width={32} height={34} fill="#f59e0b" stroke={OUT} strokeWidth={6} />
              <rect x={452} y={906} width={120} height={38} rx={9} fill="#b45309" stroke={OUT} strokeWidth={7} />
              <rect x={484} y={917} width={56} height={14} rx={5} fill={GOLD} />
              <path d="M440 742 h144 v72 a72 72 0 0 1 -144 0 z" fill={GOLD} stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
              <path d="M462 766 v42 q4 30 24 46" stroke="#fff7d6" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.65} />
              <path d={starPath(512, 796, 27, 11.5)} fill="#fff7d6" stroke="#b45309" strokeWidth={3} strokeLinejoin="round" />
              <Spark x={404} y={724} s={1.1} />
              <Spark x={626} y={738} s={0.8} delay={0.7} />
            </Holder>
          </g>

          {/* mail (contact) */}
          <g className={on("mail")} aria-hidden="true">
            <Holder hw={120}>
              <g className="ring-bell">
                <rect x={396} y={782} width={232} height={142} rx={12} fill="#f8fafc" stroke={OUT} strokeWidth={7} />
                <path d="M402 792 L512 868 L622 792" stroke="#94a3b8" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" fill="none" />
              </g>
              <circle className="badge-ring" cx={612} cy={782} r={29} fill="none" stroke="#ef4444" strokeWidth={5} />
              <g className="badge-pop">
                <circle cx={612} cy={782} r={29} fill="#ef4444" stroke={OUT} strokeWidth={5} />
                <text x={612} y={793} textAnchor="middle" fontSize={32} fontWeight={700} fill="#fff" fontFamily="Inter, system-ui, sans-serif">
                  1
                </text>
              </g>
              <Heart x={452} y={772} delay={0.3} />
              <Heart x={512} y={772} delay={1.2} color="#f472b6" s={0.85} />
              <Heart x={560} y={772} delay={2.1} color="#fda4af" s={0.7} />
            </Holder>
          </g>
        </g>
      </g>
    </svg>
  );
}
