"""FastAPI layer for the MetroGraph route planner.

Run locally:

    uvicorn app:app --reload --port 8000      (from the backend/ directory)

In production it also serves the built React app from frontend/dist, so the
whole project runs on a single port.
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from metro_graph import GraphError, MetroGraph
from models import (
    MODES,
    Analysis,
    Network,
    NetworkRequest,
    SolveRequest,
    SolveResponse,
    StationRef,
)

DATA_FILE = ROOT / "data" / "network.json"
FRONTEND_DIST = ROOT.parent / "frontend" / "dist"

BASE_NETWORK = Network.model_validate(json.loads(DATA_FILE.read_text(encoding="utf-8")))

app = FastAPI(
    title="MetroGraph API",
    version="1.0.0",
    description="BFS / Dijkstra route planning over a line-labelled metro graph.",
)

# Only needed when the Vite dev server (port 5173) talks to the API directly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/network", response_model=Network)
@app.get("/network", response_model=Network)
def get_network() -> Network:
    """The seed dataset: stations, lines with their station order, weighted edges."""
    return BASE_NETWORK


@app.post("/api/solve", response_model=SolveResponse)
@app.post("/solve", response_model=SolveResponse)
def solve(request: SolveRequest) -> SolveResponse:
    """Plan a journey and return all three optimisation modes for comparison."""
    graph = MetroGraph(request.network)
    try:
        options = [
            graph.solve(mode, request.source, request.target, request.interchange_penalty)
            for mode in MODES
        ]
        primary = next(opt for opt in options if opt.mode == request.mode)
    except GraphError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error

    return SolveResponse(
        primary=primary,
        options=options,
        interchange_penalty=request.interchange_penalty,
        source=StationRef(id=request.source, name=graph.name(request.source)),
        target=StationRef(id=request.target, name=graph.name(request.target)),
    )


@app.post("/api/analyze", response_model=Analysis)
@app.post("/analyze", response_model=Analysis)
def analyze(request: NetworkRequest) -> Analysis:
    """Structural properties of the current network (connectivity, degrees, ...)."""
    return MetroGraph(request.network).analyse()


if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
else:

    @app.get("/", response_class=HTMLResponse)
    def missing_frontend() -> str:
        return (
            "<main style='font-family:system-ui;padding:3rem;line-height:1.6'>"
            "<h1>MetroGraph API is running</h1>"
            "<p>The React client has not been built yet. Run "
            "<code>cd frontend &amp;&amp; npm install &amp;&amp; npm run build</code>, then restart "
            "the server. During development use <code>npm run dev</code> instead.</p>"
            "<p><a href='/docs'>API docs</a></p></main>"
        )
