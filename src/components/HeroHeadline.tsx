"use client";

import { useEffect, useRef } from "react";

/**
 * The hero headline is rendered twice: an ink copy over the paper, and an
 * ivory copy clipped to the hero image so the type changes colour exactly
 * where it crosses the image. Bright images skip the ivory copy.
 */
export function HeroHeadline({
  lines,
  imageId,
  colourShift = true,
}: {
  lines: string[];
  imageId: string;
  /** Switch the type to paper where it crosses the image (off for bright images) */
  colourShift?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const overlay = overlayRef.current;
    const image = document.getElementById(imageId);
    if (!wrap || !overlay || !image) return;

    const update = () => {
      const h = wrap.getBoundingClientRect();
      const i = image.getBoundingClientRect();
      const top = Math.max(0, i.top - h.top);
      const left = Math.max(0, i.left - h.left);
      const right = Math.max(0, h.right - i.right);
      const bottom = Math.max(0, h.bottom - i.bottom);
      overlay.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(image);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [imageId, colourShift]);

  const render = (decorative: boolean) =>
    lines.map((line, i) => (
      <span key={i} className="line-mask">
        <span data-reveal="hero" data-hero="line" aria-hidden={decorative || undefined}>
          {i === 1 ? (
            <>
              <em className="font-display italic">{line.split(" ")[0]}</em>{" "}
              {line.split(" ").slice(1).join(" ")}
            </>
          ) : (
            line
          )}
        </span>
      </span>
    ));

  return (
    <div ref={wrapRef} className="relative">
      <h1 className="display text-[clamp(3.3rem,12.5vw,5.6rem)] text-ink sm:text-[clamp(4.4rem,10vw,7rem)] lg:text-[clamp(5rem,8.2vw,10.5rem)]">
        {render(false)}
      </h1>
      {colourShift && (
        <div
          ref={overlayRef}
          aria-hidden
          className="display pointer-events-none absolute inset-0 hidden text-[clamp(5rem,8.2vw,10.5rem)] text-paper lg:block"
          style={{ clipPath: "inset(0 0 0 100%)" }}
        >
          {render(true)}
        </div>
      )}
    </div>
  );
}
