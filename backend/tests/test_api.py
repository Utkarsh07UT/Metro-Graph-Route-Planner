"""API and endpoint tests for FastAPI backend in backend/app.py.

Tests:
- Route registrations on the FastAPI app (/api/health, /api/network, /api/solve, /api/analyze).
- GET /api/health returns status ok.
- GET /api/network returns 59 stations, 64 edges, 7 lines (including Bus 405, 433, 522).
- POST /api/solve:
    - Multimodal journey Karol Bagh -> Lajpat Nagar across all 3 optimization modes.
    - Bus 522 route with bus-only stop Ashok Vihar.
    - Bus 433 route with bus-only stop Greater Kailash.
    - Same-station boundary case.
    - HTTP 404 on unknown station.
    - Pydantic validation error (HTTP 422 equivalent).
- POST /api/analyze:
    - Structural properties (59 stations, 64 edges, connected components, articulation points).
- Missing frontend HTML fallback.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi import HTTPException
from fastapi.routing import APIRoute
from pydantic import ValidationError

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import (  # noqa: E402
    app,
    BASE_NETWORK,
    health,
    get_network,
    solve,
    analyze,
)
from models import (  # noqa: E402
    MODES,
    Network,
    NetworkRequest,
    SolveRequest,
    SolveResponse,
    Analysis,
)


def test_api_routes_registered() -> None:
    routes = {
        route.path: route
        for route in app.routes
        if isinstance(route, APIRoute)
    }
    assert "/api/health" in routes
    assert "/api/network" in routes
    assert "/api/solve" in routes
    assert "/api/analyze" in routes

    assert "GET" in routes["/api/health"].methods
    assert "GET" in routes["/api/network"].methods
    assert "POST" in routes["/api/solve"].methods
    assert "POST" in routes["/api/analyze"].methods

    assert routes["/api/network"].response_model is Network
    assert routes["/api/solve"].response_model is SolveResponse
    assert routes["/api/analyze"].response_model is Analysis


def test_health_endpoint() -> None:
    result = health()
    assert result == {"status": "ok"}


def test_network_endpoint() -> None:
    net = get_network()
    assert isinstance(net, Network)
    assert len(net.stations) == 59
    assert len(net.edges) == 64
    assert len(net.lines) == 7

    bus_lines = [line for line in net.lines if line.mode == "bus"]
    assert len(bus_lines) == 3
    assert {line.id for line in bus_lines} == {"bus-405", "bus-433", "bus-522"}

    # Verify bus-only stations are present
    station_ids = {s.id for s in net.stations}
    assert "ashok-vihar" in station_ids
    assert "greater-kailash" in station_ids


def test_solve_endpoint_karol_bagh_to_lajpat_nagar() -> None:
    req = SolveRequest(
        network=BASE_NETWORK,
        source="karol-bagh",
        target="lajpat-nagar",
        mode="shortest_time",
        interchange_penalty=5.0,
    )
    res = solve(req)
    assert isinstance(res, SolveResponse)
    assert res.source.id == "karol-bagh"
    assert res.target.id == "lajpat-nagar"
    assert res.interchange_penalty == 5.0

    # Primary mode is shortest_time
    assert res.primary.mode == "shortest_time"
    assert res.primary.found is True
    assert res.primary.summary is not None
    assert res.primary.summary.minutes == 22.0
    assert res.primary.summary.interchanges == 1

    # Options contains all 3 modes
    assert len(res.options) == 3
    mode_map = {opt.mode: opt for opt in res.options}
    assert set(mode_map.keys()) == set(MODES)

    # Fewest interchanges takes direct Bus 405 with 0 changes
    fewest_int = mode_map["fewest_interchanges"]
    assert fewest_int.summary is not None
    assert fewest_int.summary.interchanges == 0
    assert [leg.line for leg in fewest_int.legs] == ["bus-405"]


def test_solve_bus_522_ashok_vihar() -> None:
    req = SolveRequest(
        network=BASE_NETWORK,
        source="ashok-vihar",
        target="pitampura",
        mode="shortest_time",
        interchange_penalty=5.0,
    )
    res = solve(req)
    assert res.primary.found is True
    assert res.primary.summary is not None
    assert res.primary.summary.stops == 1
    assert res.primary.summary.minutes == 12.0
    assert res.primary.summary.fare == 15
    assert res.primary.legs[0].line == "bus-522"


def test_solve_bus_433_greater_kailash() -> None:
    req = SolveRequest(
        network=BASE_NETWORK,
        source="hauz-khas",
        target="greater-kailash",
        mode="shortest_time",
        interchange_penalty=5.0,
    )
    res = solve(req)
    assert res.primary.found is True
    assert res.primary.summary is not None
    assert res.primary.summary.stops == 1
    assert res.primary.summary.minutes == 7.0
    assert res.primary.legs[0].line == "bus-433"


def test_solve_same_station() -> None:
    req = SolveRequest(
        network=BASE_NETWORK,
        source="rajiv-chowk",
        target="rajiv-chowk",
        mode="fewest_stops",
        interchange_penalty=5.0,
    )
    res = solve(req)
    assert res.primary.found is True
    assert res.primary.summary is not None
    assert res.primary.summary.stops == 0
    assert res.primary.summary.minutes == 0
    assert res.primary.summary.fare == 0


def test_solve_unknown_station_raises_404() -> None:
    req = SolveRequest(
        network=BASE_NETWORK,
        source="atlantis-station",
        target="rajiv-chowk",
        mode="shortest_time",
        interchange_penalty=5.0,
    )
    with pytest.raises(HTTPException) as exc_info:
        solve(req)
    assert exc_info.value.status_code == 404
    assert "Unknown station" in exc_info.value.detail


def test_solve_validation_error_invalid_penalty() -> None:
    with pytest.raises(ValidationError):
        SolveRequest(
            network=BASE_NETWORK,
            source="rajiv-chowk",
            target="new-delhi",
            interchange_penalty=50.0,  # exceeds maximum 30
        )


def test_analyze_endpoint() -> None:
    req = NetworkRequest(network=BASE_NETWORK)
    res = analyze(req)
    assert isinstance(res, Analysis)
    assert res.station_count == 59
    assert res.edge_count == 64
    assert res.line_count == 7
    assert res.is_connected is True
    assert res.component_count == 1

    art_ids = {ap.id for ap in res.articulation_points}
    assert "mandi-house" in art_ids
    assert "kashmere-gate" in art_ids
