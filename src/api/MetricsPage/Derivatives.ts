// src/api/MetricsPage/Derivatives.ts
import { http } from "../http";

export interface OiPoint {
  openInterest: number | null;
  openInterestValue: number | null;
  delta: number | null;
  pct: number | null;
  timestamp: number | null;
}
export interface OpenInterestResponse {
  symbol: string;
  oi: { "1h": OiPoint; "4h": OiPoint };
  source: string;
}

export interface FundingRateResponse {
  symbol: string;
  fundingRate: number | null;     // decimal (0.0001 = 0.01%)
  fundingTime: number | null;
  fundingRatePct: number | null;  // %
  source: string;
}

export interface Basis1MResponse {
  pair: string;
  contractType: string;
  basis: number | null;
  basisRate: number | null;       // decimal
  annualized1M: number | null;    // anualizado sobre 30D
  futuresPrice: number | null;
  indexPrice: number | null;
  source: string;
}

export interface LongShortRatioResponse {
  symbol: string;
  interval: string;
  longShortRatio: number | null;  // >1 = long > short
  longAccount: number | null;
  shortAccount: number | null;
  timestamp: number | null;
  source: string;
}

export interface Liquidations24hResponse {
  symbol: string;
  symbolQueried?: string | null;  // aparece si hubo fallback (p.ej. BTCUSDT)
  window: string;                 // "24h"
  count: number;
  totalNotional: number;
  bySide: { BUY: number; SELL: number };
  note?: string | null;           // mensaje de fallback/observación
  source: string;
}

export interface EstimatedLeverageResponse {
  symbol: string;
  elr: number | null;             // siempre null por ahora
  oiUsd: number | null;
  timestamp: number | null;
  note: string;
  source: string;
}

/* calls */
export function fetchOpenInterest(symbol?: string) {
  return http.get<OpenInterestResponse>("/derivatives/open-interest", {
    params: symbol ? { symbol } : undefined,
  });
}
export function fetchFundingRate(symbol?: string) {
  return http.get<FundingRateResponse>("/derivatives/funding-rate", {
    params: symbol ? { symbol } : undefined,
  });
}
export function fetchBasis1M(pair?: string) {
  return http.get<Basis1MResponse>("/derivatives/basis-1m", {
    params: pair ? { pair } : undefined,
  });
}
export function fetchLongShortRatio(symbol?: string) {
  return http.get<LongShortRatioResponse>("/derivatives/long-short-ratio", {
    params: symbol ? { symbol } : undefined,
  });
}
export function fetchLiquidations24h(symbol?: string) {
  return http.get<Liquidations24hResponse>("/derivatives/liquidations-24h", {
    params: symbol ? { symbol } : undefined,
  });
}
export function fetchEstimatedLeverage(symbol?: string) {
  return http.get<EstimatedLeverageResponse>("/derivatives/estimated-leverage", {
    params: symbol ? { symbol } : undefined,
  });
}
