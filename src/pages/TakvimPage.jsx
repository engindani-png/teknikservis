import { useState, useMemo } from "react";
import { T } from "../theme";
import {
  PageHeader,
  Card,
  Badge,
  Modal,
  IRow,
  FInput,
  FSelect,
  FTextarea,
} from "../components/shared";
import {
  CUSTOMERS,
  TECHS,
  aptStatusCfg,
} from "../data/constants";

/* ── NewAppointmentModal (local) ── */
function NewAppointmentModal({ ctx, serviceId, customerId, onClose }) {
  const [form, setForm] = useState({
    tarih: "2026-03-15",
    saat: "10:00",
    techId: "2",
    tip: "Arıza Müdahale",
    notlar: "",
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    const id = "RN-" + String(ctx.appointments.length + 100).padStart(3, "0");
    ctx.setAppointments((p) => [
      ...p,
      {
        id,
        tarih: form.tarih,
        saat: form.saat,
        customerId,
        serviceId,
        techId: parseInt(form.techId),
        tip: form.tip,
        notlar: form.notlar,
        status: "Planlandı",
      },
    ]);
    ctx.setServices((p) =>
      p.map((s) =>
        s.id === serviceId
          ? { ...s, randevuTarihi: form.tarih, randevuSaat: form.saat }
          : s
      )
    );
    onClose();
  };

  return (
    <Modal title="Randevu Oluştur" onClose={onClose} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FInput label="Tarih" value={form.tarih} onChange={upd("tarih")} type="date" />
          <FInput label="Saat" value={form.saat} onChange={upd("saat")} type="time" />
        </div>

        <FSelect
          label="Teknisyen"
          value={form.techId}
          onChange={upd("techId")}
          options={[
            { value: "2", label: "Ali Kaya" },
            { value: "3", label: "Mert Demir" },
            { value: "4", label: "Zeynep Arslan" },
          ]}
        />

        <FSelect
          label="Randevu Tipi"
          value={form.tip}
          onChange={upd("tip")}
          options={[
            "Arıza Müdahale",
            "Periyodik Bakım",
            "Kalibrasyon",
            "Parça Değişim",
            "Yazılım Güncelleme",
            "Kontrol",
          ]}
        />

        <FTextarea label="Notlar" value={form.notlar} onChange={upd("notlar")} rows={2} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
          <button className="btn-g" onClick={onClose}>
            İptal
          </button>
          <button className="btn-p" onClick={save}>
            Takvime Ekle →
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════ TAKVİM PAGE ═══════════ */
export default function TakvimPage({ ctx }) {
  const { appointments, setAppointments } = ctx;
  const [viewMode, setViewMode] = useState("hafta");
  const [showNew, setShowNew] = useState(false);
  const [selApt, setSelApt] = useState(null);

  /* ── Build week grid (Mon-Sun around today) ── */
  const today = new Date(2026, 2, 10); // March 10, 2026
  const dow = today.getDay() || 7; // Mon=1..Sun=7
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - (dow - 1));

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const HOURS = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  ];
  const DAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const MONTHS_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];

  const techColors = {
    2:    { bg: "#DBEAFE", color: "#1D4ED8" },
    3:    { bg: "#FCE7F3", color: "#BE185D" },
    4:    { bg: "#D1FAE5", color: "#065F46" },
    null: { bg: "#F1F5F9", color: "#64748B" },
  };

  const aptForDay = (d) =>
    appointments.filter((a) => {
      const ad = new Date(a.tarih);
      return ad.getDate() === d.getDate() && ad.getMonth() === d.getMonth();
    });

  const aptForHour = (apts, h) =>
    apts.filter((a) => a.saat.startsWith(h.split(":")[0]));

  const tipIcon = {
    "Arıza Müdahale": "🔧",
    "Periyodik Bakım": "🔬",
    "Kalibrasyon": "◎",
    "Parça Değişim": "🔩",
    "Yazılım Güncelleme": "💻",
    "Bakım Anlaşması": "📄",
    "Kontrol": "🔍",
  };

  return (
    <div>
      {/* ── Page Header ── */}
      <PageHeader
        title="Randevu Takvimi"
        sub="Servis ve bakım takvimi — Mart 2026"
        actions={[
          <div
            key="v"
            style={{
              background: "#F1F5F9",
              borderRadius: 8,
              padding: 3,
              display: "flex",
              gap: 2,
            }}
          >
            {[["hafta", "Hafta"], ["liste", "Liste"]].map(([id, lbl]) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 12,
                  background: viewMode === id ? T.surface : "transparent",
                  color: viewMode === id ? T.teal : T.textSub,
                }}
              >
                {lbl}
              </button>
            ))}
          </div>,
          <button key="n" className="btn-p" onClick={() => setShowNew(true)}>
            + Randevu Ekle
          </button>,
        ]}
      />

      {/* ── Legend ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {Object.entries(TECHS).map(([id, name]) => {
          const tc = techColors[parseInt(id)] || {};
          return (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: tc.bg,
                borderRadius: 20,
                padding: "4px 10px",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: tc.color,
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: tc.color }}>
                {name}
              </span>
            </div>
          );
        })}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "#F1F5F9",
            borderRadius: 20,
            padding: "4px 10px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#64748B",
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>
            Atanmadı
          </span>
        </div>
      </div>

      {/* ═══════ WEEK VIEW ═══════ */}
      {viewMode === "hafta" && (
        <Card style={{ overflow: "hidden" }}>
          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px repeat(7,1fr)",
              background: "#F8FAFC",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div style={{ padding: "8px", borderRight: `1px solid ${T.border}` }} />

            {days.map((d, i) => {
              const isToday =
                d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
              return (
                <div
                  key={i}
                  style={{
                    padding: "8px 10px",
                    borderRight: i < 6 ? `1px solid ${T.border}` : "none",
                    textAlign: "center",
                    background: isToday ? "#F0FDFA" : "transparent",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: isToday ? T.teal : T.textMuted,
                    }}
                  >
                    {DAYS_TR[i]}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: isToday ? T.teal : T.text,
                      fontFamily: "Sora,sans-serif",
                    }}
                  >
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hour rows */}
          <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 320px)" }}>
            {HOURS.map((h) => (
              <div
                key={h}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px repeat(7,1fr)",
                  borderBottom: `1px solid ${T.border}`,
                  minHeight: 52,
                }}
              >
                <div
                  style={{
                    padding: "6px 8px",
                    fontSize: 10,
                    color: T.textMuted,
                    fontWeight: 600,
                    borderRight: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: 8,
                  }}
                >
                  {h}
                </div>

                {days.map((d, i) => {
                  const apts = aptForHour(aptForDay(d), h);
                  const isToday =
                    d.getDate() === today.getDate() &&
                    d.getMonth() === today.getMonth();

                  return (
                    <div
                      key={i}
                      style={{
                        borderRight: i < 6 ? `1px solid ${T.border}` : "none",
                        padding: "3px 4px",
                        background: isToday
                          ? "rgba(13,148,136,0.03)"
                          : "transparent",
                        minHeight: 52,
                      }}
                    >
                      {apts.map((a) => {
                        const tc = techColors[a.techId] || {};
                        const c = CUSTOMERS.find((c) => c.id === a.customerId);
                        return (
                          <div
                            key={a.id}
                            onClick={() => setSelApt(a)}
                            style={{
                              background: tc.bg,
                              border: `1px solid ${tc.color}33`,
                              borderLeft: `3px solid ${tc.color}`,
                              borderRadius: 5,
                              padding: "4px 7px",
                              marginBottom: 2,
                              cursor: "pointer",
                              fontSize: 11,
                              lineHeight: 1.4,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 700,
                                color: tc.color,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {tipIcon[a.tip] || "📅"} {a.tip}
                            </div>
                            <div
                              style={{
                                color: tc.color,
                                opacity: 0.8,
                                fontSize: 10,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {c?.kurumAdi?.substring(0, 18)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══════ LIST VIEW ═══════ */}
      {viewMode === "liste" && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "Tarih / Saat",
                  "Tip",
                  "Müşteri",
                  "Servis Bağ.",
                  "Teknisyen",
                  "Durum",
                  "",
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
              {appointments
                .sort((a, b) => a.tarih.localeCompare(b.tarih))
                .map((a, i) => {
                  const c = CUSTOMERS.find((c) => c.id === a.customerId);
                  const tc = techColors[a.techId] || {};
                  const stC = aptStatusCfg[a.status] || {};

                  return (
                    <tr
                      key={a.id}
                      className="rh"
                      onClick={() => setSelApt(a)}
                      style={{
                        borderBottom:
                          i < appointments.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                      }}
                    >
                      {/* Tarih / Saat */}
                      <td style={{ padding: "11px 13px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{a.tarih}</div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>{a.saat}</div>
                      </td>

                      {/* Tip */}
                      <td style={{ padding: "11px 13px", fontSize: 12, fontWeight: 600 }}>
                        {tipIcon[a.tip] || "📅"} {a.tip}
                      </td>

                      {/* Müşteri */}
                      <td style={{ padding: "11px 13px", fontSize: 12 }}>
                        {c?.kurumAdi}
                      </td>

                      {/* Servis Bağ. */}
                      <td style={{ padding: "11px 13px" }}>
                        {a.serviceId ? (
                          <span
                            style={{
                              fontSize: 11,
                              background: T.tealLight,
                              color: T.teal,
                              borderRadius: 6,
                              padding: "2px 7px",
                              fontFamily: "monospace",
                            }}
                          >
                            {a.serviceId}
                          </span>
                        ) : (
                          <span style={{ color: T.textMuted, fontSize: 11 }}>—</span>
                        )}
                      </td>

                      {/* Teknisyen */}
                      <td style={{ padding: "11px 13px" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: tc.bg,
                            borderRadius: 20,
                            padding: "3px 9px",
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: tc.color,
                            }}
                          />
                          <span style={{ fontSize: 11, fontWeight: 600, color: tc.color }}>
                            {TECHS[a.techId] || "Atanmadı"}
                          </span>
                        </div>
                      </td>

                      {/* Durum */}
                      <td style={{ padding: "11px 13px" }}>
                        <Badge label={a.status} bg={stC.bg} color={stC.color} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "11px 13px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          {a.status === "Planlandı" && (
                            <button
                              className="btn-g"
                              style={{ padding: "4px 8px", fontSize: 11 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAppointments((p) =>
                                  p.map((x) =>
                                    x.id === a.id
                                      ? { ...x, status: "Tamamlandı" }
                                      : x
                                  )
                                );
                              }}
                            >
                              ✓ Tamam
                            </button>
                          )}
                          {a.status === "Planlandı" && (
                            <button
                              className="btn-g"
                              style={{ padding: "4px 8px", fontSize: 11 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAppointments((p) =>
                                  p.map((x) =>
                                    x.id === a.id ? { ...x, status: "İptal" } : x
                                  )
                                );
                              }}
                            >
                              ✗
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Card>
      )}

      {/* ═══════ APPOINTMENT DETAIL MODAL ═══════ */}
      {selApt && (
        <Modal title="Randevu Detayı" onClose={() => setSelApt(null)} width={420}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge label={selApt.tip} bg={T.blueLight} color={T.blue} />
              <Badge
                label={selApt.status}
                bg={aptStatusCfg[selApt.status]?.bg}
                color={aptStatusCfg[selApt.status]?.color}
              />
            </div>

            <IRow label="Tarih / Saat" value={`${selApt.tarih} ${selApt.saat}`} />
            <IRow
              label="Müşteri"
              value={CUSTOMERS.find((c) => c.id === selApt.customerId)?.kurumAdi}
            />
            <IRow label="Teknisyen" value={TECHS[selApt.techId] || "Atanmadı"} />
            {selApt.serviceId && <IRow label="Servis No" value={selApt.serviceId} />}

            {selApt.notlar && (
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 12,
                  color: T.textSub,
                }}
              >
                {selApt.notlar}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 6,
              }}
            >
              {selApt.status === "Planlandı" && (
                <button
                  className="btn-p"
                  style={{ padding: "9px", fontSize: 12 }}
                  onClick={() => {
                    setAppointments((p) =>
                      p.map((x) =>
                        x.id === selApt.id ? { ...x, status: "Tamamlandı" } : x
                      )
                    );
                    setSelApt(null);
                  }}
                >
                  ✓ Tamamlandı
                </button>
              )}
              {selApt.status === "Planlandı" && (
                <button
                  className="btn-r"
                  style={{ padding: "9px", fontSize: 12 }}
                  onClick={() => {
                    setAppointments((p) =>
                      p.map((x) =>
                        x.id === selApt.id ? { ...x, status: "İptal" } : x
                      )
                    );
                    setSelApt(null);
                  }}
                >
                  ✗ İptal
                </button>
              )}
              <button
                className="btn-g"
                style={{ padding: "9px", fontSize: 12, gridColumn: "1/-1" }}
                onClick={() => setSelApt(null)}
              >
                Kapat
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ═══════ NEW APPOINTMENT MODAL ═══════ */}
      {showNew && (
        <NewAppointmentModal
          ctx={ctx}
          serviceId={null}
          customerId={null}
          onClose={() => setShowNew(false)}
        />
      )}
    </div>
  );
}
