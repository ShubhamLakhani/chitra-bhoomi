import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionLabel } from "@/components/SectionLabel";

export function Contact() {
  const c = site.contact;
  return (
    <section
      id="contact"
      data-theme="dark"
      aria-labelledby="contact-title"
      className="on-dark relative bg-charcoal pb-[clamp(96px,12vw,180px)] pt-[clamp(96px,12vw,180px)] text-paper"
    >
      <div className="shell">
        <SectionLabel index="07" label="Start a Project" tone="dark" />
        <h2 id="contact-title" data-reveal="lines" className="display mt-12 max-w-[14ch] text-[clamp(3rem,8vw,8.8rem)]">
          Let’s shape your <em className="italic">space.</em>
        </h2>

        <div className="grid-12 mt-[clamp(56px,8vw,120px)] gap-y-16">
          <div className="col-span-12 space-y-10 md:col-span-5 lg:col-span-4">
            <div data-reveal="fade">
              <p className="eyebrow mb-3 text-mist">Call the studio</p>
              <a href={c.phoneHref} className="display text-[clamp(2rem,3.2vw,2.9rem)] leading-none hover:text-ember-light">
                {c.phoneDisplay}
              </a>
            </div>
            {c.email && (
              <div data-reveal="fade">
                <p className="eyebrow mb-3 text-mist">Email</p>
                <a href={`mailto:${c.email}`} className="link-underline text-lg">
                  {c.email}
                </a>
              </div>
            )}
            <div data-reveal="fade">
              <p className="eyebrow mb-3 text-mist">Studio</p>
              <address className="text-[1.0625rem] not-italic leading-relaxed text-paper/80">
                {c.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </div>
            <div data-reveal="fade">
              <p className="eyebrow mb-3 text-mist">Follow</p>
              <ul className="flex flex-col gap-2 text-[1.0625rem]">
                <li>
                  <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2">
                    <span className="link-underline pb-0.5">Instagram</span>
                    <ArrowUpRight aria-hidden className="h-4 w-4 text-ember-light" strokeWidth={1.4} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a href={c.facebook} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2">
                    <span className="link-underline pb-0.5">Facebook</span>
                    <ArrowUpRight aria-hidden className="h-4 w-4 text-ember-light" strokeWidth={1.4} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div data-reveal="fade" className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <p className="pretty mb-10 max-w-[44ch] text-[1.0625rem] leading-relaxed text-paper/75">
              Tell us a little about your site and what you have in mind — a new home, an interior, or a garden.
            </p>
            <EnquiryForm />
          </div>
        </div>
      </div>

    </section>
  );
}
