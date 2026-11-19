import type { Analysis, Mode, Network, SolveResponse } from "./types";

const API_BASE = "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      /* keep the status-based message */
    }
    throw new Error(detail);
  }

  return (await response.json()) as T;
}

export function getNetwork(signal?: AbortSignal): Promise<Network> {
  return request<Network>("/api/network", { signal });
}

export function solve(
  payload: {
    network: Network;
    source: string;
    target: string;
    mode: Mode;
    interchangePenalty: number;
  },
  signal?: AbortSignal,
): Promise<SolveResponse> {
  return request<SolveResponse>("/api/solve", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

export function analyze(network: Network, signal?: AbortSignal): Promise<Analysis> {
  return request<Analysis>("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ network }),
    signal,
  });
}
