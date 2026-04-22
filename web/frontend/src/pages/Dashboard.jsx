import { useEffect, useState } from "react";
import { StatCard, Card } from "../components/UI";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({ ogrenci: 0, ogretmen: 0, ders: 0 });
  const [duyurular, setDuyurular] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  Promise.all([
    api.get("/ogrenciler").catch(() => ({ data: {} })),
    api.get("/ogretmenler").catch(() => ({ data: [] })),
    api.get("/dersler").catch(() => ({ data: [] })),
    api.get("/duyurular").catch(() => ({ data: [] })),
  ]).then(([ogr, ogt, drs, duy]) => {
    setStats({
      ogrenci: ogr.data?.toplam || ogr.data?.data?.length || 0,
      ogretmen: Array.isArray(ogt.data) ? ogt.data.length : 0,
      ders: Array.isArray(drs.data) ? drs.data.length : 0,
    });
    setDuyurular(Array.isArray(duy.data) ? duy.data.slice(0, 5) : []);
  }).catch(console.error)
    .finally(() => setLoading(false));
}, []);

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700" }}>Ana Sayfa</h1>
        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>OBS sistemine hoş geldiniz</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <StatCard label="Toplam Öğrenci" value={loading ? "..." : stats.ogrenci} color="#2563eb" />
        <StatCard label="Öğretmen" value={loading ? "..." : stats.ogretmen} color="#7c3aed" />
        <StatCard label="Ders" value={loading ? "..." : stats.ders} color="#059669" />
        <StatCard label="Aktif Dönem" value="Güz 2024" color="#d97706" />
      </div>

      <Card>
        <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Son Duyurular</h2>
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Yükleniyor...</p>
        ) : duyurular.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Henüz duyuru bulunmuyor</p>
        ) : (
          duyurular.map((d) => (
            <div key={d.duyuru_id} style={{
              padding: "12px 0",
              borderBottom: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              <div>
                <p style={{ fontWeight: "600", marginBottom: "4px" }}>{d.baslik}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                  {d.icerik?.slice(0, 100)}{d.icerik?.length > 100 ? "..." : ""}
                </p>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: "12px", whiteSpace: "nowrap", marginLeft: "16px" }}>
                {new Date(d.yayin_tarihi).toLocaleDateString("tr-TR")}
              </span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
