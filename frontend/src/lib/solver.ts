import type { Analysis, CriticalStation, DegreeRow, Leg, Mode, Network, Route, SolveResponse, StationRef, Summary } from "../types";
import { MODE_LABELS, MODES } from "../types";
import defaultNetworkJson from "../data/network.json";

export const DEFAULT_NETWORK: Network = defaultNetworkJson as unknown as Network;

const FARE_BANDS: [number | null, number][] = [
  [2, 10],
  [5, 20],
  [9, 30],
  [14, 40],
  [19, 50],
  [null, 60],
];

const BUS_FARE = 15;

function estimateFare(stops: number): [number, string] {
  let prev = 0;
  for (const [limit, fare] of FARE_BANDS) {
    if (limit === null) return [fare, `${prev + 1}+ stops`];
    if (stops <= limit) {
      const band = prev ? `${prev}–${limit} stops` : `0–${limit} stops`;
      return [fare, band];
    }
    prev = limit;
  }
  return [60, "full network"];
}

function journeyFare(metroStops: number, busLegs: number): [number, string] {
  const busFare = BUS_FARE * busLegs;
  const [metroFare, band] = metroStops > 0 ? estimateFare(metroStops) : [0, ""];
  if (busLegs && metroStops) {
    return [metroFare + busFare, `₹${metroFare} metro (${band}) + ₹${busFare} bus`];
  }
  if (busLegs) {
    const ticket = busLegs === 1 ? "ticket" : "tickets";
    return [busFare, `₹${busFare} bus · ${busLegs} ${ticket}`];
  }
  return [metroFare, band];
}

export class ClientMetroGraph {
  network: Network;
  stations: Map<string, { id: string; name: string }>;
  lines: Map<string, { id: string; name: string; color: string; mode: "metro" | "bus" }>;
  stationIds: string[];
  adj: Map<string, Map<string, [number, string]>>;
  linesAt: Map<string, Set<string>>;

  constructor(network: Network) {
    this.network = network;
    this.stations = new Map(network.stations.map((s) => [s.id, s]));
    this.lines = new Map(network.lines.map((l) => [l.id, l]));
    this.stationIds = network.stations.map((s) => s.id);
    this.adj = new Map(this.stationIds.map((id) => [id, new Map()]));
    this.linesAt = new Map(this.stationIds.map((id) => [id, new Set()]));

    for (const edge of network.edges) {
      if (!this.adj.has(edge.a) || !this.adj.has(edge.b) || edge.a === edge.b) continue;
      const weight = Number(edge.minutes);
      this.adj.get(edge.a)!.set(edge.b, [weight, edge.line]);
      this.adj.get(edge.b)!.set(edge.a, [weight, edge.line]);
      this.linesAt.get(edge.a)!.add(edge.line);
      this.linesAt.get(edge.b)!.add(edge.line);
    }
  }

  name(stationId: string): string {
    return this.stations.get(stationId)?.name ?? stationId;
  }

  names(stationIds: string[]): string[] {
    return stationIds.map((id) => this.name(id));
  }

  bfsFewestStops(source: string, target: string): string[] | null {
    const distance = new Map<string, number>([[source, 0]]);
    const queue: string[] = [source];

    while (queue.length > 0) {
      const station = queue.shift()!;
      const neighbors = Array.from(this.adj.get(station)?.keys() ?? []).sort();
      for (const n of neighbors) {
        if (!distance.has(n)) {
          distance.set(n, distance.get(station)! + 1);
          queue.push(n);
        }
      }
    }

    if (!distance.has(target)) return null;
    if (target === source) return [source];

    const best = new Map<string, number>([[source, 0]]);
    const parent = new Map<string, string | null>([[source, null]]);
    const targetHops = distance.get(target)!;

    for (let hop = 0; hop < targetHops; hop++) {
      const layer = Array.from(distance.entries())
        .filter(([, d]) => d === hop)
        .map(([s]) => s)
        .sort();

      for (const station of layer) {
        for (const [neighbor, [weight]] of this.adj.get(station) ?? []) {
          if (distance.get(neighbor) !== hop + 1) continue;
          const candidate = (best.get(station) ?? 0) + weight;
          if (!best.has(neighbor) || candidate < best.get(neighbor)!) {
            best.set(neighbor, candidate);
            parent.set(neighbor, station);
          }
        }
      }
    }

    const path: string[] = [];
    let cur: string | null = target;
    while (cur !== null) {
      path.push(cur);
      cur = parent.get(cur) ?? null;
    }
    path.reverse();
    return path;
  }

  dijkstra(
    source: string,
    target: string,
    mode: Mode,
    penalty: number,
  ): [string, string][] | null {
    if (!this.linesAt.get(source)?.size || !this.linesAt.get(target)?.size) return null;

    type State = [string, string]; // [station, line]
    const stateKey = (s: State) => `${s[0]}@@${s[1]}`;

    // Priority comparator
    const isBetter = (
      a: [number, number, number],
      b: [number, number, number],
    ) => {
      // mode fewest_interchanges: interchanges, minutes, stops
      if (mode === "fewest_interchanges") {
        if (a[1] !== b[1]) return a[1] < b[1];
        if (a[0] !== b[0]) return a[0] < b[0];
        return a[2] < b[2];
      }
      // shortest_time: minutes, interchanges, stops
      if (a[0] !== b[0]) return a[0] < b[0];
      if (a[1] !== b[1]) return a[1] < b[1];
      return a[2] < b[2];
    };

    const best = new Map<string, [number, number, number]>();
    const parent = new Map<string, State | null>();
    const queue: { state: State; score: [number, number, number] }[] = [];

    const startLines = Array.from(this.linesAt.get(source) ?? []).sort();
    for (const l of startLines) {
      const state: State = [source, l];
      const score: [number, number, number] = [0, 0, 0];
      best.set(stateKey(state), score);
      parent.set(stateKey(state), null);
      queue.push({ state, score });
    }

    while (queue.length > 0) {
      queue.sort((a, b) => (isBetter(a.score, b.score) ? -1 : 1));
      const { state, score } = queue.shift()!;
      const key = stateKey(state);
      const currentBest = best.get(key);
      if (!currentBest || currentBest[0] !== score[0] || currentBest[1] !== score[1]) continue;

      const [station, line] = state;
      if (station === target) {
        const path: State[] = [];
        let cur: State | null = state;
        while (cur !== null) {
          path.push(cur);
          cur = parent.get(stateKey(cur)) ?? null;
        }
        path.reverse();
        return path;
      }

      // Ride edge
      for (const [nextSt, [w, edgeLine]] of this.adj.get(station) ?? []) {
        if (edgeLine !== line) continue;
        const nextState: State = [nextSt, line];
        const nextScore: [number, number, number] = [score[0] + w, score[1], score[2] + 1];
        const nKey = stateKey(nextState);
        if (!best.has(nKey) || isBetter(nextScore, best.get(nKey)!)) {
          best.set(nKey, nextScore);
          parent.set(nKey, state);
          queue.push({ state: nextState, score: nextScore });
        }
      }

      // Transfer edge
      for (const nextLine of this.linesAt.get(station) ?? []) {
        if (nextLine === line) continue;
        const nextState: State = [station, nextLine];
        const nextScore: [number, number, number] = [score[0] + penalty, score[1] + 1, score[2]];
        const nKey = stateKey(nextState);
        if (!best.has(nKey) || isBetter(nextScore, best.get(nKey)!)) {
          best.set(nKey, nextScore);
          parent.set(nKey, state);
          queue.push({ state: nextState, score: nextScore });
        }
      }
    }

    return null;
  }

  legsFromPath(path: string[]): [string, string[]][] {
    if (path.length < 2) return [];
    const legs: [string, string[]][] = [];
    let curLine = this.adj.get(path[0])?.get(path[1])?.[1] ?? "";
    let curStations = [path[0], path[1]];

    for (let i = 1; i < path.length - 1; i++) {
      const line = this.adj.get(path[i])?.get(path[i + 1])?.[1] ?? "";
      if (line === curLine) {
        curStations.push(path[i + 1]);
      } else {
        legs.push([curLine, curStations]);
        curLine = line;
        curStations = [path[i], path[i + 1]];
      }
    }
    legs.push([curLine, curStations]);
    return legs;
  }

  legsFromStates(states: [string, string][]): [string, string[]][] {
    const legs: [string, string[]][] = [];
    let curLine: string | null = null;
    let curStations: string[] = [];

    for (const [st, line] of states) {
      if (curLine === null) {
        curLine = line;
        curStations = [st];
      } else if (line === curLine) {
        curStations.push(st);
      } else {
        legs.push([curLine, curStations]);
        curLine = line;
        curStations = [st];
      }
    }
    if (curLine !== null && curStations.length > 0) {
      legs.push([curLine, curStations]);
    }
    return legs;
  }

  buildRoute(mode: Mode, path: string[], rawLegs: [string, string[]][], penalty: number): Route {
    let rideMinutes = 0;
    const legModels: Leg[] = [];

    for (const [lineId, stationIds] of rawLegs) {
      const line = this.lines.get(lineId);
      let legMinutes = 0;
      for (let i = 0; i < stationIds.length - 1; i++) {
        legMinutes += this.adj.get(stationIds[i])?.get(stationIds[i + 1])?.[0] ?? 0;
      }
      rideMinutes += legMinutes;
      legModels.push({
        line: lineId,
        lineName: line?.name ?? lineId,
        color: line?.color ?? "#94a3b8",
        mode: line?.mode ?? "metro",
        stationIds,
        stationNames: this.names(stationIds),
        stops: stationIds.length - 1,
        minutes: Math.round(legMinutes * 10) / 10,
      });
    }

    const stops = Math.max(0, path.length - 1);
    const interchanges = Math.max(0, legModels.length - 1);
    const totalMinutes = rideMinutes + interchanges * penalty;
    const interchangeIds = legModels.slice(1).map((l) => l.stationIds[0]);

    const metroStops = legModels.filter((l) => l.mode === "metro").reduce((sum, l) => sum + l.stops, 0);
    const busLegs = legModels.filter((l) => l.mode === "bus").length;
    const [fare, fareBand] = journeyFare(metroStops, busLegs);

    return {
      mode,
      modeLabel: MODE_LABELS[mode],
      found: true,
      stationIds: path,
      stationNames: this.names(path),
      legs: legModels,
      summary: {
        stops,
        minutes: Math.round(totalMinutes * 10) / 10,
        rideMinutes: Math.round(rideMinutes * 10) / 10,
        interchanges,
        fare,
        fareBand,
      },
      interchangeStationIds: interchangeIds,
    };
  }

  solveRoute(mode: Mode, source: string, target: string, penalty: number = 5): Route {
    if (source === target) {
      return {
        mode,
        modeLabel: MODE_LABELS[mode],
        found: true,
        message: "You are already at the destination.",
        stationIds: [source],
        stationNames: [this.name(source)],
        summary: {
          stops: 0,
          minutes: 0,
          rideMinutes: 0,
          interchanges: 0,
          fare: 0,
          fareBand: "no journey needed",
        },
      };
    }

    if (mode === "fewest_stops") {
      const path = this.bfsFewestStops(source, target);
      if (!path) {
        return {
          mode,
          modeLabel: MODE_LABELS[mode],
          found: false,
          message: `No path exists between ${this.name(source)} and ${this.name(target)}.`,
          stationIds: [],
        };
      }
      return this.buildRoute(mode, path, this.legsFromPath(path), penalty);
    }

    const states = this.dijkstra(source, target, mode, penalty);
    if (!states) {
      return {
        mode,
        modeLabel: MODE_LABELS[mode],
        found: false,
        message: `No path exists between ${this.name(source)} and ${this.name(target)}.`,
        stationIds: [],
      };
    }

    const path: string[] = [];
    for (const [st] of states) {
      if (path.length === 0 || path[path.length - 1] !== st) {
        path.push(st);
      }
    }
    return this.buildRoute(mode, path, this.legsFromStates(states), penalty);
  }

  components(): string[][] {
    const seen = new Set<string>();
    const comps: string[][] = [];

    for (const id of this.stationIds) {
      if (seen.has(id)) continue;
      const comp: string[] = [];
      const queue: string[] = [id];
      seen.add(id);

      while (queue.length > 0) {
        const u = queue.shift()!;
        comp.push(u);
        for (const v of this.adj.get(u)?.keys() ?? []) {
          if (!seen.has(v)) {
            seen.add(v);
            queue.push(v);
          }
        }
      }
      comps.push(comp);
    }
    comps.sort((a, b) => b.length - a.length);
    return comps;
  }

  articulationPoints(): string[] {
    const discovery = new Map<string, number>();
    const low = new Map<string, number>();
    const parent = new Map<string, string | null>();
    const points = new Set<string>();
    let counter = 0;

    const visit = (u: string) => {
      discovery.set(u, counter);
      low.set(u, counter);
      counter++;
      let children = 0;

      for (const v of this.adj.get(u)?.keys() ?? []) {
        if (!discovery.has(v)) {
          children++;
          parent.set(v, u);
          visit(v);
          low.set(u, Math.min(low.get(u)!, low.get(v)!));
          if (parent.get(u) === null && children > 1) points.add(u);
          if (parent.get(u) !== null && low.get(v)! >= discovery.get(u)!) points.add(u);
        } else if (v !== parent.get(u)) {
          low.set(u, Math.min(low.get(u)!, discovery.get(v)!));
        }
      }
    };

    for (const id of this.stationIds) {
      if (!discovery.has(id)) {
        parent.set(id, null);
        visit(id);
      }
    }
    return Array.from(points).sort((a, b) => this.name(a).localeCompare(this.name(b)));
  }

  analyse(): Analysis {
    const comps = this.components();
    const degrees = new Map(this.stationIds.map((id) => [id, this.adj.get(id)?.size ?? 0]));
    const topDeg = Array.from(degrees.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id, deg]): DegreeRow => ({
        id,
        name: this.name(id),
        degree: deg,
        lines: Array.from(this.linesAt.get(id) ?? []).sort(),
      }));

    const cutVertices = this.articulationPoints();
    const critical: CriticalStation[] = cutVertices.map((id) => ({
      id,
      name: this.name(id),
      degree: degrees.get(id) ?? 0,
      parts: 2,
    }));

    let edges = 0;
    for (const m of this.adj.values()) edges += m.size;
    const E = Math.floor(edges / 2);
    const V = this.stationIds.length;
    const averageDegree = V > 0 ? (2 * E) / V : 0;
    const density = V > 1 ? (2 * E) / (V * (V - 1)) : 0;
    const maxDegree = topDeg.length > 0 ? topDeg[0].degree : 0;

    const articulationPoints = cutVertices.map((id) => ({ id, name: this.name(id) }));
    const isolatedStations = this.stationIds
      .filter((id) => (degrees.get(id) ?? 0) === 0)
      .map((id) => ({ id, name: this.name(id) }));

    return {
      stationCount: V,
      edgeCount: E,
      lineCount: this.lines.size,
      isConnected: comps.length <= 1,
      componentCount: comps.length,
      components: comps.map((c) => this.names(c)),
      averageDegree,
      maxDegree,
      density,
      topDegrees: topDeg,
      criticalStations: critical,
      articulationPoints,
      isolatedStations,
    };
  }
}

export function solveClient(
  network: Network,
  source: string,
  target: string,
  mode: Mode,
  penalty: number,
): SolveResponse {
  const g = new ClientMetroGraph(network);
  const options = MODES.map((m) => g.solveRoute(m, source, target, penalty));
  const primary = options.find((o) => o.mode === mode) ?? options[0];

  return {
    primary,
    options,
    interchangePenalty: penalty,
    source: { id: source, name: g.name(source) },
    target: { id: target, name: g.name(target) },
  };
}
