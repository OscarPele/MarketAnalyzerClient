// src/pages/MetricsPage/components/Derivatives/Derivatives.tsx
import { useEffect, useState } from "react";
import {
  fetchOpenInterest,
  fetchFundingRate,
  fetchBasis1M,
  fetchLongShortRatio,
  fetchLiquidations24h,
  fetchEstimatedLeverage,
  type OiPoint,
} from "../../../../api/MetricsPage/Derivatives";
import "./Derivatives.scss";

export default function Derivatives() {
  const SYMBOL = "BTCUSDC";

  // 19) OI + ΔOI
  const [oi1h, setOi1h] = useState<OiPoint | null>(null);
  const [oi4h, setOi4h] = useState<OiPoint | null>(null);

  // 20) Funding
  const [fundingPct, setFundingPct] = useState<number | null>(null);

  // 21) Basis 1M
  const [annual1M, setAnnual1M] = useState<number | null>(null);
  const [basisRate, setBasisRate] = useState<number | null>(null);

  // 22) Long/Short ratio
  const [lsRatio, setLsRatio] = useState<number | null>(null);

  // 23) Liquidaciones 24h
  const [liqCount, setLiqCount] = useState<number | null>(null);
  const [liqNotional, setLiqNotional] = useState<number | null>(null);
  const [liqQueried, setLiqQueried] = useState<string | null>(null);
  const [liqNote, setLiqNote] = useState<string | null>(null);

  // 24) Estimated leverage (placeholder)
  const [oiUsd, setOiUsd] = useState<number | null>(null);
  const [elrNote, setElrNote] = useState<string | null>(null);

  // UI
  const [error, setError] = useState<string | null>(null);

  async function load(s: string) {
    setError(null);
    try {
      const [rOi, rFund, rBasis, rLS, rLiq, rElr] = await Promise.all([
        fetchOpenInterest(s),
        fetchFundingRate(s),
        fetchBasis1M(s),
        fetchLongShortRatio(s),
        fetchLiquidations24h(s),
        fetchEstimatedLeverage(s),
      ]);

      setOi1h(rOi.oi["1h"]);
      setOi4h(rOi.oi["4h"]);

      setFundingPct(rFund.fundingRatePct);

      setAnnual1M(rBasis.annualized1M);
      setBasisRate(rBasis.basisRate);

      setLsRatio(rLS.longShortRatio);

      setLiqCount(rLiq.count);
      setLiqNotional(rLiq.totalNotional);
      setLiqQueried(rLiq.symbolQueried ?? rLiq.symbol ?? null);
      setLiqNote(rLiq.note ?? null);

      setOiUsd(rElr.oiUsd);
      setElrNote(rElr.note);
    } catch (e: any) {
      setError(e.message ?? "Error");
      setOi1h(null); setOi4h(null);
      setFundingPct(null);
      setAnnual1M(null); setBasisRate(null);
      setLsRatio(null);
      setLiqCount(null); setLiqNotional(null); setLiqQueried(null); setLiqNote(null);
      setOiUsd(null); setElrNote(null);
    } finally {
    }
  }

  useEffect(() => {
    load(SYMBOL);
    const id = window.setInterval(() => load(SYMBOL), 60 * 60 * 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (n: number | null, d = 2) =>
    n != null ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
  const arrow = (x: number | null) => (x == null ? "→" : x > 0 ? "↑" : x < 0 ? "↓" : "→");
  const basisText =
    basisRate == null ? "—" : basisRate > 0 ? "Contango" : basisRate < 0 ? "Backwardation" : "Neutro";
  const lsText =
    lsRatio == null ? "—" : lsRatio > 1.05 ? "Largos dominan" : lsRatio < 0.95 ? "Cortos dominan" : "Equilibrado";

  const tip = {
    oi: "Open Interest y ΔOI: confirma si el movimiento suma posiciones nuevas o es cierre.",
    funding: "Funding rate: coste entre largos y cortos. Extremos → riesgo de squeeze.",
    basis: "Basis 1M anualizado: futuros vs spot. >0 contango, <0 backwardation.",
    ls: "Long/Short ratio global: sesgo agregado. Útil en extremos.",
    liq: "Liquidaciones 24h: zonas barridas por apalancamiento.",
    elr: "ELR estimado: requiere reservas del exchange (fuente externa).",
  } as const;

  const showFallbackBadge = liqQueried && liqQueried !== SYMBOL;

  return (
    <div className="deriv-metrics-panel">
      <section className="deriv-toolbar">
        <h3 className="group-title">Derivados</h3>
      </section>

      {error && <p className="error-text">{error}</p>}

      <section className="deriv-grid">
        {/* 19) OI 1h */}
        <div className="deriv-card">
          <h2>Open Interest · 1h</h2>
          <button className="help-badge" aria-label="Ayuda OI" data-tip={tip.oi}>?</button>
          <div className="deriv-value">
            {oi1h ? `${fmt(oi1h.openInterest, 0)} (${arrow(oi1h.delta)} ${fmt(oi1h.pct, 2)}%)` : "—"}
          </div>
        </div>

        {/* 19) OI 4h */}
        <div className="deriv-card">
          <h2>Open Interest · 4h</h2>
          <button className="help-badge" aria-label="Ayuda OI" data-tip={tip.oi}>?</button>
          <div className="deriv-value">
            {oi4h ? `${fmt(oi4h.openInterest, 0)} (${arrow(oi4h.delta)} ${fmt(oi4h.pct, 2)}%)` : "—"}
          </div>
        </div>

        {/* 20) Funding */}
        <div className="deriv-card">
          <h2>Funding rate</h2>
          <button className="help-badge" aria-label="Ayuda Funding" data-tip={tip.funding}>?</button>
          <div className="deriv-value">{fundingPct != null ? `${fmt(fundingPct, 4)}%` : "—"}</div>
        </div>

        {/* 21) Basis 1M */}
        <div className="deriv-card">
          <h2>Basis 1M (anualizado)</h2>
          <button className="help-badge" aria-label="Ayuda Basis" data-tip={tip.basis}>?</button>
          <div className="deriv-value">
            {annual1M != null ? `${fmt(annual1M * 100, 2)}%` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>{basisText}</div>
        </div>

        {/* 22) Long/Short ratio */}
        <div className="deriv-card">
          <h2>Long/Short ratio · 1h</h2>
          <button className="help-badge" aria-label="Ayuda L/S" data-tip={tip.ls}>?</button>
          <div className="deriv-value">{lsRatio != null ? fmt(lsRatio, 3) : "—"}</div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>{lsText}</div>
        </div>

        {/* 23) Liquidaciones 24h */}
        <div className="deriv-card">
          <h2>Liquidaciones · 24h</h2>
          <button className="help-badge" aria-label="Ayuda Liq" data-tip={tip.liq}>?</button>
          <div className="deriv-value">
            {liqNotional != null ? `${fmt(liqNotional, 0)}` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {liqCount != null ? `Eventos: ${fmt(liqCount, 0)}` : "—"}
          </div>
          {showFallbackBadge && (
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
              Feed: <strong>{liqQueried}</strong>
            </div>
          )}
          {liqNote && (
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
              {liqNote}
            </div>
          )}
        </div>

        {/* 24) ELR (placeholder) */}
        <div className="deriv-card">
          <h2>Apalancamiento estimado</h2>
          <button className="help-badge" aria-label="Ayuda ELR" data-tip={tip.elr}>?</button>
          <div className="deriv-value">
            {oiUsd != null ? `OI USD: ${fmt(oiUsd, 0)}` : "—"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>{elrNote ?? "—"}</div>
        </div>
      </section>
    </div>
  );
}
