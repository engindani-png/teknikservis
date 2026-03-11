import { useState } from "react";
import { T, CSS } from "./theme";

// Data constants
import {
  USERS,
  DEVICES_DB,
  SERVICES_INIT,
  QUOTES_INIT,
  ORDERS_INIT,
  CONTRACTS_INIT,
  STOCK_DB,
  STOCK_MOVEMENTS_INIT,
  WAYBILLS_INIT,
  APPOINTMENTS_INIT,
} from "./data/constants";

// Page components
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MusterilerPage from "./pages/MusterilerPage";
import CihazlarPage from "./pages/CihazlarPage";
import ServislerPage from "./pages/ServislerPage";
import TekliflerPage from "./pages/TekliflerPage";
import SiparislerPage from "./pages/SiparislerPage";
import AnlasmalarPage from "./pages/AnlasmalarPage";
import TakvimPage from "./pages/TakvimPage";
import KalibrasyonPage from "./pages/KalibrasyonPage";
import StokPage from "./pages/StokPage";

/* ═══════════ NAV CONFIG ═══════════ */
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "musteriler", label: "Müşteri Kartları", icon: "🏥" },
  { id: "cihazlar", label: "Cihaz Parkı", icon: "🔬" },
  { id: "servisler", label: "Servis & Takip", icon: "🔧" },
  { id: "teklifler", label: "Teklifler", icon: "📋" },
  { id: "siparisler", label: "Siparişler", icon: "🛒" },
  { id: "anlasmalar", label: "Bakım Anlaşmaları", icon: "📄" },
  { id: "takvim", label: "Takvim", icon: "📅" },
  { id: "kalibrasyon", label: "Kalibrasyon", icon: "◎" },
  { id: "stok", label: "Stok Yönetimi", icon: "📦" },
];

/* ═══════════ APP SHELL ═══════════ */
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  // Global state - simulates DB
  const [services, setServices] = useState(SERVICES_INIT);
  const [quotes, setQuotes] = useState(QUOTES_INIT);
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [contracts, setContracts] = useState(CONTRACTS_INIT);
  const [stockDb, setStockDb] = useState(STOCK_DB);
  const [movements, setMovements] = useState(STOCK_MOVEMENTS_INIT);
  const [waybills, setWaybills] = useState(WAYBILLS_INIT);
  const [appointments, setAppointments] = useState(APPOINTMENTS_INIT);

  if (!user) return <LoginPage onLogin={setUser} />;

  const calWarn = DEVICES_DB.filter((d) => d.calDays <= 30).length;
  const stkWarn = stockDb.filter((s) => (s.qty - s.rezerve) < s.min).length;
  const pendingQuotes = quotes.filter((q) => q.status === "Onay Bekleniyor").length;
  const pendingOrders = orders.filter((o) => o.status === "Beklemede").length;

  const ctx = {
    services, setServices,
    quotes, setQuotes,
    orders, setOrders,
    contracts, setContracts,
    stockDb, setStockDb,
    movements, setMovements,
    waybills, setWaybills,
    appointments, setAppointments,
    user, setPage,
  };

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
      background: T.bg,
      minHeight: "100vh",
      display: "flex",
      color: T.text,
    }}>
      <style>{CSS}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 218,
        background: T.navy,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: "14px 14px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(135deg,#0D9488,#0891B2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}>
              ⚕
            </div>
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 800,
                color: "white",
                fontFamily: "Sora,sans-serif",
              }}>
                Erişçi TMS
              </div>
              <div style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: 1,
              }}>
                TEKNİK SERVİS
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          padding: "8px 6px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
        }}>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item${page === n.id ? " active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              {n.label}

              {n.id === "teklifler" && pendingQuotes > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: T.amber,
                  color: "white",
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "1px 6px",
                }}>
                  {pendingQuotes}
                </span>
              )}

              {n.id === "siparisler" && pendingOrders > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: T.purple,
                  color: "white",
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "1px 6px",
                }}>
                  {pendingOrders}
                </span>
              )}

              {n.id === "kalibrasyon" && calWarn > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: T.red,
                  color: "white",
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "1px 6px",
                }}>
                  {calWarn}
                </span>
              )}

              {n.id === "stok" && stkWarn > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: T.orange,
                  color: "white",
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "1px 6px",
                }}>
                  {stkWarn}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User info & logout */}
        <div style={{
          padding: "10px 12px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#0D9488,#0891B2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "white",
            flexShrink: 0,
          }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {user.ad}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
              {user.rol}
            </div>
          </div>
          <button
            onClick={() => setUser(null)}
            title="Çıkış"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.3)",
              fontSize: 16,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: "auto", padding: 26, minWidth: 0 }}>
        {page === "dashboard" && <Dashboard ctx={ctx} setPage={setPage} />}
        {page === "musteriler" && <MusterilerPage ctx={ctx} />}
        {page === "cihazlar" && <CihazlarPage ctx={ctx} />}
        {page === "servisler" && <ServislerPage ctx={ctx} />}
        {page === "teklifler" && <TekliflerPage ctx={ctx} />}
        {page === "siparisler" && <SiparislerPage ctx={ctx} />}
        {page === "anlasmalar" && <AnlasmalarPage ctx={ctx} />}
        {page === "takvim" && <TakvimPage ctx={ctx} />}
        {page === "kalibrasyon" && <KalibrasyonPage ctx={ctx} />}
        {page === "stok" && <StokPage ctx={ctx} />}
      </main>
    </div>
  );
}
