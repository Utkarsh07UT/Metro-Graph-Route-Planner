import type { Analysis, Line } from "../types";
import { Card, Pill, SectionTitle } from "./ui";

interface Props {
  analysis: Analysis | null;
  lines: Line[];
}

export function InsightsCard({ analysis, lines }: Props) {
  const lineColor = (id: string) => lines.find((line) => line.id === id)?.color ?? "#94a3b8";
  // Only vertices that really are hubs: degree 2 is just a station mid-line.
  const hubs = analysis?.topDegrees.filter((row) => row.degree >= 3) ?? [];

  return (
    <Card className="p-4 sm:p-5">
      <SectionTitle
        title="Network analysis"
        subtitle="Structural properties of the graph that is currently loaded."
        right={
          analysis ? (
            analysis.isConnected ? (
              <Pill tone="good">Connected</Pill>
            ) : (
              <Pill tone="warn">{analysis.componentCount} components</Pill>
            )
          ) : null
        }
      />

      {!analysis ? (
        <div className="mt-4 h-40 animate-pulse rounded-xl bg-white/[0.03]" />
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { label: "|V|", value: analysis.stationCount, hint: "stations" },
              { label: "|E|", value: analysis.edgeCount, hint: "edges" },
              { label: "avg deg", value: analysis.averageDegree.toFixed(2), hint: "2E/V" },
              { label: "density", value: analysis.density.toFixed(3), hint: "2E/V(V-1)" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/[0.06] bg-black/20 px-2.5 py-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-slate-500">{item.label}</div>
                <div className="mt-1 font-mono text-[15px] leading-none text-slate-100">{item.value}</div>
                <div className="mt-1 text-[10px] text-slate-600">{item.hint}</div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <h3 className="label">Busiest vertices · degree</h3>
            <ul className="space-y-1.5">
              {hubs.map((row) => (
                <li key={row.id} className="flex items-center gap-2">
                  <span className="w-[42%] truncate text-[12px] text-slate-300">{row.name}</span>
                  <span className="flex items-center gap-1">
                    {row.lines.map((lineId) => (
                      <span
                        key={lineId}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: lineColor(lineId) }}
                      />
                    ))}
                  </span>
                  <div className="ml-auto h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-emerald-400/80"
                      style={{ width: `${(row.degree / Math.max(analysis.maxDegree, 1)) * 100}%` }}
                    />
                  </div>
                  <span className="w-4 text-right font-mono text-[11px] text-slate-400">{row.degree}</span>
                </li>
              ))}
              {hubs.length === 0 ? (
                <li className="text-[12px] text-slate-500">No connected stations.</li>
              ) : null}
            </ul>
          </div>

          <div className="mt-5">
            <h3 className="label">Critical vertices · removal impact</h3>
            <ul className="space-y-1">
              {analysis.criticalStations.slice(0, 5).map((row) => (
                <li
                  key={row.id}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-black/20 px-2 py-1.5"
                >
                  <span className="flex-1 truncate text-[12px] text-slate-300">{row.name}</span>
                  <span className="font-mono text-[10px] text-slate-600">deg {row.degree}</span>
                  <span className="rounded-md border border-amber-400/20 bg-amber-400/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-amber-200/90">
                    {row.parts} parts
                  </span>
                </li>
              ))}
              {analysis.criticalStations.length === 0 ? (
                <li className="text-[12px] text-slate-500">None — no single station splits the network.</li>
              ) : null}
            </ul>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              {analysis.articulationPoints.length} of {analysis.stationCount} vertices are cut vertices
              (Tarjan low-link DFS). Removing one splits the graph into the number of components shown.
            </p>
          </div>

          {analysis.componentCount > 1 ? (
            <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3">
              <h3 className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-amber-200/80">
                Components
              </h3>
              <ul className="mt-2 space-y-1.5">
                {analysis.components.map((component, index) => (
                  <li key={index} className="text-[11.5px] leading-snug text-amber-100/70">
                    <span className="font-mono text-amber-300/90">{component.length}</span> station
                    {component.length === 1 ? "" : "s"} · {component.slice(0, 4).join(", ")}
                    {component.length > 4 ? ` +${component.length - 4}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-5 text-[11px] leading-relaxed text-slate-600">
              A single component means every station is reachable from every other station.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
