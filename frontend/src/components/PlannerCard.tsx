import type { Mode, Network, Station } from "../types";
import { MODE_OPTIONS } from "../types";
import { ModeToggle } from "./ModeToggle";
import { StationSelect } from "./StationSelect";
import { Card, SectionTitle, Switch } from "./ui";

interface Props {
  network: Network;
  stations?: Station[];
  source: string;
  target: string;
  mode: Mode;
  onSourceChange: (id: string) => void;
  onTargetChange: (id: string) => void;
  onSwap: () => void;
  onModeChange: (mode: Mode) => void;
  includeBus: boolean;
  busCount: number;
  onToggleBus: (include: boolean) => void;
}

export function PlannerCard({
  network,
  stations,
  source,
  target,
  mode,
  onSourceChange,
  onTargetChange,
  onSwap,
  onModeChange,
  includeBus,
  busCount,
  onToggleBus,
}: Props) {
  const stationList = stations ?? network.stations;
  const activeMode = MODE_OPTIONS.find((option) => option.id === mode) ?? MODE_OPTIONS[0];

  return (
    <Card className="p-4 sm:p-5">
      <SectionTitle
        title="Plan a journey"
        subtitle="Vertices are stations, edges are adjacent stops, weights are minutes."
      />

      <div className="mt-4 space-y-2.5">
        <StationSelect label="From" value={source} stations={stationList} onChange={onSourceChange} />

        <div className="flex items-center gap-2">
          <span className="h-px flex-1 bg-white/[0.06]" />
          <button
            type="button"
            onClick={onSwap}
            aria-label="Swap origin and destination"
            className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-emerald-400/40 hover:text-emerald-300"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 4v13m0 0-3-3m3 3 3-3M17 20V7m0 0-3 3m3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <StationSelect label="To" value={target} stations={stationList} onChange={onTargetChange} />
      </div>

      <div className="mt-5">
        <span className="label">Optimise for</span>
        <ModeToggle mode={mode} onChange={onModeChange} />
        <div className="mt-2.5 flex gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2">
          <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
          <p className="text-[11.5px] leading-relaxed text-slate-500">{activeMode.hint}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2">
        <span className="text-[11.5px] text-slate-300">Include bus routes</span>
        <span className="font-mono text-[10px] text-slate-600">{busCount} routes</span>
        <div className="ml-auto">
          <Switch checked={includeBus} onChange={onToggleBus} label="Include bus routes in planning" />
        </div>
      </div>
    </Card>
  );
}
