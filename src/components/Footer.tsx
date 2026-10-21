import { site } from "@/content/site";
import { Wordmark } from "@/components/Wordmark";

export function Footer() {
  return (
    <footer data-theme="dark" className="on-dark border-t border-paper/10 bg-charcoal text-paper">
      <div className="shell py-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Wordmark className="text-paper" />
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-paper/70">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-underline pb-0.5 hover:text-paper">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#top" className="link-underline pb-0.5 hover:text-paper">
                  Back to top ↑
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-paper/10 pt-6 text-[12px] text-paper/65 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>{site.disciplines.join(" · ")} — {site.city}</p>
        </div>
      </div>
    </footer>
  );
}
