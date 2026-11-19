import type { Station } from "../types";

interface Props {
  label: string;
  value: string;
  stations: Station[];
  onChange: (stationId: string) => void;
}

export function StationSelect({ label, value, stations, onChange }: Props) {
  const sorted = [...stations].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="relative">
        <select
          className="field pr-9"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {sorted.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
}
