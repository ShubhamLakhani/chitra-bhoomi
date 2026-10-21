import { ArrowUpRight } from "lucide-react";
import { site, testimonials } from "@/content/site";
import { SectionLabel } from "@/components/SectionLabel";

/**
 * Shows verified client testimonials from content/site.ts. Until any are
 * added, an understated placeholder is shown instead — no invented quotes.
 */
export function Testimonials() {
  const hasQuotes = testimonials.length > 0;

  return (
    <section aria-labelledby="voices-title" className="relative bg-bone/60 py-[clamp(88px,11vw,170px)]">
      <div className="shell">
        <SectionLabel index="06" label="Client voices" />

        {hasQuotes ? (
          <div className="mt-14 grid gap-16 md:grid-cols-2">
            <h2 id="voices-title" className="sr-only">
              Client voices
            </h2>
            {testimonials.map((t) => (
              <figure key={t.name} data-reveal="fade">
                <blockquote className="display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.15]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="eyebrow mt-6 text-graphite">
                  {t.name}
                  {t.context ? ` — ${t.context}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="grid-12 mt-14 items-end gap-y-10">
            <div className="col-span-12 md:col-span-8">
              <span aria-hidden className="display block h-[0.5em] text-[clamp(6rem,12vw,11rem)] leading-none text-ember">
                “
              </span>
              <h2 id="voices-title" data-reveal="lines" className="display mt-6 text-[clamp(2.4rem,5vw,5rem)] leading-[1]">
                Every project begins as a <em className="italic">conversation.</em>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4">
              <p data-reveal="fade" className="pretty max-w-[34ch] text-[1.0625rem] leading-relaxed text-graphite">
                Reflections from the families and clients we design for will be shared here. Until then, recent work is
                published on our Instagram.
              </p>
              <a
                data-reveal="fade"
                href={site.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm"
              >
                <span className="link-underline pb-1">{site.contact.instagramHandle}</span>
                <ArrowUpRight aria-hidden className="h-4 w-4 text-ember-deep" strokeWidth={1.4} />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
