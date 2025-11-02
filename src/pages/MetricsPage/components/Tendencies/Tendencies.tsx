import { useEffect, useState } from "react";
import {
  fetchEma200,
  fetchEma50,
  fetchEma21,
  fetchEma200Slope,
  fetchHHHL,
  fetchRsi14,
  fetchMacdHistogram,
  type Slope,
  type Bias,
  type MacdSign,
} from "../../../../api/MetricsPage/Tendencies";
import "./Tendencies.scss";

export default function Tendencies() {
  const SYMBOL = "BTCUSDC";

  // EMAs
  const [ema1h, setEma1h] = useState<number | null>(null);
  const [ema4h, setEma4h] = useState<number | null>(null);
  const [ema50_1h, setEma50_1h] = useState<number | null>(null);
  const [ema21_1h, setEma21_1h] = useState<number | null>(null);

  // Pendiente EMA 200
  const [slope1h, setSlope1h] = useState<Slope | null>(null);
  const [slope4h, setSlope4h] = useState<Slope | null>(null);

  // Estructura HH/HL vs LH/LL
  const [bias, setBias] = useState<Bias | null>(null);
  const [highSeq, setHighSeq] = useState<"HH" | "LH" | null>(null);
  const [lowSeq, setLowSeq] = useState<"HL" | "LL" | null>(null);

  // RSI 14
  const [rsi14, setRsi14] = useState<number | null>(null);
  const [rsiBias, setRsiBias] = useState<Bias | null>(null);

  // MACD histograma (1h)
  const [macdHist, setMacdHist] = useState<number | null>(null);
  const [macdSign, setMacdSign] = useState<MacdSign | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(s: string) {
    setLoading(true);
    setError(null);
    try {
      const [r200, r50, r21, rSlope, rStruct, rRsi, rMacd] = await Promise.all([
        fetchEma200(s),
        fetchEma50(s),
        fetchEma21(s),
        fetchEma200Slope(s),
        fetchHHHL(s),
        fetchRsi14(s),
        fetchMacdHistogram(s), // 12/26/9 por defecto
      ]);

      setEma1h(r200.ema200["1h"]);
      setEma4h(r200.ema200["4h"]);
      setEma50_1h(r50.ema50["1h"]);
      setEma21_1h(r21.ema21["1h"]);
      setSlope1h(rSlope.ema200_slope["1h"]);
      setSlope4h(rSlope.ema200_slope["4h"]);
      setBias(rStruct.bias);
      setHighSeq(rStruct.highSeq);
      setLowSeq(rStruct.lowSeq);
      setRsi14(rRsi.rsi);
      setRsiBias(rRsi.bias);
      setMacdHist(rMacd.histogram);
      setMacdSign(rMacd.sign);
    } catch (e: any) {
      setError(e.message ?? "Error");
      setEma1h(null);
      setEma4h(null);
      setEma50_1h(null);
      setEma21_1h(null);
      setSlope1h(null);
      setSlope4h(null);
      setBias(null);
      setHighSeq(null);
      setLowSeq(null);
      setRsi14(null);
      setRsiBias(null);
      setMacdHist(null);
      setMacdSign(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(SYMBOL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (n: number | null, digits = 2) =>
    n != null ? n.toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";

  const arrow = (s: Slope | null) => (!s ? "—" : s.sign === "up" ? "↑" : s.sign === "down" ? "↓" : "→");

  const biasText =
    bias === "bullish" ? "Alcista" : bias === "bearish" ? "Bajista" : bias === "neutral" ? "Neutral" : "—";

  const macdText =
    macdSign === "positive" ? "Positivo" : macdSign === "negative" ? "Negativo" : macdSign === "flat" ? "Plano" : "—";

  return (
    <div className="tendencies-metrics-panel">
      <section className="tendencies-toolbar">
        <button className="btn" onClick={() => load(SYMBOL)} disabled={loading}>
          {loading ? "Cargando…" : "Obtener métricas"}
        </button>
      </section>

      {error && <p style={{ color: "crimson", marginBottom: 12 }}>{error}</p>}

      <section className="tendencies-grid">
        <div className="tendencies-card">
          <h2>EMA 200 · 1h</h2>
          <div className="tendencies-value">{fmt(ema1h)}</div>
        </div>
        <div className="tendencies-card">
          <h2>EMA 200 · 4h</h2>
          <div className="tendencies-value">{fmt(ema4h)}</div>
        </div>
        <div className="tendencies-card">
          <h2>EMA 50 · 1h</h2>
          <div className="tendencies-value">{fmt(ema50_1h)}</div>
        </div>
        <div className="tendencies-card">
          <h2>EMA 21 · 1h</h2>
          <div className="tendencies-value">{fmt(ema21_1h)}</div>
        </div>
        <div className="tendencies-card">
          <h2>Pendiente EMA 200 · 1h</h2>
          <div className="tendencies-value">{slope1h ? `${arrow(slope1h)} ${fmt(slope1h.pctPerBar, 3)}%` : "—"}</div>
        </div>
        <div className="tendencies-card">
          <h2>Pendiente EMA 200 · 4h</h2>
          <div className="tendencies-value">{slope4h ? `${arrow(slope4h)} ${fmt(slope4h.pctPerBar, 3)}%` : "—"}</div>
        </div>
        <div className="tendencies-card">
          <h2>Estructura 1h</h2>
          <div className="tendencies-value">{biasText}</div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            Altos: {highSeq ?? "—"} · Bajos: {lowSeq ?? "—"}
          </div>
        </div>
        <div className="tendencies-card">
          <h2>RSI 14 · 1h</h2>
          <div className="tendencies-value">{fmt(rsi14, 1)}</div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {rsiBias === "bullish" ? "Alcista" : rsiBias === "bearish" ? "Bajista" : rsiBias === "neutral" ? "Neutral" : "—"}
          </div>
        </div>
        <div className="tendencies-card">
          <h2>MACD Histograma · 1h</h2>
          <div className="tendencies-value">{fmt(macdHist, 4)}</div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>{macdText}</div>
        </div>
      </section>
    </div>
  );
}
