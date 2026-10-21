"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/content/site";
import type { ResolvedImage } from "@/lib/media";
import { Figure } from "@/components/Figure";
import { useMotion } from "@/components/MotionProvider";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type ResolvedProject = Omit<Project, "cover" | "gallery"> & {
  cover: ResolvedImage;
  gallery: ResolvedImage[];
};

// Editorial placement per layout slot (12-column grid on desktop)
const SLOT: Record<Project["layout"], { item: string; aspect: string; sizes: string }> = {
  feature: {
    item: "md:col-span-8 md:col-start-1",
    aspect: "aspect-[4/3]",
    sizes: "(min-width: 768px) 66vw, 100vw",
  },
  tall: {
    item: "md:col-span-4 md:col-start-9 md:mt-[22vw]",
    aspect: "aspect-[3/4]",
    sizes: "(min-width: 768px) 33vw, 100vw",
  },
  portrait: {
    item: "md:col-span-5 md:col-start-2 md:-mt-[6vw]",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 42vw, 100vw",
  },
  wide: {
    item: "md:col-span-6 md:col-start-7 md:mt-[14vw]",
    aspect: "aspect-[16/11]",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
};

export function WorkGallery({ projects }: { projects: ResolvedProject[] }) {
  const [active, setActive] = useState<ResolvedProject | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { lenis } = useMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active) {
      if (!dialog.open) dialog.showModal();
      lenis?.stop();
      dialog.scrollTop = 0;
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          dialog.querySelectorAll("[data-dialog-anim]"),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.06 },
        );
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [active, lenis]);

  const close = () => setActive(null);

  return (
    <>
      <ul className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-[clamp(12px,1.6vw,28px)] md:gap-y-0">
        {projects.map((p, i) => {
          const slot = SLOT[p.layout];
          return (
            <li key={p.slug} className={slot.item}>
              <article className="work-card group relative">
                <div data-reveal="image" className={`relative ${slot.aspect}`}>
                  <Figure image={p.cover} sizes={slot.sizes} className="absolute inset-0" />
                </div>
                <div className="mt-5 grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 sm:grid-cols-[auto_1fr_auto]">
                  <span className="font-mono text-[11px] text-graphite">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.02]">
                      <button
                        type="button"
                        className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                        onClick={(e) => {
                          triggerRef.current = e.currentTarget;
                          setActive(p);
                        }}
                        aria-haspopup="dialog"
                      >
                        {p.title}
                      </button>
                    </h3>
                    <span aria-hidden className="work-rule mt-3 block h-px w-full max-w-[220px] bg-ember" />
                  </div>
                  <span className="eyebrow col-start-2 flex items-center gap-1.5 text-graphite sm:col-start-auto">
                    {p.category}
                    <ArrowUpRight
                      aria-hidden
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.4}
                    />
                  </span>
                </div>
                {/* visible focus ring for the stretched button */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-2 hidden outline outline-[1.5px] outline-ember group-has-[button:focus-visible]:block"
                />
              </article>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        data-lenis-prevent
        onClose={() => {
          setActive(null);
          lenis?.start();
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        {active && (
          <div className="min-h-full">
            <div className="shell sticky top-0 z-10 flex h-[var(--header-h)] items-center justify-between border-b border-ink/10 bg-ivory">
              <span className="eyebrow text-graphite">
                {active.category} — {String(projects.indexOf(active) + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={close}
                className="-mr-2 flex h-11 items-center gap-2 px-2 text-[12px] uppercase tracking-[0.14em]"
                autoFocus
              >
                Close <X aria-hidden className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </div>

            <div className="shell grid gap-10 py-10 lg:grid-cols-12 lg:gap-x-8 lg:py-16">
              <div className="lg:col-span-4 lg:col-start-1">
                <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
                  <h2 id="project-dialog-title" data-dialog-anim className="display text-[clamp(2.4rem,3.4vw,4.2rem)] balance">
                    {active.title}
                  </h2>
                  <p data-dialog-anim className="pretty mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-graphite">
                    {active.summary}
                  </p>
                  <dl data-dialog-anim className="mt-10 border-t border-ink/15">
                    {(
                      [
                        ["Category", active.category],
                        ["Location", active.location],
                        ["Year", active.year],
                        ["Scope", active.scope],
                        ["Status", active.status],
                      ] as const
                    )
                      .filter(([, v]) => Boolean(v))
                      .map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[110px_1fr] border-b border-ink/15 py-3 text-sm">
                          <dt className="eyebrow pt-0.5 text-graphite">{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              </div>
              <div className="space-y-6 lg:col-span-8">
                {[active.cover, ...active.gallery].map((img) => (
                  <div key={img.src} data-dialog-anim className="relative aspect-[4/3]">
                    <Figure image={img} sizes="(min-width: 1024px) 66vw, 100vw" className="absolute inset-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
