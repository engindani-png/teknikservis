import { useState } from "react";
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
  DEVICES_DB,
  contractStatusCfg,
  fmtMoney,
} from "../data/constants";

/* ═══════════ BAKIM ANLAŞMALARI ═══════════ */

export default function AnlasmalarPage({ ctx }) {
  const { contracts, setContracts } = ctx;
  const [sel, setSel] = useState(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <PageHeader
        title="Bakım Anlaşmaları"
        sub="Yıllık bakım, ihale ve çerçeve anlaşmaları"
        actions={[
          <button
            key="n"
            className="btn-p"
            onClick={() => setShowNew(true)}
          >
            + Yeni Anlaşma
          </button>,
        ]}
      />

      {/* ── Üst özet kartları ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {[
          {
            l: "Aktif Anlaşma",
            v: contracts.filter((c) => c.status === "Aktif").length,
            c: T.green,
          },
          {
            l: "Toplam Yıllık Ciro",
            v: fmtMoney(
              contracts
                .filter((c) => c.status === "Aktif")
                .reduce((a, b) => a + b.yillikUcret, 0)
            ),
            c: T.teal,
          },
          {
            l: "Süresi Dolan",
            v: contracts.filter((c) => c.status === "Süresi Doldu").length,
            c: T.red,
          },
        ].map((k) => (
          <Card key={k.l} style={{ padding: "14px 16px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.textSub,
                marginBottom: 3,
              }}
            >
              {k.l}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: k.c,
                fontFamily: "Sora,sans-serif",
              }}
            >
              {k.v}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Liste + detay paneli ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: sel ? "1fr 380px" : "1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {contracts.map((ct) => {
            const c = CUSTOMERS.find((c) => c.id === ct.customerId);
            const st = contractStatusCfg[ct.status] || {};
            const devCnt = ct.cihazlar.length;

            return (
              <Card
                key={ct.id}
                onClick={() => setSel(sel?.id === ct.id ? null : ct)}
                style={{
                  padding: "15px 18px",
                  borderLeft: `4px solid ${
                    ct.status === "Aktif"
                      ? T.teal
                      : ct.status === "Süresi Doldu"
                      ? T.red
                      : T.amber
                  }`,
                  cursor: "pointer",
                  background: sel?.id === ct.id ? "#F0FDFA" : T.surface,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 800 }}>
                        {ct.tip}
                      </span>
                      <Badge label={ct.status} bg={st.bg} color={st.color} />
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: T.textMuted,
                        }}
                      >
                        {ct.id}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: T.text,
                        marginBottom: 3,
                      }}
                    >
                      {c?.kurumAdi}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        fontSize: 11,
                        color: T.textMuted,
                      }}
                    >
                      <span>
                        {"\uD83D\uDCC5"} {ct.baslangic} – {ct.bitis}
                      </span>
                      <span>
                        {"\uD83D\uDD2C"} {devCnt} cihaz
                      </span>
                      <span>
                        {"\uD83D\uDC64"}{" "}
                        {USERS.find((u) => u.id === ct.sorumlu)?.ad}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: T.teal,
                        fontFamily: "Sora,sans-serif",
                      }}
                    >
                      {fmtMoney(ct.yillikUcret)}
                    </div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>
                      {ct.odemePeriyodu}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* ── Seçili anlaşma detayı ── */}
        {sel && (
          <Card style={{ position: "sticky", top: 0, padding: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800 }}>{sel.id}</span>
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

            <SLabel title="Kapsam" icon={"\uD83D\uDCCB"} />
            {sel.kapsam.map((k, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 0",
                  fontSize: 12,
                }}
              >
                <span style={{ color: T.green, fontWeight: 700 }}>
                  {"\u2713"}
                </span>
                {k}
              </div>
            ))}

            <SLabel title="Kapsamdaki Cihazlar" icon={"\uD83D\uDD2C"} />
            {sel.cihazlar.map((did) => {
              const d = DEVICES_DB.find((x) => x.id === did);
              return d ? (
                <div
                  key={did}
                  style={{ fontSize: 12, padding: "4px 0", color: T.text }}
                >
                  {d.marka} {d.model} —{" "}
                  <span
                    style={{ fontFamily: "monospace", color: T.teal }}
                  >
                    {d.seriNo}
                  </span>
                </div>
              ) : null;
            })}

            {sel.notlar && (
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
                {"\uD83D\uDCDD"} {sel.notlar}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 14,
              }}
            >
              <button
                className="btn-p"
                style={{ padding: "8px", fontSize: 12 }}
              >
                {"\u270F"} Düzenle
              </button>
              <button
                className="btn-g"
                style={{ padding: "8px", fontSize: 12 }}
              >
                {"\uD83D\uDCC4"} PDF
              </button>
              {sel.status === "Aktif" && (
                <button
                  className="btn-g"
                  style={{
                    padding: "8px",
                    fontSize: 12,
                    gridColumn: "1/-1",
                  }}
                >
                  {"\uD83D\uDD04"} Yenile
                </button>
              )}
            </div>
          </Card>
        )}
      </div>

      {showNew && (
        <NewContractModal ctx={ctx} onClose={() => setShowNew(false)} />
      )}
    </div>
  );
}

/* ═══════════ YENİ ANLAŞMA MODALI ═══════════ */

export function NewContractModal({ ctx, onClose }) {
  const [form, setForm] = useState({
    customerId: "C001",
    tip: "Yıllık Kapsamlı Bakım",
    baslangic: "",
    bitis: "",
    yillikUcret: "",
    odemePeriyodu: "Yıllık",
    notlar: "",
  });

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    const id =
      "BA-2026-" +
      String(ctx.contracts.length + 10).padStart(3, "0");

    ctx.setContracts((p) => [
      ...p,
      {
        id,
        customerId: form.customerId,
        tip: form.tip,
        baslangic: form.baslangic,
        bitis: form.bitis,
        yillikUcret: parseFloat(form.yillikUcret) || 0,
        odemePeriyodu: form.odemePeriyodu,
        status: "Aktif",
        kapsam: [],
        cihazlar: [],
        notlar: form.notlar,
        sorumlu: ctx.user.id,
      },
    ]);
    onClose();
  };

  return (
    <Modal title="Yeni Bakım Anlaşması" onClose={onClose} width={520}>
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
          label="Anlaşma Tipi"
          value={form.tip}
          onChange={upd("tip")}
          options={[
            "Yıllık Kapsamlı Bakım",
            "İhale Kapsamı Bakım",
            "Çerçeve Anlaşma",
            "Spot Servis",
            "Garanti Uzatma",
          ]}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <FInput
            label="Başlangıç"
            value={form.baslangic}
            onChange={upd("baslangic")}
            type="date"
          />
          <FInput
            label="Bitiş"
            value={form.bitis}
            onChange={upd("bitis")}
            type="date"
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <FInput
            label="Yıllık Ücret (₺)"
            value={form.yillikUcret}
            onChange={upd("yillikUcret")}
            type="number"
          />
          <FSelect
            label="Ödeme Periyodu"
            value={form.odemePeriyodu}
            onChange={upd("odemePeriyodu")}
            options={["Yıllık", "6 Aylık", "Aylık", "İş Bazlı"]}
          />
        </div>
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
            Kaydet →
          </button>
        </div>
      </div>
    </Modal>
  );
}
