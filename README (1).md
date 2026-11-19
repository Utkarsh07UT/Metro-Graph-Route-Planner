# MetroGraph — Metro / Bus Route Planner

A graph-theory route planner over a curated Delhi network: four metro lines and three city bus routes,
59 stations and 64 weighted edges. Pick an origin and a destination and the engine solves the graph for
**fewest stops** (BFS), **shortest travel time** (Dijkstra) or **fewest interchanges**.

The graph algorithms are written by hand in Python — BFS, Dijkstra over a `(station, line)` state graph,
connected components, vertex degrees and articulation points. Bus routes are lines in the same graph, so
they get multimodal journeys, a shared interchange penalty and fare handling for free. No NetworkX is
used for the maths; the map is a custom SVG renderer in React.

## Stack

| Layer      | Choice                                          |
| ---------- | ----------------------------------------------- |
| Algorithms | Python 3.12, `collections.deque`, `heapq`       |
| API        | FastAPI + Pydantic                              |
| Frontend   | React 19 + TypeScript + Tailwind CSS v4 + Vite  |
| Data       | One JSON file (`backend/data/network.json`)     |

## Deploy to Vercel

The project is pre-configured for one-click deployment on **Vercel** with fullstack support (React frontend on Vercel CDN + FastAPI on Vercel Serverless Functions).

1. Push your repository to **GitHub** / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Add New > Project** and select your repository.
3. Keep the default settings (the included `vercel.json` and `package.json` will automatically build the frontend into `frontend/dist` and route `/api/*` to `api/index.py`).
4. Click **Deploy**. Your app will be live with full interactive routing and graph analysis!

---

## Run it

### Windows (Quick Start)
Double-click `run.bat` or run in PowerShell:
```powershell
.\run.ps1
```
Or run directly with Python:
```powershell
python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000
```
Then open your browser to **http://localhost:8000** (or http://127.0.0.1:8000).

### Linux / macOS
```bash
# 1. Python environment + API
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt

# 2. Build the client
cd frontend && npm install && npm run build && cd ..

# 3. Serve everything on one port
.venv/bin/uvicorn app:app --app-dir backend --host 0.0.0.0 --port 8000
# → http://localhost:8000
```

To regenerate the dataset after editing route definitions:

```bash
python3 backend/data/build_dataset.py
```

For frontend development with hot reload, run the API on port 8000 and `npm run dev` in `frontend/`
(port 5173, `/api` is proxied to FastAPI).

## Tests

```bash
cd backend && ../.venv/bin/python -m pytest -q
```

20 tests cover: same station, unreachable pair, multi-interchange journeys, BFS vs. Dijkstra optimality,
bus-only and multimodal journeys, fare arithmetic, the interchange penalty, connectivity, isolated
vertices, suspended lines, degrees, articulation points and the fare bands.

## The graph model

* **V** = stations and bus stops (59), **E** = adjacent pairs on a line (64).
* Edge weight = scheduled minutes between the two stops.
* Each edge is labelled with its line, so a journey can be charged for changing line.
* **Adjacency list**, `dict[str, dict[str, tuple[float, str]]]` (`adj[a][b] = (minutes, line)`):
  O(V + E) storage, O(1) neighbour lookup. A 59 × 59 adjacency matrix would hold 3481 cells for 64
  edges and could not carry a line label per edge.
* **Interchange stations** are vertices with degree > 2 — Kashmere Gate has degree 5 (three lines).
* A **bus stop that is also a metro station** is a single vertex on both lines, so a bus-to-metro
  change is just a line change: same state graph, same penalty, no special case.

The bus layer is deliberately small but load-bearing: Bus 522 links west Delhi (Janakpuri West) to the
Red Line at Pitampura, Bus 433 links Hauz Khas to Nehru Place, and Bus 405 runs Karol Bagh → New Delhi →
ITO → Lajpat Nagar across the centre. Two bus-only stops (Ashok Vihar, Greater Kailash) are vertices
with degree 2.

## Algorithms

| Task                    | Algorithm                                                   | Cost             |
| ----------------------- | ----------------------------------------------------------- | ---------------- |
| Fewest stops            | BFS layers, then Dijkstra over the BFS DAG to break ties     | O((V + E) log V) |
| Shortest time           | Dijkstra on `(station, line)` states, `heapq`                | O((V + E) log V) |
| Fewest interchanges     | Dijkstra with cost `(interchanges, minutes)`                 | O((V + E) log V) |
| Reachability/components | BFS over every vertex                                        | O(V + E)         |
| Critical stations       | Tarjan low-link DFS, ranked by components after removal      | O(V + E)         |
| Fare                    | Metro stop-count slabs + ₹15 per bus leg                     | O(1)             |

The interchange penalty is modelled by expanding the graph: a state is `(station, line)`, a ride edge
keeps the line and costs the segment time, a transfer edge stays at the station and costs the penalty
(5 minutes) plus one interchange. Boarding at the origin is free, which is why the same pair can produce
different routes under different objectives.

## API

* `GET /api/network` — the seed dataset.
* `POST /api/solve` — `{ network, source, target, mode, interchangePenalty }`; returns the chosen route
  plus all three objectives for comparison.
* `POST /api/analyze` — `{ network }`; returns connectivity, components, degrees, density and
  articulation points.
* `GET /docs` — interactive OpenAPI docs.

The API is stateless: the editor's current network is sent with each request, so concurrent users never
share graph state.

## Layout

```
backend/
  app.py            FastAPI routes + static hosting of the built client
  metro_graph.py    the discrete-maths core (BFS, Dijkstra, components, Tarjan)
  models.py         Pydantic models (snake_case in Python, camelCase on the wire)
  data/             network.json + the script that generated it
  tests/            algorithm tests
frontend/src/
  App.tsx           state, data fetching, layout
  components/       planner, route panel, SVG map, insights, editor
  lib/              station editing helpers and formatting
```

## Using it for the report / demo

1. The app opens on **Karol Bagh → Lajpat Nagar**: Bus 405 runs it direct in 24 min with **0 changes**,
   while the metro takes 22 min but needs **1 change** at Mandi House. Switch objectives to show the
   trade-off.
2. Try **Kashmere Gate → Khan Market**: fewest stops is a 5-stop bus-assisted route that is *slower*
   than the 6-stop direct Violet Line ride — BFS minimises hops, not minutes.
3. Turn **Include bus routes** off: the network drops to 57 stations / 57 edges and Rajiv Chowk becomes
   a cut vertex again, because the buses had formed a loop around it.
4. Suspend the Violet Line in the editor: its stations strand and the component count jumps.
5. Remove **Yamuna Bank**: the eastern Blue Line branch detaches — the "unreachable pair" screenshot.
