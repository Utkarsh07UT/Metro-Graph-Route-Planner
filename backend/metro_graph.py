"""The discrete-maths core of the project.

Everything graph-theoretic is implemented by hand here — nothing is delegated
to NetworkX — so each step can be explained line by line in the report:

* **Graph representation** — an adjacency list, ``dict[str, dict[str, tuple]]``:
  ``adj[a][b] = (minutes, line)``. A dict of dicts gives O(1) neighbour lookup,
  O(V + E) storage, and carries the two attributes an edge needs (weight and
  line). An adjacency matrix would waste 57 x 57 = 3249 cells on 60 edges and
  could not store a line label per edge.
* **BFS** — fewest stops on the *unweighted* station graph.
* **Dijkstra** — shortest time on the *weighted* graph. Interchanges are handled
  by expanding the graph into states ``(station, line)``; moving between two
  lines at one station costs the interchange penalty.
* **Connectivity** — connected components by BFS.
* **Vertex degrees** — degree of every station (interchanges have high degree).
* **Articulation points** — Tarjan's low-link DFS: stations whose removal
  disconnects the network.
"""

from __future__ import annotations

import heapq
from collections import deque

from models import (
    MODE_LABELS,
    MODES,
    Analysis,
    CriticalStation,
    DegreeRow,
    Leg,
    Mode,
    Network,
    Route,
    StationRef,
    Summary,
)

#: Fare slabs modelled on the Delhi Metro's distance-based bands. We use the
#: number of stops as a proxy for distance, which keeps the fare explainable:
#: (max stops in band, fare in rupees).
FARE_BANDS: tuple[tuple[int | None, int], ...] = (
    (2, 10),
    (5, 20),
    (9, 30),
    (14, 40),
    (19, 50),
    (None, 60),
)

#: Flat bus ticket per bus leg (a change of bus needs a second ticket).
BUS_FARE = 15


class GraphError(Exception):
    """Raised when a request refers to a station that is not in the network."""


def estimate_fare(stops: int) -> tuple[int, str]:
    """Return (metro fare in rupees, human readable band) for `stops` stops."""
    previous = 0
    for limit, fare in FARE_BANDS:
        if limit is None:
            return fare, f"{previous + 1}+ stops"
        if stops <= limit:
            band = f"{previous}–{limit} stops" if previous else f"0–{limit} stops"
            return fare, band
        previous = limit
    return FARE_BANDS[-1][1], "full network"  # pragma: no cover


def journey_fare(metro_stops: int, bus_legs: int) -> tuple[int, str]:
    """Metro slabs by stop count, plus one flat bus ticket per bus leg."""
    bus_fare = BUS_FARE * bus_legs
    if metro_stops > 0:
        metro_fare, band = estimate_fare(metro_stops)
    else:
        metro_fare, band = 0, ""

    if bus_legs and metro_stops:
        return metro_fare + bus_fare, f"₹{metro_fare} metro ({band}) + ₹{bus_fare} bus"
    if bus_legs:
        ticket = "ticket" if bus_legs == 1 else "tickets"
        return bus_fare, f"₹{bus_fare} bus · {bus_legs} {ticket}"
    return metro_fare, band


def _round(value: float) -> float:
    return round(value, 1)


class MetroGraph:
    """A weighted, undirected, line-labelled graph built from a network payload."""

    def __init__(self, network: Network) -> None:
        self.network = network
        self.stations = {station.id: station for station in network.stations}
        self.lines = {line.id: line for line in network.lines}
        self.station_ids = [station.id for station in network.stations]

        # Adjacency list. Parallel edges are not part of the dataset, so the
        # first edge between two stations wins.
        self.adj: dict[str, dict[str, tuple[float, str]]] = {
            station_id: {} for station_id in self.station_ids
        }
        self.lines_at: dict[str, set[str]] = {station_id: set() for station_id in self.station_ids}

        for edge in network.edges:
            if edge.a not in self.adj or edge.b not in self.adj or edge.a == edge.b:
                continue
            if edge.b in self.adj[edge.a]:
                continue
            weight = float(edge.minutes)
            self.adj[edge.a][edge.b] = (weight, edge.line)
            self.adj[edge.b][edge.a] = (weight, edge.line)
            self.lines_at[edge.a].add(edge.line)
            self.lines_at[edge.b].add(edge.line)

    # ------------------------------------------------------------------ basics

    def name(self, station_id: str) -> str:
        station = self.stations.get(station_id)
        return station.name if station else station_id

    def edge_count(self) -> int:
        return sum(len(neighbours) for neighbours in self.adj.values()) // 2

    def names(self, station_ids: Iterable[str]) -> list[str]:
        return [self.name(station_id) for station_id in station_ids]

    def _require(self, *station_ids: str) -> None:
        for station_id in station_ids:
            if station_id not in self.adj:
                raise GraphError(f"Unknown station: {station_id}")

    # ----------------------------------------------------- BFS: fewest stops

    def bfs_fewest_stops(self, source: str, target: str) -> list[str] | None:
        """Breadth-first search over the unweighted station graph.

        Layer by layer, BFS records the minimum number of edges (stops) needed to
        reach every station: O(V + E). Several paths can share that hop count,
        and BFS alone is indifferent between them, so a second pass runs Dijkstra
        over the BFS DAG — only edges that move exactly one layer outwards — and
        picks the quickest of the minimum-stop paths. The result is
        lexicographic: fewest stops first, then least travel time.
        """
        distance: dict[str, int] = {source: 0}
        queue: deque[str] = deque([source])

        while queue:
            station = queue.popleft()
            # Sorted neighbours keep tie-breaking deterministic.
            for neighbour in sorted(self.adj[station]):
                if neighbour not in distance:
                    distance[neighbour] = distance[station] + 1
                    queue.append(neighbour)

        if target not in distance:
            return None
        if target == source:
            return [source]

        best: dict[str, float] = {source: 0.0}
        parent: dict[str, str | None] = {source: None}

        for hop in range(distance[target]):
            layer = sorted(station for station, depth in distance.items() if depth == hop)
            for station in layer:
                for neighbour, (weight, _line) in self.adj[station].items():
                    if distance.get(neighbour) != hop + 1:
                        continue
                    candidate = best[station] + weight
                    if neighbour not in best or candidate < best[neighbour]:
                        best[neighbour] = candidate
                        parent[neighbour] = station

        return self._walk_back(parent, target)

    @staticmethod
    def _walk_back(parent: dict[str, str | None], target: str) -> list[str]:
        path: list[str] = []
        cursor: str | None = target
        while cursor is not None:
            path.append(cursor)
            cursor = parent[cursor]
        path.reverse()
        return path

    # --------------------------------------- Dijkstra: time / interchanges

    @staticmethod
    def _key(objective: Mode, minutes: float, interchanges: int, stops: int) -> tuple[float, ...]:
        """Lexicographic priority for the heap.

        * ``shortest_time``: minimise minutes, then interchanges, then stops.
        * ``fewest_interchanges``: minimise interchanges, then minutes, then stops.
        """
        if objective == "fewest_interchanges":
            return (interchanges, minutes, stops)
        return (minutes, interchanges, stops)

    def dijkstra(
        self,
        source: str,
        target: str,
        objective: Mode = "shortest_time",
        penalty: float = 5.0,
    ) -> list[tuple[str, str]] | None:
        """Dijkstra over the state graph ``(station, line)``.

        States remember which line the traveller is on, so changing line at a
        station can be charged: the transfer edge costs `penalty` minutes and
        one interchange, while a ride edge costs the segment's travel time.
        Complexities: O((V' + E') log V') with V' <= 2V, E' <= E + 2V.
        """
        if not self.lines_at[source] or not self.lines_at[target]:
            return None

        key = self._key
        objective_key = lambda minutes, interchanges, stops: key(  # noqa: E731
            objective, minutes, interchanges, stops
        )

        best: dict[tuple[str, str], tuple[float, ...]] = {}
        parent: dict[tuple[str, str], tuple[str, str] | None] = {}
        heap: list[tuple[tuple[float, ...], tuple[str, str], float, int, int]] = []

        for line in sorted(self.lines_at[source]):
            state = (source, line)
            priority = objective_key(0.0, 0, 0)
            best[state] = priority
            parent[state] = None
            heapq.heappush(heap, (priority, state, 0.0, 0, 0))

        while heap:
            priority, state, minutes, interchanges, stops = heapq.heappop(heap)
            if priority != best.get(state):
                continue
            station, line = state
            if station == target:
                return self._walk_back_states(parent, state)

            # Ride one edge of the same line.
            for neighbour, (weight, edge_line) in self.adj[station].items():
                if edge_line != line:
                    continue
                next_state = (neighbour, line)
                next_minutes = minutes + weight
                next_interchanges = interchanges
                next_stops = stops + 1
                next_priority = objective_key(next_minutes, next_interchanges, next_stops)
                if next_state not in best or next_priority < best[next_state]:
                    best[next_state] = next_priority
                    parent[next_state] = state
                    heapq.heappush(
                        heap,
                        (next_priority, next_state, next_minutes, next_interchanges, next_stops),
                    )

            # Change line at this station: pay the penalty, count an interchange.
            for other_line in sorted(self.lines_at[station]):
                if other_line == line:
                    continue
                next_state = (station, other_line)
                next_minutes = minutes + penalty
                next_interchanges = interchanges + 1
                next_priority = objective_key(next_minutes, next_interchanges, stops)
                if next_state not in best or next_priority < best[next_state]:
                    best[next_state] = next_priority
                    parent[next_state] = state
                    heapq.heappush(
                        heap,
                        (next_priority, next_state, next_minutes, next_interchanges, stops),
                    )

        return None

    @staticmethod
    def _walk_back_states(
        parent: dict[tuple[str, str], tuple[str, str] | None],
        target: tuple[str, str],
    ) -> list[tuple[str, str]]:
        states: list[tuple[str, str]] = []
        cursor: tuple[str, str] | None = target
        while cursor is not None:
            states.append(cursor)
            cursor = parent[cursor]
        states.reverse()
        return states

    # ------------------------------------------------------------- legs/routes

    def _legs_from_path(self, path: list[str]) -> list[tuple[str, list[str]]]:
        """Group a station path into legs, one per line used."""
        legs: list[tuple[str, list[str]]] = []
        current_line: str | None = None
        ids: list[str] = [path[0]]

        for previous, current in zip(path, path[1:]):
            weight_and_line = self.adj[previous].get(current)
            if weight_and_line is None:
                raise GraphError(f"No edge between {previous} and {current}")
            line = weight_and_line[1]
            if current_line is None:
                current_line = line
            elif line != current_line:
                legs.append((current_line, ids))
                ids = [previous]
                current_line = line
            ids.append(current)

        if current_line is not None and len(ids) >= 2:
            legs.append((current_line, ids))
        return legs

    def _legs_from_states(self, states: list[tuple[str, str]]) -> list[tuple[str, list[str]]]:
        """Group a state path into legs; a transfer is a repeated station."""
        legs: list[tuple[str, list[str]]] = []
        current_line = states[0][1]
        ids: list[str] = [states[0][0]]

        for (previous_station, _), (station, line) in zip(states, states[1:]):
            if station == previous_station:  # transfer at the same vertex
                if len(ids) >= 2:
                    legs.append((current_line, ids))
                ids = [station]
                current_line = line
            else:
                ids.append(station)

        if len(ids) >= 2:
            legs.append((current_line, ids))
        return legs

    def _build_route(
        self,
        mode: Mode,
        path: list[str],
        legs: list[tuple[str, list[str]]],
        penalty: float,
    ) -> Route:
        ride_minutes = 0.0
        for a, b in zip(path, path[1:]):
            if a == b:
                continue
            ride_minutes += self.adj[a][b][0]

        stops = len(path) - 1
        interchanges = max(0, len(legs) - 1)
        minutes = ride_minutes + interchanges * penalty

        leg_models = []
        for line_id, station_ids in legs:
            line = self.lines.get(line_id)
            leg_minutes = sum(
                self.adj[a][b][0] for a, b in zip(station_ids, station_ids[1:])
            )
            leg_models.append(
                Leg(
                    line=line_id,
                    line_name=line.name if line else line_id,
                    color=line.color if line else "#94a3b8",
                    mode=line.mode if line else "metro",
                    station_ids=station_ids,
                    station_names=self.names(station_ids),
                    stops=len(station_ids) - 1,
                    minutes=_round(leg_minutes),
                )
            )

        interchange_ids = [leg.station_ids[0] for leg in leg_models[1:]]
        metro_stops = sum(leg.stops for leg in leg_models if leg.mode == "metro")
        bus_legs = sum(1 for leg in leg_models if leg.mode == "bus")
        fare, fare_band = journey_fare(metro_stops, bus_legs)

        return Route(
            mode=mode,
            mode_label=MODE_LABELS[mode],
            found=True,
            station_ids=path,
            station_names=self.names(path),
            legs=leg_models,
            summary=Summary(
                stops=stops,
                minutes=_round(minutes),
                ride_minutes=_round(ride_minutes),
                interchanges=interchanges,
                fare=fare,
                fare_band=fare_band,
            ),
            interchange_station_ids=interchange_ids,
        )

    # ---------------------------------------------------------------- solving

    def solve(
        self,
        mode: Mode,
        source: str,
        target: str,
        penalty: float = 5.0,
    ) -> Route:
        self._require(source, target)
        mode = mode if mode in MODES else "shortest_time"

        if source == target:
            return Route(
                mode=mode,
                mode_label=MODE_LABELS[mode],
                found=True,
                message="You are already at the destination.",
                station_ids=[source],
                station_names=[self.name(source)],
                summary=Summary(
                    stops=0,
                    minutes=0.0,
                    ride_minutes=0.0,
                    interchanges=0,
                    fare=0,
                    fare_band="no journey needed",
                ),
            )

        if mode == "fewest_stops":
            path = self.bfs_fewest_stops(source, target)
            if path is None:
                return self._unreachable(mode, source, target)
            # The BFS path is time-independent: its travel time and interchanges
            # are read off afterwards, which is why a "fewest stops" route can
            # be slower than the "shortest time" one.
            return self._build_route(mode, path, self._legs_from_path(path), penalty)

        states = self.dijkstra(source, target, mode, penalty)
        if states is None:
            return self._unreachable(mode, source, target)
        # A transfer repeats the station in the state path (arrive on line A,
        # leave on line B), so collapse consecutive duplicates into a walk.
        path: list[str] = []
        for station, _line in states:
            if not path or path[-1] != station:
                path.append(station)
        return self._build_route(mode, path, self._legs_from_states(states), penalty)

    def _unreachable(self, mode: Mode, source: str, target: str) -> Route:
        components = self.components()
        source_component = next((c for c in components if source in c), [source])
        target_component = next((c for c in components if target in c), [target])
        return Route(
            mode=mode,
            mode_label=MODE_LABELS[mode],
            found=False,
            message=(
                f"No path exists: {self.name(source)} is in a component of "
                f"{len(source_component)} station(s) and {self.name(target)} in one of "
                f"{len(target_component)}."
            ),
            station_ids=[],
        )

    # ------------------------------------------------------------ connectivity

    def components(self) -> list[list[str]]:
        """Connected components of the station graph, largest first (BFS)."""
        seen: set[str] = set()
        found: list[list[str]] = []
        for station_id in self.station_ids:
            if station_id in seen:
                continue
            component: list[str] = []
            queue: deque[str] = deque([station_id])
            seen.add(station_id)
            while queue:
                station = queue.popleft()
                component.append(station)
                for neighbour in sorted(self.adj[station]):
                    if neighbour not in seen:
                        seen.add(neighbour)
                        queue.append(neighbour)
            found.append(component)
        found.sort(key=lambda component: (-len(component), self.name(component[0])))
        return found

    def is_connected(self) -> bool:
        return len(self.components()) <= 1

    # ------------------------------------------------------------- articulation

    def _component_count_without(self, removed: str) -> int:
        """Number of connected components left after deleting one vertex."""
        seen: set[str] = {removed}
        components = 0
        for start in self.station_ids:
            if start in seen:
                continue
            components += 1
            seen.add(start)
            queue: deque[str] = deque([start])
            while queue:
                station = queue.popleft()
                for neighbour in self.adj[station]:
                    if neighbour not in seen:
                        seen.add(neighbour)
                        queue.append(neighbour)
        return components

    def articulation_points(self) -> list[str]:
        """Tarjan low-link DFS: stations whose removal increases component count."""
        discovery: dict[str, int] = {}
        low: dict[str, int] = {}
        parent: dict[str, str | None] = {}
        points: set[str] = set()
        counter = 0

        def visit(station: str) -> None:
            nonlocal counter
            discovery[station] = low[station] = counter
            counter += 1
            children = 0

            for neighbour in sorted(self.adj[station]):
                if neighbour not in discovery:
                    children += 1
                    parent[neighbour] = station
                    visit(neighbour)
                    low[station] = min(low[station], low[neighbour])
                    if parent.get(station) is None and children > 1:
                        points.add(station)
                    if parent.get(station) is not None and low[neighbour] >= discovery[station]:
                        points.add(station)
                elif neighbour != parent.get(station):
                    low[station] = min(low[station], discovery[neighbour])

        for station_id in self.station_ids:
            if station_id not in discovery:
                parent[station_id] = None
                visit(station_id)

        return sorted(points, key=self.name)

    # ----------------------------------------------------------------- analysis

    def analyse(self) -> Analysis:
        components = self.components()
        edges = self.edge_count()
        stations = len(self.station_ids)
        degrees = {station_id: len(self.adj[station_id]) for station_id in self.station_ids}

        top = sorted(self.station_ids, key=lambda sid: (-degrees[sid], self.name(sid)))[:6]
        top_degrees = [
            DegreeRow(
                id=station_id,
                name=self.name(station_id),
                degree=degrees[station_id],
                lines=sorted(self.lines_at[station_id]),
            )
            for station_id in top
            if degrees[station_id] > 0
        ]

        articulation = self.articulation_points()
        critical = [
            CriticalStation(
                id=station_id,
                name=self.name(station_id),
                degree=degrees[station_id],
                parts=self._component_count_without(station_id),
            )
            for station_id in articulation
        ]
        critical.sort(key=lambda row: (-row.parts, -row.degree, row.name))

        return Analysis(
            station_count=stations,
            edge_count=edges,
            line_count=len(self.lines),
            is_connected=len(components) <= 1,
            component_count=len(components),
            components=[self.names(component) for component in components],
            average_degree=round(sum(degrees.values()) / stations, 2) if stations else 0.0,
            max_degree=max(degrees.values(), default=0),
            density=round(2 * edges / (stations * (stations - 1)), 4) if stations > 1 else 0.0,
            top_degrees=top_degrees,
            critical_stations=critical,
            articulation_points=[
                StationRef(id=station_id, name=self.name(station_id)) for station_id in articulation
            ],
            isolated_stations=[
                StationRef(id=station_id, name=self.name(station_id))
                for station_id in self.station_ids
                if degrees[station_id] == 0
            ],
        )
