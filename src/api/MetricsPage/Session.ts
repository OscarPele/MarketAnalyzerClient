// src/api/MetricsPage/Session.ts
import { http } from "../http";

/* ===== Tipos ===== */
export interface VwapDailyResponse {
  symbol: string;
  vwap: number | null;
  interval: string;
  window: string; // e.g. "today_utc"
  source: string;
}

export interface AvwapResponse {
  symbol: string;
  anchorTs: number;
  avwap: number | null;
  interval: string;
  source: string;
}

export interface PrevDayHiLoResponse {
  symbol: string;
  prevDayHigh: number | null;
  prevDayLow: number | null;
  prevOpenTime: number | null;
  source: string;
}

export interface OpeningRange60Response {
  symbol: string;
  rangeMinutes: number;
  orHigh: number | null;
  orLow: number | null;
  range: number | null;
  source: string;
}

export interface SessionsResponse {
  utcDayStart: number;
  asia: { start: number; end: number };
  london: { start: number; end: number };
  newYork: { start: number; end: number };
  overlaps: {
    asia_london: { start: number; end: number };
    london_ny: { start: number; end: number };
  };
  currentSession: "ASIA" | "LONDON" | "NEW_YORK" | "OFF_HOURS" | string;
  source: string;
}

export interface MacroFlagResponse {
  dateUtc: string;
  hasHighImpact: boolean;
  note: string;
  keyEvents: string[];
  source: string;
}

/* ===== Calls ===== */
export function fetchVwapDaily(symbol?: string) {
  return http.get<VwapDailyResponse>("/session/vwap-daily", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchAvwap(symbol?: string, anchorTs?: number) {
  const params: Record<string, any> = {};
  if (symbol) params.symbol = symbol;
  if (anchorTs) params.anchorTs = anchorTs;
  return http.get<AvwapResponse>("/session/avwap", { params });
}

export function fetchPrevDayHiLo(symbol?: string) {
  return http.get<PrevDayHiLoResponse>("/session/prev-day-hilo", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchOpeningRange60(symbol?: string) {
  return http.get<OpeningRange60Response>("/session/opening-range-60", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchSessionsToday() {
  return http.get<SessionsResponse>("/session/sessions");
}

export function fetchMacroFlag() {
  return http.get<MacroFlagResponse>("/session/macro-flag");
}
