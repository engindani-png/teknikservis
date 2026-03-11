import { useState } from "react";
import { T } from "../theme";
import {
  Badge,
  Card,
  TabBar,
  SLabel,
  IRow,
  EmptyState,
  SideLayout,
  SidePanel,
} from "../components/shared";
import {
  CUSTOMERS,
  DEVICES_DB,
  tipRenk,
  initials,
  fmtMoney,
} from "../data/constants";

/* ═══════════ CİHAZLAR ═══════════ */

function CihazlarPage({ ctx }) {
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("kimlik");

  const list = DEVICES_DB.filter(
    (d) =>
      !search ||
      `${d.marka} ${d.model} ${d.seriNo} ${d.stokKodu}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <SideLayout
      list={
        <SidePanel
          search={search}
          onSearch={setSearch}
          onNew={() => {}}
          newLabel="+ Cihaz Ekle"
          searchPlaceholder="Cihaz, model, seri no..."
        >
          {list.map((d) => {
            const c = CUSTOMERS.find((c) => c.id === d.customerId);
            const dS =
              d.status === "aktif"
                ? { bg: T.greenLight, color: T.green }
                : { bg: T.redLight, color: T.red };

            return (
              <div
                key={d.id}
                className={`rh${sel?.id === d.id ? " sel" : ""}`}
                onClick={() => {
                  setSel(d);
                  setTab("kimlik");
                }}
                style={{
                  padding: "11px 13px",
                  borderBottom: `1px solid ${T.border}`,
                  borderLeft: "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", gap: 9 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: T.blueLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    🔬
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
                      {d.marka} {d.model}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textMuted,
                        fontFamily: "monospace",
                      }}
                    >
                      {d.seriNo}
                    </div>
                    <div
                      style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}
                    >
                      {c?.kurumAdi}
                    </div>
                    <div style={{ marginTop: 3 }}>
                      <Badge label={d.status} bg={dS.bg} color={dS.color} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </SidePanel>
      }
      detail={
        !sel ? (
          <EmptyState icon="🔬" text="Bir cihaz seçin" />
        ) : (
          <CihazDetay d={sel} ctx={ctx} tab={tab} setTab={setTab} />
        )
      }
    />
  );
}

/* ═══════════ CİHAZ DETAY ═══════════ */

export function CihazDetay({ d, ctx, tab, setTab }) {
  const c = CUSTOMERS.find((c) => c.id === d.customerId);
  const compat = ctx.stockDb.filter((s) =>
    s.uyumluModeller.includes(d.stokKodu)
  );
  const dS =
    d.status === "aktif"
      ? { bg: T.greenLight, color: T.green }
      : { bg: T.redLight, color: T.red };
  const wS =
    d.warranty === "active"
      ? { bg: T.greenLight, color: T.green }
      : { bg: T.redLight, color: T.red };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: T.blueLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🔬
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 5,
              }}
            >
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  fontFamily: "Sora,sans-serif",
                  margin: 0,
                }}
              >
                {d.marka} {d.model}
              </h2>
              <Badge label={d.status} bg={dS.bg} color={dS.color} />
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
                {d.stokKodu}
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
                ÜTS: {d.utsKodu}
              </code>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-g" style={{ fontSize: 12 }}>
            + Servis Formu
          </button>
          <button className="btn-p" style={{ fontSize: 12 }}>
            ✏ Düzenle
          </button>
        </div>
      </div>

      {/* Tabs */}
      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "kimlik", label: "Kimlik", icon: "🆔" },
          { id: "teknik", label: "HW/SW", icon: "⚙️" },
          {
            id: "lisanslar",
            label: "Lisanslar",
            icon: "🔑",
            count: d.lisanslar.length,
          },
          { id: "bilgisayar", label: "Eşleşik PC", icon: "💻" },
          {
            id: "parcalar",
            label: "Uyumlu Parçalar",
            icon: "🔩",
            count: compat.length,
          },
        ]}
      />

      {/* Tab: Kimlik */}
      {tab === "kimlik" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Card style={{ padding: 16 }}>
            <SLabel title="Cihaz Kimliği" />
            <IRow label="Seri No" value={d.seriNo} mono />
            <IRow label="Ürün Grubu" value={d.urunGrubu} />
            <IRow label="Departman" value={d.dept} />
            <IRow label="Müşteri" value={c?.kurumAdi} />
            <IRow
              label="Garanti"
              value={`${d.garantiAy} Ay · ${d.warrantyEnd}`}
            />
            <div style={{ marginTop: 8 }}>
              <Badge
                label={d.warranty === "active" ? "✓ Garantide" : "✗ Doldu"}
                bg={wS.bg}
                color={wS.color}
              />
            </div>
          </Card>
          <Card style={{ padding: 16 }}>
            <SLabel title="Kodlar" />
            <IRow label="Dahili Stok Kodu" value={d.stokKodu} mono />
            <IRow label="Üretici Kodu" value={d.ureticiKod} mono />
            <IRow label="ÜTS Kodu" value={d.utsKodu} mono />
            <IRow label="Kal. Döngüsü" value={`${d.kalPeriod} Ay`} />
            <IRow label="Sonraki Kal." value={d.nextCal} />
            <IRow label="Kalan" value={`${d.calDays} Gün`} />
          </Card>
        </div>
      )}

      {/* Tab: Teknik (HW/SW) */}
      {tab === "teknik" && (
        <Card style={{ padding: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                background: T.blueLight,
                borderRadius: 10,
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: T.blue,
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                DONANIM REV.
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  fontFamily: "monospace",
                  color: T.blue,
                }}
              >
                {d.hwRev}
              </div>
            </div>
            <div
              style={{
                background: T.tealLight,
                borderRadius: 10,
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: T.teal,
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                YAZILIM VER.
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  fontFamily: "monospace",
                  color: T.teal,
                }}
              >
                {d.swVer}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab: Lisanslar */}
      {tab === "lisanslar" && (
        <Card style={{ padding: 16 }}>
          {d.lisanslar.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: 32, color: T.textMuted }}
            >
              Lisans yok.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {d.lisanslar.map((l, i) => (
                <div
                  key={i}
                  style={{
                    border: `1.5px solid ${
                      l.durum === "aktif" ? T.teal : T.border
                    }`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    background: l.durum === "aktif" ? T.surface : "#FAFAFA",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <Badge label="Lisans" bg={T.purpleLight} color={T.purple} />
                    <Badge
                      label={l.durum}
                      bg={l.durum === "aktif" ? T.greenLight : T.border}
                      color={l.durum === "aktif" ? T.green : T.textMuted}
                    />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{l.ad}</div>
                  <IRow label="Kod" value={l.kod} mono />
                  <IRow label="Geçerlilik" value={l.gecerlilik} />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab: Bilgisayar (Eşleşik PC) */}
      {tab === "bilgisayar" &&
        (!d.pc?.var ? (
          <Card style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>💻</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 10 }}>
              Eşleşik bilgisayar yok
            </div>
            <button className="btn-p" style={{ marginTop: 12 }}>
              + Eşleştir
            </button>
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <Card style={{ padding: 16 }}>
              <SLabel title="PC Kimliği" />
              <IRow
                label="Model"
                value={`${d.pc.marka} ${d.pc.model}`}
              />
              <IRow label="Seri No" value={d.pc.seriNo} mono />
              <IRow label="İşletim Sistemi" value={d.pc.os} />
              <IRow label="Garanti" value={d.pc.garBitis} />
              {d.pc.notlar && (
                <div
                  style={{
                    marginTop: 8,
                    background: T.amberLight,
                    borderRadius: 7,
                    padding: "8px 10px",
                    fontSize: 12,
                    color: "#92400E",
                  }}
                >
                  ⚠ {d.pc.notlar}
                </div>
              )}
            </Card>
            <Card style={{ padding: 16 }}>
              <SLabel title="Teknik Özellikler" />
              <IRow label="CPU" value={d.pc.cpu} />
              <IRow label="RAM" value={d.pc.ram} />
              <IRow label="Disk" value={d.pc.disk} />
            </Card>
          </div>
        ))}

      {/* Tab: Uyumlu Parçalar */}
      {tab === "parcalar" && (
        <Card style={{ padding: 16 }}>
          {compat.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: 32, color: T.textMuted }}
            >
              Uyumlu parça yok.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Tür", "Ad", "Kod", "Mevcut", "Fiyat"].map((h) => (
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
                {compat.map((s, i) => {
                  const tc = tipRenk[s.tip] || {};
                  const av = s.qty - s.rezerve;

                  return (
                    <tr
                      key={s.id}
                      className="rh"
                      style={{
                        borderBottom:
                          i < compat.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                      }}
                    >
                      <td style={{ padding: "9px 11px" }}>
                        <Badge label={s.tip} bg={tc.bg} color={tc.color} />
                      </td>
                      <td
                        style={{
                          padding: "9px 11px",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {s.ad}
                      </td>
                      <td
                        style={{
                          padding: "9px 11px",
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: T.teal,
                        }}
                      >
                        {s.stokKodu}
                      </td>
                      <td
                        style={{
                          padding: "9px 11px",
                          fontWeight: 700,
                          color: av < s.min ? T.red : T.green,
                        }}
                      >
                        {av}/{s.qty}
                      </td>
                      <td
                        style={{
                          padding: "9px 11px",
                          fontWeight: 700,
                        }}
                      >
                        {fmtMoney(s.fiyat)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  );
}

export default CihazlarPage;
