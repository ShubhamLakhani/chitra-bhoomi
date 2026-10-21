/**
 * Temporary text wordmark. It borrows the studio's high-contrast serif and
 * the orange square from its mark — replace with the supplied logo file
 * (SVG preferred) when available.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 leading-none ${className}`}>
      <span aria-hidden className="brand-square !h-[9px] !w-[9px] shrink-0" />
      <span className="flex flex-col gap-[5px]">
        <span className="font-display text-[17px] uppercase tracking-[0.14em] sm:text-[18px]">
          Chitra Bhoomi
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.32em] opacity-70">Architects</span>
      </span>
    </span>
  );
}
