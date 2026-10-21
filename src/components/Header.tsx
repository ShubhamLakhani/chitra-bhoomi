"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useMotion } from "@/components/MotionProvider";
import { Wordmark } from "@/components/Wordmark";

export function Header() {
  const { lenis } = useMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, reveal on scroll up; flip colours over dark sections
  // (any element marked data-theme="dark" sitting under the header line).
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const checkTheme = () => {
      const stack = document.elementsFromPoint(window.innerWidth / 2, 38);
      const under = stack.find((el) => !el.closest("header") && !el.closest("#mobile-menu"));
      setDark(under?.closest("[data-theme]")?.getAttribute("data-theme") === "dark");
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 240);
          last = y;
        }
        checkTheme();
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("cb:theme", checkTheme);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("cb:theme", checkTheme);
    };
  }, []);

  // Mobile menu: lock scroll, animate, trap focus, close on Escape.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      const links = menu.querySelectorAll<HTMLElement>("[data-menu-item]");
      if (!prefersReducedMotion()) {
        gsap.fromTo(menu, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" });
        gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: 0.35 });
      }
      menu.querySelector<HTMLElement>("a")?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "Tab") {
          const focusables = [toggleRef.current!, ...menu.querySelectorAll<HTMLElement>("a")];
          const i = focusables.indexOf(document.activeElement as HTMLElement);
          if (e.shiftKey && i <= 0) {
            e.preventDefault();
            focusables[focusables.length - 1].focus();
          } else if (!e.shiftKey && i === focusables.length - 1) {
            e.preventDefault();
            focusables[0].focus();
          }
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    lenis?.start();
    document.body.style.overflow = "";
  }, [open, lenis]);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onDark = dark && !open;
  const solid = scrolled && !open;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-[transform,background-color,color,border-color] duration-700 ease-[var(--ease-arch)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${
          open
            ? "border-b border-transparent bg-transparent text-paper"
            : onDark
              ? `text-paper ${solid ? "border-b border-paper/10 bg-charcoal" : "border-b border-transparent"}`
              : `text-ink ${solid ? "border-b border-ink/10 bg-ivory" : "border-b border-transparent"}`
        }`}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between">
          <a href="#top" aria-label={`${site.name} — back to top`} className="relative z-[61]">
            <Wordmark />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[13px] tracking-[0.04em]">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline pb-1">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="#contact"
            className="group hidden items-center gap-2 text-[13px] tracking-[0.04em] lg:inline-flex"
          >
            <span className="link-underline pb-1">Start a Project</span>
            <ArrowUpRight aria-hidden className="h-4 w-4 text-ember transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.4} />
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="relative z-[61] -mr-2 flex h-11 items-center gap-3 px-2 text-[12px] uppercase tracking-[0.14em] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-[9px] w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ${open ? "top-1 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 block h-px bg-current transition-all duration-500 ${open ? "top-1 w-6 -rotate-45" : "top-2 w-4"}`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="on-dark fixed inset-0 z-[55] flex flex-col bg-charcoal text-paper lg:hidden"
      >
        <div className="shell flex flex-1 flex-col justify-between pb-10 pt-[calc(var(--header-h)+5vh)]">
          <nav aria-label="Mobile">
            <ul className="space-y-2">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <a
                    data-menu-item
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-1"
                  >
                    <span className="font-mono text-[11px] text-mist">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-[clamp(2.6rem,11vw,4.5rem)]">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-6 border-t border-paper/15 pt-6 text-sm sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-2 text-mist">Call</p>
              <a href={site.contact.phoneHref} className="text-lg">
                {site.contact.phoneDisplay}
              </a>
            </div>
            <div className="flex gap-6">
              <a href={site.contact.instagram} target="_blank" rel="noopener noreferrer" className="link-underline">
                Instagram
              </a>
              <a href={site.contact.facebook} target="_blank" rel="noopener noreferrer" className="link-underline">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
