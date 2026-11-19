import type { Mode } from "../types";
import { MODE_OPTIONS } from "../types";

export function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Optimisation objective"
      className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/30 p-1"
    >
      {MODE_OPTIONS.map((option) => {
        const active = option.id === mode;
        return (
          <button
            key={option.id}
            role="radio"
            aria-checked={active}
            type="button"
            onClick={() => onChange(option.id)}
            className={`group flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-center transition ${
              active
                ? "bg-emerald-400/12 text-emerald-100 ring-1 ring-inset ring-emerald-400/30"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
            }`}
          >
            <span className="text-[12px] font-medium leading-tight">{option.label}</span>
            <span
              className={`font-mono text-[9.5px] uppercase tracking-[0.1em] ${
                active ? "text-emerald-300/80" : "text-slate-600 group-hover:text-slate-500"
              }`}
            >
              {option.algorithm}
            </span>
          </button>
        );
      })}
    </div>
  );
}
