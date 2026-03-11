import { useState } from "react";
import { T } from "../theme";
import { FInput } from "../components/shared";
import { USERS } from "../data/constants";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const go = () => {
    setLoading(true);
    setErr("");
    setTimeout(() => {
      const u = USERS.find((u) => u.email === email && u.sifre === pass);
      if (u) {
        onLogin(u);
      } else {
        setErr("E-posta veya şifre hatalı.");
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.navy} 0%, #0D4A6B 55%, #0D9488 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ width: 420, zIndex: 1 }}>
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: "linear-gradient(135deg, #0D9488, #0891B2)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: 12,
              boxShadow: "0 8px 32px rgba(13,148,136,0.45)",
            }}
          >
            ⚕
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "white",
              fontFamily: "Sora, sans-serif",
            }}
          >
            ERİŞÇİ TMS
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              marginTop: 4,
            }}
          >
            Teknik Servis Yönetim Sistemi
          </div>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.98)",
            borderRadius: 16,
            padding: 30,
            boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 18px" }}>
            Giriş Yap
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FInput label="E-posta" value={email} onChange={setEmail} type="email" />
            <FInput label="Şifre" value={pass} onChange={setPass} type="password" />
          </div>

          {err && (
            <div
              style={{
                marginTop: 10,
                background: T.redLight,
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 12,
                color: T.red,
                fontWeight: 600,
              }}
            >
              ⚠ {err}
            </div>
          )}

          <button
            className="btn-p"
            onClick={go}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "12px",
              fontSize: 14,
              borderRadius: 10,
            }}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap →"}
          </button>

          {/* Demo accounts */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: T.textMuted,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Demo hesapları · şifre: <strong>erisci123</strong>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
              }}
            >
              {USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setEmail(u.email);
                    setPass(u.sifre);
                  }}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    cursor: "pointer",
                    background: T.bg,
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.teal)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
                >
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{u.ad}</div>
                  <div style={{ fontSize: 10, color: T.textMuted }}>{u.rol}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
