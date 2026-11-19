import type { Label, Network, Station } from "../types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function uniqueStationId(name: string, stations: Station[]): string {
  const base = slugify(name) || "station";
  const taken = new Set(stations.map((station) => station.id));
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function labelForDirection(from: Station, to: Station): Label {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { dx: 0, dy: 16, anchor: "middle", rotate: 0 };
  }
  return { dx: -13, dy: 4, anchor: "end", rotate: 0 };
}

function findStation(stations: Station[], id: string): Station {
  const station = stations.find((candidate) => candidate.id === id);
  if (!station) throw new Error(`Station "${id}" is not in this network.`);
  return station;
}

export interface AddStationInput {
  name: string;
  lineId: string;
  afterId: string;
}

/** Insert a station on a line, splitting the segment after `afterId` in two. */
export function addStation(network: Network, input: AddStationInput): Network {
  const name = input.name.trim();
  if (!name) throw new Error("Give the new station a name.");

  const line = network.lines.find((candidate) => candidate.id === input.lineId);
  if (!line) throw new Error("Choose a line for the new station.");

  const index = line.stations.indexOf(input.afterId);
  if (index === -1) throw new Error("That station is not on this line.");

  const previousId = line.stations[index + 1];
  const after = findStation(network.stations, input.afterId);
  const next = previousId ? findStation(network.stations, previousId) : undefined;

  let x: number;
  let y: number;
  if (next) {
    x = (after.x + next.x) / 2;
    y = (after.y + next.y) / 2;
  } else {
    const beforeId = line.stations[index - 1];
    const before = beforeId ? findStation(network.stations, beforeId) : undefined;
    const dx = before ? after.x - before.x : 40;
    const dy = before ? after.y - before.y : 0;
    const length = Math.hypot(dx, dy) || 1;
    x = after.x + (dx / length) * 45;
    y = after.y + (dy / length) * 45;
  }

  const id = uniqueStationId(name, network.stations);
  const label = next ? labelForDirection(after, next) : labelForDirection(after, { ...after, x, y });

  const station: Station = { id, name, x, y, lines: [line.id], label };

  const splitEdge = next
    ? network.edges.find(
        (edge) =>
          (edge.a === after.id && edge.b === next.id) || (edge.a === next.id && edge.b === after.id),
      )
    : undefined;
  const originalMinutes = splitEdge ? splitEdge.minutes : 6;
  const firstHalf = Math.max(1, Math.round(originalMinutes / 2));
  const secondHalf = Math.max(1, Math.round(originalMinutes - firstHalf));

  const edges = network.edges.filter((edge) => edge !== splitEdge);
  edges.push({ a: after.id, b: id, line: line.id, minutes: firstHalf });
  if (next) edges.push({ a: id, b: next.id, line: line.id, minutes: secondHalf });

  const stations = [...network.stations, station].sort((a, b) => a.name.localeCompare(b.name));

  const lines = network.lines.map((candidate) => {
    if (candidate.id !== line.id) return candidate;
    const order = [...candidate.stations];
    order.splice(index + 1, 0, id);
    return { ...candidate, stations: order };
  });

  return { ...network, stations, lines, edges };
}

/** Remove a station and every edge incident to it. */
export function removeStation(network: Network, stationId: string): Network {
  const station = network.stations.find((candidate) => candidate.id === stationId);
  if (!station) throw new Error("That station is not in this network.");

  return {
    ...network,
    stations: network.stations.filter((candidate) => candidate.id !== stationId),
    edges: network.edges.filter((edge) => edge.a !== stationId && edge.b !== stationId),
    lines: network.lines.map((line) => ({
      ...line,
      stations: line.stations.filter((id) => id !== stationId),
    })),
  };
}
