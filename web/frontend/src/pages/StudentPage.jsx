import { useEffect, useState } from "react";
import { Card, PageHeader, Table, Badge, StatCard, Button } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export function OgrenciDashboard() {
  const { kullanici } = useAuth();
  const [kayitOzet, setKayitOzet] = useState({ onayliSayisi: 0 });
  const [agno, setAgno] = useState("-");

  useEffect(() => {
    api.get("/kayitlar/ogrenci").then(r => {
      const d = r.data;
      if (d) {
        setKayitOzet({
          onayliSayisi: (d.kayitlar || []).filter(k => k.durum === "Onaylı").length,
        });
      }
    }).catch(console.error);
    if (kullanici?.id) {
      api.get(`/ogrenciler/${kullanici.id}/transkript`).then(r => {
        if (r.data?.agno?.agno != null) setAgno(String(r.data.agno.agno));
      }).catch(console.error);
    }
  }, [kullanici?.id]);

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700" }}>Hoş geldin! 👋</h1>
        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Öğrenci portalına hoş geldiniz</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <StatCard label="Kayıtlı Ders" value={String(kayitOzet.onayliSayisi)} icon="📚" color="#2563eb" />
        <StatCard label="Genel Ortalama" value={String(agno)} icon="⭐" color="#7c3aed" />
        <StatCard label="Dönem" value="Aktif" icon="📅" color="#d97706" />
      </div>
    </div>
  );
}

export function DersSecimi() {
  const { kullanici } = useAuth();
  const [kayitlar, setKayitlar] = useState([]);
  const [dersler, setDersler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gonderiliyor, setGonderiliyor] = useState(null);

  useEffect(() => {
  if (!kullanici?.id) return;
  setLoading(true);

  const bolumId = kullanici?.bolum_id || null;
  const sinif   = kullanici?.sinif    || null;

  console.log("bolumId:", bolumId, "sinif:", sinif);

  Promise.all([
    api.get("/kayitlar/ogrenci").then(r => r.data).catch(() => ({ kayitlar: [] })),
    bolumId && sinif
      ? api.get("/dersler", { params: { bolum_id: bolumId, sinif } }).then(r => r.data).catch(() => [])
      : api.get("/dersler").then(r => r.data).catch(() => []),
  ]).then(([kRes, dersData]) => {
    if (kRes) setKayitlar(kRes.kayitlar || []);
    setDersler(Array.isArray(dersData) ? dersData : []);
  })
  .catch(console.error)
  .finally(() => setLoading(false));
}, [kullanici?.id]);

  const talepGonder = async (dersId) => {
    setGonderiliyor(dersId);
    try {
      await api.post("/kayitlar", { ders_id: dersId });
      const res = await api.get("/kayitlar/ogrenci");
      if (res.data) setKayitlar(res.data.kayitlar || []);
    } catch (err) {
      alert(err.response?.data?.error || "Talep gönderilemedi");
    } finally { setGonderiliyor(null); }
  };

  const bekleyenMi = (dersId) => kayitlar.find(k => k.ders_id === dersId)?.durum === "Bekliyor";
  const onayliMi  = (dersId) => kayitlar.find(k => k.ders_id === dersId)?.durum === "Onaylı";

  return (
    <div>
      <PageHeader title="Ders Seçimi" subtitle="Mevcut dersler" />
      <Card>
        {loading ? <p>Yükleniyor...</p> : dersler.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Ders bulunamadı.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "10px" }}>Ders Kodu</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Ders Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {dersler.map(d => {
                const bekleyen = bekleyenMi(d.ders_id);
                const onayli   = onayliMi(d.ders_id);
                return (
                  <tr key={d.ders_id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", fontFamily: "monospace", fontSize: "13px" }}>{d.ders_kodu || "-"}</td>
                    <td style={{ padding: "10px" }}>{d.ad || "-"}</td>
                    <td style={{ textAlign: "center", padding: "10px" }}>
                      {onayli   && <Badge color="green">Kayıtlı</Badge>}
                      {bekleyen && <Badge color="yellow">Bekliyor</Badge>}
                      {!onayli && !bekleyen && (
                        <Button
                          size="sm"
                          disabled={gonderiliyor === d.ders_id}
                          onClick={() => talepGonder(d.ders_id)}
                        >
                          {gonderiliyor === d.ders_id ? "Gönderiliyor..." : "+ Talep"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export function Derslerim() {
  const { kullanici } = useAuth();
  const [kayitlar, setKayitlar] = useState([]);
  const [notlar, setNotlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!kullanici?.id) return;
    setLoading(true);
    Promise.all([
      api.get("/kayitlar/ogrenci").then(r => r.data).catch(() => ({ kayitlar: [] })),
      api.get(`/notlar?ogrenci_id=${kullanici.id}`).then(r => r.data).catch(() => []),
    ]).then(([kRes, notData]) => {
      setKayitlar((kRes?.kayitlar || []).filter(k => k.durum === "Onaylı"));
      setNotlar(Array.isArray(notData) ? notData : []);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [kullanici?.id]);

  const getNot = (dersId, turId) =>
    notlar.find(n => Number(n.ders_id) === Number(dersId) && Number(n.sinav_tur_id) === turId)?.sinav_notu ?? null;

  const hesapla = (dersId) => {
    const vize  = getNot(dersId, 1);
    const final = getNot(dersId, 2);
    const but   = getNot(dersId, 3);
    const finalNot = but ?? final;
    if (vize == null && finalNot == null) return null;
    const ort = (vize || 0) * 0.4 + (finalNot || 0) * 0.6;
    let harf;
    if (ort >= 90) harf = "A";
    else if (ort >= 85) harf = "A";
    else if (ort >= 80) harf = "B";
    else if (ort >= 75) harf = "B";
    else if (ort >= 70) harf = "C";
    else if (ort >= 65) harf = "C";
    else if (ort >= 60) harf = "D";
    else if (ort >= 50) harf = "E";
    else harf = "F";
    return { ort: parseFloat(ort.toFixed(2)), harf, vize, final, but };
  };

  const durumBadge = (h) => {
    if (!h) return { renk: "gray", yazi: "Sonuçlanmadı" };
    return { renk: h.ort >= 60 ? "green" : "red", yazi: "Sonuçlandırıldı" };
  };

  return (
    <div>
      <PageHeader title="Derslerim" subtitle="Onaylı dersleriniz ve notlarınız" />
      <Card>
        {loading ? <p>Yükleniyor...</p> : kayitlar.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Onaylı ders kaydınız yok.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
           <thead>
  <tr style={{ borderBottom: "2px solid var(--border)", background: "#f8fafc" }}>
    {["#", "Ders Kodu", "Ders Adı", "Durum", "Vize", "Final", "Bütünleme", "Ortalama", "Harf"].map(h => (
      <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>{h}</th>
    ))}
  </tr>
</thead>
<tbody>
  {kayitlar.map((k, i) => {
    const dersId = k.ders?.ders_id;
    const h = hesapla(dersId);
    const durum = durumBadge(h);
    return (
      <tr key={k.kayit_id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
        <td style={{ padding: "12px", color: "#64748b", fontWeight: "600" }}>{i + 1}</td>
        <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "13px", fontWeight: "600" }}>{k.ders?.ders_kodu || "-"}</td>
        <td style={{ padding: "12px", fontWeight: "500" }}>{k.ders?.ad || "-"}</td>
        <td style={{ padding: "12px" }}>
          <Badge color={durum.renk}>{durum.yazi}</Badge>
        </td>
        <td style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>
          {h?.vize != null
            ? <span style={{ background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "6px", fontSize: "13px" }}>{h.vize}</span>
            : <span style={{ color: "#94a3b8" }}>-</span>}
        </td>
        <td style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>
          {h?.final != null
            ? <span style={{ background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "6px", fontSize: "13px" }}>{h.final}</span>
            : <span style={{ color: "#94a3b8" }}>-</span>}
        </td>
        <td style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>
          {h?.but != null
            ? <span style={{ background: "#fffbeb", color: "#d97706", padding: "3px 10px", borderRadius: "6px", fontSize: "13px" }}>{h.but}</span>
            : <span style={{ color: "#94a3b8" }}>-</span>}
        </td>
        <td style={{ padding: "12px", fontWeight: "700", fontSize: "15px" }}>
          {h ? h.ort : "-"}
        </td>
        <td style={{ padding: "12px", fontWeight: "700", fontSize: "15px", color: h ? (h.ort >= 60 ? "#16a34a" : "#dc2626") : "#94a3b8" }}>
          {h ? h.harf : "-"}
        </td>
      </tr>
    );
  })}
</tbody>
          </table>
        )}
      </Card>
    </div>
  );
}