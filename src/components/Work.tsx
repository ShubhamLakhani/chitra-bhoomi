import { projects } from "@/content/site";
import { resolveImage } from "@/lib/media";
import { WorkGallery, type ResolvedProject } from "@/components/WorkGallery";
import { SectionLabel } from "@/components/SectionLabel";

export function Work() {
  const resolved: ResolvedProject[] = projects.map((p) => ({
    ...p,
    cover: resolveImage(p.cover),
    gallery: p.gallery.map(resolveImage),
  }));

  return (
    <section id="work" aria-labelledby="work-title" className="relative pb-[clamp(96px,14vw,200px)] pt-[clamp(96px,12vw,180px)]">
      <div className="shell">
        <SectionLabel index="01" label="Selected Work" />
        <div className="grid-12 mb-[clamp(56px,8vw,120px)] mt-10 items-end gap-y-8">
          <h2 id="work-title" data-reveal="lines" className="display col-span-12 text-[clamp(3rem,8vw,8.5rem)] md:col-span-8">
            Selected <em className="italic">Work</em>
          </h2>
          <div data-reveal="fade" className="col-span-12 md:col-span-4">
            <p className="pretty max-w-[38ch] text-[1.0625rem] leading-relaxed text-graphite">
              A selection of homes and interiors, each shaped around the people who live in them.
            </p>
            {resolved.some((p) => !p.cover.available) && (
              <p className="eyebrow mt-5 max-w-[44ch] leading-relaxed text-graphite">
                Shown as concept drawings until project photography is added.
              </p>
            )}
          </div>
        </div>
        <WorkGallery projects={resolved} />
      </div>
    </section>
  );
}
