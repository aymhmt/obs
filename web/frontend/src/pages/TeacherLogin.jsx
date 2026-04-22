import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TeacherLogin() {
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
      if (kullanici.rol !== "ogretmen") {
        setHata("Bu sayfa sadece öğretmenler içindir.");
        return;
      }
      navigate("/ogretmen");
    } catch (err) {
      setHata(err.response?.data?.error || "Giriş başarısız");
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>OBS</div>
          <h1 style={styles.leftTitle}>Öğretmen Portalı</h1>
          <p style={styles.leftDesc}>Derslerinizi yönetin, notları girin ve öğrenci devamını takip edin.</p>
          <div style={styles.features}>
            {["📝 Not girişi ve düzenleme", "📋 Yoklama takibi", "📊 Sınıf istatistikleri", "📢 Duyuru yönetimi"].map(f => (
              <div key={f} style={styles.featureItem}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.avatarIcon}>🎓</div>
            <h2 style={styles.cardTitle}>Öğretmen Girişi</h2>
            <p style={styles.cardSubtitle}>Öğretmen hesabınızla giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Kullanıcı Adı</label>
              <input style={styles.input} value={kullanici_adi}
                onChange={e => setKullaniciAdi(e.target.value)}
                placeholder="Kullanıcı adınız" required
                onFocus={e => e.target.style.borderColor = "#7c3aed"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Şifre</label>
              <input style={styles.input} type="password" value={sifre}
                onChange={e => setSifre(e.target.value)}
                placeholder="Şifreniz" required
                onFocus={e => e.target.style.borderColor = "#7c3aed"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {hata && <div style={styles.hata}>{hata}</div>}

            <button style={{ ...styles.btn, background: yukleniyor ? "#c4b5fd" : "#7c3aed" }}
              type="submit" disabled={yukleniyor}>
              {yukleniyor ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>veya</span>
            <span style={styles.dividerLine} />
          </div>

          <Link to="/student" style={styles.altLink}>
            Öğrenci misiniz? Buradan giriş yapın
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: { display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
  left: {
    flex: 1, background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #8b5cf6 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px",
  },
  leftContent: { maxWidth: "400px", color: "#fff" },
  logo: {
    fontSize: "28px", fontWeight: "800", background: "rgba(255,255,255,0.2)",
    display: "inline-block", padding: "8px 20px", borderRadius: "12px", marginBottom: "32px",
  },
  leftTitle: { fontSize: "36px", fontWeight: "800", marginBottom: "16px", lineHeight: 1.2 },
  leftDesc: { fontSize: "16px", opacity: 0.85, lineHeight: 1.7, marginBottom: "32px" },
  features: { display: "flex", flexDirection: "column", gap: "12px" },
  featureItem: { background: "rgba(255,255,255,0.12)", padding: "12px 16px", borderRadius: "10px", fontSize: "14px" },
  right: {
    width: "480px", display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px", background: "#f8fafc",
  },
  card: { width: "100%", background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  cardHeader: { textAlign: "center", marginBottom: "32px" },
  avatarIcon: { fontSize: "48px", marginBottom: "12px" },
  cardTitle: { fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" },
  cardSubtitle: { color: "#64748b", fontSize: "14px" },
  field: { marginBottom: "18px" },
  label: { display: "block", marginBottom: "7px", fontWeight: "600", fontSize: "13px", color: "#374151" },
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0",
    borderRadius: "10px", fontSize: "14px", outline: "none",
    transition: "border-color 0.15s", boxSizing: "border-box",
  },
  hata: {
    background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
    padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px",
  },
  btn: {
    width: "100%", padding: "13px", color: "#fff", border: "none",
    borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer",
    transition: "background 0.15s", marginTop: "4px",
  },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" },
  dividerLine: { flex: 1, height: "1px", background: "#e2e8f0" },
  dividerText: { color: "#94a3b8", fontSize: "13px" },
  altLink: {
    display: "block", textAlign: "center", padding: "12px",
    border: "1.5px solid #e2e8f0", borderRadius: "10px",
    color: "#374151", fontSize: "14px", fontWeight: "600",
    textDecoration: "none",
  },
};
