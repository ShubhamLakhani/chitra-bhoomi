import { site } from "@/content/site";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper text-ink">
      <div className="shell py-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-4">
            <Logo className="h-12" />
            <p className="eyebrow text-graphite">{site.serviceLine}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-graphite">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-underline pb-0.5 hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#top" className="link-underline pb-0.5 hover:text-ink">
                  Back to top ↑
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-ink/10 pt-6 text-[12px] text-graphite sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>{site.city}</p>
        </div>
      </div>
    </footer>
  );
}
