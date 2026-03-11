import { useState, useMemo } from "react";
import { T } from "../theme";
import {
  PageHeader,
  Card,
  Badge,
  IRow,
  SLabel,
  Modal,
  FInput,
  FSelect,
  FTextarea,
} from "../components/shared";
import { CUSTOMERS, orderStatusCfg, fmtMoney } from "../data/constants";

const TIPS = ["Sarf Siparişi", "Aksesuar Siparişi", "Hizmet Siparişi"];

export function NewOrderModal({ ctx, onClose }) {
  const [form, setForm] = useState({
    tip: "Sarf Siparişi",
    customerId: "",
    serviceId: "",
    tedarikci: "",
    notlar: "",
    items: [{ stokId: "", ad: "", qty: "1", birimFiyat: "", toplam: "" }],
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const updItem = (i, k, v) => {
    const its = [...form.items];
    its[i] = { ...its[i], [k]: v };
    if (its[i].qty && its[i].birimFiyat) {
      its[i].toplam = (
        parseFloat(its[i].qty) * parseFloat(its[i].birimFiyat)
      ).toFixed(2);
    }
    setForm((p) => ({ ...p, items: its }));
  };

  const total = form.items.reduce((a, b) => a + (parseFloat(b.toplam) || 0), 0);

  const save = () => {
    const id =
      "SP-2026-" + String(ctx.orders.length + 100).padStart(4, "0");
    ctx.setOrders((p) => [
      {
        id,
        tip: form.tip,
        customerId: form.customerId || null,
        serviceId: form.serviceId || null,
        status: "Beklemede",
        tarih: new Date().toLocaleDateString("tr-TR"),
        tedarikci: form.tedarikci,
        items: form.items.map((it) => ({
          ...it,
          qty: parseFloat(it.qty),
          birimFiyat: parseFloat(it.birimFiyat),
          toplam: parseFloat(it.toplam || 0),
        })),
        toplam: total,
        notlar: form.notlar,
        irsaliyeNo: null,
      },
      ...p,
    ]);
    onClose();
  };

  return (
    <Modal title="Yeni Sipariş" onClose={onClose} width={620}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FSelect
            label="Sipariş Tipi"
            value={form.tip}
            onChange={upd("tip")}
            options={TIPS}
          />
          <FInput
            label="Tedarikçi"
            value={form.tedarikci}
            onChange={upd("tedarikci")}
            placeholder="Philips Türkiye, GE..."
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FSelect
            label="Müşteri (opsiyonel)"
            value={form.customerId}
            onChange={upd("customerId")}
            options={[
              { value: "", label: "— Stok Siparişi —" },
              ...CUSTOMERS.map((c) => ({ value: c.id, label: c.kurumAdi })),
            ]}
          />
          <FSelect
            label="Servis Bağla (opsiyonel)"
            value={form.serviceId}
            onChange={upd("serviceId")}
            options={[
              { value: "", label: "— Bağlantısız —" },
              ...ctx.services.map((s) => ({ value: s.id, label: s.id })),
            ]}
          />
        </div>

        <SLabel title="Kalemler" />

        {form.items.map((it, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
              gap: 6,
              marginBottom: 6,
            }}
          >
            <input
              value={it.ad}
              onChange={(e) => updItem(i, "ad", e.target.value)}
              placeholder="Ürün adı"
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 7,
                padding: "7px 9px",
                fontSize: 12,
                outline: "none",
              }}
            />
            <input
              value={it.qty}
              onChange={(e) => updItem(i, "qty", e.target.value)}
              placeholder="Adet"
              type="number"
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 7,
                padding: "7px 9px",
                fontSize: 12,
                outline: "none",
              }}
            />
            <input
              value={it.birimFiyat}
              onChange={(e) => updItem(i, "birimFiyat", e.target.value)}
              placeholder="₺ Birim"
              type="number"
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 7,
                padding: "7px 9px",
                fontSize: 12,
                outline: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 13,
                fontWeight: 700,
                color: T.green,
              }}
            >
              {it.toplam ? fmtMoney(it.toplam) : "—"}
            </div>
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
                padding: "0 4px",
              }}
            >
              ×
            </button>
          </div>
        ))}

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
                  { stokId: "", ad: "", qty: "1", birimFiyat: "", toplam: "" },
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
          <div style={{ fontWeight: 800, fontSize: 14, color: T.teal }}>
            Toplam: {fmtMoney(total)}
          </div>
        </div>

        <FTextarea label="Notlar" value={form.notlar} onChange={upd("notlar")} rows={2} />

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
            Sipariş Oluştur →
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function SiparislerPage({ ctx }) {
  const { orders, setOrders } = ctx;
  const [sel, setSel] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [tipFilter, setTipFilter] = useState("Tümü");

  const list = useMemo(
    () => (tipFilter === "Tümü" ? orders : orders.filter((o) => o.tip === tipFilter)),
    [tipFilter, orders]
  );

  return (
    <div>
      <PageHeader
        title="Sipariş Yönetimi"
        sub="Sarf, aksesuar ve hizmet siparişleri"
        actions={[
          <button key="n" className="btn-p" onClick={() => setShowNew(true)}>
            + Yeni Sipariş
          </button>,
        ]}
      />

      {/* Tip filter buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["Tümü", ...TIPS].map((t) => {
          const cnt =
            t === "Tümü" ? orders.length : orders.filter((o) => o.tip === t).length;
          const active = tipFilter === t;
          return (
            <button
              key={t}
              onClick={() => setTipFilter(t)}
              style={{
                background: active ? T.teal : T.surface,
                border: `1px solid ${active ? T.teal : T.border}`,
                borderRadius: 8,
                padding: "7px 14px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 12,
                color: active ? "white" : T.textSub,
              }}
            >
              {t} ({cnt})
            </button>
          );
        })}
      </div>

      {/* Main content grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: sel ? "1fr 360px" : "1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "Sipariş No",
                  "Tip",
                  "Müşteri",
                  "Tedarikçi",
                  "Durum",
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
              {list.map((o, i) => {
                const c = CUSTOMERS.find((c) => c.id === o.customerId);
                const st = orderStatusCfg[o.status] || {};
                const tipC =
                  o.tip === "Sarf Siparişi"
                    ? { bg: T.roseLight, color: T.rose }
                    : o.tip === "Aksesuar Siparişi"
                      ? { bg: T.purpleLight, color: T.purple }
                      : { bg: T.tealLight, color: T.teal };

                return (
                  <tr
                    key={o.id}
                    className="rh"
                    onClick={() => setSel(sel?.id === o.id ? null : o)}
                    style={{
                      borderBottom:
                        i < list.length - 1 ? `1px solid ${T.border}` : "none",
                      background: sel?.id === o.id ? "#F0FDFA" : "white",
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
                      {o.id}
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      <Badge label={o.tip} bg={tipC.bg} color={tipC.color} />
                    </td>
                    <td style={{ padding: "11px 13px", fontSize: 12 }}>
                      {c?.kurumAdi || (
                        <span style={{ color: T.textMuted }}>Stok Siparişi</span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "11px 13px",
                        fontSize: 12,
                        color: T.textSub,
                      }}
                    >
                      {o.tedarikci}
                    </td>
                    <td style={{ padding: "11px 13px" }}>
                      <Badge label={o.status} bg={st.bg} color={st.color} />
                    </td>
                    <td
                      style={{
                        padding: "11px 13px",
                        fontWeight: 700,
                        color: T.green,
                      }}
                    >
                      {fmtMoney(o.toplam)}
                    </td>
                    <td
                      style={{
                        padding: "11px 13px",
                        fontSize: 11,
                        color: T.textMuted,
                      }}
                    >
                      {o.tarih}
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

        {/* Side detail panel */}
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
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <Badge
                  label={sel.tip}
                  bg={
                    sel.tip === "Sarf Siparişi"
                      ? T.roseLight
                      : sel.tip === "Aksesuar Siparişi"
                        ? T.purpleLight
                        : T.tealLight
                  }
                  color={
                    sel.tip === "Sarf Siparişi"
                      ? T.rose
                      : sel.tip === "Aksesuar Siparişi"
                        ? T.purple
                        : T.teal
                  }
                />
                <Badge
                  label={sel.status}
                  bg={orderStatusCfg[sel.status]?.bg}
                  color={orderStatusCfg[sel.status]?.color}
                />
              </div>

              <IRow label="Tedarikçi" value={sel.tedarikci} />
              <IRow label="Tarih" value={sel.tarih} />
              {sel.serviceId && <IRow label="Bağlı Servis" value={sel.serviceId} />}
              {sel.irsaliyeNo && (
                <IRow label="İrsaliye No" value={sel.irsaliyeNo} mono />
              )}
              {sel.notlar && (
                <div
                  style={{
                    background: "#F8FAFC",
                    borderRadius: 8,
                    padding: "7px 10px",
                    fontSize: 12,
                    color: T.textSub,
                    marginTop: 8,
                  }}
                >
                  {sel.notlar}
                </div>
              )}

              <SLabel title="Sipariş Kalemleri" />

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
                    <div style={{ fontWeight: 600 }}>{it.ad}</div>
                    <div style={{ color: T.textMuted }}>
                      {it.qty} × {fmtMoney(it.birimFiyat)}
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
                <span style={{ color: T.green }}>{fmtMoney(sel.toplam)}</span>
              </div>

              {/* Action buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 7,
                  marginTop: 10,
                }}
              >
                {sel.status === "Beklemede" && (
                  <button
                    className="btn-p"
                    style={{ padding: "8px", fontSize: 12 }}
                    onClick={() => {
                      setOrders((p) =>
                        p.map((o) =>
                          o.id === sel.id ? { ...o, status: "Onaylandı" } : o
                        )
                      );
                      setSel((p) => ({ ...p, status: "Onaylandı" }));
                    }}
                  >
                    Onayla
                  </button>
                )}
                {sel.status === "Onaylandı" && (
                  <button
                    className="btn-p"
                    style={{ padding: "8px", fontSize: 12 }}
                    onClick={() => {
                      setOrders((p) =>
                        p.map((o) =>
                          o.id === sel.id ? { ...o, status: "Siparişte" } : o
                        )
                      );
                      setSel((p) => ({ ...p, status: "Siparişte" }));
                    }}
                  >
                    Siparişe Ver
                  </button>
                )}
                {sel.status === "Siparişte" && (
                  <button
                    className="btn-p"
                    style={{ padding: "8px", fontSize: 12 }}
                    onClick={() => {
                      setOrders((p) =>
                        p.map((o) =>
                          o.id === sel.id
                            ? { ...o, status: "Teslim Edildi" }
                            : o
                        )
                      );
                      setSel((p) => ({ ...p, status: "Teslim Edildi" }));
                      ctx.setStockDb((p) =>
                        p.map((s) => {
                          const it = sel.items.find((i) => i.stokId === s.id);
                          if (it) return { ...s, qty: s.qty + it.qty };
                          return s;
                        })
                      );
                    }}
                  >
                    Teslim Alındı
                  </button>
                )}
                <button
                  className="btn-g"
                  style={{ padding: "8px", fontSize: 12 }}
                >
                  Yazdır
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* New order modal */}
      {showNew && <NewOrderModal ctx={ctx} onClose={() => setShowNew(false)} />}
    </div>
  );
}
