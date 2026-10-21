/** Section index + label with a drawn hairline, e.g. "(01) — Selected Work". */
export function SectionLabel({
  index,
  label,
  tone = "light",
}: {
  index: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "text-mist" : "text-graphite";
  return (
    <div className={`flex items-center gap-4 ${muted}`}>
      <span className="eyebrow">({index})</span>
      <span data-reveal="rule" aria-hidden className="h-px flex-1 bg-current opacity-30" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
