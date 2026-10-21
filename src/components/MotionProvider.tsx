"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";

type MotionApi = {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement) => void;
};

const MotionContext = createContext<MotionApi>({ lenis: null, scrollTo: () => {} });
export const useMotion = () => useContext(MotionContext);

/**
 * Owns smooth scrolling (Lenis, driven by the GSAP ticker so ScrollTrigger
 * stays in sync) and the shared, attribute-driven reveal animations:
 *
 *   data-reveal="hero"   — part of the opening sequence (see Hero)
 *   data-reveal="fade"   — rise + fade on enter
 *   data-reveal="lines"  — masked line-by-line headline reveal
 *   data-reveal="words"  — word opacity scrubbed by scroll
 *   data-reveal="image"  — curtain reveal with a settling zoom
 *   data-reveal="rule"   — hairline drawn from left to right
 *   data-reveal="riser"  — vertical line drawn from the bottom up
 *   data-parallax="8"    — gentle vertical drift, value in yPercent
 *
 * With reduced motion none of this runs and content is simply visible.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (prefersReducedMotion()) {
      html.classList.remove("motion");
      html.classList.add("motion-ready");
      return;
    }

    const l = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    });
    const onTick = (time: number) => l.raf(time * 1000);
    l.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);

    const splits: SplitText[] = [];
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    // Build reveals once web fonts are ready: SplitText measures lines, and a
    // font swap mid-setup would re-split and remove triggers during refresh.
    const setup = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        heroIntro();

        gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.2,
              delay: Number(el.dataset.delay ?? 0),
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
          gsap.set(el, { autoAlpha: 1 });
          splits.push(
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 112,
                  duration: 1.3,
                  stagger: 0.09,
                  delay: Number(el.dataset.delay ?? 0),
                  ease: "expo.out",
                  scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
                }),
            }),
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="words"]').forEach((el) => {
          gsap.set(el, { autoAlpha: 1 });
          const split = SplitText.create(el, { type: "words" });
          splits.push(split);
          gsap.fromTo(
            split.words,
            { opacity: 0.13 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 50%", scrub: 0.6 },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="image"]').forEach((el) => {
          const inner = el.querySelector<HTMLElement>("[data-figure-inner]");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
            delay: Number(el.dataset.delay ?? 0),
          });
          tl.fromTo(
            el,
            { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
          );
          if (inner) {
            tl.fromTo(
              inner,
              { scale: 1.16 },
              { scale: 1, duration: 2, ease: "expo.out", clearProps: "transform" },
              0.25,
            );
          }
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="rule"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 1, scaleX: 0, transformOrigin: "0% 50%" },
            {
              scaleX: 1,
              duration: 1.6,
              ease: "expo.inOut",
              delay: Number(el.dataset.delay ?? 0),
              scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="riser"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 1, scaleY: 0, transformOrigin: "50% 100%" },
            {
              scaleY: 1,
              duration: 0.9,
              ease: "expo.inOut",
              delay: Number(el.dataset.delay ?? 0),
              scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax || 8);
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
      html.classList.add("motion-ready");
      ScrollTrigger.refresh();
    };
    if (document.fonts) document.fonts.ready.then(setup);
    else setup();

    return () => {
      cancelled = true;
      splits.forEach((s) => s.revert());
      ctx?.revert();
      gsap.ticker.remove(onTick);
      l.destroy();
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | HTMLElement) => {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (!el) return;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(el, { duration: 1.6, force: true });
      } else {
        el.scrollIntoView({ behavior: "auto" });
      }
      // Move keyboard focus with the scroll for assistive tech users.
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    },
    [lenis],
  );

  // Route in-page anchor clicks through the smooth scroller.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href")!;
      if (hash.length < 2) return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, "", hash);
      scrollTo(el);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  return <MotionContext.Provider value={{ lenis, scrollTo }}>{children}</MotionContext.Provider>;
}

/** The opening sequence: image curtain, headline lines, then details. */
function heroIntro() {
  const image = document.querySelector<HTMLElement>('[data-hero="image"]');
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero="line"]');
  const details = gsap.utils.toArray<HTMLElement>('[data-hero="detail"]');
  const rules = gsap.utils.toArray<HTMLElement>('[data-hero="rule"]');
  if (!image && !lines.length) return;

  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
  if (image) {
    const inner = image.querySelector<HTMLElement>("[data-figure-inner]");
    tl.fromTo(
      image,
      { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut" },
      0,
    );
    if (inner) tl.fromTo(inner, { scale: 1.22 }, { scale: 1, duration: 2.6 }, 0.2);
  }
  tl.fromTo(lines, { autoAlpha: 1, yPercent: 115 }, { yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.55);
  tl.fromTo(
    rules,
    { autoAlpha: 1, scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, duration: 1.6, ease: "expo.inOut", stagger: 0.1 },
    0.7,
  );
  tl.fromTo(details, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.07 }, 1.1);
}
