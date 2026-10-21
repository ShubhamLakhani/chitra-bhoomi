import { ArrowRight } from "lucide-react";
import { hero, site } from "@/content/site";
import { resolveImage } from "@/lib/media";
import { Figure } from "@/components/Figure";
import { HeroHeadline } from "@/components/HeroHeadline";

export function Hero() {
  const image = resolveImage(hero.image);
  // A bright image keeps the headline in ink; a dark one switches it to paper where it overlaps.
  const lightImage = image.available && image.tone === "light";
  const chip = lightImage ? "bg-paper/85 px-2 py-1 text-ink/80" : "";

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex flex-col overflow-hidden pt-[var(--header-h)] lg:block lg:h-[100svh] lg:min-h-[720px]"
    >
      {/* Hero image — right-hand plate on desktop, full-bleed below copy on mobile */}
      <div
        id="hero-image"
        data-reveal="hero"
        data-hero="image"
        className="relative order-last mx-[var(--gutter)] mt-10 aspect-[4/5] sm:aspect-[4/3] lg:absolute lg:bottom-[clamp(24px,4vh,44px)] lg:right-[var(--gutter)] lg:top-[calc(var(--header-h)+8px)] lg:m-0 lg:aspect-auto lg:w-[53%]"
      >
        <Figure
          image={image}
          priority
          sizes="(min-width: 1024px) 53vw, 100vw"
          className="relative h-full w-full"
          tag={false}
        />
        {/* legibility scrim where the headline crosses a dark image */}
        {!lightImage && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(18,17,16,0.38),rgba(18,17,16,0)_45%)] lg:block"
          />
        )}
        {/* top dimension line */}
        <div aria-hidden className={`absolute inset-x-5 top-5 flex items-center gap-3 ${lightImage ? "text-ink/55" : "text-paper/70"}`}>
          <span className="h-3 w-px bg-current" />
          <span data-reveal="hero" data-hero="rule" className="h-px flex-1 bg-current opacity-60" />
          <span data-reveal="hero" data-hero="detail" className={`font-mono text-[10px] uppercase tracking-[0.18em] ${chip}`}>
            {hero.caption.note}
          </span>
          <span data-reveal="hero" data-hero="rule" className="h-px w-10 bg-current opacity-60" />
          <span className="h-3 w-px bg-current" />
        </div>
        <div
          data-reveal="hero"
          data-hero="detail"
          className={`absolute bottom-5 right-5 text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] ${
            lightImage ? chip : "text-paper/85"
          }`}
        >
          {hero.caption.label}
          {image.available && image.kind === "visualisation" && (
            <>
              <br />
              <span className="opacity-75">Architectural visualisation</span>
            </>
          )}
          {!image.available && (
            <>
              <br />
              <span className="text-paper/65">Concept study · photograph to follow</span>
            </>
          )}
        </div>
      </div>

      <div className="shell relative flex flex-col lg:h-full lg:justify-between lg:pb-[clamp(24px,4vh,44px)] lg:pt-[clamp(28px,6vh,64px)]">
        {/* meta row */}
        <div className="mt-8 flex flex-col gap-2 lg:mt-0 lg:w-[42%]">
          <p data-reveal="hero" data-hero="detail" className="eyebrow flex items-center gap-3 text-graphite">
            <span className="brand-square !h-[7px] !w-[7px]" aria-hidden />
            {site.serviceLine}
          </p>
          <p data-reveal="hero" data-hero="detail" className="eyebrow text-graphite">
            Studio — {site.city}
          </p>
        </div>

        <div className="relative z-10 mt-10 lg:mt-0">
          <HeroHeadline lines={hero.headline} imageId="hero-image" colourShift={!lightImage} />
        </div>

        <div className="mt-8 lg:mt-0 lg:w-[40%]">
          <div>
            <span data-reveal="hero" data-hero="rule" aria-hidden className="mb-5 block h-px w-16 bg-ink/40" />
            <p data-reveal="hero" data-hero="detail" className="pretty max-w-[36ch] text-[1.0625rem] leading-relaxed text-graphite">
              {hero.supporting}
            </p>
            <div data-reveal="hero" data-hero="detail" className="mt-7 flex flex-wrap gap-3">
              <a href={hero.primaryCta.href} className="btn btn-solid">
                {hero.primaryCta.label}
                <ArrowRight aria-hidden className="btn-arrow h-4 w-4" strokeWidth={1.4} />
              </a>
              <a href={hero.secondaryCta.href} className="btn btn-ghost">
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#work"
        data-reveal="hero"
        data-hero="detail"
        className="group absolute bottom-[clamp(24px,4vh,44px)] left-[calc(47%-var(--gutter)-28px)] hidden -translate-x-full items-center gap-3 xl:flex"
        aria-label="Scroll to selected work"
      >
        <span className="eyebrow text-graphite">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_var(--ease-arch)_infinite] bg-ink" />
        </span>
      </a>
    </section>
  );
}
