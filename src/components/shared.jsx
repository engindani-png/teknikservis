import { useState } from "react";
import { T } from '../theme';

/* ═══════════ SHARED COMPONENTS ═══════════ */

export function Badge({ label, bg, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 9px",
        background: bg || "#F1F5F9",
        color: color || T.textSub,
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.surface,
        borderRadius: 12,
        border: `1px solid ${T.border}`,
        boxShadow: "0 1px 4px rgba(15,28,46,0.06)",
        ...style,
        cursor: onClick ? "pointer" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function SLabel({ title, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: T.textSub,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

export function IRow({ label, value, mono = false }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 12, color: T.textMuted, minWidth: 155, flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          fontFamily: mono ? "monospace" : "inherit",
          background: mono ? "#F8FAFC" : "transparent",
          padding: mono ? "1px 5px" : "0",
          borderRadius: mono ? 4 : 0,
        }}
      >
        {value || "\u2014"}
      </span>
    </div>
  );
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        background: "#F1F5F9",
        borderRadius: 10,
        padding: 4,
        flexWrap: "wrap",
        marginBottom: 16,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            padding: "7px 13px",
            borderRadius: 8,
            transition: "all 0.15s",
            background: active === t.id ? T.surface : "transparent",
            color: active === t.id ? T.teal : T.textSub,
            boxShadow: active === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {t.icon && <span style={{ marginRight: 5 }}>{t.icon}</span>}
          {t.label}
          {t.count != null && (
            <span
              style={{
                marginLeft: 5,
                fontSize: 10,
                background: active === t.id ? T.tealLight : "#E2E8F0",
                color: active === t.id ? T.teal : T.textMuted,
                borderRadius: 10,
                padding: "1px 6px",
              }}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function FInput({
  label,
  value,
  onChange,
  type = "text",
  mono = false,
  required = false,
  placeholder = "",
}) {
  const [f, setF] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: T.textSub }}>
          {label}
          {required && <span style={{ color: T.red }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          border: `1.5px solid ${f ? T.teal : T.border}`,
          borderRadius: 8,
          padding: "8px 11px",
          fontSize: 13,
          color: T.text,
          fontFamily: mono ? "monospace" : "inherit",
          outline: "none",
          background: T.surface,
          boxShadow: f ? `0 0 0 3px ${T.tealLight}` : "none",
          transition: "all 0.15s",
        }}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
      />
    </div>
  );
}

export function FSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: T.textSub }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: `1.5px solid ${T.border}`,
          borderRadius: 8,
          padding: "8px 11px",
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          background: T.surface,
          color: T.text,
        }}
      >
        {options.map((o) => (
          <option key={o.value || o} value={o.value || o}>
            {o.label || o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FTextarea({ label, value, onChange, rows = 3 }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: T.textSub }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{
          border: `1.5px solid ${f ? T.teal : T.border}`,
          borderRadius: 8,
          padding: "8px 11px",
          fontSize: 13,
          color: T.text,
          fontFamily: "inherit",
          outline: "none",
          background: T.surface,
          resize: "vertical",
          lineHeight: 1.6,
          boxShadow: f ? `0 0 0 3px ${T.tealLight}` : "none",
          transition: "all 0.15s",
        }}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
      />
    </div>
  );
}

export function Modal({ title, onClose, children, width = 600 }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,28,46,0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: T.surface,
          borderRadius: 16,
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: T.surface,
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 800 }}>{title}</span>
          <button
            onClick={onClose}
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
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, sub, actions }) {
  return (
    <div
      style={{
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "Sora,sans-serif", margin: 0 }}>
          {title}
        </h1>
        {sub && (
          <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{sub}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>
      )}
    </div>
  );
}

export function EmptyState({ icon, text }) {
  return (
    <div
      style={{
        height: "100%",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.4,
      }}
    >
      <div style={{ fontSize: 48 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12 }}>{text}</div>
    </div>
  );
}

export function SideLayout({ list, detail }) {
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 52px)",
        margin: "-26px",
        overflow: "hidden",
      }}
    >
      {list}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>{detail}</div>
    </div>
  );
}

export function SidePanel({
  children,
  search,
  onSearch,
  onNew,
  newLabel,
  searchPlaceholder = "Ara...",
}) {
  return (
    <aside
      style={{
        width: 280,
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "13px 13px 9px", borderBottom: `1px solid ${T.border}` }}>
        {onSearch && (
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              width: "100%",
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: "8px 11px",
              fontSize: 12,
              fontFamily: "inherit",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = T.teal)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        )}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      {onNew && (
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}>
          <button
            className="btn-p"
            onClick={onNew}
            style={{ width: "100%", padding: "9px", fontSize: 12, borderRadius: 8 }}
          >
            {newLabel || "+ Ekle"}
          </button>
        </div>
      )}
    </aside>
  );
}
