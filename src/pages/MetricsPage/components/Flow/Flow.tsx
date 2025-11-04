import { useEffect, useState } from "react";
import {
  fetchVolumeMA20,
  fetchObvSlope,
  fetchCvd1h,
  fetchBuySellRatio,
  fetchOrderbookImbalance,
  type TriSign,
} from "../../../../api/MetricsPage/Flow";
import "./Flow.scss";

export default function Flow() {
  const SYMBOL = "BTCUSDC";

  // 14) Volumen vs MA20
  const [lastVol, setLastVol] = useState<number | null>(null);
  const [volMA20, setVolMA20] = useState<number | null>(null);
  const [volRatio, setVolRatio] = useState<number | null>(null);
  const [volState, setVolState] = useState<"high" | "normal" | "low" | null>(null);

  // 15) OBV slope
  const [obv, setObv] = useState<number | null>(null);
  const [obvDelta, setObvDelta] = useState<number | null>(null);
  const [obvPct, setObvPct] = useState<number | null>(null);
  const [obvSign, setObvSign] = useState<TriSign | null>(null);

  // 16/17) CVD & Buy/Sell Ratio
  const [buys, setBuys] = useState<number | null>(null);
  const [sells, setSells] = useState<number | null>(null);
  const [cvd, setCvd] = useState<number | null>(null);
  const [bsRatio, setBsRatio] = useState<number | null>(null);

  // 18) Orderbook imbalance
  const [levels, setLevels] = useState<number | null>(null);
  const [bidVol, setBidVol] = useState<number | null>(null);
  const [askVol, setAskVol] = useState<number | null>(null);
  const [imbPct, setImbPct] = useState<number | null>(null);

  // UI
  // Sin control de loading manual; la carga es automática
  const [error, setError] = useState<string | null>(null);

  async function load(s: string) {
    setError(null);
    try {
      const [rVol, rObv, rCvd, rBS, rObi] = await Promise.all([
        fetchVolumeMA20(s),
        fetchObvSlope(s),
        fetchCvd1h(s),
        fetchBuySellRatio(s),
        fetchOrderbookImbalance(s, 20),
      ]);

      setLastVol(rVol.lastVolume);
      setVolMA20(rVol.ma20);
      setVolRatio(rVol.ratio);
      setVolState(rVol.state);

      setObv(rObv.obv);
      setObvDelta(rObv.deltaPerBar);
      setObvPct(rObv.pctPerBar);
      setObvSign(rObv.sign);

      setBuys(rCvd.buysVolume);
      setSells(rCvd.sellsVolume);
      setCvd(rCvd.cvd);
      setBsRatio(rBS.buySellRatioPct);

      setLevels(rObi.levels);
      setBidVol(rObi.bidVolume);
      setAskVol(rObi.askVolume);
      setImbPct(rObi.imbalancePct);
    } catch (e: any) {
      setError(e.message ?? "Error");
      setLastVol(null); setVolMA20(null); setVolRatio(null); setVolState(null);
      setObv(null); setObvDelta(null); setObvPct(null); setObvSign(null);
      setBuys(null); setSells(null); setCvd(null); setBsRatio(null);
      setLevels(null); setBidVol(null); setAskVol(null); setImbPct(null);
    } finally {
    }
  }

  useEffect(() => {
    load(SYMBOL);
    const id = window.setInterval(() => load(SYMBOL), 60 * 60 * 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (n: number | null, digits = 2) =>
    n != null ? n.toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";

  const arrow = (s: TriSign | null) => (!s ? "→" : s === "up" ? "↑" : s === "down" ? "↓" : "→");

  const volStateText =
    volState === "high" ? "Alto" : volState === "low" ? "Bajo" : volState === "normal" ? "Normal" : "—";

  const bsText =
    bsRatio == null
      ? "—"
      : bsRatio > 55
      ? "Compras dominan"
      : bsRatio < 45
      ? "Ventas dominan"
      : "Equilibrado";

  const obiText =
    imbPct == null
      ? "—"
      : imbPct > 5
      ? "Bid dominante"
      : imbPct < -5
      ? "Ask dominante"
      : "Balanceado";

  const tip = {
    volMA20:
      "Volumen vs MA20: confirma un movimiento cuando el volumen supera claramente su media. Bajo volumen → poca participación.",
    obvSlope:
      "OBV pendiente (1h): acumulación si sube, distribución si baja. Delta por vela y % relativo.",
    cvd: "CVD 1h: compras agresivas menos ventas agresivas en la última hora.",
    bsRatio:
      "Buy/Sell Ratio 1h: % de volumen agresivo comprador. >55% compras dominan, <45% ventas dominan.",
    obi: "Order book imbalance (top 20): (bid−ask)/(bid+ask). >0 soporte; <0 oferta.",
  } as const;

  return (
    <div className="flow-panel">
      <section className="flow-toolbar">
        <h3 className="group-title">Flow</h3>
      </section>

      {error && <p className="error-text">{error}</p>}

      <section className="flow-grid">
        {/* 14) Volumen vs MA20 */}
        <div className="flow-card">
          <h2>Volumen vs MA20 · 1h</h2>
          <button className="help-badge" aria-label="Ayuda Volumen" data-tip={tip.volMA20}>?</button>
          <div className="flow-value">
            {volRatio != null ? `${fmt(volRatio, 2)}×` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {lastVol != null && volMA20 != null ? `Último: ${fmt(lastVol, 2)} · MA20: ${fmt(volMA20, 2)} · ${volStateText}` : "—"}
          </div>
        </div>

        {/* 15) OBV pendiente */}
        <div className="flow-card">
          <h2>OBV pendiente · 1h</h2>
          <button className="help-badge" aria-label="Ayuda OBV" data-tip={tip.obvSlope}>?</button>
          <div className="flow-value">
            {obvPct != null ? `${arrow(obvSign)} ${fmt(obvPct, 3)}%/vela` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {obvDelta != null && obv != null ? `Δ: ${fmt(obvDelta, 2)} · OBV: ${fmt(obv, 2)}` : "—"}
          </div>
        </div>

        {/* 16) CVD 1h */}
        <div className="flow-card">
          <h2>CVD · 1h</h2>
          <button className="help-badge" aria-label="Ayuda CVD" data-tip={tip.cvd}>?</button>
          <div className="flow-value">
            {cvd != null ? fmt(cvd, 2) : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {buys != null && sells != null ? `Buys: ${fmt(buys, 2)} · Sells: ${fmt(sells, 2)}` : "—"}
          </div>
        </div>

        {/* 17) Buy/Sell Ratio 1h */}
        <div className="flow-card">
          <h2>Buy/Sell Ratio · 1h</h2>
          <button className="help-badge" aria-label="Ayuda Buy/Sell" data-tip={tip.bsRatio}>?</button>
          <div className="flow-value">
            {bsRatio != null ? `${fmt(bsRatio, 1)}%` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>{bsText}</div>
        </div>

        {/* 18) Order book imbalance */}
        <div className="flow-card">
          <h2>Order Book Imbalance</h2>
          <button className="help-badge" aria-label="Ayuda OBI" data-tip={tip.obi}>?</button>
          <div className="flow-value">
            {imbPct != null ? `${fmt(imbPct, 2)}%` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {levels != null && bidVol != null && askVol != null
              ? `Niveles: ${levels} · Bid: ${fmt(bidVol, 2)} · Ask: ${fmt(askVol, 2)} · ${obiText}`
              : "—"}
          </div>
        </div>
      </section>
    </div>
  );
}
