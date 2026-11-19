import { useCallback, useEffect, useMemo, useState } from "react";
import * as api from "./api";
import { EditorCard } from "./components/EditorCard";
import { InsightsCard } from "./components/InsightsCard";
import { MetroMap } from "./components/MetroMap";
import { PlannerCard } from "./components/PlannerCard";
import { RoutePanel } from "./components/RoutePanel";
import { Pill, Spinner } from "./components/ui";
import { addStation, removeStation } from "./lib/network";
import type { AddStationInput } from "./lib/network";
import type { Analysis, Mode, Network, SolveResponse } from "./types";
import { INTERCHANGE_PENALTY } from "./types";

// A journey where the objectives disagree: the metro is 2 minutes faster but
// needs a change, while Bus 405 runs it direct with no changes.
const DEFAULT_SOURCE = "karol-bagh";
const DEFAULT_TARGET = "lajpat-nagar";

export default function App() {
  const [baseNetwork, setBaseNetwork] = useState<Network | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [suspended, setSuspended] = useState<string[]>([]);
  const [includeBus, setIncludeBus] = useState(true);
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [mode, setMode] = useState<Mode>("shortest_time");
  const [result, setResult] = useState<SolveResponse | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Load the seed dataset once.
  useEffect(() => {
    const controller = new AbortController();
    api
      .getNetwork(controller.signal)
      .then((loaded) => {
        setBaseNetwork(loaded);
        setNetwork(loaded);
      })
      .catch((cause: Error) => {
        if (cause.name !== "AbortError") setError(cause.message);
      });
    return () => controller.abort();
  }, []);

  const busLineIds = useMemo(
    () => new Set((network?.lines ?? []).filter((line) => line.mode === "bus").map((line) => line.id)),
    [network],
  );

  // Lines removed from planning: suspended ones, plus every bus route when the
  // bus layer is off. They stay on the map (dimmed) so the network is editable.
  const effectiveNetwork = useMemo(() => {
    if (!network) return null;
    const excluded = new Set(suspended);
    if (!includeBus) busLineIds.forEach((lineId) => excluded.add(lineId));
    if (excluded.size === 0) return network;

    const stations = network.stations.filter((station) =>
      station.lines.some((lineId) => !excluded.has(lineId)),
    );
    const stationIds = new Set(stations.map((station) => station.id));

    return {
      ...network,
      lines: network.lines.filter((line) => !excluded.has(line.id)),
      stations,
      edges: network.edges.filter(
        (edge) => !excluded.has(edge.line) && stationIds.has(edge.a) && stationIds.has(edge.b),
      ),
    };
  }, [network, suspended, includeBus, busLineIds]);

  // Synchronize source and target when effectiveNetwork changes to prevent 404s
  useEffect(() => {
    if (!effectiveNetwork || effectiveNetwork.stations.length === 0) return;
    const stationIds = new Set(effectiveNetwork.stations.map((station) => station.id));
    let nextSource = source;

    if (!stationIds.has(source)) {
      nextSource = effectiveNetwork.stations[0]?.id ?? "";
      setSource(nextSource);
    }
    if (!stationIds.has(target)) {
      const fallbackTarget =
        effectiveNetwork.stations.find((station) => station.id !== nextSource)?.id ??
        effectiveNetwork.stations[0]?.id ??
        "";
      setTarget(fallbackTarget);
    }
  }, [effectiveNetwork, source, target]);

  useEffect(() => {
    if (!effectiveNetwork || effectiveNetwork.stations.length === 0) return;
    const stationIds = new Set(effectiveNetwork.stations.map((station) => station.id));
    if (!stationIds.has(source) || !stationIds.has(target)) {
      return;
    }
    const controller = new AbortController();
    setPending(true);

    Promise.all([
      api.solve(
        {
          network: effectiveNetwork,
          source,
          target,
          mode,
          interchangePenalty: INTERCHANGE_PENALTY,
        },
        controller.signal,
      ),
      api.analyze(effectiveNetwork, controller.signal),
    ])
      .then(([solved, analysed]) => {
        setResult(solved);
        setAnalysis(analysed);
        setError(null);
      })
      .catch((cause: Error) => {
        if (cause.name !== "AbortError") setError(cause.message);
      })
      .finally(() => setPending(false));

    return () => controller.abort();
  }, [effectiveNetwork, source, target, mode]);

  const applyNetwork = useCallback(
    (next: Network) => {
      setNetwork(next);
      if (!next.stations.some((station) => station.id === source)) {
        setSource(next.stations[0]?.id ?? "");
      }
      if (!next.stations.some((station) => station.id === target)) {
        setTarget(next.stations[1]?.id ?? next.stations[0]?.id ?? "");
      }
    },
    [source, target],
  );

  const handleAddStation = (input: AddStationInput) => {
    if (!network) return;
    try {
      applyNetwork(addStation(network, input));
      setNotice(`Added “${input.name.trim()}” to the network.`);
    } catch (cause) {
      setNotice((cause as Error).message);
    }
  };

  const handleRemoveStation = (stationId: string) => {
    if (!network) return;
    const name = network.stations.find((station) => station.id === stationId)?.name ?? stationId;
    try {
      applyNetwork(removeStation(network, stationId));
      setNotice(`Removed “${name}” and its incident edges.`);
    } catch (cause) {
      setNotice((cause as Error).message);
    }
  };

  const handleReset = () => {
    if (!baseNetwork) return;
    setNetwork(baseNetwork);
    setSuspended([]);
    setIncludeBus(true);
    setSource(DEFAULT_SOURCE);
    setTarget(DEFAULT_TARGET);
    setMode("shortest_time");
    setNotice(`Network restored to the original ${baseNetwork.stations.length}-station dataset.`);
  };

  const modified = Boolean(
    baseNetwork && network && (network !== baseNetwork || suspended.length > 0),
  );

  if (!network || !baseNetwork) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          {error ? (
            <span className="max-w-md rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-rose-200">
              {error}
            </span>
          ) : (
            <>
              <Spinner className="h-4 w-4 text-emerald-300" />
              Loading the metro graph…
            </>
          )}
        </div>
      </div>
    );
  }

  const metroCount = network.lines.filter((line) => line.mode === "metro").length;
  const busCount = network.lines.filter((line) => line.mode === "bus").length;

  return (
    <div className="min-h-screen pb-10">
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#070a10]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3 xl:px-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-sky-500 text-[#04140f] shadow-lg shadow-emerald-500/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="6" cy="18" r="2.1" />
              <circle cx="18" cy="18" r="2.1" />
              <circle cx="12" cy="6" r="2.1" />
              <path d="M12 8.1 6 15.9M12 8.1l6 7.8M8.1 18h7.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold tracking-tight text-white">MetroGraph</h1>
            <p className="truncate text-[11px] text-slate-500">
              {network.name} · BFS &amp; Dijkstra route engine
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <Pill>{network.stations.length} stations</Pill>
            <Pill>{metroCount} metro</Pill>
            <Pill>{busCount} bus</Pill>
            {analysis ? (
              analysis.isConnected ? (
                <Pill tone="good">connected</Pill>
              ) : (
                <Pill tone="warn">{analysis.componentCount} components</Pill>
              )
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-4 px-4 pt-4 md:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_320px] xl:gap-5 xl:px-6">
        <div className="space-y-4 md:col-start-1 xl:space-y-5">
          <PlannerCard
            network={network}
            stations={effectiveNetwork?.stations ?? network.stations}
            source={source}
            target={target}
            mode={mode}
            onSourceChange={setSource}
            onTargetChange={setTarget}
            onSwap={() => {
              setSource(target);
              setTarget(source);
            }}
            onModeChange={setMode}
            includeBus={includeBus}
            busCount={busCount}
            onToggleBus={setIncludeBus}
          />
          <RoutePanel result={result} mode={mode} pending={pending} onModeChange={setMode} />
        </div>

        <div className="space-y-4 md:col-start-2 xl:space-y-5">
          {error ? (
            <div className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-2.5 text-[12px] text-rose-200">
              {error}
            </div>
          ) : null}

          <MetroMap
            network={network}
            route={result?.primary ?? null}
            suspended={suspended}
            penalty={INTERCHANGE_PENALTY}
            includeBus={includeBus}
          />
        </div>

        <div className="grid gap-4 md:col-span-2 md:grid-cols-2 xl:col-span-1 xl:col-start-3 xl:grid-cols-1 xl:gap-5">
            <InsightsCard analysis={analysis} lines={network.lines} />
            <EditorCard
              network={network}
              suspended={suspended}
              modified={modified}
              notice={notice}
              onToggleLine={(lineId) =>
                setSuspended((current) =>
                  current.includes(lineId)
                    ? current.filter((id) => id !== lineId)
                    : [...current, lineId],
                )
              }
              onAddStation={handleAddStation}
              onRemoveStation={handleRemoveStation}
              onReset={handleReset}
            />
        </div>
      </main>

      <footer className="mx-auto max-w-[1500px] px-4 pb-10 xl:px-6">
        <p className="text-[11px] leading-relaxed text-slate-600">
          Every algorithm here — adjacency list construction, BFS, Dijkstra over the (station, line) state
          graph, connected components, vertex degrees and articulation points — is implemented by hand in
          Python. Bus routes are just more lines in the same graph, so each algorithm handles them without
          a special case. No NetworkX, no graph shortcuts.
        </p>
      </footer>
    </div>
  );
}
