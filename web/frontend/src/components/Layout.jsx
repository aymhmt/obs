import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminMenu = [
  { label: "Ana Sayfa",      path: "/dashboard"},
  { label: "Öğrenciler",    path: "/ogrenciler"},
  { label: "Öğretmenler",   path: "/ogretmenler"},
  { label: "Dersler",       path: "/dersler"},
  { label: "Kayıt Onayları",path: "/kayit-onaylari"},
  { label: "Ödemeler",      path: "/odemeler"},
];

const ogretmenMenu = [
  { label: "Ana Sayfa",     path: "/ogretmen"},
  { label: "Derslerim",     path: "/ogretmen/derslerim"},
  { label: "Duyurular",    path: "/duyurular"},
    { label: "Ödemeler",      path: "/odemeler"},
];

const ogrenciMenu = [
  { label: "Ana Sayfa",      path: "/ogrenci"},
  { label: "Ders Seçimi",    path: "/ogrenci/ders-secimi"},
  { label: "Derslerim",      path: "/ogrenci/derslerim"},
  { label: "Duyurular",      path: "/duyurular"},
];

export default function Layout({ children }) {
  const { kullanici, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menu =
    kullanici?.rol === "ogretmen" ? ogretmenMenu :
    kullanici?.rol === "ogrenci"  ? ogrenciMenu  : adminMenu;

  const handleLogout = () => { logout(); navigate("/student"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8fafc" }}>
      <div style={{
        width: collapsed ? "64px" : "240px", background: "#1e293b", color: "#fff",
        display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0,
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", background: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>O</div>
          {!collapsed && <span style={{ fontWeight: "700", fontSize: "16px" }}>OBS</span>}
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {menu.map(item => {
            const aktif = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 10px", borderRadius: "8px", marginBottom: "2px",
                background: aktif ? "#2563eb" : "transparent",
                color: aktif ? "#fff" : "#94a3b8",
                textDecoration: "none", fontSize: "14px", fontWeight: aktif ? "600" : "400",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!aktif) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { if (!aktif) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {!collapsed && (
            <div style={{ padding: "8px 10px", marginBottom: "8px" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>{kullanici?.ad} {kullanici?.soyad}</p>
              <p style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", textTransform: "capitalize" }}>{kullanici?.rol}</p>
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: "100%", padding: "9px 10px", background: "rgba(239,68,68,0.1)", border: "none",
            borderRadius: "8px", color: "#f87171", fontSize: "13px", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {!collapsed && "Çıkış Yap"}
          </button>
        </div>
      </div>

      <div style={{ marginLeft: collapsed ? "64px" : "240px", flex: 1, transition: "margin-left 0.2s" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#64748b" }}>
            {collapsed ? "☰" : "✕"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", background: "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
              {kullanici?.rol === "ogrenci" ? "👤" : kullanici?.rol === "ogretmen" ? "👨‍🏫" : "⚙️"}
            </div>
            {!collapsed && <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{kullanici?.kullanici_adi}</span>}
          </div>
        </div>

        <div style={{ padding: "28px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
