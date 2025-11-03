import "./MetricsPage.scss";
import Tendencies from "./components/Tendencies/Tendencies";
import VolatilityAndRange from "./components/Flow/Flow";
import Flow from "./components/Flow/Flow";
import Derivatives from "./components/Derivatives/Derivatives";
import SessionContext from "./components/SessionContext/SessionContext";

export default function MetricsPage() {
  return (
    <main className="metrics-root">
      <Tendencies />
      <div style={{ height: 16 }} />
      <VolatilityAndRange />
      <div style={{ height: 16 }} />
      <Flow />
      <div style={{ height: 16 }} />
      <Derivatives />
      <div style={{ height: 16 }} />
      <SessionContext />
    </main>
  );
}
