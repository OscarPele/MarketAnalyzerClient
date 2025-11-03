// src/api/MetricsPage/Volatility.ts
import { http } from "../http";

export interface Atr14Response {
  symbol: string;
  interval: string;
  period: number;
  atr: number;
  source: string;
}

export interface Atr14PctResponse {
  symbol: string;
  interval: string;
  period: number;
  atrPct: number;
  source: string;
}

export interface BbWidthResponse {
  symbol: string;
  interval: string;
  period: number;
  k: number;
  middle: number;
  upper: number;
  lower: number;
  widthAbs: number;
  widthPct: number;
  source: string;
}

export type SqueezeState = "squeeze_on" | "squeeze_off" | "neutral";
export interface SqueezeResponse {
  symbol: string;
  interval: string;
  bbPeriod: number;
  bbK: number;
  kcPeriod: number;
  kcMult: number;
  bb: { middle: number; upper: number; lower: number; widthAbs: number; widthPct: number };
  kc: { middle: number; upper: number; lower: number; widthAbs: number; widthPct: number };
  inSqueeze: boolean;
  state: SqueezeState;
  source: string;
}

export interface VwapDistanceResponse {
  symbol: string;
  interval: string;
  lookback: number;
  vwap: number;
  close: number;
  distanceAbs: number;
  distancePct: number;
  source: string;
}

export interface AtrPctPercentileResponse {
  symbol: string;
  interval: string;
  period: number;
  days: number;
  currentAtrPct: number;
  percentile: number; // 0–100
  samples: number;
  source: string;
}

export function fetchAtr14(symbol?: string) {
  return http.get<Atr14Response>("/metrics/atr14", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchAtr14Pct(symbol?: string) {
  return http.get<Atr14PctResponse>("/metrics/atr14pct", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchBbWidth(symbol?: string, period = 20, k = 2.0) {
  return http.get<BbWidthResponse>("/metrics/bbwidth", {
    params: { ...(symbol ? { symbol } : {}), period, k },
  });
}

export function fetchSqueeze(symbol?: string, bbPeriod = 20, bbK = 2.0, kcPeriod = 20, kcMult = 1.5) {
  return http.get<SqueezeResponse>("/metrics/squeeze", {
    params: { ...(symbol ? { symbol } : {}), bbPeriod, bbK, kcPeriod, kcMult },
  });
}

export function fetchVwapDistance(symbol?: string, lookback = 24) {
  return http.get<VwapDistanceResponse>("/metrics/vwap-distance", {
    params: { ...(symbol ? { symbol } : {}), lookback },
  });
}

export function fetchAtrPctPercentile(symbol?: string, period = 14, days = 30) {
  return http.get<AtrPctPercentileResponse>("/metrics/atrpct-percentile", {
    params: { ...(symbol ? { symbol } : {}), period, days },
  });
}
