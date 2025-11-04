import "./ChartPlaceholder.scss";

export default function ChartPlaceholder() {
  return (
    <div className="chart-panel">
      <div className="chart-header">
        <h3 className="group-title">Gráfico</h3>
      </div>
      <div className="chart-body">
        <div className="chart-mock">Área reservada para el gráfico</div>
      </div>
    </div>
  );
}

