import { useState, useMemo } from "react";
import { T } from "../theme";
import {
  Badge,
  Card,
  SLabel,
  IRow,
  TabBar,
  FInput,
  FSelect,
  FTextarea,
  Modal,
  PageHeader,
  EmptyState,
  SidePanel,
} from "../components/shared";
import {
  tipRenk,
  fmtMoney,
  movementTypeCfg,
  USERS,
  CUSTOMERS,
} from "../data/constants";

/* ═══════════ STOK YÖNETİMİ ═══════════ */

export default function StokPage({ ctx }) {
  const {
    stockDb,
    setStockDb,
    movements,
    setMovements,
    waybills,
    setWaybills,
    services,
    setServices,
  } = ctx;

  const [tab, setTab] = useState("stok");
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");
  const [tipFilter, setTipFilter] = useState("Tümü");
  const [showGiris, setShowGiris] = useState(false);
  const [showCikis, setShowCikis] = useState(false);
  const [showIade, setShowIade] = useState(false);
  const [showSayim, setShowSayim] = useState(false);
  const [showWaybill, setShowWaybill] = useState(null);

  const list = stockDb.filter(
    (s) =>
      (tipFilter === "Tümü" || s.tip === tipFilter) &&
      (!search ||
        s.ad.toLowerCase().includes(search.toLowerCase()) ||
        s.stokKodu.toLowerCase().includes(search.toLowerCase()))
  );

  const kritikCount = stockDb.filter(
    (s) => s.qty - s.rezerve < s.min
  ).length;

  const logMovement = (tip, neden, referans, stokId, qty, notlar) => {
    const stok = stockDb.find((s) => s.id === stokId);
    if (!stok) return;

    const id = "SM-" + String(movements.length + 100).padStart(3, "0");
    const once = stok.qty;
    const sonra =
      tip === "Giriş"
        ? once + qty
        : tip === "İade"
          ? once + qty
          : once - qty;

    setMovements((p) => [
      {
        id,
        tarih: new Date().toLocaleDateString("tr-TR"),
        tip,
        neden,
        referans,
        stokId,
        qty,
        oncekiQty: once,
        sonrakiQty: sonra,
        notlar,
        user: ctx.user.id,
      },
      ...p,
    ]);

    setStockDb((p) =>
      p.map((s) => (s.id === stokId ? { ...s, qty: sonra } : s))
    );

    if (sel?.id === stokId) setSel((p) => ({ ...p, qty: sonra }));

    return { id, stok, once, sonra };
  };

  return (
    <div>
      <PageHeader
        title="Stok Yönetimi"
        sub="Giriş · Çıkış · İrsaliye · İade"
        actions={[
          <button key="g" className="btn-p" onClick={() => setShowGiris(true)}>
            + Giriş
          </button>,
          <button key="c" className="btn-g" onClick={() => setShowCikis(true)}>
            ↓ Çıkış
          </button>,
          <button key="i" className="btn-g" onClick={() => setShowIade(true)}>
            ↩ İade
          </button>,
          <button key="s" className="btn-g" onClick={() => setShowSayim(true)}>
            📊 Sayım
          </button>,
        ]}
      />

      {/* Kritik stok uyarısı */}
      {kritikCount > 0 && (
        <div
          style={{
            background: T.redLight,
            border: "1px solid #FECACA",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 18 }}>🔴</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.red }}>
              {kritikCount} Kalemde Kritik Stok Seviyesi
            </div>
            <div style={{ fontSize: 11, color: "#7F1D1D" }}>
              Minimum stok altındaki kalemler için sipariş oluşturunuz.
            </div>
          </div>
        </div>
      )}

      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "stok", label: "Stok Listesi", icon: "📦", count: stockDb.length },
          { id: "hareketler", label: "Hareketler", icon: "📊", count: movements.length },
          { id: "irsaliyeler", label: "İrsaliyeler", icon: "🚚", count: waybills.length },
        ]}
      />

      {/* ── Stok Listesi Tab ── */}
      {tab === "stok" && (
        <div
          style={{
            display: "flex",
            height: "calc(100vh - 280px)",
            gap: 14,
            overflow: "hidden",
          }}
        >
          <SidePanel
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Parça adı veya kod..."
            onNew={() => setShowGiris(true)}
            newLabel="+ Stok Girişi"
          >
            <div
              style={{
                padding: "8px 12px 4px",
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {["Tümü", "Yedek Parça", "Aksesuar", "Sarf Malzeme"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTipFilter(t)}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    background: tipFilter === t ? T.teal : "#F1F5F9",
                    color: tipFilter === t ? "white" : T.textSub,
                    fontFamily: "inherit",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {list.map((s) => {
              const tc = tipRenk[s.tip] || {};
              const av = s.qty - s.rezerve;
              const krit = av < s.min;

              return (
                <div
                  key={s.id}
                  className={`rh${sel?.id === s.id ? " sel" : ""}`}
                  onClick={() => setSel(s)}
                  style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${T.border}`,
                    borderLeft: "3px solid transparent",
                    background: krit ? "#FFF5F5" : "white",
                  }}
                >
                  <div style={{ display: "flex", gap: 9 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 7,
                        background: tc.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {s.tip === "Yedek Parça"
                        ? "🔩"
                        : s.tip === "Aksesuar"
                          ? "🔌"
                          : "🧪"}
                    </div>
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
                        {krit && "🔴 "}
                        {s.ad}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: T.textMuted,
                          fontFamily: "monospace",
                        }}
                      >
                        {s.stokKodu}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          marginTop: 3,
                          alignItems: "center",
                        }}
                      >
                        <Badge label={s.tip} bg={tc.bg} color={tc.color} />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: krit ? T.red : T.green,
                          }}
                        >
                          {av} {s.birim}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </SidePanel>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {!sel ? (
              <EmptyState icon="📦" text="Bir stok kalemi seçin" />
            ) : (
              <StokDetay
                s={sel}
                ctx={ctx}
                logMovement={logMovement}
                setShowGiris={setShowGiris}
                setShowCikis={setShowCikis}
                setShowWaybill={setShowWaybill}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Hareketler Tab ── */}
      {tab === "hareketler" && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "Tarih",
                  "Hareket",
                  "Ürün",
                  "Qty",
                  "Önceki",
                  "Sonraki",
                  "Referans",
                  "Notlar",
                  "Kullanıcı",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
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
              {movements.map((m, i) => {
                const s = stockDb.find((x) => x.id === m.stokId);
                const mc = movementTypeCfg[m.tip] || {};
                const u = USERS.find((u) => u.id === m.user);

                return (
                  <tr
                    key={m.id}
                    className="rh"
                    style={{
                      borderBottom:
                        i < movements.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                    }}
                  >
                    <td style={{ padding: "9px 12px", fontSize: 11, color: T.textMuted }}>
                      {m.tarih}
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <Badge label={m.tip} bg={mc.bg} color={mc.color} />
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 600 }}>
                      {s?.ad || "—"}
                    </td>
                    <td
                      style={{
                        padding: "9px 12px",
                        fontWeight: 700,
                        color: m.tip === "Çıkış" ? T.red : T.green,
                        fontSize: 13,
                      }}
                    >
                      {m.tip === "Çıkış" ? "-" : "+"}
                      {m.qty}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 12, color: T.textMuted }}>
                      {m.oncekiQty}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 600 }}>
                      {m.sonrakiQty}
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      {m.referans ? (
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
                          {m.referans}
                        </span>
                      ) : (
                        <span style={{ color: T.textMuted, fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "9px 12px",
                        fontSize: 11,
                        color: T.textSub,
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.notlar || "—"}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 11, color: T.textSub }}>
                      {u?.ad || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* ── İrsaliyeler Tab ── */}
      {tab === "irsaliyeler" && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "İrsaliye No",
                  "Tarih",
                  "Tip",
                  "Müşteri",
                  "Durum",
                  "Kargo",
                  "İzleme",
                  "Kalemler",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
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
              {waybills.map((w, i) => {
                const c = CUSTOMERS.find((c) => c.id === w.customerId);
                const tipC =
                  w.tip === "Çıkış"
                    ? { bg: T.roseLight, color: T.rose }
                    : w.tip === "İade"
                      ? { bg: T.blueLight, color: T.blue }
                      : { bg: T.greenLight, color: T.green };

                return (
                  <tr
                    key={w.id}
                    className="rh"
                    style={{
                      borderBottom:
                        i < waybills.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "9px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: T.teal,
                        fontFamily: "monospace",
                      }}
                    >
                      {w.id}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 11, color: T.textMuted }}>
                      {w.tarih}
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <Badge label={w.tip} bg={tipC.bg} color={tipC.color} />
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 12 }}>
                      {c?.kurumAdi}
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <Badge
                        label={w.status}
                        bg={w.status === "Teslim Edildi" ? T.greenLight : T.amberLight}
                        color={w.status === "Teslim Edildi" ? T.green : T.amber}
                      />
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 12, color: T.textSub }}>
                      {w.kargo || "—"}
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      {w.kargoNo ? (
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: "monospace",
                            background: T.blueLight,
                            color: T.blue,
                            borderRadius: 6,
                            padding: "2px 7px",
                          }}
                        >
                          {w.kargoNo}
                        </span>
                      ) : (
                        <span style={{ color: T.textMuted, fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 11, color: T.textSub }}>
                      {w.items.length} kalem
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <button
                        className="btn-g"
                        style={{ padding: "4px 9px", fontSize: 11 }}
                        onClick={() => setShowWaybill(w)}
                      >
                        Görüntüle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* ── Modals ── */}
      {showGiris && (
        <StokGirisModal
          ctx={ctx}
          logMovement={logMovement}
          onClose={() => setShowGiris(false)}
        />
      )}
      {showCikis && (
        <StokCikisModal
          ctx={ctx}
          logMovement={logMovement}
          setWaybills={setWaybills}
          onClose={() => setShowCikis(false)}
        />
      )}
      {showIade && (
        <StokIadeModal
          ctx={ctx}
          logMovement={logMovement}
          setWaybills={setWaybills}
          onClose={() => setShowIade(false)}
        />
      )}
      {showSayim && (
        <StokSayimModal
          ctx={ctx}
          logMovement={logMovement}
          onClose={() => setShowSayim(false)}
        />
      )}
      {showWaybill && (
        <WaybillModal
          waybill={showWaybill}
          ctx={ctx}
          onClose={() => setShowWaybill(null)}
        />
      )}
    </div>
  );
}

/* ═══════════ STOK DETAY ═══════════ */

export function StokDetay({ s, ctx, logMovement, setShowGiris, setShowCikis, setShowWaybill }) {
  const av = s.qty - s.rezerve;
  const krit = av < s.min;
  const tc = tipRenk[s.tip] || {};
  const myWaybills = ctx.waybills.filter((w) =>
    w.items.some((i) => i.stokId === s.id)
  );

  return (
    <div>
      {/* Başlık */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 11,
              background: tc.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {s.tip === "Yedek Parça" ? "🔩" : s.tip === "Aksesuar" ? "🔌" : "🧪"}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  fontFamily: "Sora,sans-serif",
                  margin: 0,
                }}
              >
                {s.ad}
              </h2>
              <Badge label={s.tip} bg={tc.bg} color={tc.color} />
              {krit && <Badge label="KRİTİK" bg={T.redLight} color={T.red} />}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <code
                style={{
                  fontSize: 10,
                  background: "#F8FAFC",
                  padding: "2px 6px",
                  borderRadius: 4,
                  border: `1px solid ${T.border}`,
                }}
              >
                {s.stokKodu}
              </code>
              <code
                style={{
                  fontSize: 10,
                  background: T.tealLight,
                  padding: "2px 6px",
                  borderRadius: 4,
                  color: T.teal,
                }}
              >
                ÜTS: {s.utsKodu}
              </code>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <button
            className="btn-p"
            style={{ fontSize: 12, padding: "7px 12px" }}
            onClick={() => setShowGiris(true)}
          >
            + Giriş
          </button>
          <button
            className="btn-g"
            style={{ fontSize: 12, padding: "7px 12px" }}
            onClick={() => setShowCikis(true)}
          >
            ↓ Çıkış
          </button>
        </div>
      </div>

      {/* Stok kartları */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {[
          { l: "Toplam", v: s.qty, c: T.blue },
          { l: "Rezerve", v: s.rezerve, c: T.amber },
          { l: "Kullanılabilir", v: av, c: krit ? T.red : T.green },
        ].map((m) => (
          <Card key={m.l} style={{ padding: "12px 13px", textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: m.c,
                fontFamily: "Sora,sans-serif",
              }}
            >
              {m.v}
            </div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>
              {m.l} / {s.birim}
            </div>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 8,
          background: "#F1F5F9",
          borderRadius: 4,
          overflow: "hidden",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, (s.qty / (s.min * 2)) * 100)}%`,
            background: krit ? T.red : T.green,
            borderRadius: 4,
          }}
        />
      </div>
      <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 14 }}>
        Min. stok: {s.min} {s.birim} ·{" "}
        {krit ? "⚠ Sipariş gerekiyor" : "✓ Yeterli stok"}
      </div>

      {/* Bilgi kartları */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <Card style={{ padding: 14 }}>
          <SLabel title="Ürün Bilgisi" />
          <IRow label="Marka" value={s.marka} />
          <IRow label="Birim" value={s.birim} />
          <IRow label="Konum" value={s.konum} mono />
          <IRow label="Birim Fiyat" value={fmtMoney(s.fiyat)} />
          <IRow label="KDV" value={`%${s.kdv}`} />
        </Card>
        <Card style={{ padding: 14 }}>
          <SLabel title="Kodlar" />
          <IRow label="Stok Kodu" value={s.stokKodu} mono />
          <IRow label="Üretici Kodu" value={s.ureticiKod} mono />
          <IRow label="ÜTS Kodu" value={s.utsKodu} mono />
          {s.uretim && <IRow label="Üretim Tarihi" value={s.uretim} />}
          {s.sku && <IRow label="SKT" value={s.sku} />}
        </Card>
      </div>

      {/* İlgili İrsaliyeler */}
      {myWaybills.length > 0 && (
        <Card style={{ padding: 14 }}>
          <SLabel title="İlgili İrsaliyeler" icon="🚚" />
          {myWaybills.slice(0, 3).map((w) => (
            <div
              key={w.id}
              onClick={() => setShowWaybill(w)}
              className="rh"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
                borderBottom: `1px solid ${T.border}`,
                cursor: "pointer",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.teal,
                    fontFamily: "monospace",
                  }}
                >
                  {w.id}
                </span>
                <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8 }}>
                  {w.tarih} · {w.tip}
                </span>
              </div>
              <Badge
                label={w.status}
                bg={w.status === "Teslim Edildi" ? T.greenLight : T.amberLight}
                color={w.status === "Teslim Edildi" ? T.green : T.amber}
              />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ═══════════ STOK GİRİŞ MODAL ═══════════ */

export function StokGirisModal({ ctx, logMovement, onClose }) {
  const [form, setForm] = useState({
    stokId: ctx.stockDb[0]?.id || "",
    qty: "1",
    neden: "Satın Alma",
    referans: "",
    notlar: "",
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!form.stokId || !form.qty) return;
    logMovement(
      "Giriş",
      form.neden,
      form.referans || null,
      form.stokId,
      parseInt(form.qty),
      form.notlar
    );
    onClose();
  };

  const sel = ctx.stockDb.find((s) => s.id === form.stokId);

  return (
    <Modal title="Stok Girişi" onClose={onClose} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <FSelect
          label="Ürün"
          value={form.stokId}
          onChange={upd("stokId")}
          options={ctx.stockDb.map((s) => ({
            value: s.id,
            label: `${s.ad} (Mevcut: ${s.qty - s.rezerve} ${s.birim})`,
          }))}
        />

        {sel && (
          <div
            style={{
              background: T.tealLight,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              color: T.tealDark,
            }}
          >
            Mevcut stok: <strong>{sel.qty - sel.rezerve}</strong> → giriş sonrası:{" "}
            <strong>{sel.qty - sel.rezerve + parseInt(form.qty || 0)}</strong> {sel.birim}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FInput
            label="Giriş Miktarı"
            value={form.qty}
            onChange={upd("qty")}
            type="number"
          />
          <FSelect
            label="Giriş Nedeni"
            value={form.neden}
            onChange={upd("neden")}
            options={[
              "Satın Alma",
              "Tedarikçi Teslimi",
              "İade Alındı",
              "Sayım Düzeltme",
              "Manuel Giriş",
            ]}
          />
        </div>

        <FInput
          label="Referans No (Sipariş/İrsaliye)"
          value={form.referans}
          onChange={upd("referans")}
          placeholder="SP-2026-..."
          mono
        />

        <FTextarea label="Notlar" value={form.notlar} onChange={upd("notlar")} rows={2} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
          <button className="btn-g" onClick={onClose}>
            İptal
          </button>
          <button className="btn-p" onClick={save}>
            ✓ Stok Girişi Yap
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════ STOK ÇIKIŞ MODAL ═══════════ */

export function StokCikisModal({ ctx, logMovement, setWaybills, onClose }) {
  const [form, setForm] = useState({
    stokId: ctx.stockDb[0]?.id || "",
    qty: "1",
    neden: "Servis",
    referans: "",
    kargo: "",
    kargoNo: "",
    notlar: "",
    irsaliye: true,
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const sel = ctx.stockDb.find((s) => s.id === form.stokId);
  const av = sel ? sel.qty - sel.rezerve : 0;

  const save = () => {
    if (!form.stokId || !form.qty) return;

    const result = logMovement(
      "Çıkış",
      form.neden,
      form.referans || null,
      form.stokId,
      parseInt(form.qty),
      form.notlar
    );

    if (form.irsaliye && result) {
      const wId =
        "IR-2026-" + String(ctx.waybills.length + 100).padStart(4, "0");
      setWaybills((p) => [
        {
          id: wId,
          tarih: new Date().toLocaleDateString("tr-TR"),
          tip: "Çıkış",
          customerId: null,
          serviceId: form.referans || null,
          items: [
            {
              stokId: form.stokId,
              ad: result.stok.ad,
              qty: parseInt(form.qty),
              birim: result.stok.birim,
            },
          ],
          status: "Hazırlandı",
          kargo: form.kargo,
          kargoNo: form.kargoNo,
          notlar: form.notlar,
        },
        ...p,
      ]);
    }

    onClose();
  };

  return (
    <Modal title="Stok Çıkışı" onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <FSelect
          label="Ürün"
          value={form.stokId}
          onChange={upd("stokId")}
          options={ctx.stockDb.map((s) => ({
            value: s.id,
            label: `${s.ad} (Mevcut: ${s.qty - s.rezerve} ${s.birim})`,
          }))}
        />

        {sel && (
          <div
            style={{
              background: av > 0 ? T.blueLight : T.redLight,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              color: av > 0 ? T.blue : T.red,
            }}
          >
            Kullanılabilir: <strong>{av}</strong> {sel.birim}
            {av <= 0 && " — STOK YETERSİZ!"}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FInput
            label="Çıkış Miktarı"
            value={form.qty}
            onChange={upd("qty")}
            type="number"
          />
          <FSelect
            label="Çıkış Nedeni"
            value={form.neden}
            onChange={upd("neden")}
            options={["Servis", "Satış", "Fire", "Numune", "Sayım Düzeltme"]}
          />
        </div>

        <FInput
          label="Referans (Servis No vb.)"
          value={form.referans}
          onChange={upd("referans")}
          placeholder="SF-2026-..."
          mono
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FInput
            label="Kargo Firması"
            value={form.kargo}
            onChange={upd("kargo")}
            placeholder="MNG, Yurtiçi..."
          />
          <FInput
            label="Kargo Takip No"
            value={form.kargoNo}
            onChange={upd("kargoNo")}
            mono
          />
        </div>

        <FTextarea label="Notlar" value={form.notlar} onChange={upd("notlar")} rows={2} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F8FAFC",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <input
            type="checkbox"
            id="wbb"
            checked={form.irsaliye}
            onChange={(e) => upd("irsaliye")(e.target.checked)}
          />
          <label htmlFor="wbb" style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            📄 Otomatik İrsaliye Oluştur
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
          <button className="btn-g" onClick={onClose}>
            İptal
          </button>
          <button className="btn-p" onClick={save} disabled={parseInt(form.qty) > av}>
            ↓ Çıkış Yap
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════ STOK İADE MODAL ═══════════ */

export function StokIadeModal({ ctx, logMovement, setWaybills, onClose }) {
  const [form, setForm] = useState({
    stokId: ctx.stockDb[0]?.id || "",
    qty: "1",
    referans: "",
    neden: "Müşteri İadesi",
    notlar: "",
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const sel = ctx.stockDb.find((s) => s.id === form.stokId);

  const save = () => {
    if (!form.stokId || !form.qty) return;

    const result = logMovement(
      "İade",
      form.neden,
      form.referans || null,
      form.stokId,
      parseInt(form.qty),
      form.notlar
    );

    if (result) {
      const wId =
        "IR-2026-" + String(ctx.waybills.length + 100).padStart(4, "0");
      setWaybills((p) => [
        {
          id: wId,
          tarih: new Date().toLocaleDateString("tr-TR"),
          tip: "İade",
          customerId: null,
          serviceId: form.referans || null,
          items: [
            {
              stokId: form.stokId,
              ad: result.stok.ad,
              qty: parseInt(form.qty),
              birim: result.stok.birim,
            },
          ],
          status: "İade Alındı",
          kargo: "",
          kargoNo: "",
          notlar: form.notlar,
        },
        ...p,
      ]);
    }

    onClose();
  };

  return (
    <Modal title="İade Alma" onClose={onClose} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            background: T.blueLight,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 12,
            color: "#1E40AF",
          }}
        >
          ↩ İade alınan ürünler stoka eklenir ve iade irsaliyesi oluşturulur.
        </div>

        <FSelect
          label="Ürün"
          value={form.stokId}
          onChange={upd("stokId")}
          options={ctx.stockDb.map((s) => ({
            value: s.id,
            label: `${s.ad} (Mevcut: ${s.qty - s.rezerve} ${s.birim})`,
          }))}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FInput
            label="İade Miktarı"
            value={form.qty}
            onChange={upd("qty")}
            type="number"
          />
          <FSelect
            label="İade Nedeni"
            value={form.neden}
            onChange={upd("neden")}
            options={[
              "Müşteri İadesi",
              "Hatalı Ürün",
              "Sipariş İptali",
              "Kullanılmadı",
            ]}
          />
        </div>

        <FInput
          label="Referans (Servis/İrsaliye No)"
          value={form.referans}
          onChange={upd("referans")}
          placeholder="SF-2026-..."
          mono
        />

        <FTextarea label="Notlar" value={form.notlar} onChange={upd("notlar")} rows={2} />

        {sel && (
          <div
            style={{
              background: T.tealLight,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              color: T.tealDark,
            }}
          >
            İade sonrası stok:{" "}
            <strong>
              {sel.qty + parseInt(form.qty || 0)} {sel.birim}
            </strong>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
          <button className="btn-g" onClick={onClose}>
            İptal
          </button>
          <button className="btn-p" onClick={save}>
            ↩ İade Al
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════ STOK SAYIM MODAL ═══════════ */

export function StokSayimModal({ ctx, logMovement, onClose }) {
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(ctx.stockDb.map((s) => [s.id, String(s.qty)]))
  );

  const save = () => {
    ctx.stockDb.forEach((s) => {
      const sayim = parseInt(counts[s.id]);
      if (!isNaN(sayim) && sayim !== s.qty) {
        logMovement(
          "Sayım Düzeltme",
          "Periyodik Sayım",
          null,
          s.id,
          Math.abs(sayim - s.qty),
          `Sayım: ${s.qty} → ${sayim}`
        );
      }
    });
    onClose();
  };

  return (
    <Modal title="Stok Sayım & Düzeltme" onClose={onClose} width={600}>
      <div
        style={{
          marginBottom: 12,
          background: T.amberLight,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 12,
          color: "#92400E",
        }}
      >
        ⚠ Sayım değerini değiştirdiğiniz kalemler için otomatik düzeltme hareketi
        oluşturulur.
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14 }}>
        <thead>
          <tr style={{ background: "#F8FAFC" }}>
            {["Ürün", "Stok Kodu", "Sistemdeki", "Sayılan", "Fark"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "8px 11px",
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
          {ctx.stockDb.map((s, i) => {
            const sayim = parseInt(counts[s.id]) || 0;
            const fark = sayim - s.qty;

            return (
              <tr
                key={s.id}
                style={{
                  borderBottom:
                    i < ctx.stockDb.length - 1 ? `1px solid ${T.border}` : "none",
                }}
              >
                <td style={{ padding: "8px 11px", fontSize: 12, fontWeight: 600 }}>
                  {s.ad}
                </td>
                <td
                  style={{
                    padding: "8px 11px",
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: T.teal,
                  }}
                >
                  {s.stokKodu}
                </td>
                <td style={{ padding: "8px 11px", fontSize: 13, fontWeight: 700 }}>
                  {s.qty}
                </td>
                <td style={{ padding: "8px 11px" }}>
                  <input
                    type="number"
                    value={counts[s.id]}
                    onChange={(e) =>
                      setCounts((p) => ({ ...p, [s.id]: e.target.value }))
                    }
                    style={{
                      width: 70,
                      border: `1.5px solid ${fark !== 0 ? T.amber : T.border}`,
                      borderRadius: 7,
                      padding: "5px 8px",
                      fontSize: 13,
                      fontWeight: 700,
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                </td>
                <td
                  style={{
                    padding: "8px 11px",
                    fontWeight: 700,
                    color: fark > 0 ? T.green : fark < 0 ? T.red : T.textMuted,
                  }}
                >
                  {fark > 0 ? `+${fark}` : fark === 0 ? "—" : fark}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button className="btn-g" onClick={onClose}>
          İptal
        </button>
        <button className="btn-p" onClick={save}>
          💾 Sayımı Kaydet
        </button>
      </div>
    </Modal>
  );
}

/* ═══════════ WAYBILL (İRSALİYE) MODAL ═══════════ */

export function WaybillModal({ waybill: w, ctx, onClose }) {
  const c = CUSTOMERS.find((c) => c.id === w.customerId);

  return (
    <Modal title={`İrsaliye — ${w.id}`} onClose={onClose} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Badge
            label={w.tip}
            bg={w.tip === "İade" ? T.blueLight : T.roseLight}
            color={w.tip === "İade" ? T.blue : T.rose}
          />
          <Badge label={w.status} bg={T.greenLight} color={T.green} />
        </div>

        <IRow label="Tarih" value={w.tarih} />
        {c && <IRow label="Müşteri" value={c.kurumAdi} />}
        {w.serviceId && <IRow label="Servis No" value={w.serviceId} />}
        {w.kargo && <IRow label="Kargo" value={w.kargo} />}
        {w.kargoNo && <IRow label="Takip No" value={w.kargoNo} mono />}

        <SLabel title="Kalemler" />
        {w.items.map((it, i) => {
          const s = ctx.stockDb.find((x) => x.id === it.stokId);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
                borderBottom: `1px solid ${T.border}`,
                fontSize: 12,
              }}
            >
              <span style={{ fontWeight: 600 }}>{it.ad || s?.ad}</span>
              <span style={{ color: T.textSub }}>
                {it.qty} {it.birim || s?.birim}
              </span>
            </div>
          );
        })}

        {w.notlar && (
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 8,
              padding: "8px 10px",
              fontSize: 12,
              color: T.textSub,
            }}
          >
            📝 {w.notlar}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 8,
          }}
        >
          <button className="btn-g" onClick={() => window.print()}>
            🖨 Yazdır
          </button>
          <button className="btn-g" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </Modal>
  );
}
