"""Generate data/network.json.

The dataset is a curated excerpt of four Delhi Metro lines plus three city bus
routes that feed them (59 stations). Station coordinates are schematic (a
metro-map style layout, not geography); travel times are typical off-peak
minutes between adjacent stops.

Run from the repository root:

    python backend/data/build_dataset.py
"""

from __future__ import annotations

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent

# (station id, display name, x, y) in line order, plus minutes per segment.
LINES = [
    {
        "id": "yellow",
        "name": "Yellow Line",
        "color": "#F5C43C",
        "mode": "metro",
        "label": {"dx": -13, "dy": 4, "anchor": "end", "rotate": 0},
        "stations": [
            ("azadpur", "Azadpur", 470, 90),
            ("model-town", "Model Town", 470, 140),
            ("gtb-nagar", "GTB Nagar", 470, 190),
            ("vishwavidyalaya", "Vishwavidyalaya", 470, 240),
            ("civil-lines", "Civil Lines", 470, 290),
            ("kashmere-gate", "Kashmere Gate", 470, 340),
            ("chandni-chowk", "Chandni Chowk", 470, 390),
            ("new-delhi", "New Delhi", 470, 440),
            ("rajiv-chowk", "Rajiv Chowk", 470, 520),
            ("central-secretariat", "Central Secretariat", 470, 590),
            ("ina", "INA", 470, 650),
            ("aiims", "AIIMS", 470, 710),
            ("green-park", "Green Park", 470, 770),
            ("hauz-khas", "Hauz Khas", 470, 830),
        ],
        "times": [3, 2, 2, 3, 2, 2, 3, 3, 2, 3, 2, 3, 3],
    },
    {
        "id": "blue",
        "name": "Blue Line",
        "color": "#3B8BE0",
        "mode": "metro",
        "label": {"dx": 7, "dy": 15, "anchor": "start", "rotate": -42},
        "stations": [
            ("janakpuri-west", "Janakpuri West", 70, 520),
            ("tilak-nagar", "Tilak Nagar", 110, 520),
            ("tagore-garden", "Tagore Garden", 150, 520),
            ("rajouri-garden", "Rajouri Garden", 190, 520),
            ("moti-nagar", "Moti Nagar", 230, 520),
            ("kirti-nagar", "Kirti Nagar", 270, 520),
            ("patel-nagar", "Patel Nagar", 310, 520),
            ("karol-bagh", "Karol Bagh", 350, 520),
            ("jhandewalan", "Jhandewalan", 390, 520),
            ("ramakrishna-ashram-marg", "Ramakrishna Ashram Marg", 430, 520),
            ("rajiv-chowk", "Rajiv Chowk", 470, 520),
            ("barakhamba-road", "Barakhamba Road", 510, 520),
            ("mandi-house", "Mandi House", 550, 520),
            ("supreme-court", "Supreme Court", 590, 520),
            ("indraprastha", "Indraprastha", 630, 520),
            ("yamuna-bank", "Yamuna Bank", 670, 520),
            ("akshardham", "Akshardham", 710, 520),
            ("mayur-vihar-1", "Mayur Vihar-I", 750, 520),
            ("noida-sector-18", "Noida Sector 18", 790, 520),
            ("botanical-garden", "Botanical Garden", 830, 520),
            ("noida-city-centre", "Noida City Centre", 870, 520),
        ],
        "times": [3, 2, 2, 2, 3, 2, 3, 2, 2, 3, 2, 2, 3, 2, 3, 4, 3, 3, 3, 3],
    },
    {
        "id": "red",
        "name": "Red Line",
        "color": "#E2564B",
        "mode": "metro",
        # The north-west stretch is diagonal, so labels run parallel to it.
        "label": {"dx": 8, "dy": -8, "anchor": "start", "rotate": 45},
        "stations": [
            ("rithala", "Rithala", 90, 60),
            ("pitampura", "Pitampura", 150, 120),
            ("netaji-subhash-place", "Netaji Subhash Place", 210, 180),
            ("keshav-puram", "Keshav Puram", 270, 235),
            ("inderlok", "Inderlok", 330, 285),
            ("shastri-nagar", "Shastri Nagar", 380, 310),
            ("tis-hazari", "Tis Hazari", 425, 325),
            ("kashmere-gate", "Kashmere Gate", 470, 340),
            ("shastri-park", "Shastri Park", 540, 345),
            ("seelampur", "Seelampur", 610, 345),
            ("welcome", "Welcome", 670, 335),
            ("shahdara", "Shahdara", 740, 325),
            ("dilshad-garden", "Dilshad Garden", 810, 315),
        ],
        "times": [3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3],
    },
    {
        "id": "violet",
        "name": "Violet Line",
        "color": "#9B6BE0",
        "mode": "metro",
        "label": {"dx": 13, "dy": 5, "anchor": "start", "rotate": 0},
        "stations": [
            ("kashmere-gate", "Kashmere Gate", 470, 340),
            ("lal-qila", "Lal Qila", 500, 375),
            ("jama-masjid", "Jama Masjid", 520, 405),
            ("delhi-gate", "Delhi Gate", 540, 435),
            ("ito", "ITO", 550, 470),
            ("mandi-house", "Mandi House", 550, 520),
            ("khan-market", "Khan Market", 600, 570),
            ("lajpat-nagar", "Lajpat Nagar", 645, 615),
            ("moolchand", "Moolchand", 690, 660),
            ("nehru-place", "Nehru Place", 735, 700),
            ("kalkaji-mandir", "Kalkaji Mandir", 780, 740),
            ("govindpuri", "Govindpuri", 825, 780),
            ("badarpur-border", "Badarpur Border", 880, 845),
        ],
        "times": [2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4],
    },
    # --- Bus routes -------------------------------------------------------
    # Buses reuse the metro stations they serve and add two bus-only stops, so
    # a bus stop on a line is just another vertex in the same graph.
    {
        "id": "bus-522",
        "name": "Bus 522",
        "color": "#3DDC97",
        "mode": "bus",
        "label": {"dx": 14, "dy": 4, "anchor": "start", "rotate": 0},
        "stations": [
            ("janakpuri-west", "Janakpuri West", 70, 520),
            ("ashok-vihar", "Ashok Vihar", 110, 320),
            ("pitampura", "Pitampura", 150, 120),
        ],
        "times": [10, 12],
    },
    {
        "id": "bus-433",
        "name": "Bus 433",
        "color": "#FF9F45",
        "mode": "bus",
        "label": {"dx": 0, "dy": 19, "anchor": "middle", "rotate": 0},
        "stations": [
            ("hauz-khas", "Hauz Khas", 470, 830),
            ("greater-kailash", "Greater Kailash", 570, 790),
            ("nehru-place", "Nehru Place", 735, 700),
        ],
        "times": [7, 8],
    },
    {
        "id": "bus-405",
        "name": "Bus 405",
        "color": "#FF6FA5",
        "mode": "bus",
        "label": {"dx": 13, "dy": 20, "anchor": "start", "rotate": 0},
        "stations": [
            ("karol-bagh", "Karol Bagh", 350, 520),
            ("new-delhi", "New Delhi", 470, 440),
            ("ito", "ITO", 550, 470),
            ("lajpat-nagar", "Lajpat Nagar", 645, 615),
        ],
        "times": [8, 7, 9],
    },
]

# Interchange labels need bespoke placement because two or three lines meet there.
OVERRIDES = {
    "greater-kailash": {"dx": 0, "dy": 20, "anchor": "middle", "rotate": 0},
    "pitampura": {"dx": -14, "dy": 4, "anchor": "end", "rotate": 0},
    "badarpur-border": {"dx": -14, "dy": 10, "anchor": "end", "rotate": 0},
    "kashmere-gate": {"dx": -17, "dy": 17, "anchor": "end", "rotate": 0},
    "rajiv-chowk": {"dx": 17, "dy": -13, "anchor": "start", "rotate": 0},
    "mandi-house": {"dx": 15, "dy": 14, "anchor": "start", "rotate": 0},
    "new-delhi": {"dx": -13, "dy": -14, "anchor": "end", "rotate": 0},
    "ito": {"dx": 13, "dy": 2, "anchor": "start", "rotate": 0},
    "ramakrishna-ashram-marg": {"dx": 8, "dy": 15, "anchor": "start", "rotate": 45},
}


def build() -> dict:
    stations: dict[str, dict] = {}
    station_order: list[str] = []
    line_records: list[dict] = []
    edges: list[dict] = []
    seen_pairs: set[tuple[str, str]] = set()

    for line in LINES:
        stops = line["stations"]
        times = line["times"]
        assert len(times) == len(stops) - 1, f"{line['id']}: need {len(stops) - 1} times"

        for index, (sid, name, x, y) in enumerate(stops):
            station = stations.get(sid)
            if station is None:
                station = {
                    "id": sid,
                    "name": name,
                    "x": x,
                    "y": y,
                    "lines": [],
                    "label": OVERRIDES.get(sid) or dict(line["label"]),
                }
                stations[sid] = station
                station_order.append(sid)
            station["lines"].append(line["id"])
            if sid in OVERRIDES:
                station["label"] = OVERRIDES[sid]

        # Red line labels east of Kashmere Gate are staggered so long names fit.
        for index, (sid, _name, x, _y) in enumerate(stops):
            if line["id"] == "red" and x > 500:
                stations[sid]["label"] = {
                    "dx": 0,
                    "dy": -14 if index % 2 else -30,
                    "anchor": "middle",
                    "rotate": 0,
                }

        for index, minutes in enumerate(times):
            a = stops[index][0]
            b = stops[index + 1][0]
            key = (a, b) if a < b else (b, a)
            if key in seen_pairs:
                continue
            seen_pairs.add(key)
            edges.append({"a": a, "b": b, "line": line["id"], "minutes": minutes})

        line_records.append(
            {
                "id": line["id"],
                "name": line["name"],
                "color": line["color"],
                "mode": line["mode"],
                "stations": [s[0] for s in stops],
            }
        )

    return {
        "name": "Delhi Metro + city buses",
        "lines": line_records,
        "stations": [stations[sid] for sid in station_order],
        "edges": edges,
    }


if __name__ == "__main__":
    data = build()
    target = HERE / "network.json"
    target.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {target} — {len(data['stations'])} stations, {len(data['edges'])} edges, "
          f"{len(data['lines'])} lines")
