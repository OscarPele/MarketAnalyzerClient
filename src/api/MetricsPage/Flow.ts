import { http } from "../http";

export type TriSign = "up" | "down" | "flat";

export interface VolumeMA20Response {
  symbol: string;
  interval: string;     // "1h"
  lastVolume: number;
  ma20: number;
  ratio: number;        // lastVolume / ma20
  state: "high" | "normal" | "low";
  source: string;
}

export interface ObvSlopeResponse {
  symbol: string;
  interval: string;     // "1h"
  obv: number;
  deltaPerBar: number;
  pctPerBar: number;
  sign: TriSign;
  source: string;
}

export interface Cvd1hResponse {
  symbol: string;
  window: string;       // "1h"
  buysVolume: number;
  sellsVolume: number;
  cvd: number;          // buys - sells
  source: string;
}

export interface BuySellRatioResponse {
  symbol: string;
  window: string;       // "1h"
  buySellRatioPct: number; // % de volumen agresivo comprador
  source: string;
}

export interface OrderbookImbalanceResponse {
  symbol: string;
  levels: number;
  bidVolume: number;
  askVolume: number;
  imbalancePct: number; // (bid-ask)/(bid+ask)*100
  source: string;
}

export function fetchVolumeMA20(symbol?: string) {
  return http.get<VolumeMA20Response>("/metrics/volume-ma20", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchObvSlope(symbol?: string) {
  return http.get<ObvSlopeResponse>("/metrics/obv-slope", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchCvd1h(symbol?: string) {
  return http.get<Cvd1hResponse>("/metrics/cvd1h", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchBuySellRatio(symbol?: string) {
  return http.get<BuySellRatioResponse>("/metrics/buy-sell-ratio", {
    params: symbol ? { symbol } : undefined,
  });
}

export function fetchOrderbookImbalance(symbol?: string, levels = 20) {
  return http.get<OrderbookImbalanceResponse>("/metrics/orderbook-imbalance", {
    params: { ...(symbol ? { symbol } : {}), levels },
  });
}
