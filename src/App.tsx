import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import MetricsPage from "./pages/MetricsPage/MetricsPage";
import "./app.scss";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <nav className="top-nav">
            <div className="brand">BTC Dashboard</div>
            <div className="nav-links">
              <NavLink to="/metrics" className={({ isActive }) => (isActive ? "active" : "")}>
                Métricas
              </NavLink>
            </div>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/metrics" replace />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="*" element={<p className="not-found">Página no encontrada</p>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
