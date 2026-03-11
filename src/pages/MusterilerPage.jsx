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
  kurumRenk,
  SVC_STATUS_CFG,
  contractStatusCfg,
  initials,
  fmtMoney,
} from "../data/constants";

/* ═══════════ MÜŞTERİLER ═══════════ */

function MusterilerPage({ ctx }) {
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("genel");

  const list = CUSTOMERS.filter(
    (c) =>
      !search ||
      `${c.kurumAdi} ${c.kurumKodu} ${c.sehir}`
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
          newLabel="+ Yeni Müşteri"
          searchPlaceholder="Hastane ara..."
        >
          {list.map((c) => {
            const cr = kurumRenk[c.kurumTuru] || {};
            const devCnt = DEVICES_DB.filter(
              (d) => d.customerId === c.id
            ).length;
            const activeSvc = ctx.services.filter(
              (s) =>
                s.customerId === c.id &&
                !["Kapalı", "Fatura Kesildi"].includes(s.status)
            ).length;

            return (
              <div
                key={c.id}
                className={`rh${sel?.id === c.id ? " sel" : ""}`}
                onClick={() => {
                  setSel(c);
                  setTab("genel");
                }}
                style={{
                  padding: "11px 13px",
                  borderBottom: `1px solid ${T.border}`,
                  borderLeft: "3px solid transparent",
                  display: "flex",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: cr.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    color: cr.color,
                    flexShrink: 0,
                  }}
                >
                  {initials(c.kurumAdi)}
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
                    {c.kurumAdi}
                  </div>
                  <div style={{ fontSize: 10, color: T.textMuted }}>
                    {c.sehir} · {c.kurumKodu}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                    <span style={{ fontSize: 10, color: T.textMuted }}>
                      🔬 {devCnt}
                    </span>
                    {activeSvc > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          background: T.amberLight,
                          color: T.amber,
                          borderRadius: 8,
                          padding: "1px 6px",
                          fontWeight: 600,
                        }}
                      >
                        ⚡ {activeSvc}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </SidePanel>
      }
      detail={
        !sel ? (
          <EmptyState icon="🏥" text="Bir müşteri seçin" />
        ) : (
          <MusteriDetay c={sel} ctx={ctx} tab={tab} setTab={setTab} />
        )
      }
    />
  );
}

/* ═══════════ MÜŞTERİ DETAY ═══════════ */

export function MusteriDetay({ c, ctx, tab, setTab }) {
  const devs = DEVICES_DB.filter((d) => d.customerId === c.id);
  const svcs = ctx.services.filter((s) => s.customerId === c.id);
  const conts = ctx.contracts.filter((x) => x.customerId === c.id);
  const cr = kurumRenk[c.kurumTuru] || {};
  const rev = svcs
    .filter((s) => s.amount)
    .reduce((a, b) => a + b.amount, 0);
  const sevkAdres =
    c.sevkiyatTercihi === "fatura"
      ? c.faturaAdres
      : c.sevkiyatTercihi === "ozel"
        ? c.ozelSevkiyatAdres
        : c.adres;

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
              background: cr.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: cr.color,
              fontFamily: "Sora,sans-serif",
              flexShrink: 0,
            }}
          >
            {initials(c.kurumAdi)}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
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
                {c.kurumAdi}
              </h2>
              <Badge label={c.kurumTuru} bg={cr.bg} color={cr.color} />
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.textMuted,
                display: "flex",
                gap: 10,
              }}
            >
              📍 {c.sehir} · 📞 {c.telefon}
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

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {[
          { l: "Cihaz", v: devs.length, c: T.blue },
          {
            l: "Aktif Servis",
            v: svcs.filter(
              (s) => !["Kapalı", "Fatura Kesildi"].includes(s.status)
            ).length,
            c: T.amber,
          },
          {
            l: "Anlaşma",
            v: conts.filter((x) => x.status === "Aktif").length,
            c: T.purple,
          },
          { l: "Toplam Ciro", v: fmtMoney(rev), c: T.green },
        ].map((m) => (
          <Card key={m.l} style={{ padding: "10px 13px" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: T.textSub,
                marginBottom: 3,
              }}
            >
              {m.l}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: m.c,
                fontFamily: "Sora,sans-serif",
              }}
            >
              {m.v}
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "genel", label: "Genel", icon: "📋" },
          { id: "fatura", label: "Fatura", icon: "🧾" },
          { id: "cihazlar", label: "Cihazlar", icon: "🔬", count: devs.length },
          { id: "servisler", label: "Servisler", icon: "🔧", count: svcs.length },
          {
            id: "anlasmalar",
            label: "Anlaşmalar",
            icon: "📄",
            count: conts.length,
          },
        ]}
      />

      {/* Tab: Genel */}
      {tab === "genel" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card style={{ padding: 16 }}>
            <SLabel title="İletişim" icon="📍" />
            <IRow label="Adres" value={c.adres} />
            <IRow label="Tel" value={c.telefon} />
            <IRow label="E-Posta" value={c.email} />
            {c.notlar && (
              <div
                style={{
                  marginTop: 10,
                  background: T.amberLight,
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 12,
                  color: "#92400E",
                }}
              >
                📝 {c.notlar}
              </div>
            )}
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Card style={{ padding: 14 }}>
              <SLabel title="Teknik İrtibat" icon="🔧" />
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {c.teknikIrtibat.ad}
              </div>
              <div style={{ fontSize: 11, color: T.textMuted }}>
                {c.teknikIrtibat.unvan} · {c.teknikIrtibat.tel}
              </div>
            </Card>

            <Card style={{ padding: 14 }}>
              <SLabel title="Satın Alma" icon="📦" />
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {c.satinAlmaIrtibat.ad}
              </div>
              <div style={{ fontSize: 11, color: T.textMuted }}>
                {c.satinAlmaIrtibat.unvan} · {c.satinAlmaIrtibat.tel}
              </div>
            </Card>

            <Card style={{ padding: 14, borderLeft: `3px solid ${T.teal}` }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.teal,
                  marginBottom: 3,
                }}
              >
                🚚 AKTİF SEVKİYAT
              </div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>
                {sevkAdres}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Fatura */}
      {tab === "fatura" && (
        <Card style={{ padding: 16 }}>
          <SLabel title="Fatura Bilgileri" />
          <IRow label="Fatura Unvanı" value={c.faturaAdi} />
          <IRow label="Vergi Dairesi" value={c.vergiDairesi} />
          <IRow label="Vergi No" value={c.vergiNo} mono />
          <IRow label="Fatura Adresi" value={c.faturaAdres} />
          {c.kurumAdi !== c.faturaAdi && (
            <div
              style={{
                marginTop: 10,
                background: T.amberLight,
                borderRadius: 8,
                padding: "9px 11px",
                fontSize: 12,
                color: "#92400E",
              }}
            >
              ⚠ Kurum adı ≠ fatura unvanı
            </div>
          )}
        </Card>
      )}

      {/* Tab: Cihazlar */}
      {tab === "cihazlar" && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Seri No", "Model", "Dept", "Garanti", "Sonraki Kal.", "Durum"].map(
                  (h) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {devs.map((d, i) => {
                const wS =
                  d.warranty === "active"
                    ? { bg: T.greenLight, color: T.green }
                    : { bg: T.redLight, color: T.red };
                const dS =
                  d.status === "aktif"
                    ? { bg: T.greenLight, color: T.green }
                    : { bg: T.redLight, color: T.red };

                return (
                  <tr
                    key={d.id}
                    className="rh"
                    style={{
                      borderBottom:
                        i < devs.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 13px",
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: T.teal,
                      }}
                    >
                      {d.seriNo}
                    </td>
                    <td style={{ padding: "10px 13px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        {d.marka}
                      </div>
                      <div style={{ fontSize: 11, color: T.textMuted }}>
                        {d.model}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px 13px",
                        fontSize: 11,
                        color: T.textSub,
                      }}
                    >
                      {d.dept}
                    </td>
                    <td style={{ padding: "10px 13px" }}>
                      <Badge
                        label={d.warranty === "active" ? "Garantide" : "Doldu"}
                        bg={wS.bg}
                        color={wS.color}
                      />
                    </td>
                    <td
                      style={{
                        padding: "10px 13px",
                        fontSize: 12,
                        fontWeight: 700,
                        color:
                          d.calDays <= 20
                            ? T.red
                            : d.calDays <= 30
                              ? T.amber
                              : T.textSub,
                      }}
                    >
                      {d.calDays}g
                    </td>
                    <td style={{ padding: "10px 13px" }}>
                      <Badge label={d.status} bg={dS.bg} color={dS.color} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Tab: Servisler */}
      {tab === "servisler" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {svcs.map((s) => {
            const st = SVC_STATUS_CFG[s.status] || {};
            return (
              <Card
                key={s.id}
                style={{
                  padding: "12px 15px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    background: "#F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  🔧
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 2 }}>
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: T.teal }}
                    >
                      {s.id}
                    </span>
                    <Badge label={s.status} bg={st.bg} color={st.color} />
                  </div>
                  <div style={{ fontSize: 11, color: T.textSub }}>
                    {s.fault?.substring(0, 60)}...
                  </div>
                </div>
                {s.amount && (
                  <span
                    style={{ fontSize: 14, fontWeight: 800, color: T.green }}
                  >
                    {fmtMoney(s.amount)}
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab: Anlasmalar */}
      {tab === "anlasmalar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {conts.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: 32, color: T.textMuted }}
            >
              Bu müşteriye ait anlaşma yok.
            </div>
          ) : (
            conts.map((ct) => {
              const st = contractStatusCfg[ct.status] || {};
              return (
                <Card key={ct.id} style={{ padding: "14px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 700 }}>
                          {ct.tip}
                        </span>
                        <Badge
                          label={ct.status}
                          bg={st.bg}
                          color={st.color}
                        />
                      </div>
                      <div
                        style={{ fontSize: 11, color: T.textMuted }}
                      >
                        {ct.baslangic} – {ct.bitis} ·{" "}
                        {fmtMoney(ct.yillikUcret)}/yıl
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default MusterilerPage;
