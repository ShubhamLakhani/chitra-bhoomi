import { processSteps } from "@/content/site";
import { SectionLabel } from "@/components/SectionLabel";

/**
 * The four stages climb like a stair in section: each tread is a stage,
 * each riser a step up from the one before.
 */
export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative pb-[clamp(96px,14vw,200px)] pt-[clamp(96px,12vw,180px)]">
      <div className="shell">
        <SectionLabel index="05" label="Process" />
        <div className="grid-12 mt-10 gap-y-6">
          <h2 id="process-title" data-reveal="lines" className="display col-span-12 text-[clamp(2.8rem,7vw,7.5rem)] md:col-span-9">
            From first conversation to <em className="italic">finished</em> space.
          </h2>
        </div>

        <ol className="mt-[clamp(56px,8vw,120px)] grid grid-cols-1 gap-y-12 md:grid-cols-4 md:gap-x-0 md:gap-y-0">
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              className="relative md:pr-[clamp(16px,2.4vw,40px)]"
              style={{ ["--rise" as string]: `${(processSteps.length - 1 - i) * 72}px` }}
            >
              <div className="md:mt-[var(--rise)]">
                {/* riser from the previous tread */}
                {i > 0 && (
                  <span
                    data-reveal="riser"
                    data-delay={i * 0.25}
                    aria-hidden
                    className="absolute left-0 top-[var(--rise)] hidden h-[73px] w-px bg-ink/50 md:block"
                  />
                )}
                <span data-reveal="rule" data-delay={i * 0.25} aria-hidden className="block h-px w-full bg-ink/50" />
                <div className="flex items-start justify-between pt-5">
                  <span className="display text-[clamp(3.2rem,5vw,5rem)] leading-none text-ink/90">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="brand-square mt-2 !h-[7px] !w-[7px]" />
                </div>
                <h3 data-reveal="fade" data-delay={0.1 + i * 0.1} className="mt-8 text-[1.05rem] font-medium uppercase tracking-[0.12em]">
                  {step.title}
                </h3>
                <p data-reveal="fade" data-delay={0.15 + i * 0.1} className="pretty mt-3 max-w-[30ch] text-[0.975rem] leading-relaxed text-graphite">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
