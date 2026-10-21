import { philosophy } from "@/content/site";
import { resolveImage } from "@/lib/media";
import { Figure } from "@/components/Figure";
import { SectionLabel } from "@/components/SectionLabel";

export function Philosophy() {
  const image = resolveImage(philosophy.image);

  return (
    <section
      id="studio"
      aria-labelledby="studio-title"
      className="relative bg-paper pb-[clamp(96px,14vw,200px)] pt-[clamp(96px,12vw,180px)]"
    >
      <div className="shell">
        <SectionLabel index="02" label={philosophy.eyebrow} />

        <h2 id="studio-title" className="sr-only">
          Studio philosophy
        </h2>
        <blockquote
          data-reveal="words"
          className="display balance mt-14 max-w-[18ch] text-[clamp(2.3rem,5.6vw,6.4rem)] leading-[1.02] md:mt-20"
        >
          {philosophy.statement}
        </blockquote>

        <div className="grid-12 mt-[clamp(64px,9vw,140px)] gap-y-14">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden">
              <div data-parallax="6" className="absolute -inset-y-[8%] inset-x-0">
                <Figure image={image} sizes="(min-width: 768px) 33vw, 100vw" className="relative h-full w-full" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <p data-reveal="lines" className="pretty max-w-[30ch] font-display text-[clamp(1.5rem,2.3vw,2.2rem)] leading-[1.25]">
              {philosophy.intro}
            </p>

            <ol className="mt-14 border-t border-ink/15">
              {philosophy.principles.map((item, i) => (
                <li
                  key={item.title}
                  data-reveal="fade"
                  data-delay={i * 0.05}
                  className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 border-b border-ink/15 py-6 sm:grid-cols-[3rem_11rem_1fr]"
                >
                  <span className="font-mono text-[11px] text-graphite">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display text-[1.6rem] leading-none">{item.title}</h3>
                  <p className="pretty col-start-2 text-[0.975rem] leading-relaxed text-graphite sm:col-start-3">
                    {item.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
