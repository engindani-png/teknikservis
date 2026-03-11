import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { T } from "../theme";
import { PageHeader, Card, Badge } from "../components/shared";
import {
  MONTHLY,
  SVC_STATUSES,
  SVC_STATUS_CFG,
  CUSTOMERS,
  DEVICES_DB,
  fmtMoney,
} from "../data/constants";

export default function Dashboard({ ctx, setPage }) {
  const { services, quotes, orders, stockDb } = ctx;

  const FUNNEL = [
    { label: "Gelen Çağrı", val: 148, color: T.blue },
    { label: "Teklife Dönüşen", val: 112, color: T.teal },
    { label: "Siparişe Dönüşen", val: 89, color: T.purple },
    { label: "Kapatılan", val: 81, color: T.amber },
    { label: "Faturalandı", val: 76, color: T.green },
  ];

  const kpis = [
    {
      l: "Aktif Servis",
      v: services.filter(
        (s) => !["Kapalı", "Fatura Kesildi"].includes(s.status)
      ).length,
      c: T.blue,
      icon: "🔧",
    },
    {
      l: "Bekleyen Teklif",
      v: quotes.filter((q) => q.status === "Onay Bekleniyor").length,
      c: T.amber,
      icon: "📋",
    },
    {
      l: "Bekleyen Sipariş",
      v: orders.filter((o) => o.status === "Beklemede").length,
      c: T.purple,
      icon: "🛒",
    },
    {
      l: "Kritik Stok",
      v: stockDb.filter((s) => s.qty - s.rezerve < s.min).length,
      c: T.red,
      icon: "⚠",
    },
  ];

  return (
    <div>
      <PageHeader title="Ana Dashboard" sub="Mart 2026 · Tüm lokasyonlar" />

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {kpis.map((k) => (
          <Card
            key={k.l}
            style={{ padding: "14px 16px", borderTop: `3px solid ${k.c}` }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{k.icon}</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: k.c,
                fontFamily: "Sora,sans-serif",
                lineHeight: 1,
              }}
            >
              {k.v}
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.textSub,
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              {k.l}
            </div>
          </Card>
        ))}
      </div>

      {/* Funnel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 10,
          marginBottom: 18,
        }}
      >
        {FUNNEL.map((f, i) => {
          const prev = i > 0 ? FUNNEL[i - 1].val : null;
          const rate = prev ? ((f.val / prev) * 100).toFixed(0) : null;
          return (
            <Card key={f.label} style={{ padding: "13px" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: f.color,
                  fontFamily: "Sora,sans-serif",
                  lineHeight: 1,
                }}
              >
                {f.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.textSub,
                  marginTop: 3,
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {f.label}
              </div>
              {rate && (
                <div
                  style={{
                    marginTop: 5,
                    fontSize: 10,
                    background: "#F1F5F9",
                    color: T.textSub,
                    borderRadius: 10,
                    padding: "1px 6px",
                    display: "inline-block",
                  }}
                >
                  %{rate}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Monthly Service Trend */}
        <Card>
          <div
            style={{
              padding: "12px 18px 8px",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Aylık Servis Trendi
            </span>
          </div>
          <div style={{ padding: "8px" }}>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart
                data={MONTHLY}
                margin={{ top: 0, right: 8, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={T.blue}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor={T.blue}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={T.green}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor={T.green}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis
                  dataKey="ay"
                  tick={{ fontSize: 11, fill: T.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: T.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                    fontSize: 12,
                    fontFamily: "Plus Jakarta Sans",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="çağrı"
                  stroke={T.blue}
                  strokeWidth={2}
                  fill="url(#gc)"
                  name="Çağrı"
                />
                <Area
                  type="monotone"
                  dataKey="fatura"
                  stroke={T.green}
                  strokeWidth={2}
                  fill="url(#gf)"
                  name="Fatura"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Service Status Distribution */}
        <Card>
          <div
            style={{
              padding: "12px 18px 8px",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Servis Durum Dağılımı
            </span>
          </div>
          <div style={{ padding: "14px 18px" }}>
            {SVC_STATUSES.slice(0, 6).map((s) => {
              const cnt = services.filter((x) => x.status === s).length;
              const pct = ((cnt / services.length) * 100).toFixed(0);
              const cfg = SVC_STATUS_CFG[s] || {};
              return (
                <div key={s} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{s}</span>
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}
                    >
                      {cnt}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: "#F1F5F9",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: cfg.color,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {/* Recent Service Requests */}
        <Card>
          <div
            style={{
              padding: "12px 18px 8px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Son Servis Talepleri
            </span>
          </div>
          {services.slice(0, 5).map((s, i) => {
            const c = CUSTOMERS.find((c) => c.id === s.customerId);
            const st = SVC_STATUS_CFG[s.status] || {};
            return (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 18px",
                  borderBottom:
                    i < 4 ? `1px solid ${T.border}` : "none",
                }}
              >
                <span style={{ fontSize: 16 }}>
                  {s.callType === "Telefon" ? "📞" : "📧"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c?.kurumAdi}
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>
                    {s.id} · {s.created}
                  </div>
                </div>
                <Badge label={s.status} bg={st.bg} color={st.color} />
                {s.amount && (
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: T.green }}
                  >
                    {fmtMoney(s.amount)}
                  </span>
                )}
              </div>
            );
          })}
        </Card>

        {/* Upcoming Calibrations */}
        <Card>
          <div
            style={{
              padding: "12px 18px 8px",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Yaklaşan Kalibrasyonlar
            </span>
          </div>
          {DEVICES_DB.filter((d) => d.calDays <= 90)
            .sort((a, b) => a.calDays - b.calDays)
            .slice(0, 5)
            .map((d, i) => {
              const c = CUSTOMERS.find((c) => c.id === d.customerId);
              const col =
                d.calDays <= 15
                  ? T.red
                  : d.calDays <= 30
                    ? T.amber
                    : T.blue;
              return (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 18px",
                    borderBottom:
                      i < 4 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 32,
                      borderRadius: 7,
                      background:
                        d.calDays <= 15
                          ? T.redLight
                          : d.calDays <= 30
                            ? T.amberLight
                            : T.blueLight,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: col,
                        lineHeight: 1,
                      }}
                    >
                      {d.calDays}
                    </span>
                    <span style={{ fontSize: 8, color: col }}>gün</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>
                      {d.marka} {d.model}
                    </div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>
                      {c?.kurumAdi}
                    </div>
                  </div>
                </div>
              );
            })}
        </Card>
      </div>
    </div>
  );
}
