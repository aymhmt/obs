import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [kullanici_adi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata("");
    setYukleniyor(true);
    try {
      const kullanici = await login(kullanici_adi, sifre);
      if (kullanici.rol !== "admin" && kullanici.rol !== "idari") {
        setHata("Bu alana erişim yetkiniz bulunmamaktadır.");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setHata(err.response?.data?.error || "Giriş başarısız");
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: "20px",
    }}>
      <div style={{
        position: "fixed", inset: 0, overflow: "hidden", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px", background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: "800", color: "#fff", margin: "0 auto 16px",
            boxShadow: "0 8px 32px rgba(37,99,235,0.4)",
          }}>O</div>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: "0 0 6px" }}>Yönetim Paneli</h1>
          <p style={{ color: "#475569", fontSize: "13px" }}>Sadece yetkili personel girebilir</p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "36px", backdropFilter: "blur(10px)",
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "7px", fontWeight: "600", fontSize: "13px", color: "#94a3b8" }}>
                Kullanıcı Adı
              </label>
              <input value={kullanici_adi} onChange={e => setKullaniciAdi(e.target.value)}
                placeholder="Yönetici kullanıcı adı" required
                style={{
                  width: "100%", padding: "11px 14px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px", fontSize: "14px", color: "#fff", outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "7px", fontWeight: "600", fontSize: "13px", color: "#94a3b8" }}>
                Şifre
              </label>
              <input type="password" value={sifre} onChange={e => setSifre(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width: "100%", padding: "11px 14px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px", fontSize: "14px", color: "#fff", outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
            </div>

            {hata && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171", padding: "10px 14px", borderRadius: "8px",
                fontSize: "13px", marginBottom: "16px",
              }}>{hata}</div>
            )}

            <button type="submit" disabled={yukleniyor} style={{
              width: "100%", padding: "13px",
              background: yukleniyor ? "rgba(37,99,235,0.5)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: "700", cursor: yukleniyor ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
            }}>
              {yukleniyor ? "Doğrulanıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "#334155", fontSize: "12px", marginTop: "24px" }}>
          OBS · Öğrenci Bilgi Sistemi
        </p>
      </div>
    </div>
  );
}
