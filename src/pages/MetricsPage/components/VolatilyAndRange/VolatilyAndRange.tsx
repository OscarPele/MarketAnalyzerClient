// src/pages/MetricsPage/components/VolatilityAndRange/VolatilityAndRange.tsx
import { useEffect, useState } from "react";
import {
  fetchAtr14,
  fetchAtr14Pct,
  fetchBbWidth,
  fetchSqueeze,
  fetchVwapDistance,
  fetchAtrPctPercentile,
  type SqueezeState,
} from "../../../../api/MetricsPage/Volatility";

export default function VolatilityAndRange() {
  const SYMBOL = "BTCUSDC";

  // MÉTRICAS existentes
  const [atr14, setAtr14] = useState<number | null>(null);
  const [atrPct, setAtrPct] = useState<number | null>(null);
  const [bbAbs, setBbAbs] = useState<number | null>(null);
  const [bbPct, setBbPct] = useState<number | null>(null);

  // NUEVAS: Squeeze, VWAP distance, ATR% percentile
  const [squeezeState, setSqueezeState] = useState<SqueezeState | null>(null);
  const [inSqueeze, setInSqueeze] = useState<boolean | null>(null);

  const [vwap, setVwap] = useState<number | null>(null);
  const [closePx, setClosePx] = useState<number | null>(null);
  const [vwapDistAbs, setVwapDistAbs] = useState<number | null>(null);
  const [vwapDistPct, setVwapDistPct] = useState<number | null>(null);

  const [atrPctCurrent, setAtrPctCurrent] = useState<number | null>(null);
  const [atrPctPerc, setAtrPctPerc] = useState<number | null>(null);
  const [atrPctSamples, setAtrPctSamples] = useState<number | null>(null);

  // UI
  // Sin control de loading manual; la carga es automática
  const [error, setError] = useState<string | null>(null);

  async function load(s: string) {
    setError(null);
    try {
      const [rAtr, rAtrPct, rBb, rSqueeze, rVwap, rAtrPctPerc] = await Promise.all([
        fetchAtr14(s),
        fetchAtr14Pct(s),
        fetchBbWidth(s, 20, 2.0),
        fetchSqueeze(s), // 20,2 vs 20,1.5
        fetchVwapDistance(s, 24),
        fetchAtrPctPercentile(s, 14, 30),
      ]);

      setAtr14(rAtr.atr);
      setAtrPct(rAtrPct.atrPct);
      setBbAbs(rBb.widthAbs);
      setBbPct(rBb.widthPct);

      setSqueezeState(rSqueeze.state);
      setInSqueeze(rSqueeze.inSqueeze);

      setVwap(rVwap.vwap);
      setClosePx(rVwap.close);
      setVwapDistAbs(rVwap.distanceAbs);
      setVwapDistPct(rVwap.distancePct);

      setAtrPctCurrent(rAtrPctPerc.currentAtrPct);
      setAtrPctPerc(rAtrPctPerc.percentile);
      setAtrPctSamples(rAtrPctPerc.samples);
    } catch (e: any) {
      setError(e.message ?? "Error");
      setAtr14(null);
      setAtrPct(null);
      setBbAbs(null);
      setBbPct(null);
      setSqueezeState(null);
      setInSqueeze(null);
      setVwap(null);
      setClosePx(null);
      setVwapDistAbs(null);
      setVwapDistPct(null);
      setAtrPctCurrent(null);
      setAtrPctPerc(null);
      setAtrPctSamples(null);
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

  const squeezeText =
    squeezeState === "squeeze_on"
      ? "Compresión (BB dentro de Keltner)"
      : squeezeState === "squeeze_off"
      ? "Expansión (BB fuera)"
      : squeezeState === "neutral"
      ? "Neutral"
      : "—";

  const tip = {
    atr14: "ATR(14) 1h: rango medio esperado por vela. Cuanto mayor, más movimiento probable.",
    atrPct: "ATR%: ATR / precio * 100. Compara volatilidad entre activos/épocas.",
    bbWidth: "Bollinger 20, 2σ: ancho de bandas. Ancho bajo = compresión; alto = expansión.",
    squeeze:
      "Squeeze BB–Keltner: cuando BB queda dentro de Keltner hay compresión; suele preceder rupturas.",
    vwap:
      "Distancia a VWAP (24h): % y diferencia vs VWAP. Alejamientos grandes → riesgo de reversión a la media.",
    atrPctPerc:
      "Percentil ATR% 30D: posición histórica de la volatilidad normalizada. >80% alto régimen; <20% bajo.",
  } as const;

  return (
    <div className="tendencies-metrics-panel">
      <section className="tendencies-toolbar">
        <h3 className="group-title">Volatilidad</h3>
      </section>

      {error && <p style={{ color: "crimson", marginBottom: 12 }}>{error}</p>}

      <section className="tendencies-grid">
        {/* ATR 14 */}
        <div className="tendencies-card">
          <h2>ATR 14 · 1h</h2>
          <button className="help-badge" aria-label="Ayuda ATR" data-tip={tip.atr14}>?</button>
          <div className="tendencies-value">{fmt(atr14, 2)}</div>
        </div>

        {/* ATR% */}
        <div className="tendencies-card">
          <h2>ATR% · 1h</h2>
          <button className="help-badge" aria-label="Ayuda ATR%" data-tip={tip.atrPct}>?</button>
          <div className="tendencies-value">{atrPct != null ? `${fmt(atrPct, 2)}%` : "—"}</div>
        </div>

        {/* BB Width */}
        <div className="tendencies-card">
          <h2>BB Width 20, 2σ · 1h</h2>
          <button className="help-badge" aria-label="Ayuda BB Width" data-tip={tip.bbWidth}>?</button>
          <div className="tendencies-value">
            {bbPct != null ? `${fmt(bbPct, 2)}%` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {bbAbs != null ? `Ancho abs: ${fmt(bbAbs, 2)}` : "—"}
          </div>
        </div>

        {/* Squeeze BB–Keltner */}
        <div className="tendencies-card">
          <h2>Squeeze BB–Keltner · 1h</h2>
          <button className="help-badge" aria-label="Ayuda Squeeze" data-tip={tip.squeeze}>?</button>
          <div className="tendencies-value">{squeezeText}</div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {inSqueeze == null ? "—" : inSqueeze ? "BB dentro de Keltner" : "BB fuera de Keltner"}
          </div>
        </div>

        {/* Distancia a VWAP */}
        <div className="tendencies-card">
          <h2>Distancia a VWAP · 1h</h2>
          <button className="help-badge" aria-label="Ayuda VWAP" data-tip={tip.vwap}>?</button>
          <div className="tendencies-value">
            {vwapDistPct != null ? `${fmt(vwapDistPct, 2)}%` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {vwapDistAbs != null && vwap != null && closePx != null
              ? `Δ: ${fmt(vwapDistAbs, 2)} · Cierre: ${fmt(closePx, 2)} · VWAP: ${fmt(vwap, 2)}`
              : "—"}
          </div>
        </div>

        {/* Percentil ATR% 30D */}
        <div className="tendencies-card">
          <h2>Percentil ATR% · 30D</h2>
          <button className="help-badge" aria-label="Ayuda Percentil ATR%" data-tip={tip.atrPctPerc}>?</button>
          <div className="tendencies-value">
            {atrPctPerc != null ? `${fmt(atrPctPerc, 1)}º pct` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {atrPctCurrent != null && atrPctSamples != null
              ? `ATR% actual: ${fmt(atrPctCurrent, 2)}% · muestras: ${atrPctSamples}`
              : "—"}
          </div>
        </div>
      </section>
    </div>
  );
}
