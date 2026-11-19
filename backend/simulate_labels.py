import json
import math
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parent / "data" / "network.json"
network = json.loads(DATA_FILE.read_text(encoding="utf-8"))
stations = network["stations"]
lines = network["lines"]

def label_quad(x, y, anchor, angle, width, height):
    left = 0 if anchor == "start" else (-width if anchor == "end" else -width / 2)
    top = -height * 0.75
    rad = math.radians(angle)
    c = math.cos(rad)
    s = math.sin(rad)
    corners = [
        [left, top],
        [left + width, top],
        [left + width, top + height],
        [left, top + height],
    ]
    return [[x + lx * c - ly * s, y + lx * s + ly * c] for lx, ly in corners]

def quads_overlap(a, b):
    for quad in [a, b]:
        for i in range(len(quad)):
            x1, y1 = quad[i]
            x2, y2 = quad[(i + 1) % len(quad)]
            ax = y1 - y2
            ay = x2 - x1
            length = math.hypot(ax, ay) or 1
            nx = ax / length
            ny = ay / length
            minA = min(px * nx + py * ny for px, py in a)
            maxA = max(px * nx + py * ny for px, py in a)
            minB = min(px * nx + py * ny for px, py in b)
            maxB = max(px * nx + py * ny for px, py in b)
            if maxA < minB or maxB < minA:
                return False
    return True

def estimated_width(text, font_size, bold):
    return len(text) * font_size * (0.6 if bold else 0.56)

VIEW_X = 20
VIEW_Y = 20
VIEW_W = 970
VIEW_H = 860

def run_simulation(box_w, box_h, zoom=1.0, route_ids=None):
    if route_ids is None:
        route_ids = ["karol-bagh", "jhandewalan", "ramakrishna-ashram-marg", "rajiv-chowk", "mandi-house", "khan-market", "lajpat-nagar"]
    route_station_set = set(route_ids)
    route_start = route_ids[0] if route_ids else None
    route_end = route_ids[-1] if route_ids else None

    scale = min(box_w / VIEW_W, box_h / VIEW_H) or 0.6
    target_px = 9.0 if box_w < 480 else 10.5
    base_font = max(4.0, target_px / max(scale * zoom, 0.05))
    offset_factor = base_font / 15.5

    terminals = set()
    for l in lines:
        if l["stations"]:
            terminals.add(l["stations"][0])
            terminals.add(l["stations"][-1])

    line_by_id = {l["id"]: l for l in lines}

    def priority_of(st):
        sid = st["id"]
        # Elevated active route stations:
        if sid == route_start or sid == route_end:
            return 0
        if sid in route_station_set:
            return 1
        if len(st["lines"]) > 1:
            return 2
        if any(line_by_id[lid]["mode"] == "bus" for lid in st["lines"]):
            return 3
        if sid in terminals:
            return 4
        return 5

    candidates = sorted(stations, key=lambda st: (priority_of(st), st["name"]))

    placed = []
    dropped = []
    quads = []

    KEY_STATIONS = {"rajiv-chowk", "mandi-house", "new-delhi", "pitampura", "noida-city-centre"}

    for st in candidates:
        prio = priority_of(st)
        is_route = st["id"] in route_station_set
        important = prio <= 2
        font_size = base_font * 1.08 if important else base_font
        lbl = st["label"]
        x = st["x"] + lbl["dx"] * offset_factor
        y = st["y"] + lbl["dy"] * offset_factor
        w = estimated_width(st["name"], font_size, important) + 4
        h = font_size * 1.15 + 4
        quad = label_quad(x, y, lbl["anchor"], lbl["rotate"], w, h)

        outside = any(px < VIEW_X - 4 or px > VIEW_X + VIEW_W + 4 or py < VIEW_Y - 4 or py > VIEW_Y + VIEW_H + 4 for px, py in quad)
        if outside:
            dropped.append((st["name"], st["id"], "outside", prio))
            continue
        collided = None
        for other_quad, other_name in quads:
            if quads_overlap(other_quad, quad):
                collided = other_name
                break
        if collided:
            if is_route:
                # Active route station: never drop!
                quads.append((quad, st["name"]))
                placed.append((st["name"], st["id"], prio))
            else:
                dropped.append((st["name"], st["id"], f"collided with {collided}", prio))
                continue
        else:
            quads.append((quad, st["name"]))
            placed.append((st["name"], st["id"], prio))

    print(f"Viewport ({box_w}x{box_h}), zoom={zoom}: Placed {len(placed)}/{len(stations)} labels.")
    dropped_keys = [d for d in dropped if d[1] in KEY_STATIONS]
    if dropped_keys:
        print(f"  WARNING: Dropped key stations: {dropped_keys}")
    else:
        print("  Key stations (Rajiv Chowk, Mandi House, New Delhi, Pitampura, Noida City Centre) all PLACED!")

if __name__ == "__main__":
    print("--- Testing at 1280x800 container (552x628) ---")
    run_simulation(552, 628, 1.0)
    print("--- Testing at 1920x1080 container (772x628) ---")
    run_simulation(772, 628, 1.0)
