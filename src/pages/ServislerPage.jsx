import { useState } from "react";
import { T } from "../theme";
import {
  Badge,
  Card,
  SLabel,
  FInput,
  FSelect,
  FTextarea,
  Modal,
  PageHeader,
} from "../components/shared";
import {
  CUSTOMERS,
  DEVICES_DB,
  SVC_STATUSES,
  SVC_STATUS_CFG,
  TECHS,
  fmtMoney,
} from "../data/constants";

/* ═══════════ SERVİS & TAKİP ═══════════ */

export default function ServislerPage({ ctx }) {
  const {
    services,
    setServices,
    quotes,
    setQuotes,
    appointments,
    setAppointments,
  } = ctx;

  const [stFilter, setStFilter] = useState("Tümü");
  const [sel, setSel] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showAptModal, setShowAptModal] = useState(false);

  const list =
    stFilter === "Tümü"
      ? services
      : services.filter((s) => s.status === stFilter);

  const advanceStatus = (svc) => {
    const idx = SVC_STATUSES.indexOf(svc.status);
    if (idx < SVC_STATUSES.length - 1) {
      const newStatus = SVC_STATUSES[idx + 1];
      setServices((p) =>
        p.map((s) => (s.id === svc.id ? { ...s, status: newStatus } : s))
      );
      setSel((p) => (p ? { ...p, status: newStatus } : p));
    }
  };

  return (
    <div>
      <PageHeader
        title="Servis & Takip"
        sub="Tüm servis talepleri ve iş emirleri"
        actions={[
          <button
            key="n"
            className="btn-p"
            onClick={() => setShowNewModal(true)}
          >
            + Yeni Servis Formu
          </button>,
        ]}
      />

      {/* Status filter bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8,1fr)",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {["Tümü", ...SVC_STATUSES].map((s) => {
          const cnt =
            s === "Tümü"
              ? services.length
              : services.filter((x) => x.status === s).length;
          const cfg = SVC_STATUS_CFG[s] || { bg: "#F1F5F9", color: "#64748B" };
          const isActive = stFilter === s;

          return (
            <div
              key={s}
              className="rh"
              onClick={() => setStFilter(s)}
              style={{
                background: isActive ? cfg.bg : T.surface,
                border: `1px solid ${isActive ? cfg.color + "44" : T.border}`,
                borderRadius: 9,
                padding: "10px 8px",
                textAlign: "center",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  fontFamily: "Sora,sans-serif",
                  color: isActive ? cfg.color : T.text,
                }}
              >
                {cnt}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: isActive ? cfg.color : T.textSub,
                  marginTop: 2,
                  lineHeight: 1.3,
                }}
              >
                {s}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: sel ? "1fr 380px" : "1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "Form No",
                  "Müşteri",
                  "Çağrı",
                  "Durum",
                  "Garanti",
                  "Tutar",
                  "Tarih",
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
              {list.map((s, i) => {
                const c = CUSTOMERS.find((c) => c.id === s.customerId);
                const st = SVC_STATUS_CFG[s.status] || {};

                return (
                  <tr
                    key={s.id}
                    className="rh"
                    onClick={() => setSel(sel?.id === s.id ? null : s)}
                    style={{
                      borderBottom:
                        i < list.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                      background: sel?.id === s.id ? "#F0FDFA" : "white",
                    }}
                  >
                    <td
                      style={{
                        padding: "11px 13px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: T.teal,
                      }}
                    >
                      {s.id}
                    </td>
                    <td
                      style={{
                        padding: "11px 13px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {c?.kurumAdi}
                    </td>
                    <td style={{ padding: "11px 13px", fontSize: 12 }}>
                      {s.callType === "Telefon" ? "\u{1F4DE}" : "\u{1F4E7}"}{" "}
                      {s.callType}
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      <Badge label={s.status} bg={st.bg} color={st.color} />
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      <Badge
                        label={s.warrantyActive ? "Garantide" : "Ücretli"}
                        bg={s.warrantyActive ? T.greenLight : T.redLight}
                        color={s.warrantyActive ? T.green : T.red}
                      />
                    </td>
                    <td
                      style={{
                        padding: "11px 13px",
                        fontWeight: 700,
                        color: s.amount ? T.green : T.textMuted,
                      }}
                    >
                      {s.amount ? fmtMoney(s.amount) : "\u2014"}
                    </td>
                    <td
                      style={{
                        padding: "11px 13px",
                        fontSize: 11,
                        color: T.textMuted,
                      }}
                    >
                      {s.created}
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      <button
                        className="btn-g"
                        style={{ padding: "4px 9px", fontSize: 11 }}
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {sel && (
          <Card style={{ position: "sticky", top: 0 }}>
            <div
              style={{
                padding: "13px 16px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: T.teal }}>
                {sel.id}
              </span>
              <button
                onClick={() => setSel(null)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 22,
                  color: T.textMuted,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: 15 }}>
              {!sel.warrantyActive && (
                <div
                  style={{
                    background: T.redLight,
                    border: "1px solid #FECACA",
                    borderRadius: 8,
                    padding: "8px 10px",
                    marginBottom: 10,
                    fontSize: 12,
                    color: T.red,
                    fontWeight: 600,
                  }}
                >
                  {"\u26A0"} Garanti d{"\u0131"}{"\u015F"}{"\u0131"} — Ücretli servis
                </div>
              )}
              <div
                style={{
                  fontSize: 12,
                  color: T.textSub,
                  marginBottom: 10,
                  background: "#F8FAFC",
                  borderRadius: 8,
                  padding: "8px 10px",
                  lineHeight: 1.6,
                }}
              >
                {sel.fault}
              </div>

              {/* Pipeline */}
              <div
                style={{
                  display: "flex",
                  marginBottom: 10,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                {SVC_STATUSES.map((step, i) => {
                  const idx = SVC_STATUSES.indexOf(sel.status);
                  return (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        padding: "5px 2px",
                        textAlign: "center",
                        fontSize: 8,
                        fontWeight: 700,
                        background: i <= idx ? T.teal : "#E2E8F0",
                        color: i <= idx ? "white" : "#94A3B8",
                        overflow: "hidden",
                      }}
                    >
                      {step.split(" ")[0]}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginBottom: 10,
                  fontSize: 11,
                  color: T.textSub,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span>{"\u{1F4C5}"} {sel.created}</span>
                <span>{"\u{1F464}"} {TECHS[sel.techId] || "Atanmad\u0131"}</span>
                {sel.randevuTarihi && (
                  <span>
                    {"\u{1F4C6}"} {sel.randevuTarihi} {sel.randevuSaat}
                  </span>
                )}
              </div>

              {sel.quoteId && (
                <div
                  style={{
                    background: T.tealLight,
                    borderRadius: 8,
                    padding: "7px 10px",
                    fontSize: 12,
                    color: T.tealDark,
                    marginBottom: 10,
                    fontWeight: 600,
                  }}
                >
                  {"\u{1F4CB}"} Teklif: {sel.quoteId}
                </div>
              )}

              {sel.items.length > 0 && (
                <>
                  <SLabel title="Kalemler" />
                  {sel.items.map((it, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom: `1px solid ${T.border}`,
                        fontSize: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{it.desc}</div>
                        <div style={{ color: T.textMuted }}>
                          {it.tip} · {it.qty} × {fmtMoney(it.birim)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: T.green }}>
                        {fmtMoney(it.toplam)}
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0 4px",
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    <span>TOPLAM</span>
                    <span style={{ color: T.green }}>
                      {fmtMoney(sel.items.reduce((a, b) => a + b.toplam, 0))}
                    </span>
                  </div>
                </>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 7,
                  marginTop: 10,
                }}
              >
                <button
                  className="btn-p"
                  style={{ padding: "8px", fontSize: 12, borderRadius: 8 }}
                  onClick={() => advanceStatus(sel)}
                >
                  {"\u2192"} İlerlet
                </button>
                <button
                  className="btn-g"
                  style={{ padding: "8px", fontSize: 12 }}
                  onClick={() => setShowQuoteModal(true)}
                >
                  + Teklif
                </button>
                <button
                  className="btn-g"
                  style={{ padding: "8px", fontSize: 12 }}
                  onClick={() => setShowAptModal(true)}
                >
                  {"\u{1F4C5}"} Randevu
                </button>
                <button
                  className="btn-g"
                  style={{ padding: "8px", fontSize: 12 }}
                >
                  {"\u{1F4C4}"} Yazd{"\u0131"}r
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {showNewModal && (
        <NewServiceModal ctx={ctx} onClose={() => setShowNewModal(false)} />
      )}
      {showQuoteModal && sel && (
        <NewQuoteModal
          ctx={ctx}
          serviceId={sel.id}
          customerId={sel.customerId}
          onClose={() => setShowQuoteModal(false)}
        />
      )}
      {showAptModal && sel && (
        <NewAppointmentModal
          ctx={ctx}
          serviceId={sel.id}
          customerId={sel.customerId}
          onClose={() => setShowAptModal(false)}
        />
      )}
    </div>
  );
}

/* ─── Placeholder for NewQuoteModal (to be extracted separately) ─── */
function NewQuoteModal({ ctx, serviceId, customerId, onClose }) {
  return (
    <Modal title="Yeni Teklif" onClose={onClose}>
      <p style={{ fontSize: 13, color: T.textSub }}>
        Teklif formu henüz bu modüle taşınmadı.
      </p>
    </Modal>
  );
}

/* ═══════════ NewServiceModal ═══════════ */

export function NewServiceModal({ ctx, onClose }) {
  const [form, setForm] = useState({
    customerId: "C001",
    deviceId: "",
    callType: "Telefon",
    fault: "",
    techId: "",
    warrantyActive: false,
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const custDevs = DEVICES_DB.filter((d) => d.customerId === form.customerId);

  const save = () => {
    const id =
      "SF-2026-" + String(ctx.services.length + 100).padStart(4, "0");
    ctx.setServices((p) => [
      {
        id,
        customerId: form.customerId,
        deviceId: form.deviceId,
        callType: form.callType,
        fault: form.fault,
        status: "Açık",
        techId: form.techId || null,
        warrantyActive: form.warrantyActive,
        created: new Date().toLocaleDateString("tr-TR"),
        amount: null,
        quoteId: null,
        randevuTarihi: null,
        randevuSaat: null,
        items: [],
      },
      ...p,
    ]);
    onClose();
  };

  return (
    <Modal title="Yeni Servis Formu" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <FSelect
          label="Müşteri"
          value={form.customerId}
          onChange={upd("customerId")}
          options={CUSTOMERS.map((c) => ({
            value: c.id,
            label: c.kurumAdi,
          }))}
        />
        <FSelect
          label="Cihaz"
          value={form.deviceId}
          onChange={upd("deviceId")}
          options={[
            { value: "", label: "— Seçiniz —" },
            ...custDevs.map((d) => ({
              value: d.id,
              label: `${d.marka} ${d.model} (${d.seriNo})`,
            })),
          ]}
        />
        <FSelect
          label="Çağrı Tipi"
          value={form.callType}
          onChange={upd("callType")}
          options={["Telefon", "Mail", "İhale", "Ziyaret"]}
        />
        <FTextarea
          label="Arıza/Talep Açıklaması"
          value={form.fault}
          onChange={upd("fault")}
          rows={3}
        />
        <FSelect
          label="Teknisyen"
          value={form.techId}
          onChange={upd("techId")}
          options={[
            { value: "", label: "— Atanmadı —" },
            { value: "2", label: "Ali Kaya" },
            { value: "3", label: "Mert Demir" },
            { value: "4", label: "Zeynep Arslan" },
          ]}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            id="wac"
            checked={form.warrantyActive}
            onChange={(e) => upd("warrantyActive")(e.target.checked)}
          />
          <label htmlFor="wac" style={{ fontSize: 13, fontWeight: 600 }}>
            Garanti kapsamında
          </label>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 8,
          }}
        >
          <button className="btn-g" onClick={onClose}>
            İptal
          </button>
          <button className="btn-p" onClick={save}>
            Kaydet {"\u2192"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════ NewAppointmentModal ═══════════ */

export function NewAppointmentModal({ ctx, serviceId, customerId, onClose }) {
  const [form, setForm] = useState({
    tarih: "2026-03-15",
    saat: "10:00",
    techId: "2",
    tip: "Arıza Müdahale",
    notlar: "",
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    const id =
      "RN-" + String(ctx.appointments.length + 100).padStart(3, "0");
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <FInput
            label="Tarih"
            value={form.tarih}
            onChange={upd("tarih")}
            type="date"
          />
          <FInput
            label="Saat"
            value={form.saat}
            onChange={upd("saat")}
            type="time"
          />
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
        <FTextarea
          label="Notlar"
          value={form.notlar}
          onChange={upd("notlar")}
          rows={2}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 6,
          }}
        >
          <button className="btn-g" onClick={onClose}>
            İptal
          </button>
          <button className="btn-p" onClick={save}>
            Takvime Ekle {"\u2192"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
