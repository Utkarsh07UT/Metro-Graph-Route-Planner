"""Pydantic models shared by the API layer and the graph engine.

Field names are snake_case in Python and camelCase on the wire, so the React
client can stay idiomatic without a translation layer.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

Mode = Literal["fewest_stops", "shortest_time", "fewest_interchanges"]
LineMode = Literal["metro", "bus"]
Anchor = Literal["start", "middle", "end"]

MODES: tuple[Mode, ...] = ("fewest_stops", "shortest_time", "fewest_interchanges")

MODE_LABELS: dict[Mode, str] = {
    "fewest_stops": "Fewest stops",
    "shortest_time": "Shortest time",
    "fewest_interchanges": "Fewest interchanges",
}


class Wire(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Label(Wire):
    dx: float = 0
    dy: float = 0
    anchor: Anchor = "start"
    rotate: float = 0


class Station(Wire):
    id: str
    name: str
    x: float
    y: float
    lines: list[str] = Field(default_factory=list)
    label: Label = Field(default_factory=Label)


class Line(Wire):
    id: str
    name: str
    color: str
    mode: LineMode = "metro"
    stations: list[str]


class Edge(Wire):
    a: str
    b: str
    line: str
    minutes: float


class Network(Wire):
    name: str
    lines: list[Line]
    stations: list[Station]
    edges: list[Edge]


class NetworkRequest(Wire):
    network: Network


class SolveRequest(Wire):
    network: Network
    source: str
    target: str
    mode: Mode = "shortest_time"
    interchange_penalty: float = Field(default=5.0, ge=0, le=30)


class Leg(Wire):
    line: str
    line_name: str
    color: str
    mode: LineMode = "metro"
    station_ids: list[str]
    station_names: list[str]
    stops: int
    minutes: float


class Summary(Wire):
    stops: int
    minutes: float
    ride_minutes: float
    interchanges: int
    fare: int
    fare_band: str


class Route(Wire):
    mode: Mode
    mode_label: str
    found: bool
    message: str | None = None
    station_ids: list[str] = Field(default_factory=list)
    station_names: list[str] = Field(default_factory=list)
    legs: list[Leg] = Field(default_factory=list)
    summary: Summary | None = None
    interchange_station_ids: list[str] = Field(default_factory=list)


class StationRef(Wire):
    id: str
    name: str


class SolveResponse(Wire):
    primary: Route
    options: list[Route]
    interchange_penalty: float
    source: StationRef
    target: StationRef


class DegreeRow(Wire):
    id: str
    name: str
    degree: int
    lines: list[str]


class CriticalStation(Wire):
    """A cut vertex and how many components appear once it is removed."""

    id: str
    name: str
    degree: int
    parts: int


class Analysis(Wire):
    station_count: int
    edge_count: int
    line_count: int
    is_connected: bool
    component_count: int
    components: list[list[str]]
    average_degree: float
    max_degree: int
    density: float
    top_degrees: list[DegreeRow]
    critical_stations: list[CriticalStation]
    articulation_points: list[StationRef]
    isolated_stations: list[StationRef]
