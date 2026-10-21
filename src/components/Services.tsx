"use client";

import { useEffect, useRef } from "react";
import { services } from "@/content/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { ArchPlate } from "@/components/ArchPlate";
import { SectionLabel } from "@/components/SectionLabel";

export function Services() {
  const listRef = useRef<HTMLOListElement>(null);

  // The hover drawing trails the pointer within each row (desktop only).
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) return;
    const plates = [...list.querySelectorAll<HTMLElement>("[data-plate]")];
    const movers = plates.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" }),
      r: gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" }),
    }));
    let lastX = 0;
    const onMove = (e: PointerEvent) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>(".service-row");
      if (!row) return;
      const i = Number(row.dataset.index);
      const box = row.getBoundingClientRect();
      movers[i].x(e.clientX - box.left - 100);
      movers[i].y(e.clientY - box.top - 130);
      movers[i].r(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4));
      lastX = e.clientX;
    };
    list.addEventListener("pointermove", onMove);
    return () => list.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section
      id="services"
      data-theme="dark"
      aria-labelledby="services-title"
      className="on-dark relative bg-charcoal pb-[clamp(96px,14vw,200px)] pt-[clamp(80px,10vw,150px)] text-paper"
    >
      <div className="shell">
        <SectionLabel index="04" label="Services" tone="dark" />
        <div className="grid-12 mb-[clamp(48px,7vw,100px)] mt-10 items-end gap-y-6">
          <h2 id="services-title" data-reveal="lines" className="display col-span-12 text-[clamp(2.8rem,7vw,7.5rem)] md:col-span-8">
            Three disciplines, <em className="italic">one</em> way of seeing.
          </h2>
        </div>

        <ol ref={listRef} className="border-t border-paper/15">
          {services.map((s, i) => (
            <li key={s.title} data-index={i} className="service-row group relative border-b border-paper/15">
              <div className="grid-12 items-start gap-y-5 py-10 md:py-14">
                <div className="col-span-12 flex items-center gap-3 md:col-span-1">
                  <span className="font-mono text-[11px] text-mist">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden className="service-square brand-square !h-[7px] !w-[7px]" />
                </div>
                <h3 className="service-title display col-span-12 text-[clamp(2.4rem,5.4vw,5.6rem)] leading-[0.95] md:col-span-6">
                  {s.title}
                </h3>
                <div className="col-span-12 md:col-span-5">
                  <p className="pretty max-w-[44ch] text-[1.0625rem] leading-relaxed text-paper/75">{s.text}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                    {s.focus.map((f) => (
                      <li key={f} className="eyebrow text-mist">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* hover drawing — follows the pointer, desktop only */}
              <div
                aria-hidden
                data-plate
                className="service-plate pointer-events-none absolute left-0 top-0 z-10 hidden h-[260px] w-[200px] [@media(hover:hover)_and_(min-width:1024px)]:block"
              >
                <ArchPlate kind={s.plate} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
