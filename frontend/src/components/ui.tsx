import type { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <section className={`card ${className}`}>{children}</section>;
}

type Tone = "neutral" | "good" | "warn" | "bad";

const TONES: Record<Tone, string> = {
  neutral: "border-white/10 bg-white/[0.06] text-slate-300",
  good: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  warn: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  bad: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-300">{title}</h2>
        {subtitle ? <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/25 px-3 py-2.5">
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-1.5 font-mono text-[17px] leading-none" style={{ color: accent ?? "#f1f5f9" }}>
        {value}
        {unit ? <span className="ml-1 font-sans text-[10.5px] text-slate-400">{unit}</span> : null}
      </div>
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-4 w-8 shrink-0 rounded-full border transition ${
        checked ? "border-emerald-400/40 bg-emerald-400/25" : "border-white/10 bg-white/[0.06]"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[10px] w-[10px] rounded-full transition-all ${
          checked ? "left-[18px] bg-emerald-300" : "left-[3px] bg-slate-500"
        }`}
      />
    </button>
  );
}

export function Spinner({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
