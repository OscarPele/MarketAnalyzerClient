import "./MetricsPage.scss";
import Tendencies from "./components/Tendencies/Tendencies";
import VolatilityAndRange from "./components/VolatilyAndRange/VolatilyAndRange";
import Flow from "./components/Flow/Flow";
import Derivatives from "./components/Derivatives/Derivatives";
import SessionContext from "./components/SessionContext/SessionContext";

export default function MetricsPage() {
  return (
    <main className="metrics-root">
      {/*-- Tendencias --*/}
      <Tendencies />
      {/*-- Volatilidad --*/}
      <VolatilityAndRange />
      {/*-- Flow --*/}
      <Flow />
      {/*-- Derivados --*/}
      <Derivatives />
      {/*-- Contexto de Sesión --*/}
      <SessionContext />
    </main>
  );
}
