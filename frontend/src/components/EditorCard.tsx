import { useEffect, useState } from "react";
import type { AddStationInput } from "../lib/network";
import type { Network } from "../types";
import { Card, SectionTitle, Switch } from "./ui";

interface Props {
  network: Network;
  suspended: string[];
  modified: boolean;
  notice: string | null;
  onToggleLine: (lineId: string) => void;
  onAddStation: (input: AddStationInput) => void;
  onRemoveStation: (stationId: string) => void;
  onReset: () => void;
}

export function EditorCard({
  network,
  suspended,
  modified,
  notice,
  onToggleLine,
  onAddStation,
  onRemoveStation,
  onReset,
}: Props) {
  const [name, setName] = useState("");
  const [lineId, setLineId] = useState(network.lines[0]?.id ?? "");
  const [afterId, setAfterId] = useState("");
  const [removeId, setRemoveId] = useState("");

  const activeLine = network.lines.find((line) => line.id === lineId) ?? network.lines[0];

  useEffect(() => {
    if (!activeLine) return;
    if (!activeLine.stations.includes(afterId)) {
      setAfterId(activeLine.stations[0] ?? "");
    }
  }, [activeLine, afterId]);

  const stationName = (id: string) =>
    network.stations.find((station) => station.id === id)?.name ?? id;

  return (
    <Card className="p-4 sm:p-5">
      <SectionTitle
        title="Edit the network"
        subtitle="Mutate the graph and watch the algorithms react."
        right={
          modified ? (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost px-2.5 py-1 text-[11px]"
            >
              Reset
            </button>
          ) : null
        }
      />

      <div className="mt-4">
        <h3 className="label">Lines</h3>
        <ul className="space-y-1">
          {network.lines.map((line) => {
            const active = !suspended.includes(line.id);
            return (
              <li key={line.id} className="flex items-center gap-2 rounded-lg px-1 py-1">
                <span className="h-2 w-2 rounded-full" style={{ background: active ? line.color : "#475569" }} />
                <span className={`text-[12px] ${active ? "text-slate-300" : "text-slate-500 line-through"}`}>
                  {line.name}
                </span>
                <span className="rounded border border-white/10 px-1 font-mono text-[8.5px] uppercase tracking-wide text-slate-500">
                  {line.mode}
                </span>
                <span className="font-mono text-[10px] text-slate-600">{line.stations.length}</span>
                <div className="ml-auto">
                  <Switch
                    checked={active}
                    onChange={() => onToggleLine(line.id)}
                    label={`${active ? "Suspend" : "Restore"} ${line.name}`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <form
        className="mt-4 border-t border-white/[0.06] pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim() || !activeLine) return;
          onAddStation({ name, lineId: activeLine.id, afterId });
          setName("");
        }}
      >
        <h3 className="label">Add a station</h3>
        <input
          className="field"
          placeholder="New station name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <select
            className="field px-2.5 py-2 text-[12px]"
            value={lineId}
            onChange={(event) => setLineId(event.target.value)}
            aria-label="Line for the new station"
          >
            {network.lines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
          <select
            className="field px-2.5 py-2 text-[12px]"
            value={afterId}
            onChange={(event) => setAfterId(event.target.value)}
            aria-label="Insert after station"
          >
            {activeLine?.stations.map((id) => (
              <option key={id} value={id}>
                after {stationName(id)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-2 w-full py-1.5 text-[12px]" disabled={!name.trim()}>
          Insert into line
        </button>
      </form>

      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <h3 className="label">Remove a station</h3>
        <div className="flex gap-2">
          <select
            className="field px-2.5 py-2 text-[12px]"
            value={removeId}
            onChange={(event) => setRemoveId(event.target.value)}
            aria-label="Station to remove"
          >
            <option value="">Select a station…</option>
            {[...network.stations]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
          </select>
          <button
            type="button"
            className="btn btn-danger shrink-0 px-3 py-2 text-[12px]"
            disabled={!removeId}
            onClick={() => {
              if (!removeId) return;
              onRemoveStation(removeId);
              setRemoveId("");
            }}
          >
            Delete
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
          Deleting a vertex deletes its incident edges — try removing Yamuna Bank to split the Blue Line.
        </p>
      </div>

      {notice ? (
        <p className="mt-3 rounded-lg border border-white/[0.06] bg-black/25 px-2.5 py-2 text-[11.5px] text-slate-400">
          {notice}
        </p>
      ) : null}
    </Card>
  );
}
