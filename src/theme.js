/* ═══════════ TOKENS ═══════════ */
export const T = {
  bg: "#F5F7FA",
  surface: "#FFFFFF",
  border: "#E3E8F0",
  borderStrong: "#C8D4E0",

  text: "#0F1C2E",
  textSub: "#5A6A7E",
  textMuted: "#94A3B8",

  teal: "#0D9488",
  tealLight: "#CCFBF1",
  tealDark: "#0B7C74",

  navy: "#0C1628",
  navyMid: "#1E293B",

  amber: "#D97706",
  amberLight: "#FEF3C7",

  red: "#DC2626",
  redLight: "#FEE2E2",

  blue: "#2563EB",
  blueLight: "#DBEAFE",

  green: "#16A34A",
  greenLight: "#DCFCE7",

  purple: "#7C3AED",
  purpleLight: "#EDE9FE",

  orange: "#EA580C",
  orangeLight: "#FFEDD5",

  rose: "#E11D48",
  roseLight: "#FFE4E6",

  cyan: "#0891B2",
  cyanLight: "#CFFAFE",

  indigo: "#4F46E5",
  indigoLight: "#EEF2FF",
};

/* ═══════════ CSS ═══════════ */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');

* { box-sizing: border-box; }
body { margin: 0; }

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }

.rh { transition: background 0.1s; }
.rh:hover { background: #F8FAFC !important; cursor: pointer; }
.rh.sel { background: #F0FDFA !important; border-left: 3px solid ${T.teal} !important; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.15s;
  color: rgba(255,255,255,0.55);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  text-align: left;
}
.nav-item:hover { background: rgba(255,255,255,0.07) !important; }
.nav-item.active {
  background: rgba(13,148,136,0.22) !important;
  color: ${T.teal} !important;
  font-weight: 700;
}

.btn-p {
  background: ${T.teal};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.btn-p:hover { background: ${T.tealDark}; }
.btn-p:disabled { background: #94A3B8; cursor: not-allowed; }

.btn-g {
  background: none;
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 7px 13px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: ${T.textSub};
  font-family: inherit;
}
.btn-g:hover { border-color: ${T.borderStrong}; background: #F8FAFC; }

.btn-r {
  background: ${T.redLight};
  border: 1px solid #FECACA;
  border-radius: 8px;
  padding: 7px 13px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: ${T.red};
  font-family: inherit;
}

input, select, textarea { font-family: inherit; }
`;
