import type { Analysis, Mode, Network, SolveResponse } from "./types";
import { ClientMetroGraph, DEFAULT_NETWORK, solveClient } from "./lib/solver";

const API_BASE = "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok || !contentType.includes("application/json")) {
    throw new Error(`Endpoint ${path} unavailable (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function getNetwork(signal?: AbortSignal): Promise<Network> {
  try {
    return await request<Network>("/api/network", { signal });
  } catch (err) {
    console.warn("Backend /api/network unavailable; using embedded network dataset:", err);
    return DEFAULT_NETWORK;
  }
}

export async function solve(
  payload: {
    network: Network;
    source: string;
    target: string;
    mode: Mode;
    interchangePenalty: number;
  },
  signal?: AbortSignal,
): Promise<SolveResponse> {
  try {
    return await request<SolveResponse>("/api/solve", {
      method: "POST",
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    console.warn("Backend /api/solve unavailable; solving locally with graph engine:", err);
    return solveClient(
      payload.network,
      payload.source,
      payload.target,
      payload.mode,
      payload.interchangePenalty,
    );
  }
}

export async function analyze(network: Network, signal?: AbortSignal): Promise<Analysis> {
  try {
    return await request<Analysis>("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ network }),
      signal,
    });
  } catch (err) {
    console.warn("Backend /api/analyze unavailable; computing graph analysis locally:", err);
    return new ClientMetroGraph(network).analyse();
  }
}
