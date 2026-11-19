import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Anchor, Network, Route, Station } from "../types";
import { Card } from "./ui";

interface Props {
  network: Network;
  route: Route | null;
  suspended: string[];
  penalty: number;
  includeBus: boolean;
}

type Point = [number, number];

// Content spans x 70..880 and y 60..845; labels need the extra margin.
const VIEW_X = 10;
const VIEW_Y = 15;
const VIEW_W = 1050;
const VIEW_H = 860;
const VIEW_BOX = `${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

/** Bounding quad of a label, in map units, honouring its anchor and rotation. */
function labelQuad(
  x: number,
  y: number,
  anchor: Anchor,
  angle: number,
  width: number,
  height: number,
): Point[] {
  const left = anchor === "start" ? 0 : anchor === "end" ? -width : -width / 2;
  const top = -height * 0.75;
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const corners: Point[] = [
    [left, top],
    [left + width, top],
    [left + width, top + height],
    [left, top + height],
  ];
  return corners.map(([lx, ly]) => [x + lx * cos - ly * sin, y + lx * sin + ly * cos]);
}

/** Separating-axis test for two convex quads. */
function quadsOverlap(a: Point[], b: Point[]): boolean {
  for (const quad of [a, b]) {
    for (let index = 0; index < quad.length; index += 1) {
      const [x1, y1] = quad[index];
      const [x2, y2] = quad[(index + 1) % quad.length];
      const axisX = y1 - y2;
      const axisY = x2 - x1;
      const length = Math.hypot(axisX, axisY) || 1;
      const nx = axisX / length;
      const ny = axisY / length;

      let minA = Infinity;
      let maxA = -Infinity;
      for (const [px, py] of a) {
        const value = px * nx + py * ny;
        minA = Math.min(minA, value);
        maxA = Math.max(maxA, value);
      }
      let minB = Infinity;
      let maxB = -Infinity;
      for (const [px, py] of b) {
        const value = px * nx + py * ny;
        minB = Math.min(minB, value);
        maxB = Math.max(maxB, value);
      }
      if (maxA < minB || maxB < minA) return false;
    }
  }
  return true;
}

function estimatedWidth(text: string, fontSize: number, bold: boolean): number {
  return text.length * fontSize * (bold ? 0.6 : 0.56);
}

export function MetroMap({ network, route, suspended, penalty, includeBus }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; vx: number; vy: number; scale: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [box, setBox] = useState({ width: 640, height: 520 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const stationById = useMemo(
    () => new Map(network.stations.map((station) => [station.id, station])),
    [network],
  );
  const lineById = useMemo(() => new Map(network.lines.map((line) => [line.id, line])), [network]);
  const suspendedSet = useMemo(() => new Set(suspended), [suspended]);
  const routeStationIds = useMemo(() => new Set(route?.stationIds ?? []), [route]);
  const interchangeIds = useMemo(() => new Set(route?.interchangeStationIds ?? []), [route]);

  const terminals = useMemo(() => {
    const ids = new Set<string>();
    for (const line of network.lines) {
      if (line.stations.length === 0) continue;
      ids.add(line.stations[0]);
      ids.add(line.stations[line.stations.length - 1]);
    }
    return ids;
  }, [network]);

  const metroLines = network.lines.filter((line) => line.mode === "metro");
  const busLines = network.lines.filter((line) => line.mode === "bus");

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setBox({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = svgRef.current;
    if (!node) return;

    const handleWheel = (event: WheelEvent) => {
      // Plain wheel keeps scrolling the page; only Ctrl/Cmd + wheel zooms.
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const ctm = node.getScreenCTM();
      if (!ctm) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
      setView((current) => {
        const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
        const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k * factor));
        const px = (point.x - current.x) / current.k;
        const py = (point.y - current.y) / current.k;
        return { k, x: point.x - k * px, y: point.y - k * py };
      });
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, vx: view.x, vy: view.y, scale: ctm.a };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setView((current) => ({
      ...current,
      x: drag.vx + (event.clientX - drag.x) / drag.scale,
      y: drag.vy + (event.clientY - drag.y) / drag.scale,
    }));
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const pathFor = (ids: string[]) => {
    const points = ids.map((id) => stationById.get(id)).filter((station) => station !== undefined);
    if (points.length < 2) return "";
    return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  };

  const startStation = route?.stationIds.length ? stationById.get(route.stationIds[0]) : undefined;
  const endStation = route?.stationIds.length
    ? stationById.get(route.stationIds[route.stationIds.length - 1])
    : undefined;

  const zoomBy = (factor: number) =>
    setView((current) => ({
      ...current,
      k: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k * factor)),
    }));

  /**
   * Label placement.
   *
   * Labels keep a constant *screen* size (their font is divided by the zoom and
   * by the render scale), so zooming in makes them occupy less and less of the
   * map and more of them fit. Candidates are placed greedily by importance and
   * any label whose box would collide with an already placed one is skipped, so
   * the rendered set never overlaps itself.
   */
  const labels = useMemo(() => {
    const scale = Math.min(box.width / VIEW_W, box.height / VIEW_H) || 0.6;
    const targetPx = box.width < 480 ? 9 : 10.5;
    const baseFont = Math.max(4, targetPx / Math.max(scale * view.k, 0.05));
    const offsetFactor = baseFont / 15.5;

    const routeStart = route?.stationIds[0];
    const routeEnd = route?.stationIds[route.stationIds.length - 1];

    const priorityOf = (station: Station) => {
      if (station.id === routeStart || station.id === routeEnd) return 0;
      if (routeStationIds.has(station.id)) return 1;
      if (station.lines.length > 1) return 2;
      if (station.lines.some((lineId) => lineById.get(lineId)?.mode === "bus")) return 3;
      if (terminals.has(station.id)) return 4;
      return 5;
    };

    const candidates = network.stations
      .map((station) => ({ station, priority: priorityOf(station) }))
      .sort((a, b) => a.priority - b.priority || a.station.name.localeCompare(b.station.name));

    const placed: { station: Station; x: number; y: number; fontSize: number; important: boolean }[] = [];
    const quads: Point[][] = [];

    for (const { station, priority } of candidates) {
      const isRouteStation = routeStationIds.has(station.id) || station.id === routeStart || station.id === routeEnd;
      const important = priority <= 2;
      const fontSize = important ? baseFont * 1.08 : baseFont;
      const x = station.x + station.label.dx * offsetFactor;
      const y = station.y + station.label.dy * offsetFactor;
      const width = estimatedWidth(station.name, fontSize, important) + 4;
      const height = fontSize * 1.15 + 4;
      const quad = labelQuad(x, y, station.label.anchor, station.label.rotate, width, height);

      const outside = quad.some(
        ([px, py]) =>
          px < VIEW_X - 4 ||
          px > VIEW_X + VIEW_W + 4 ||
          py < VIEW_Y - 4 ||
          py > VIEW_Y + VIEW_H + 4,
      );
      if (outside && !isRouteStation) continue;
      if (quads.some((other) => quadsOverlap(other, quad))) {
        if (!isRouteStation) continue;
      }

      quads.push(quad);
      placed.push({ station, x, y, fontSize, important });
    }

    return placed;
  }, [network, box, view.k, lineById, terminals, route, routeStationIds]);

  const hoveredLabel = useMemo(() => {
    if (!hovered) return null;
    const station = stationById.get(hovered);
    if (!station) return null;
    if (labels.some((item) => item.station.id === hovered)) return null;

    const scale = Math.min(box.width / VIEW_W, box.height / VIEW_H) || 0.6;
    const targetPx = box.width < 480 ? 9 : 10.5;
    const baseFont = Math.max(4, targetPx / Math.max(scale * view.k, 0.05));
    const offsetFactor = baseFont / 15.5;
    const fontSize = baseFont * 1.08;
    const x = station.x + station.label.dx * offsetFactor;
    const y = station.y + station.label.dy * offsetFactor;
    return { station, x, y, fontSize, important: true };
  }, [hovered, stationById, labels, box, view.k]);

  return (
    <Card className="flex h-[440px] flex-col overflow-hidden sm:h-[520px] md:h-[560px] xl:h-[720px]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-300">Network map</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Drag to pan · ⌘/Ctrl + scroll to zoom in for more labels · {penalty} min interchange
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => zoomBy(1 / 1.25)}
            className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:text-slate-100"
            aria-label="Zoom out"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 10h10" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1.25)}
            className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:text-slate-100"
            aria-label="Zoom in"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 5v10M5 10h10" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setView({ x: 0, y: 0, k: 1 })}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-white/20 hover:text-slate-100"
          >
            Reset
          </button>
        </div>
      </div>

      <div ref={frameRef} className="relative min-h-0 flex-1">
        <svg
          ref={svgRef}
          viewBox={VIEW_BOX}
          preserveAspectRatio="xMidYMid meet"
          className={`h-full w-full touch-none select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          role="img"
          aria-label="Metro and bus network with the planned route highlighted"
        >
          <defs>
            <pattern id="dot-grid" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.1" fill="rgba(148,163,184,0.10)" />
            </pattern>
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="1000" height="940" fill="url(#dot-grid)" />

          <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
            {/* Bus routes sit under the metro so crossings read correctly. */}
            {busLines.map((line) => {
              const off = suspendedSet.has(line.id) || !includeBus;
              return (
                <path
                  key={line.id}
                  d={pathFor(line.stations)}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="11 9"
                  opacity={off ? 0.13 : 0.85}
                />
              );
            })}

            {metroLines.map((line) => {
              const off = suspendedSet.has(line.id);
              return (
                <g key={line.id} opacity={off ? 0.16 : 1}>
                  <path
                    d={pathFor(line.stations)}
                    fill="none"
                    stroke="#05080d"
                    strokeWidth={13}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={pathFor(line.stations)}
                    fill="none"
                    stroke={line.color}
                    strokeWidth={7.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={off ? "7 8" : undefined}
                  />
                </g>
              );
            })}

            {route && route.legs.length > 0 ? (
              <g>
                <path
                  d={pathFor(route.stationIds)}
                  fill="none"
                  stroke="#f8fafc"
                  strokeOpacity={0.16}
                  strokeWidth={15}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#route-glow)"
                />
                {route.legs.map((leg, index) => (
                  <path
                    key={`${leg.line}-${index}`}
                    d={pathFor(leg.stationIds)}
                    fill="none"
                    stroke={leg.color}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                <path
                  className="route-flow"
                  d={pathFor(route.stationIds)}
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity={0.7}
                  strokeWidth={1.8}
                  strokeDasharray="2 26"
                  strokeLinecap="round"
                />
              </g>
            ) : null}

            {/* Vertices */}
            {network.stations.map((station) => {
              const onRoute = routeStationIds.has(station.id);
              const interchange = station.lines.length > 1;
              const color = lineById.get(station.lines[0])?.color ?? "#94a3b8";
              const isInterchangeOnRoute = interchangeIds.has(station.id);
              return (
                <g
                  key={station.id}
                  onPointerEnter={() => setHovered(station.id)}
                  onPointerLeave={() => setHovered((current) => (current === station.id ? null : current))}
                >
                  <title>
                    {`${station.name} — ${station.lines.length} line${station.lines.length === 1 ? "" : "s"}`}
                  </title>
                  <circle cx={station.x} cy={station.y} r={11} fill="transparent" />
                  {onRoute && !interchange ? (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={9}
                      fill="none"
                      stroke="#f8fafc"
                      strokeOpacity={0.35}
                      strokeWidth={2.5}
                    />
                  ) : null}
                  {isInterchangeOnRoute ? (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={12}
                      fill="none"
                      stroke="#f8fafc"
                      strokeOpacity={0.5}
                      strokeWidth={2.5}
                    />
                  ) : null}
                  {interchange ? (
                    <>
                      <circle cx={station.x} cy={station.y} r={7} fill="#0a0f16" stroke="#e2e8f0" strokeWidth={3} />
                      <circle cx={station.x} cy={station.y} r={2.4} fill="#e2e8f0" />
                    </>
                  ) : (
                    <circle cx={station.x} cy={station.y} r={4.6} fill="#0a0f16" stroke={color} strokeWidth={2.8} />
                  )}
                </g>
              );
            })}

            {/* Labels (already de-collided) */}
            {labels.map(({ station, x, y, fontSize, important }) => (
              <text
                key={`label-${station.id}`}
                x={x}
                y={y}
                textAnchor={station.label.anchor}
                transform={`rotate(${station.label.rotate} ${x} ${y})`}
                fontSize={fontSize}
                fontWeight={important ? 600 : 450}
                fill={important ? "#f1f5f9" : "#a8b3c2"}
                stroke="#070a10"
                strokeWidth={fontSize * 0.2}
                strokeLinejoin="round"
                paintOrder="stroke"
                pointerEvents="none"
              >
                {station.name}
              </text>
            ))}

            {/* Hovered station label if not already placed */}
            {hoveredLabel ? (
              <text
                key={`label-hover-${hoveredLabel.station.id}`}
                x={hoveredLabel.x}
                y={hoveredLabel.y}
                textAnchor={hoveredLabel.station.label.anchor}
                transform={`rotate(${hoveredLabel.station.label.rotate} ${hoveredLabel.x} ${hoveredLabel.y})`}
                fontSize={hoveredLabel.fontSize}
                fontWeight={650}
                fill="#38bdf8"
                stroke="#070a10"
                strokeWidth={hoveredLabel.fontSize * 0.25}
                strokeLinejoin="round"
                paintOrder="stroke"
                pointerEvents="none"
              >
                {hoveredLabel.station.name}
              </text>
            ) : null}

            {/* Journey endpoints */}
            {startStation ? (
              <g pointerEvents="none">
                <circle cx={startStation.x} cy={startStation.y} r={10} fill="#080c12" stroke="#34d399" strokeWidth={3.5} />
                <circle cx={startStation.x} cy={startStation.y} r={3.2} fill="#34d399" />
              </g>
            ) : null}
            {endStation ? (
              <g pointerEvents="none">
                <circle cx={endStation.x} cy={endStation.y} r={10} fill="#080c12" stroke="#fb7185" strokeWidth={3.5} />
                <circle cx={endStation.x} cy={endStation.y} r={3.2} fill="#fb7185" />
              </g>
            ) : null}
          </g>
        </svg>

        {!route ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <p className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] text-slate-400">
              Pick two stations to highlight a route
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t border-white/[0.06] px-4 py-2.5">
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-600">Metro</span>
        {metroLines.map((line) => {
          const off = suspendedSet.has(line.id);
          return (
            <span
              key={line.id}
              className={`inline-flex items-center gap-1.5 text-[11px] ${off ? "text-slate-600" : "text-slate-400"}`}
            >
              <span className="h-[3px] w-4 rounded-full" style={{ background: off ? "#475569" : line.color }} />
              <span className={off ? "line-through decoration-slate-600" : ""}>{line.name}</span>
            </span>
          );
        })}
        <span className="ml-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-600">Bus</span>
        {busLines.map((line) => {
          const off = suspendedSet.has(line.id) || !includeBus;
          return (
            <span
              key={line.id}
              className={`inline-flex items-center gap-1.5 text-[11px] ${off ? "text-slate-600" : "text-slate-400"}`}
            >
              <span
                className="w-4 border-t-2 border-dashed"
                style={{ borderColor: off ? "#475569" : line.color }}
              />
              <span className={off ? "line-through decoration-slate-600" : ""}>{line.name}</span>
            </span>
          );
        })}
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-200 bg-[#0a0f16]" />
          interchange
        </span>
      </div>
    </Card>
  );
}
