import { useState } from "react";
import { T } from "../theme";
import { PageHeader, Card, Badge } from "../components/shared";
import { DEVICES_DB, CUSTOMERS } from "../data/constants";

export default function KalibrasyonPage() {
  return (
    <div>
      <PageHeader
        title="Kalibrasyon Y\u00F6netimi"
        sub="D\u00F6ng\u00FC takibi \u00B7 Otomatik bildirim servisi"
      />

      {/* Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
          borderRadius: 12,
          padding: "14px 20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 22 }}>⚡</span>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              marginBottom: 2,
            }}
          >
            Otomatik Hat\u0131rlat\u0131c\u0131 Aktif — Nightly Cron 03:00
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
            30 g\u00FCn kala teknisyen + sat\u0131\u015F ekibine bildirim g\u00F6nderilir.
          </div>
        </div>

        {[
          ["2", "Kritik", T.red],
          ["1", "30 g\u00FCn", T.amber],
          ["3", "60 g\u00FCn", T.blue],
        ].map(([v, l, col]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: col,
                fontFamily: "Sora, sans-serif",
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                marginTop: 1,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {[
                "Cihaz",
                "M\u00FC\u015Fteri",
                "Seri No",
                "D\u00F6ng\u00FC",
                "Son. Kal.",
                "Kalan",
                "Durum",
                "\u0130\u015Flem",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "9px 13px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.textSub,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {DEVICES_DB.sort((a, b) => a.calDays - b.calDays).map((d, i) => {
              const c = CUSTOMERS.find((c) => c.id === d.customerId);

              const col =
                d.calDays <= 15
                  ? T.red
                  : d.calDays <= 30
                    ? T.amber
                    : d.calDays <= 60
                      ? T.blue
                      : T.green;

              const lbl =
                d.calDays <= 15
                  ? "\u26A0 Kritik"
                  : d.calDays <= 30
                    ? "Yakla\u015F\u0131yor"
                    : d.calDays <= 60
                      ? "Planl\u0131"
                      : "Normal";

              const bgL =
                d.calDays <= 15
                  ? T.redLight
                  : d.calDays <= 30
                    ? T.amberLight
                    : d.calDays <= 60
                      ? T.blueLight
                      : T.greenLight;

              return (
                <tr
                  key={d.id}
                  className="rh"
                  style={{
                    borderBottom:
                      i < DEVICES_DB.length - 1
                        ? `1px solid ${T.border}`
                        : "none",
                  }}
                >
                  <td style={{ padding: "11px 13px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {d.marka} {d.model}
                    </div>
                  </td>

                  <td
                    style={{
                      padding: "11px 13px",
                      fontSize: 12,
                      color: T.textSub,
                    }}
                  >
                    {c?.kurumAdi}
                  </td>

                  <td
                    style={{
                      padding: "11px 13px",
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: T.teal,
                    }}
                  >
                    {d.seriNo}
                  </td>

                  <td
                    style={{
                      padding: "11px 13px",
                      fontSize: 12,
                      color: T.textSub,
                    }}
                  >
                    {d.kalPeriod} Ay
                  </td>

                  <td
                    style={{
                      padding: "11px 13px",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {d.nextCal}
                  </td>

                  <td style={{ padding: "11px 13px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 5,
                          background: "#E2E8F0",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.max(5, Math.min(100, ((30 - d.calDays) / 30) * 100))}%`,
                            background: col,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{ fontSize: 13, fontWeight: 700, color: col }}
                      >
                        {d.calDays}g
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: "11px 13px" }}>
                    <Badge label={lbl} bg={bgL} color={col} />
                  </td>

                  <td style={{ padding: "11px 13px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn-g"
                        style={{ padding: "4px 9px", fontSize: 11 }}
                      >
                        Randevu
                      </button>
                      <button
                        className="btn-g"
                        style={{ padding: "4px 9px", fontSize: 11 }}
                      >
                        Teklif
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
