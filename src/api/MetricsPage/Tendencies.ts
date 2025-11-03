// src/api/MetricsPage/Tendencies.ts
import { http } from "../http";

export interface Ema200Response {
  symbol: string;
  ema200: { "1h": number; "4h": number };
  source: string;
}

export interface Ema50Response {
  symbol: string;
  ema50: { "1h": number };
  source: string;
}

export interface Ema21Response {
  symbol: string;
  ema21: { "1h": number };
  source: string;
}

export type Slope = { deltaPerBar: number; pctPerBar: number; sign: "up" | "down" | "flat" };
export interface Ema200SlopeResponse {
  symbol: string;
  ema200_slope: { "1h": Slope; "4h": Slope };
  source: string;
}

export type Bias = "bullish" | "bearish" | "neutral";

export interface HHHLResponse {
  symbol: string;
  interval: string;
  window: number;
  highSeq: "HH" | "LH" | null;
  lowSeq: "HL" | "LL" | null;
  bias: Bias;
  lastHigh?: { price: number; time: string } | null;
  prevHigh?: { price: number; time: string } | null;
  lastLow?: { price: number; time: string } | null;
  prevLow?: { price: number; time: string } | null;
  source: string;
}

export interface Rsi14Response {
  symbol: string;
  interval: string;
  period: number;
  rsi: number;
  bias: Bias;
  source: string;
}

export type MacdSign = "positive" | "negative" | "flat";
export interface MacdHistogramResponse {
  symbol: string;
  interval: string;
  fast: number;
  slow: number;
  signal: number;
  macd: number;
  signalValue: number;
  histogram: number;
  sign: MacdSign;
  source: string;
}

export function fetchEma200(symbol?: string) {
  return http.get<Ema200Response>("/metrics/ema200", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchEma50(symbol?: string) {
  return http.get<Ema50Response>("/metrics/ema50", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchEma21(symbol?: string) {
  return http.get<Ema21Response>("/metrics/ema21", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchEma200Slope(symbol?: string) {
  return http.get<Ema200SlopeResponse>("/metrics/ema200-slope", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchHHHL(symbol?: string, window = 2) {
  return http.get<HHHLResponse>("/metrics/hhhl", {
    params: { ...(symbol ? { symbol } : {}), window },
  });
}

export function fetchRsi14(symbol?: string) {
  return http.get<Rsi14Response>("/metrics/rsi14", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchMacdHistogram(symbol?: string, fast = 12, slow = 26, signal = 9) {
  return http.get<MacdHistogramResponse>("/metrics/macd-histogram", {
    params: { ...(symbol ? { symbol } : {}), fast, slow, signal },
  });
}

