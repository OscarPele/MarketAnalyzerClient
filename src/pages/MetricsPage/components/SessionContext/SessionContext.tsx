// src/pages/MetricsPage/components/SessionContext/SessionContext.tsx
import { useEffect, useState } from "react";
import {
  fetchVwapDaily,
  fetchAvwap,
  fetchPrevDayHiLo,
  fetchOpeningRange60,
  fetchSessionsToday,
  fetchMacroFlag,
  type VwapDailyResponse,
  type AvwapResponse,
  type PrevDayHiLoResponse,
  type OpeningRange60Response,
  type SessionsResponse,
  type MacroFlagResponse,
} from "../../../../api/MetricsPage/Session";

// Reutilizamos los estilos ya existentes
import "../Tendencies/Tendencies.scss";

export default function SessionContext() {
  const SYMBOL = "BTCUSDC";

  // Estado por métrica
  const [vwapDaily, setVwapDaily] = useState<VwapDailyResponse | null>(null);
  const [avwap, setAvwap] = useState<AvwapResponse | null>(null);
  const [prev, setPrev] = useState<PrevDayHiLoResponse | null>(null);
  const [or60, setOr60] = useState<OpeningRange60Response | null>(null);
  const [sessions, setSessions] = useState<SessionsResponse | null>(null);
  const [macro, setMacro] = useState<MacroFlagResponse | null>(null);

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(symbol: string) {
    setLoading(true);
    setError(null);
    try {
      const [rVwap, rAvwap, rPrev, rOr, rSess, rMacro] = await Promise.all([
        fetchVwapDaily(symbol),
        fetchAvwap(symbol), // anclado por defecto a inicio de día UTC
        fetchPrevDayHiLo(symbol),
        fetchOpeningRange60(symbol),
        fetchSessionsToday(),
        fetchMacroFlag(),
      ]);

      setVwapDaily(rVwap);
      setAvwap(rAvwap);
      setPrev(rPrev);
      setOr60(rOr);
      setSessions(rSess);
      setMacro(rMacro);
    } catch (e: any) {
      setError(e?.message ?? "Error");
      setVwapDaily(null);
      setAvwap(null);
      setPrev(null);
      setOr60(null);
      setSessions(null);
      setMacro(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(SYMBOL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Utils
  const fmt = (n: number | null | undefined, d = 2) =>
    n != null ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
  const tsToTime = (ts?: number | null) =>
    ts ? new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—";

  const tip = {
    vwap: "VWAP diario: media ponderada por volumen del día. Suele actuar como imán/pivote.",
    avwap:
      "AVWAP desde apertura: VWAP anclado al inicio de sesión (o anchorTs). Soportes/resistencias intradía.",
    hilo:
      "Máximo y mínimo del día previo: objetivos y barreras frecuentes por liquidez residual.",
    or:
      "Opening Range 60 min: rango inicial del día (00:00–01:00 UTC). Su ruptura guía el sesgo.",
    sessions:
      "Sesiones UTC: Asia (00–07), Londres (07–13), NY (13–21) y solapes. Útil para liquidez/volatilidad.",
    macro:
      "Flag macro: eventos/datos de alto impacto. Ajusta el riesgo ante probables spikes.",
  } as const;

  const currentSessionText =
    sessions?.currentSession === "ASIA"
      ? "Asia"
      : sessions?.currentSession === "LONDON"
      ? "Londres"
      : sessions?.currentSession === "NEW_YORK"
      ? "Nueva York"
      : sessions?.currentSession === "OFF_HOURS"
      ? "Fuera de sesión principal"
      : sessions?.currentSession ?? "—";

  return (
    <div className="tendencies-metrics-panel">
      <section className="tendencies-toolbar">
        <button className="btn" onClick={() => load(SYMBOL)} disabled={loading}>
          {loading ? "Cargando…" : "Obtener métricas"}
        </button>
      </section>

      {error && <p style={{ color: "crimson", marginBottom: 12 }}>{error}</p>}

      <section className="tendencies-grid">
        {/* 25) VWAP diario */}
        <div className="tendencies-card">
          <h2>VWAP diario</h2>
          <button className="help-badge" aria-label="Ayuda VWAP" data-tip={tip.vwap}>?</button>
          <div className="tendencies-value">{fmt(vwapDaily?.vwap, 2)}</div>
        </div>

        {/* 26) AVWAP desde apertura */}
        <div className="tendencies-card">
          <h2>AVWAP (desde apertura)</h2>
          <button className="help-badge" aria-label="Ayuda AVWAP" data-tip={tip.avwap}>?</button>
          <div className="tendencies-value">{fmt(avwap?.avwap, 2)}</div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            Ancla: {tsToTime(avwap?.anchorTs)} UTC
          </div>
        </div>

        {/* 27) High/Low día previo */}
        <div className="tendencies-card">
          <h2>High/Low día previo</h2>
          <button className="help-badge" aria-label="Ayuda Hi/Lo" data-tip={tip.hilo}>?</button>
          <div className="tendencies-value">
            H: {fmt(prev?.prevDayHigh, 2)} · L: {fmt(prev?.prevDayLow, 2)}
          </div>
        </div>

        {/* 28) Opening Range 60m */}
        <div className="tendencies-card">
          <h2>Opening Range 60m</h2>
          <button className="help-badge" aria-label="Ayuda OR60" data-tip={tip.or}>?</button>
          <div className="tendencies-value">
            {fmt(or60?.orHigh, 2)} / {fmt(or60?.orLow, 2)}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            Rango: {fmt(or60?.range, 2)}
          </div>
        </div>

        {/* 29) Sesión actual */}
        <div className="tendencies-card">
          <h2>Sesión actual</h2>
          <button className="help-badge" aria-label="Ayuda Sesiones" data-tip={tip.sessions}>?</button>
          <div className="tendencies-value">{currentSessionText}</div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            Día UTC: {tsToTime(sessions?.utcDayStart)}–…
          </div>
        </div>

        {/* 30) Flag macro del día */}
        <div className="tendencies-card">
          <h2>Flag macro (hoy)</h2>
          <button className="help-badge" aria-label="Ayuda Macro" data-tip={tip.macro}>?</button>
          <div className="tendencies-value">
            {macro?.hasHighImpact ? "Alto impacto" : "Normal"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {macro?.note || "—"}
          </div>
        </div>
      </section>
    </div>
  );
}
