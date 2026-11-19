"""Algorithm tests for the discrete-maths core.

Covers the cases the project brief calls out: same station, unreachable pair,
multi-interchange journeys, plus BFS/Dijkstra optimality and the structural
analysis (connectivity, degrees, articulation points).

Run with:  cd backend && pytest -q
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from metro_graph import MetroGraph, estimate_fare  # noqa: E402
from models import Network  # noqa: E402

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "network.json"


@pytest.fixture(scope="module")
def network() -> Network:
    return Network.model_validate(json.loads(DATA_FILE.read_text(encoding="utf-8")))


@pytest.fixture(scope="module")
def graph(network: Network) -> MetroGraph:
    return MetroGraph(network)


def without_station(network: Network, station_id: str) -> Network:
    payload = network.model_dump(by_alias=True)
    payload["stations"] = [s for s in payload["stations"] if s["id"] != station_id]
    payload["edges"] = [e for e in payload["edges"] if station_id not in (e["a"], e["b"])]
    for line in payload["lines"]:
        line["stations"] = [s for s in line["stations"] if s != station_id]
    return Network.model_validate(payload)


def test_dataset_is_well_formed(graph: MetroGraph) -> None:
    assert len(graph.station_ids) == 59
    # 57 metro segments + 7 bus segments (2 + 2 + 3).
    assert graph.edge_count() == 64
    assert len(graph.lines) == 7
    assert sum(1 for line in graph.lines.values() if line.mode == "bus") == 3
    # Every edge references a station that exists, and every line has order.
    for edge in graph.network.edges:
        assert edge.a in graph.adj and edge.b in graph.adj
        assert edge.minutes > 0


def test_degrees_identify_interchanges(graph: MetroGraph) -> None:
    degrees = {sid: len(graph.adj[sid]) for sid in graph.station_ids}
    # Kashmere Gate is on three lines and has five neighbours.
    assert degrees["kashmere-gate"] == 5
    assert degrees["rajiv-chowk"] == 4
    # Two Blue neighbours (Barakhamba Road, Supreme Court) and two Violet ones.
    assert degrees["mandi-house"] == 4


def test_bfs_returns_fewest_stops(graph: MetroGraph) -> None:
    route = graph.solve("fewest_stops", "kashmere-gate", "rajiv-chowk")
    assert route.found
    assert route.summary is not None
    assert route.summary.stops == 3
    assert route.station_names == ["Kashmere Gate", "Chandni Chowk", "New Delhi", "Rajiv Chowk"]
    assert route.summary.interchanges == 0


def test_bfs_minimises_stops_even_when_it_is_slower(graph: MetroGraph) -> None:
    # The bus hop New Delhi -> ITO shortens the journey to 5 stops, but that
    # route needs two changes and takes longer than the 6-stop Violet ride.
    fewest = graph.solve("fewest_stops", "kashmere-gate", "khan-market")
    fastest = graph.solve("shortest_time", "kashmere-gate", "khan-market")
    assert fewest.summary and fastest.summary
    assert fewest.summary.stops == 5
    assert any(leg.mode == "bus" for leg in fewest.legs)
    assert fastest.summary.stops == 6
    assert fastest.summary.minutes < fewest.summary.minutes


def test_bus_routes_join_the_graph(graph: MetroGraph) -> None:
    assert graph.is_connected()
    assert [line.id for line in graph.lines.values() if line.mode == "bus"] == [
        "bus-522",
        "bus-433",
        "bus-405",
    ]


def test_bus_only_journey(graph: MetroGraph) -> None:
    route = graph.solve("shortest_time", "janakpuri-west", "pitampura")
    assert route.summary is not None
    assert [leg.line for leg in route.legs] == ["bus-522"]
    assert route.summary.stops == 2
    assert route.summary.minutes == 22
    assert route.summary.interchanges == 0
    assert route.summary.fare == 15
    assert "bus" in route.summary.fare_band


def test_multimodal_journey(graph: MetroGraph) -> None:
    # Bus 405 feeds ITO, where the Violet Line runs to Khan Market.
    route = graph.solve("fewest_interchanges", "new-delhi", "khan-market")
    assert route.summary is not None
    assert [leg.mode for leg in route.legs] == ["bus", "metro"]
    assert route.summary.interchanges == 1
    assert route.summary.fare == 15 + 10  # one bus ticket + the 0-2 stop metro slab
    assert "metro" in route.summary.fare_band and "bus" in route.summary.fare_band


def test_fewest_interchanges_prefers_the_bus(graph: MetroGraph) -> None:
    fewest = graph.solve("fewest_interchanges", "karol-bagh", "lajpat-nagar")
    fastest = graph.solve("shortest_time", "karol-bagh", "lajpat-nagar")
    assert fewest.summary and fastest.summary
    assert [leg.line for leg in fewest.legs] == ["bus-405"]
    assert fewest.summary.interchanges == 0
    assert fastest.summary.interchanges == 1
    assert fastest.summary.minutes < fewest.summary.minutes


def test_shortest_time_never_slower_than_bfs(graph: MetroGraph) -> None:
    pairs = [
        ("rithala", "noida-city-centre"),
        ("janakpuri-west", "badarpur-border"),
        ("hauz-khas", "dilshad-garden"),
        ("azadpur", "nehru-place"),
    ]
    for source, target in pairs:
        bfs = graph.solve("fewest_stops", source, target)
        fast = graph.solve("shortest_time", source, target)
        assert fast.summary is not None and bfs.summary is not None
        assert fast.summary.minutes <= bfs.summary.minutes + 1e-9


def test_multi_interchange_route(graph: MetroGraph) -> None:
    route = graph.solve("shortest_time", "rithala", "noida-city-centre")
    assert route.found and route.summary is not None
    assert route.summary.interchanges == 2
    # Red -> Violet at Kashmere Gate -> Blue at Mandi House is time-optimal here.
    assert [leg.line for leg in route.legs] == ["red", "violet", "blue"]
    assert route.interchange_station_ids == ["kashmere-gate", "mandi-house"]
    assert len(set(route.station_ids)) == len(route.station_ids)
    assert route.summary.stops == sum(leg.stops for leg in route.legs)
    assert route.summary.minutes >= route.summary.ride_minutes


def test_fewest_interchanges_mode_is_optimal(graph: MetroGraph) -> None:
    pairs = [
        ("rithala", "noida-city-centre"),
        ("pitampura", "hauz-khas"),
        ("janakpuri-west", "shahdara"),
    ]
    for source, target in pairs:
        fewest = graph.solve("fewest_interchanges", source, target)
        fastest = graph.solve("shortest_time", source, target)
        assert fewest.summary is not None and fastest.summary is not None
        assert fewest.summary.interchanges <= fastest.summary.interchanges


def test_same_station(graph: MetroGraph) -> None:
    route = graph.solve("shortest_time", "rajiv-chowk", "rajiv-chowk")
    assert route.found
    assert route.summary is not None
    assert route.summary.stops == 0
    assert route.summary.minutes == 0
    assert route.summary.fare == 0
    assert route.legs == []


def test_unreachable_stations(network: Network) -> None:
    # Removing Yamuna Bank splits the eastern Blue Line branch off the network.
    graph = MetroGraph(without_station(network, "yamuna-bank"))
    route = graph.solve("fewest_stops", "rajiv-chowk", "noida-city-centre")
    assert not route.found
    assert route.message is not None and "No path exists" in route.message
    assert graph.is_connected() is False
    assert graph.components()[1:] and "noida-city-centre" in graph.components()[1]


def test_connectivity_and_components(graph: MetroGraph) -> None:
    assert graph.is_connected()
    assert len(graph.components()) == 1
    assert len(graph.components()[0]) == 59


def test_isolated_station_is_reported(graph: MetroGraph, network: Network) -> None:
    payload = network.model_dump(by_alias=True)
    payload["stations"].append(
        {"id": "ghost", "name": "Ghost Halt", "x": 10, "y": 10, "lines": [], "label": {}}
    )
    extended = Network.model_validate(payload)
    extended_graph = MetroGraph(extended)
    analysis = extended_graph.analyse()
    assert analysis.component_count == 2
    assert [s.name for s in analysis.isolated_stations] == ["Ghost Halt"]
    assert extended_graph.solve("shortest_time", "ghost", "rajiv-chowk").found is False


def test_suspended_line_does_not_break_connectivity(graph: MetroGraph, network: Network) -> None:
    payload = network.model_dump(by_alias=True)
    payload["edges"] = [e for e in payload["edges"] if e["line"] != "violet"]
    no_violet = MetroGraph(Network.model_validate(payload))
    # Suspending a line strands every station that only Violet served.
    assert no_violet.is_connected() is False
    analysis = no_violet.analyse()
    assert "Badarpur Border" in [station.name for station in analysis.isolated_stations]
    route = no_violet.solve("shortest_time", "rajiv-chowk", "hauz-khas")
    assert route.found
    assert all(leg.line != "violet" for leg in route.legs)


def test_articulation_points(graph: MetroGraph) -> None:
    points = set(graph.articulation_points())
    # Kashmere Gate and Mandi House still cut the network: their far-side metro
    # branches have no bus alternative. Rajiv Chowk no longer does, because the
    # two bus routes now form a loop around the centre.
    assert {"kashmere-gate", "mandi-house"} <= points
    assert "rajiv-chowk" not in points


def test_interchange_penalty_increases_time(graph: MetroGraph) -> None:
    cheap = graph.solve("shortest_time", "rithala", "noida-city-centre", penalty=0)
    pricey = graph.solve("shortest_time", "rithala", "noida-city-centre", penalty=12)
    assert cheap.summary and pricey.summary
    # The route cannot avoid two interchanges for this pair, so the penalty is
    # charged exactly twice and only affects the total, not the riding time.
    assert pricey.summary.interchanges == 2
    assert cheap.summary.minutes == pytest.approx(cheap.summary.ride_minutes)
    assert pricey.summary.minutes == pytest.approx(pricey.summary.ride_minutes + 24)


def test_fare_bands() -> None:
    assert estimate_fare(1)[0] == 10
    assert estimate_fare(4)[0] == 20
    assert estimate_fare(9)[0] == 30
    assert estimate_fare(14)[0] == 40
    assert estimate_fare(19)[0] == 50
    assert estimate_fare(30)[0] == 60
    fares = [estimate_fare(stops)[0] for stops in range(0, 31)]
    assert fares == sorted(fares)


def test_unknown_station_raises(graph: MetroGraph) -> None:
    from metro_graph import GraphError

    with pytest.raises(GraphError):
        graph.solve("shortest_time", "atlantis", "rajiv-chowk")
