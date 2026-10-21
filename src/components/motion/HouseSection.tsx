"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motionChapters } from "@/content/site";
import { ArchPlate } from "@/components/ArchPlate";
import { SectionLabel } from "@/components/SectionLabel";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

// three.js is loaded only when the visitor approaches this section.
const HouseCanvas = dynamic(() => import("./HouseCanvas"), { ssr: false });

type Mode = "3d" | "static";

// Scroll progress at which each chapter becomes the active caption
const CHAPTER_STARTS = [0, 0.14, 0.38, 0.57, 0.75];
const DUSK_AT = 0.88;

function canRender3D() {
  if (prefersReducedMotion()) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HouseSection() {
  const [mode, setMode] = useState<Mode>("3d");
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [dark, setDark] = useState(false);
  const [quality, setQuality] = useState<"high" | "low">("high");

  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    if (!canRender3D()) {
      setMode("static");
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }
    const coarse = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    setQuality(coarse || cores <= 4 ? "low" : "high");
  }, []);

  // Lazy-mount the canvas ahead of time; pause rendering when offscreen.
  useEffect(() => {
    if (mode !== "3d") return;
    const track = trackRef.current;
    if (!track) return;
    const nearObs = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: "150% 0px 150% 0px",
    });
    const viewObs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "10% 0px" });
    nearObs.observe(track);
    viewObs.observe(track);
    return () => {
      nearObs.disconnect();
      viewObs.disconnect();
    };
  }, [mode]);

  // Scroll progress through the pinned track drives the scene.
  useEffect(() => {
    if (mode !== "3d" || !trackRef.current) return;
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        progress.current = p;
        if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
        let c = 0;
        CHAPTER_STARTS.forEach((s, i) => p >= s && (c = i));
        setChapter(c);
        setDark(p >= DUSK_AT);
      },
    });
    return () => st.kill();
  }, [mode]);

  // Let the header re-check its colour when the stage turns to dusk.
  useEffect(() => {
    window.dispatchEvent(new Event("cb:theme"));
  }, [dark]);

  const intro = (
    <div className="shell pb-[clamp(56px,8vw,110px)] pt-[clamp(96px,12vw,180px)]">
      <SectionLabel index="03" label="Architecture in Motion" />
      <div className="grid-12 mt-10 items-end gap-y-8">
        <h2 id="motion-title" data-reveal="lines" className="display col-span-12 text-[clamp(2.8rem,7vw,7.5rem)] md:col-span-8">
          One house, read in <em className="italic">five</em> movements.
        </h2>
        <p data-reveal="fade" className="pretty col-span-12 max-w-[36ch] text-[1.0625rem] leading-relaxed text-graphite md:col-span-4">
          An original study model in the language of the studio’s residential work — not a reproduction of a specific
          project.{mode === "3d" ? " Scroll to move through it." : ""}
        </p>
      </div>
    </div>
  );

  if (mode === "static") {
    return (
      <section id="motion" aria-labelledby="motion-title" className="relative bg-ivory">
        {intro}
        <div className="shell grid-12 gap-y-12 pb-[clamp(96px,12vw,180px)]">
          <div className="col-span-12 grid grid-cols-2 gap-3 md:col-span-6">
            <div className="relative aspect-[3/4]">
              <ArchPlate kind="facade" />
            </div>
            <div className="relative aspect-[3/4]">
              <ArchPlate kind="section" />
            </div>
          </div>
          <ol className="col-span-12 border-t border-ink/15 md:col-span-5 md:col-start-8">
            {motionChapters.map((c, i) => (
              <li key={c.title} className="grid grid-cols-[3rem_1fr] border-b border-ink/15 py-5">
                <span className="font-mono text-[11px] text-graphite">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="display text-2xl">{c.title}</h3>
                  <p className="pretty mt-2 text-[0.975rem] leading-relaxed text-graphite">{c.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="motion" aria-labelledby="motion-title" className="relative bg-ivory">
      {intro}
      <div ref={trackRef} className="relative h-[560vh]">
        <div
          data-theme={dark ? "dark" : undefined}
          className={`sticky top-0 h-[100svh] overflow-hidden transition-colors duration-700 ${
            dark ? "bg-charcoal text-paper" : "bg-ivory text-ink"
          }`}
        >
          {/* poster while three.js loads, and behind the canvas as it fades in */}
          <div
            aria-hidden
            className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}
          >
            <div className="absolute inset-0 opacity-60">
              <ArchPlate kind="facade" />
            </div>
            <span className="eyebrow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ivory px-3 py-2 text-graphite">
              Loading model
            </span>
          </div>

          {near && (
            <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
              <HouseCanvas progress={progress} quality={quality} active={inView} onReady={() => setReady(true)} />
            </div>
          )}

          {/* legibility scrim behind the captions */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-[46%] transition-opacity duration-700 ${
              dark
                ? "bg-[linear-gradient(to_top,rgba(28,26,24,0.92),rgba(28,26,24,0))]"
                : "bg-[linear-gradient(to_top,rgba(244,240,232,0.94),rgba(244,240,232,0))]"
            }`}
          />

          {/* HUD */}
          <div className="pointer-events-none absolute inset-0">
            <div className="shell flex h-full flex-col justify-between pb-[clamp(20px,4vh,40px)] pt-[calc(var(--header-h)+12px)]">
              <div className="flex items-start justify-between">
                <p className="eyebrow opacity-80">Architecture in Motion</p>
                <p className="eyebrow opacity-80" aria-hidden>
                  {String(chapter + 1).padStart(2, "0")} / {String(motionChapters.length).padStart(2, "0")}
                </p>
              </div>

              <div className="flex items-end justify-between gap-8">
                <div className="relative min-h-[150px] w-full max-w-[400px] sm:min-h-[170px]" aria-live="polite">
                  {motionChapters.map((c, i) => (
                    <div
                      key={c.title}
                      className={`absolute bottom-0 left-0 transition-all duration-700 ease-[var(--ease-arch)] ${
                        i === chapter ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                      }`}
                      aria-hidden={i !== chapter}
                    >
                      <p className="eyebrow mb-3 flex items-center gap-2 opacity-80">
                        <span className="brand-square !h-[6px] !w-[6px]" /> {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="display text-[clamp(2.2rem,4vw,3.6rem)]">{c.title}</h3>
                      <p
                        className={`pretty mt-3 text-[0.975rem] leading-relaxed ${
                          dark ? "text-paper/75" : "text-graphite"
                        }`}
                      >
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* progress rail */}
                <div className="hidden h-[34vh] items-stretch gap-3 sm:flex" aria-hidden>
                  <div className="flex flex-col justify-between text-right">
                    {motionChapters.map((c, i) => (
                      <span
                        key={c.title}
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity duration-500 ${
                          i === chapter ? "opacity-100" : "opacity-60"
                        }`}
                      >
                        {c.title}
                      </span>
                    ))}
                  </div>
                  <span className="relative w-px bg-current/20">
                    <span ref={barRef} className="absolute inset-0 origin-top scale-y-0 bg-ember" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
