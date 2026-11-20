import { useEffect, useState, type CSSProperties } from "react";
import { content, CV_FILES, LINKS } from "./content";
import { useLang, useReveal, useTheme } from "./hooks";
import Avatar, { type Scene } from "./components/Avatar";
import FloatingAvatar from "./components/FloatingAvatar";
import GlowCard from "./components/GlowCard";

const SECTION_IDS = ["about", "experience", "projects", "skills", "education", "awards", "contact"] as const;

// what the avatar holds in each section
const SCENE_BY_SECTION: Record<string, Scene> = {
  top: "wave",
  about: "mug",
  experience: "laptop",
  projects: "phone",
  skills: "chip",
  education: "book",
  awards: "trophy",
  contact: "mail",
};

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const t = content[lang];
  const cv = CV_FILES[lang];
  const marqueeItems = Array.from(new Set(t.skills.groups.flatMap((g) => g.items)));

  useReveal();

  // keep the browser tab title in the selected language
  useEffect(() => {
    document.title = `Alperen Yanık | ${t.hero.role}`;
  }, [t.hero.role]);

  // highlight active nav link
  useEffect(() => {
    const els = ["top", ...SECTION_IDS].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = () => setMenuOpen(false);

  return (
    <>
      <header className="nav">
        <div className="wrap nav__in">
          <a href="#top" className="logo" onClick={go}>
            Alperen Yanık<span className="cursor">_</span>
          </a>

          <nav className={`nav__links ${menuOpen ? "open" : ""}`} aria-label="Main">
            {SECTION_IDS.map((id) => (
              <a key={id} href={`#${id}`} onClick={go} className={active === id ? "active" : ""}>
                {t.nav[id]}
              </a>
            ))}
          </nav>

          <div className="nav__tools">
            <a className="chip nav__cv" href={cv.href} download={cv.filename} aria-label={t.hero.downloadCv} title={t.hero.downloadCv}>
              CV ↓
            </a>
            <button className="chip" onClick={toggleLang} aria-label={t.ui.language} title={t.ui.language}>
              <span className={lang === "en" ? "on" : ""}>EN</span>
              <span className="sep">/</span>
              <span className={lang === "tr" ? "on" : ""}>TR</span>
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label={t.ui.theme} title={t.ui.theme}>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="icon-btn burger" onClick={() => setMenuOpen((v) => !v)} aria-label={t.ui.menu} aria-expanded={menuOpen}>
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section id="top" className="hero">
          <div className="wrap hero__in">
            <div className="hero__text">
              <p className="eyebrow">{t.hero.eyebrow}</p>
              <h1>Alperen Yanık</h1>
              <p className="lead">{t.hero.tagline}</p>
              <div className="hero__actions">
                <pre className="code" aria-label="about.ts">
                  <span className="code__file">about.ts</span>
                  <code>
                    <span className="k">const</span> alperen = {"{"}
                    {"\n"}
                    {"  "}role: <span className="s">"{t.code.role}"</span>,{"\n"}
                    {"  "}stack: [<span className="s">"React Native"</span>, <span className="s">"Python"</span>, <span className="s">"TypeScript"</span>],{"\n"}
                    {"  "}gpa: <span className="n">3.10</span>, <span className="c">// {t.code.comment}</span>
                    {"\n"}
                    {"}"};
                  </code>
                </pre>

                <div className="cta">
                  <a className="btn btn--primary" href="#projects">
                    {t.hero.viewProjects}
                  </a>
                  <a className="btn" href={cv.href} download={cv.filename}>
                    {t.hero.downloadCv} ↓
                  </a>
                  <a className="btn btn--ghost" href="#contact">
                    {t.hero.contactMe}
                  </a>
                </div>

                <ul className="social">
                  <li>
                    <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
                      <GitHubIcon />
                    </a>
                  </li>
                  <li>
                    <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
                      <LinkedInIcon />
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${LINKS.email}`} aria-label="Email" title="Email">
                      <MailIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="hero__side">
              <div className="portrait">
                <div className="sky" aria-hidden="true">
                  <div className="sky__day" />
                  <div className="sky__glow" />
                  <div className="sky__night">
                    <div className="sky__stars" />
                    <div className="sky__stars sky__stars--b" />
                    <span className="shoot shoot--1" />
                    <span className="shoot shoot--2" />
                    <span className="shoot shoot--3" />
                  </div>
                  <div className="sky__sun" />
                </div>
                <Avatar size={420} scene="wave" />
              </div>
            </div>
          </div>

          {/* TECH MARQUEE (built from the skills list, so it follows the language toggle) */}
          <TechMarquee label={t.skills.title} items={marqueeItems} />

          <div className="wrap">
            <ul className="stats">
              {t.stats.map((s) => (
                <li key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section">
          <div className="wrap reveal">
            <SectionHead n="01" title={t.about.title} sub={t.about.subtitle} />
            <div className="about">
              <p className="about__text">{t.about.text}</p>
              <div className="about__side">
                <img className="about__photo" src="./alperen.webp" alt="Alperen Yanık" width={640} height={640} loading="lazy" decoding="async" />
                <dl className="facts">
                  <div>
                    <dt>{t.about.basedIn}</dt>
                    <dd>{t.about.basedInValue}</dd>
                  </div>
                  <div>
                    <dt>{t.about.focus}</dt>
                    <dd>{t.about.focusValue}</dd>
                  </div>
                  <div>
                    <dt>{t.about.languages}</dt>
                    <dd>{t.about.languagesValue}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="section">
          <div className="wrap reveal">
            <SectionHead n="02" title={t.experience.title} sub={t.experience.subtitle} />
            <ol className="timeline">
              {t.experience.items.map((x) => (
                <GlowCard as="li" key={x.company} className="card">
                  <div className="card__top">
                    <div>
                      <h3>{x.company}</h3>
                      <p className="muted">
                        {x.role} · {x.place}
                      </p>
                    </div>
                    <span className="period">{x.period}</span>
                  </div>
                  <ul className="bullets">
                    {x.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Tags items={x.tags} />
                </GlowCard>
              ))}
            </ol>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section">
          <div className="wrap reveal">
            <SectionHead n="03" title={t.projects.title} sub={t.projects.subtitle} />
            <div className="grid">
              {t.projects.items.map((p) => (
                <GlowCard as="article" key={p.name} className="card project">
                  {p.badge && <span className="badge">{p.badge}</span>}
                  <h3>{p.name}</h3>
                  <p className="muted">{p.desc}</p>
                  <Tags items={p.tags} />
                  {p.href && (
                    <a className="link" href={p.href} target="_blank" rel="noreferrer">
                      {t.projects.code} ↗
                    </a>
                  )}
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section">
          <div className="wrap reveal">
            <SectionHead n="04" title={t.skills.title} sub={t.skills.subtitle} />
            <div className="grid grid--4">
              {t.skills.groups.map((g) => (
                <GlowCard key={g.name} className="card">
                  <h3 className="h-sm">{g.name}</h3>
                  <Tags items={g.items} />
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="section">
          <div className="wrap reveal">
            <SectionHead n="05" title={t.education.title} sub={t.education.subtitle} />
            <GlowCard className="card">
              <div className="card__top">
                <div>
                  <h3>{t.education.school}</h3>
                  <p className="muted">{t.education.degree}</p>
                </div>
                <span className="period">{t.education.period}</span>
              </div>
              <p className="accent">{t.education.meta}</p>
            </GlowCard>
          </div>
        </section>

        {/* AWARDS */}
        <section id="awards" className="section">
          <div className="wrap reveal">
            <SectionHead n="06" title={t.awards.title} sub={t.awards.subtitle} />
            <div className="grid grid--3">
              {t.awards.items.map((a) => (
                <GlowCard key={a.name} className="card">
                  <h3 className="h-sm">{a.name}</h3>
                  <p className="muted">{a.desc}</p>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section">
          <div className="wrap reveal">
            <SectionHead n="07" title={t.contact.title} sub="" />
            <GlowCard className="contact card">
              <h2>{t.contact.heading}</h2>
              <p className="muted">{t.contact.text}</p>
              <a className="mail" href={`mailto:${LINKS.email}`} style={{ fontWeight: 900 }}>
                {LINKS.email}
              </a>
              <div className="cta">
                <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                <a className="btn" href={LINKS.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
                <a className="btn" href={cv.href} download={cv.filename}>
                  {t.hero.downloadCv} ↓
                </a>
              </div>
            </GlowCard>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__in">
          <span>
            © {new Date().getFullYear()} Alperen Yanık · {t.footer.built}
          </span>
          <a href="#top">{t.footer.top}</a>
        </div>
      </footer>

      <FloatingAvatar
        messages={t.avatar.sections}
        openLabel={t.avatar.open}
        section={active}
        scene={SCENE_BY_SECTION[active] ?? "wave"}
      />
    </>
  );
}

function SectionHead({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="shead">
      <span className="shead__n">{n}</span>
      <h2>{title}</h2>
      {sub && <p className="muted">{sub}</p>}
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

function TechMarquee({ label, items }: { label: string; items: string[] }) {
  const renderTrack = (hidden: boolean) => (
    <ul className="marquee__track" aria-hidden={hidden || undefined}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="region" aria-label={label} style={{ "--marquee-duration": `${items.length * 2}s` } as CSSProperties}>
      {renderTrack(false)}
      {renderTrack(true)}
    </div>
  );
}
