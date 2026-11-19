import { Fragment } from "react";
import { formatMinutes, stopsLabel } from "../lib/format";
import type { Leg, LineMode, Mode, SolveResponse } from "../types";
import { MODE_OPTIONS } from "../types";
import { Card, Pill, SectionTitle, Spinner, Stat } from "./ui";

interface Props {
  result: SolveResponse | null;
  mode: Mode;
  pending: boolean;
  onModeChange: (mode: Mode) => void;
}

function ModeIcon({ mode, className }: { mode: LineMode; className?: string }) {
  if (mode === "bus") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="3.5" width="16" height="13" rx="2.5" />
        <path d="M4 10h16M7.5 16.5V19M16.5 16.5V19" strokeLinecap="round" />
        <circle cx="8" cy="13.2" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="16" cy="13.2" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5.5" y="3.5" width="13" height="13.5" rx="3" />
      <path d="M5.5 11.5h13M8.5 20l1.5-2.5M15.5 20 14 17.5" strokeLinecap="round" />
      <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Rail({ color }: { color: string }) {
  return (
    <div className="relative flex w-4 shrink-0 justify-center">
      <span className="absolute inset-y-0 w-[3px] rounded-full" style={{ background: `${color}55` }} />
    </div>
  );
}

function StationRow({
  name,
  color,
  tone,
}: {
  name: string;
  color: string;
  tone: "start" | "stop" | "end";
}) {
  return (
    <div className="flex gap-3">
      <div className="relative flex w-4 shrink-0 justify-center">
        <Rail color={color} />
        {tone === "stop" ? (
          <span className="relative z-10 mt-[7px] h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        ) : (
          <span
            className="relative z-10 mt-[5px] h-2.5 w-2.5 rounded-full"
            style={{
              background: tone === "start" ? "#34d399" : "#fb7185",
              boxShadow: `0 0 0 2px ${tone === "start" ? "#34d39955" : "#fb718555"}`,
            }}
          />
        )}
      </div>
      <div
        className={`flex-1 pb-2 text-[13px] leading-6 ${
          tone === "stop" ? "text-slate-400" : "font-semibold text-slate-100"
        }`}
      >
        {name}
        {tone === "end" ? (
          <span className="ml-2 text-[10.5px] font-normal text-rose-300/80">arrive</span>
        ) : null}
      </div>
    </div>
  );
}

function LegHeader({ leg }: { leg: Leg }) {
  return (
    <div className="flex gap-3">
      <Rail color={leg.color} />
      <div className="flex flex-wrap items-center gap-2 pb-1.5 pt-0.5">
        <span
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em]"
          style={{ background: `${leg.color}20`, color: leg.color }}
        >
          <ModeIcon mode={leg.mode} className="h-2.5 w-2.5" />
          {leg.lineName}
        </span>
        <span className="text-[11px] text-slate-500">
          {stopsLabel(leg.stops)} · {formatMinutes(leg.minutes)}
        </span>
      </div>
    </div>
  );
}

function InterchangeRow({ name, next, penalty }: { name: string; next: Leg; penalty: number }) {
  return (
    <div className="flex gap-3">
      <div className="relative flex w-4 shrink-0 justify-center">
        <Rail color={next.color} />
        <span className="relative z-10 mt-[4px] h-3 w-3 rounded-full border-2 border-slate-200 bg-[#080c12]" />
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 pb-2.5">
        <span className="text-[13px] font-semibold text-slate-100">{name}</span>
        <span className="rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-slate-400">
          change to {next.lineName} · +{penalty} min
        </span>
      </div>
    </div>
  );
}

export function RoutePanel({ result, mode, pending, onModeChange }: Props) {
  const route = result?.primary;
  const summary = route?.summary;

  return (
    <Card className="flex min-h-[320px] flex-col p-4 sm:p-5">
      <SectionTitle
        title="Route"
        subtitle={
          result ? `${result.source.name} → ${result.target.name}` : "Choose two stations to solve the graph."
        }
        right={pending ? <Spinner className="mt-1 h-3.5 w-3.5 text-slate-500" /> : null}
      />

      {!result || !route ? (
        <div className="mt-6 space-y-2">
          <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
          <div className="h-24 animate-pulse rounded-xl bg-white/[0.03]" />
        </div>
      ) : !route.found ? (
        <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] p-4">
          <Pill tone="warn">No path</Pill>
          <p className="mt-2 text-[12.5px] leading-relaxed text-amber-100/80">{route.message}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-200/50">
            The stations lie in different connected components, so no walk, path or route can join them.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Stat label="Stops" value={summary?.stops ?? 0} />
            <Stat label="Time" value={Math.round(summary?.minutes ?? 0)} unit="min" accent="#a7f3d0" />
            <Stat label="Changes" value={summary?.interchanges ?? 0} />
            <Stat label="Fare" value={`₹${summary?.fare ?? 0}`} />
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            {summary && summary.interchanges > 0
              ? `${Math.round(summary.rideMinutes)} min riding + ${summary.interchanges} × ${
                  result.interchangePenalty
                } min interchange`
              : `${Math.round(summary?.rideMinutes ?? 0)} min riding`}
            {summary ? ` · fare ${summary.fareBand}` : ""}
          </p>

          {route.message ? (
            <p className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2 text-[11.5px] text-slate-400">
              {route.message}
            </p>
          ) : null}

          {route.legs.length > 0 ? (
            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-500">Itinerary</h3>
                <span className="font-mono text-[10.5px] text-slate-600">
                  {stopsLabel(summary?.stops ?? 0)} · {route.legs.length} leg
                  {route.legs.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="max-h-[330px] overflow-y-auto pr-1">
                {route.legs.map((leg, index) => {
                  const isLast = index === route.legs.length - 1;
                  const arrival = leg.stationNames[leg.stationNames.length - 1];
                  return (
                    <Fragment key={`${leg.line}-${index}`}>
                      {index === 0 ? (
                        <StationRow name={leg.stationNames[0]} color={leg.color} tone="start" />
                      ) : null}
                      <LegHeader leg={leg} />
                      {leg.stationNames.slice(1, -1).map((name, position) => (
                        <StationRow key={`${name}-${position}`} name={name} color={leg.color} tone="stop" />
                      ))}
                      {isLast ? (
                        <StationRow name={arrival} color={leg.color} tone="end" />
                      ) : (
                        <InterchangeRow
                          name={arrival}
                          next={route.legs[index + 1]}
                          penalty={result.interchangePenalty}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-4 border-t border-white/[0.06] pt-3">
            <h3 className="mb-1.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Objectives compared
            </h3>
            <div className="grid grid-cols-[minmax(0,1fr)_34px_38px_32px] items-center gap-1.5 px-2.5 pb-1 text-[9px] uppercase tracking-[0.1em] text-slate-500">
              <span>Objective</span>
              <span className="text-right">Stops</span>
              <span className="text-right">Time</span>
              <span className="text-right">Chg</span>
            </div>
            <ul className="space-y-1">
              {result.options.map((option) => {
                const active = option.mode === mode;
                const meta = MODE_OPTIONS.find((entry) => entry.id === option.mode);
                const displayLabel =
                  option.mode === "fewest_interchanges"
                    ? "Fewest changes"
                    : meta?.label ?? option.mode;
                return (
                  <li key={option.mode}>
                    <button
                      type="button"
                      onClick={() => onModeChange(option.mode)}
                      className={`grid w-full grid-cols-[minmax(0,1fr)_34px_38px_32px] items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left transition ${
                        active
                          ? "border-emerald-400/30 bg-emerald-400/[0.08]"
                          : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span
                        className={`truncate text-[11.5px] ${
                          active ? "text-emerald-100" : "text-slate-400"
                        }`}
                      >
                        {displayLabel}
                      </span>
                      {option.found && option.summary ? (
                        <>
                          <span className="text-right font-mono text-[11px] text-slate-400">
                            {option.summary.stops}
                          </span>
                          <span className="text-right font-mono text-[11px] text-slate-400">
                            {Math.round(option.summary.minutes)}
                          </span>
                          <span className="text-right font-mono text-[11px] text-slate-500">
                            {option.summary.interchanges}
                          </span>
                        </>
                      ) : (
                        <span className="col-span-3 text-right text-[11px] text-amber-300/70">unreachable</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Objectives can tie or disagree — the fewest-stop path may need more changes, and a bus can beat the
              metro on changes while losing on time.
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
