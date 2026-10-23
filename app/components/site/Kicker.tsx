export default function Kicker({ index, label }: { index: string; label: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-silver">
      <span className="text-light">{index}</span>
      <span className="h-px w-8 bg-white/40" aria-hidden="true" />
      {label}
    </p>
  );
}
