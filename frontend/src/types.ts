export type Mode = "fewest_stops" | "shortest_time" | "fewest_interchanges";

export type LineMode = "metro" | "bus";

export type Anchor = "start" | "middle" | "end";

export interface Label {
  dx: number;
  dy: number;
  anchor: Anchor;
  rotate: number;
}

export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  lines: string[];
  label: Label;
}

export interface Line {
  id: string;
  name: string;
  color: string;
  mode: LineMode;
  stations: string[];
}

export interface Edge {
  a: string;
  b: string;
  line: string;
  minutes: number;
}

export interface Network {
  name: string;
  lines: Line[];
  stations: Station[];
  edges: Edge[];
}

export interface Leg {
  line: string;
  lineName: string;
  color: string;
  mode: LineMode;
  stationIds: string[];
  stationNames: string[];
  stops: number;
  minutes: number;
}

export interface Summary {
  stops: number;
  minutes: number;
  rideMinutes: number;
  interchanges: number;
  fare: number;
  fareBand: string;
}

export interface Route {
  mode: Mode;
  modeLabel: string;
  found: boolean;
  message?: string | null;
  stationIds: string[];
  stationNames: string[];
  legs: Leg[];
  summary: Summary | null;
  interchangeStationIds: string[];
}

export interface StationRef {
  id: string;
  name: string;
}

export interface SolveResponse {
  primary: Route;
  options: Route[];
  interchangePenalty: number;
  source: StationRef;
  target: StationRef;
}

export interface DegreeRow {
  id: string;
  name: string;
  degree: number;
  lines: string[];
}

export interface CriticalStation {
  id: string;
  name: string;
  degree: number;
  parts: number;
}

export interface Analysis {
  stationCount: number;
  edgeCount: number;
  lineCount: number;
  isConnected: boolean;
  componentCount: number;
  components: string[][];
  averageDegree: number;
  maxDegree: number;
  density: number;
  topDegrees: DegreeRow[];
  criticalStations: CriticalStation[];
  articulationPoints: StationRef[];
  isolatedStations: StationRef[];
}

export interface ModeOption {
  id: Mode;
  label: string;
  algorithm: string;
  hint: string;
}

export const MODES: Mode[] = ["fewest_stops", "shortest_time", "fewest_interchanges"];

export const MODE_LABELS: Record<Mode, string> = {
  fewest_stops: "Fewest stops",
  shortest_time: "Shortest time",
  fewest_interchanges: "Fewest changes",
};

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: "fewest_stops",
    label: "Fewest stops",
    algorithm: "BFS",
    hint: "Breadth-first search on the unweighted graph: every edge costs one stop, so the hop count is minimal. It ignores travel time, so the fewest-stop route can be slower. Ties are broken by time. O(V + E).",
  },
  {
    id: "shortest_time",
    label: "Shortest time",
    algorithm: "Dijkstra",
    hint: "Dijkstra on the weighted graph. Travel minutes plus a 5-minute penalty per interchange, using a priority queue. O((V + E) log V).",
  },
  {
    id: "fewest_interchanges",
    label: "Fewest changes",
    algorithm: "Dijkstra",
    hint: "Dijkstra on the (station, line) state graph: rides are cheap, changing line costs one interchange. Ties are broken by travel time.",
  },
];

export const INTERCHANGE_PENALTY = 5;
