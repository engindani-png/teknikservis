import { useState, useMemo } from "react";
import { T } from "../theme";
import {
  PageHeader,
  Card,
  Badge,
  SLabel,
  Modal,
  FInput,
  FSelect,
  FTextarea,
} from "../components/shared";
import {
  CUSTOMERS,
  USERS,
  quoteStatusCfg,
  fmtMoney,
} from "../data/constants";

/* ═══════════ TEKLİFLER ═══════════ */

export default function TekliflerPage({ ctx }) {
  const { quotes, setQuotes, services } = ctx;
  const [sel, setSel] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [filterSt, setFilterSt] = useState("Tümü");

  const list =
    filterSt === "Tümü" ? quotes : quotes.filter((q) => q.status === filterSt);

  const QS = [
    "Taslak",
    "Onay Bekleniyor",
    "Onaylandı",
    "Reddedildi",
    "Faturalandı",
  ];

  const calcTotal = (items) =>
    items.reduce((a, b) => a + (parseFloat(b.toplam) || 0), 0);

  return (
    <div>
      <PageHeader
        title="Teklifler"
        sub="Servis teklif yönetimi"
        actions={[
          <button
            key="n"
            className="btn-p"
            onClick={() => setShowNew(true)}
          >
            + Yeni Teklif
          </button>,
        ]}
      />

      {/* Status filter buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {["Tümü", ...QS].map((s) => {
          const cnt =
            s === "Tümü"
              ? quotes.length
              : quotes.filter((q) => q.status === s).length;
          const cfg = quoteStatusCfg[s] || {
            bg: "#F1F5F9",
            color: "#64748B",
          };
          return (
            <button
              key={s}
              onClick={() => setFilterSt(s)}
              style={{
                background: filterSt === s ? cfg.bg : T.surface,
                border: `1px solid ${
                  filterSt === s ? cfg.color + "44" : T.border
                }`,
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 12,
                color: filterSt === s ? cfg.color : T.textSub,
                transition: "all 0.15s",
              }}
            >
              {s}{" "}
              <span
                style={{
                  background: "rgba(0,0,0,0.08)",
                  borderRadius: 8,
                  padding: "0 5px",
                  marginLeft: 4,
                }}
              >
                {cnt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main grid: table + detail panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: sel ? "1fr 420px" : "1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "Teklif No",
                  "Müşteri",
                  "Tarih",
                  "Geçerlilik",
                  "Durum",
                  "Tutar",
                  "Servis Bağ.",
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
              {list.map((q, i) => {
                const c = CUSTOMERS.find((c) => c.id === q.customerId);
                const st = quoteStatusCfg[q.status] || {};
                const sub = calcTotal(q.items);
                const kdv = (sub * q.kdv) / 100;
                const total = sub + kdv;
                const hasSvc = !!q.serviceId;

                return (
                  <tr
                    key={q.id}
                    className="rh"
                    onClick={() =>
                      setSel(sel?.id === q.id ? null : q)
                    }
                    style={{
                      borderBottom:
                        i < list.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                      background:
                        sel?.id === q.id ? "#F0FDFA" : "white",
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
                      {q.id}
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
                    <td
                      style={{
                        padding: "11px 13px",
                        fontSize: 12,
                        color: T.textSub,
                      }}
                    >
                      {q.tarih}
                    </td>
                    <td
                      style={{
                        padding: "11px 13px",
                        fontSize: 12,
                        color: T.textSub,
                      }}
                    >
                      {q.gecerlilik}
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      <Badge
                        label={q.status}
                        bg={st.bg}
                        color={st.color}
                      />
                    </td>
                    <td
                      style={{
                        padding: "11px 13px",
                        fontWeight: 700,
                        color: T.green,
                      }}
                    >
                      {fmtMoney(total)}
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      {hasSvc ? (
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
                          {q.serviceId}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            color: T.textMuted,
                          }}
                        >
                          —
                        </span>
                      )}
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

        {/* Detail side panel */}
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
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.teal,
                }}
              >
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
              {sel.serviceId && (
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
                  🔧 Bağlı Servis: {sel.serviceId}
                </div>
              )}
              <div
                style={{
                  marginBottom: 10,
                  fontSize: 11,
                  color: T.textSub,
                  display: "flex",
                  gap: 10,
                }}
              >
                <span>📅 {sel.tarih}</span>
                <span>⏳ {sel.gecerlilik}</span>
                <span>
                  👤{" "}
                  {USERS.find((u) => u.id === sel.hazirlayan)?.ad ||
                    "—"}
                </span>
              </div>

              <SLabel title="Kalemler" />

              {sel.items.map((it, i) => {
                const sub =
                  parseFloat(it.birim || 0) *
                  parseFloat(it.qty || 1);
                const disc =
                  (sub * (parseFloat(it.indirim) || 0)) / 100;
                return (
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
                        {it.qty} × {fmtMoney(it.birim)}
                        {it.indirim > 0 && ` − %${it.indirim}`}
                      </div>
                    </div>
                    <div
                      style={{ fontWeight: 700, color: T.green }}
                    >
                      {fmtMoney(it.toplam)}
                    </div>
                  </div>
                );
              })}

              {/* Totals */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  fontSize: 12,
                  color: T.textSub,
                }}
              >
                <span>Ara Toplam</span>
                <span>{fmtMoney(calcTotal(sel.items))}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  fontSize: 12,
                  color: T.textSub,
                }}
              >
                <span>KDV (%{sel.kdv})</span>
                <span>
                  {fmtMoney(
                    (calcTotal(sel.items) * sel.kdv) / 100
                  )}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0 10px",
                  fontWeight: 800,
                  fontSize: 14,
                  borderBottom: `1px solid ${T.border}`,
                  marginBottom: 8,
                }}
              >
                <span>GENEL TOPLAM</span>
                <span style={{ color: T.green }}>
                  {fmtMoney(
                    calcTotal(sel.items) * (1 + sel.kdv / 100)
                  )}
                </span>
              </div>

              {sel.notlar && (
                <div
                  style={{
                    background: "#F8FAFC",
                    borderRadius: 8,
                    padding: "8px 10px",
                    fontSize: 12,
                    color: T.textSub,
                    marginBottom: 10,
                  }}
                >
                  📝 {sel.notlar}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 7,
                }}
              >
                {sel.status === "Onay Bekleniyor" && (
                  <>
                    <button
                      className="btn-p"
                      style={{ padding: "8px", fontSize: 12 }}
                      onClick={() => {
                        setQuotes((p) =>
                          p.map((q) =>
                            q.id === sel.id
                              ? { ...q, status: "Onaylandı" }
                              : q
                          )
                        );
                        setSel((p) => ({
                          ...p,
                          status: "Onaylandı",
                        }));
                      }}
                    >
                      ✓ Onayla
                    </button>
                    <button
                      className="btn-r"
                      style={{ padding: "8px", fontSize: 12 }}
                      onClick={() => {
                        setQuotes((p) =>
                          p.map((q) =>
                            q.id === sel.id
                              ? { ...q, status: "Reddedildi" }
                              : q
                          )
                        );
                        setSel((p) => ({
                          ...p,
                          status: "Reddedildi",
                        }));
                      }}
                    >
                      ✗ Reddet
                    </button>
                  </>
                )}
                <button
                  className="btn-g"
                  style={{ padding: "8px", fontSize: 12 }}
                >
                  📄 PDF
                </button>
                <button
                  className="btn-g"
                  style={{ padding: "8px", fontSize: 12 }}
                >
                  ✉ Mail Gönder
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {showNew && (
        <NewQuoteModal ctx={ctx} onClose={() => setShowNew(false)} />
      )}
    </div>
  );
}

/* ═══════════ YENİ TEKLİF MODAL ═══════════ */

export function NewQuoteModal({
  ctx,
  serviceId = null,
  customerId = null,
  onClose,
}) {
  const [form, setForm] = useState({
    customerId: customerId || "C001",
    serviceId: serviceId || "",
    gecerlilik: "30 Gün",
    kdv: "20",
    notlar: "",
    items: [
      { desc: "", qty: "1", birim: "", indirim: "0", toplam: "" },
    ],
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const calcItem = (it) => {
    const t =
      (parseFloat(it.birim) || 0) *
      (parseFloat(it.qty) || 1) *
      (1 - (parseFloat(it.indirim) || 0) / 100);
    return { ...it, toplam: t.toFixed(2) };
  };

  const updItem = (i, k, v) => {
    const its = [...form.items];
    its[i] = { ...its[i], [k]: v };
    its[i] = calcItem(its[i]);
    setForm((p) => ({ ...p, items: its }));
  };

  const sub = form.items.reduce(
    (a, b) => a + (parseFloat(b.toplam) || 0),
    0
  );
  const total = sub * (1 + parseFloat(form.kdv || 20) / 100);

  const save = () => {
    const id = "TK-2026-" + String(ctx.quotes.length + 100);
    const today = new Date().toLocaleDateString("tr-TR");
    ctx.setQuotes((p) => [
      {
        id,
        customerId: form.customerId,
        serviceId: form.serviceId || null,
        tarih: today,
        gecerlilik: form.gecerlilik,
        status: "Onay Bekleniyor",
        items: form.items.map((it) => ({
          ...it,
          qty: parseFloat(it.qty),
          birim: parseFloat(it.birim),
          indirim: parseFloat(it.indirim || 0),
          toplam: parseFloat(it.toplam || 0),
        })),
        kdv: parseFloat(form.kdv),
        notlar: form.notlar,
        hazirlayan: ctx.user.id,
      },
      ...p,
    ]);
    if (form.serviceId) {
      ctx.setServices((p) =>
        p.map((s) =>
          s.id === form.serviceId
            ? { ...s, quoteId: id, status: "Fiyat Verildi" }
            : s
        )
      );
    }
    onClose();
  };

  return (
    <Modal title="Yeni Teklif Oluştur" onClose={onClose} width={700}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
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
            label="Servis Bağla (opsiyonel)"
            value={form.serviceId}
            onChange={upd("serviceId")}
            options={[
              { value: "", label: "— Bağlantısız —" },
              ...ctx.services.map((s) => ({
                value: s.id,
                label: `${s.id} — ${CUSTOMERS.find(
                  (c) => c.id === s.customerId
                )?.kurumAdi?.substring(0, 20)}`,
              })),
            ]}
          />
        </div>

        <SLabel title="Teklif Kalemleri" />

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 6,
          }}
        >
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {[
                "Açıklama",
                "Adet",
                "Birim (₺)",
                "İndirim %",
                "Toplam",
                "",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "7px 9px",
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
            {form.items.map((it, i) => (
              <tr key={i}>
                <td style={{ padding: "5px 5px" }}>
                  <input
                    value={it.desc}
                    onChange={(e) =>
                      updItem(i, "desc", e.target.value)
                    }
                    style={{
                      width: "100%",
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      padding: "6px 8px",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </td>
                <td style={{ padding: "5px 5px" }}>
                  <input
                    value={it.qty}
                    onChange={(e) =>
                      updItem(i, "qty", e.target.value)
                    }
                    style={{
                      width: 55,
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      padding: "6px 7px",
                      fontSize: 12,
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                </td>
                <td style={{ padding: "5px 5px" }}>
                  <input
                    value={it.birim}
                    onChange={(e) =>
                      updItem(i, "birim", e.target.value)
                    }
                    style={{
                      width: 100,
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      padding: "6px 8px",
                      fontSize: 12,
                      outline: "none",
                      textAlign: "right",
                    }}
                  />
                </td>
                <td style={{ padding: "5px 5px" }}>
                  <input
                    value={it.indirim}
                    onChange={(e) =>
                      updItem(i, "indirim", e.target.value)
                    }
                    style={{
                      width: 60,
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      padding: "6px 7px",
                      fontSize: 12,
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                </td>
                <td
                  style={{
                    padding: "5px 9px",
                    fontWeight: 700,
                    color: T.green,
                    fontSize: 13,
                  }}
                >
                  {it.toplam
                    ? `₺${parseFloat(it.toplam).toLocaleString(
                        "tr-TR"
                      )}`
                    : "—"}
                </td>
                <td>
                  <button
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        items: p.items.filter((_, j) => j !== i),
                      }))
                    }
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: T.red,
                      fontSize: 16,
                    }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() =>
              setForm((p) => ({
                ...p,
                items: [
                  ...p.items,
                  {
                    desc: "",
                    qty: "1",
                    birim: "",
                    indirim: "0",
                    toplam: "",
                  },
                ],
              }))
            }
            style={{
              background: "none",
              border: `1px dashed ${T.border}`,
              borderRadius: 7,
              padding: "6px 12px",
              fontSize: 12,
              color: T.textSub,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            + Satır Ekle
          </button>
          <div style={{ textAlign: "right", fontSize: 12 }}>
            <div style={{ color: T.textSub }}>
              KDV ({form.kdv}%):{" "}
              {fmtMoney((sub * parseFloat(form.kdv)) / 100)}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: T.teal,
              }}
            >
              Toplam: {fmtMoney(total)}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <FInput
            label="Geçerlilik Süresi"
            value={form.gecerlilik}
            onChange={upd("gecerlilik")}
            placeholder="30 Gün"
          />
          <FSelect
            label="KDV %"
            value={form.kdv}
            onChange={upd("kdv")}
            options={["0", "8", "10", "18", "20"]}
          />
        </div>

        <FTextarea
          label="Notlar / Koşullar"
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
            Teklif Oluştur →
          </button>
        </div>
      </div>
    </Modal>
  );
}
