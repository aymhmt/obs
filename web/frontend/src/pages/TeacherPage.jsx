import { useEffect, useState } from "react";
import { Card, PageHeader, Badge, Button, Modal, Input, StatCard } from "../components/UI";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const harfHesapla = (vize, final, but) => {
  const finalSon = but > 0 ? but : (final || 0);
  const ham = (vize || 0) * 0.4 + finalSon * 0.6;
  if (ham >= 90) return { harf: "AA", renk: "green",  ham: ham.toFixed(1) };
  if (ham >= 85) return { harf: "BA", renk: "green",  ham: ham.toFixed(1) };
  if (ham >= 80) return { harf: "BB", renk: "green",  ham: ham.toFixed(1) };
  if (ham >= 75) return { harf: "CB", renk: "blue",   ham: ham.toFixed(1) };
  if (ham >= 70) return { harf: "CC", renk: "blue",   ham: ham.toFixed(1) };
  if (ham >= 65) return { harf: "DC", renk: "yellow", ham: ham.toFixed(1) };
  if (ham >= 60) return { harf: "DD", renk: "yellow", ham: ham.toFixed(1) };
  if (ham >= 50) return { harf: "FD", renk: "red",    ham: ham.toFixed(1) };
  return { harf: "FF", renk: "red", ham: ham.toFixed(1) };
};

export function OgretmenDashboard() {
  const { kullanici } = useAuth();
  const [dersler, setDersler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dersler")
      .then(r => {
        const liste = Array.isArray(r.data) ? r.data : [];
        setDersler(liste.filter(d => Number(d.ogretmen?.ogretmen_id) === Number(kullanici?.id)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [kullanici?.id]);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>
          Hoş geldiniz {kullanici?.unvan && `- ${kullanici.unvan}`} {kullanici?.ad} {kullanici?.soyad}
        </h1>
        <p style={{ color: "#64748b", marginTop: "4px" }}>Aktif dönem özeti</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", marginBottom: "24px" }}>
        <StatCard label="Ders Sayısı" value={loading ? "..." : dersler.length} icon="📚" color="#2563eb" />
        <StatCard label="Aktif Dönem" value="Aktif" icon="📅" color="#d97706" />
      </div>
      <Card>
        <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Derslerim</h2>
        {loading ? <p style={{ color: "#64748b" }}>Yükleniyor...</p> :
          dersler.length === 0 ? <p style={{ color: "#64748b" }}>Ders bulunamadı</p> :
          dersler.map(d => (
            <div key={d.ders_id} style={{ padding: "12px 0", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: "600" }}>{d.ad}</p>
                <p style={{ color: "#64748b", fontSize: "13px" }}>{d.ders_kodu} · {d.sinif_seviyesi}. Sınıf</p>
              </div>
              <Badge color={d.tur === "Zorunlu" ? "blue" : "purple"}>{d.tur}</Badge>
            </div>
          ))
        }
      </Card>
    </div>
  );
}

export function OgretmenDersler() {
  const { kullanici } = useAuth();
  const [dersler, setDersler] = useState([]);
  const [seciliDers, setSeciliDers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dersler")
      .then(r => {
        const liste = Array.isArray(r.data) ? r.data : [];
        setDersler(liste.filter(d => Number(d.ogretmen?.ogretmen_id) === Number(kullanici?.id)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [kullanici?.id]);

  if (seciliDers) return <DersDetay ders={seciliDers} onGeri={() => setSeciliDers(null)} />;

  return (
    <div>
      <PageHeader title="Derslerim" subtitle="Bir derse tıklayarak öğrenci listesi ve not girişi yapın" />
      {loading ? <p style={{ color: "#64748b" }}>Yükleniyor...</p> :
        dersler.length === 0 ?
          <Card><p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>Henüz ders atanmamış</p></Card> :
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" }}>
            {dersler.map(d => (
              <div key={d.ders_id} onClick={() => setSeciliDers(d)}
                style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px 24px", cursor: "pointer", borderLeft: "4px solid #2563eb" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.12)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <p style={{ fontWeight: "700", fontSize: "16px", color: "#0f172a", marginBottom: "4px" }}>{d.ad}</p>
                    <p style={{ color: "#64748b", fontSize: "13px" }}>{d.ders_kodu}</p>
                  </div>
                  <Badge color={d.tur === "Zorunlu" ? "blue" : "purple"}>{d.tur}</Badge>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <Badge color="gray">🎓 {d.sinif_seviyesi}. Sınıf</Badge>
                </div>
                <div style={{ marginTop: "12px", textAlign: "right" }}>
                  <span style={{ color: "#2563eb", fontSize: "13px", fontWeight: "600" }}>Detay →</span>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

function DersDetay({ ders, onGeri }) {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [notlar, setNotlar]         = useState([]);
  const [notForm, setNotForm]       = useState({});
  const [loading, setLoading]       = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(null);
  const [siliniyor, setSiliniyor]   = useState(null);
  const [mesaj, setMesaj]           = useState("");
  const [duzenleModal, setDuzenleModal] = useState(null); 

  const yukle = () => {
    setLoading(true);
    Promise.all([
      api.get(`/kayitlar?durum=Onaylı&ders_id=${ders.ders_id}`).then(r => r.data).catch(() => []),
      api.get(`/notlar?ders_id=${ders.ders_id}`).then(r => r.data).catch(() => []),
    ]).then(([kayitData, notData]) => {
      const ogr = Array.isArray(kayitData) ? kayitData : [];
      const not = Array.isArray(notData)   ? notData   : [];
      setOgrenciler(ogr);
      setNotlar(not);
      const init = {};
      ogr.forEach(o => {
        const oId = o.ogrenci?.ogrenci_id;
        init[oId] = {
          vize:  not.find(n => Number(n.ogrenci_id) === Number(oId) && Number(n.sinav_tur_id) === 1)?.sinav_notu?.toString() ?? "",
          final: not.find(n => Number(n.ogrenci_id) === Number(oId) && Number(n.sinav_tur_id) === 2)?.sinav_notu?.toString() ?? "",
          but:   not.find(n => Number(n.ogrenci_id) === Number(oId) && Number(n.sinav_tur_id) === 3)?.sinav_notu?.toString() ?? "",
        };
      });
      setNotForm(init);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  useEffect(() => { yukle(); }, [ders.ders_id]);

  const kaydet = async (ogrenciId, form) => {
    if (!form) return;
    setKaydediliyor(ogrenciId);
    try {
      const istekler = [];
      if (form.vize !== "" && form.vize != null)
        istekler.push(api.post("/notlar", { ogrenci_id: Number(ogrenciId), ders_id: Number(ders.ders_id), sinav_tur_id: 1, sinav_notu: parseFloat(form.vize) }));
      if (form.final !== "" && form.final != null)
        istekler.push(api.post("/notlar", { ogrenci_id: Number(ogrenciId), ders_id: Number(ders.ders_id), sinav_tur_id: 2, sinav_notu: parseFloat(form.final) }));
      if (form.but !== "" && form.but != null)
        istekler.push(api.post("/notlar", { ogrenci_id: Number(ogrenciId), ders_id: Number(ders.ders_id), sinav_tur_id: 3, sinav_notu: parseFloat(form.but) }));
      await Promise.all(istekler);
      setMesaj("Not kaydedildi!");
      setTimeout(() => setMesaj(""), 2500);
      setDuzenleModal(null);
      yukle();
    } catch (err) {
      alert(err.response?.data?.error || "Kayıt sırasında hata oluştu");
    } finally { setKaydediliyor(null); }
  };


  const getNot = (ogrenciId, turId) =>
    notlar.find(n => Number(n.ogrenci_id) === Number(ogrenciId) && Number(n.sinav_tur_id) === turId);

  const hesapla = (ogrenciId) => {
    const vize  = getNot(ogrenciId, 1)?.sinav_notu;
    const final = getNot(ogrenciId, 2)?.sinav_notu;
    const but   = getNot(ogrenciId, 3)?.sinav_notu;
    const finalNot = but ?? final;
    if (vize == null && finalNot == null) return null;
    const ort = (vize || 0) * 0.4 + (finalNot || 0) * 0.6;
    return harfHesapla(vize || 0, final || 0, but || 0);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button onClick={onGeri} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          ← Geri
        </button>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>{ders.ad}</h1>
          <p style={{ color: "#64748b", fontSize: "13px" }}>{ders.ders_kodu} · {ders.sinif_seviyesi}. Sınıf · {ogrenciler.length} öğrenci</p>
        </div>
      </div>

      {mesaj && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", color: "#15803d", fontWeight: "600" }}>
          {mesaj}
        </div>
      )}

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontWeight: "700" }}>Öğrenci Listesi & Not Yönetimi</h3>
            <p style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>Vize %40 + Final %60 · Bütünleme girersen final yerine geçer</p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "#64748b" }}>Yükleniyor...</p>
        ) : ogrenciler.length === 0 ? (
          <p style={{ color: "#64748b" }}>Bu derse onaylı kayıtlı öğrenci yok.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", background: "#f8fafc" }}>
                  {["#", "Öğrenci No", "Ad Soyad", "Sınıf", "Vize", "Final", "Bütünleme", "Ort.", "Harf", "İşlemler"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ogrenciler.map((o, i) => {
                  const oId = o.ogrenci?.ogrenci_id;
                  const vizeMevcut  = getNot(oId, 1);
                  const finalMevcut = getNot(oId, 2);
                  const butMevcut   = getNot(oId, 3);
                  const hesap = hesapla(oId);

                  return (
                    <tr key={o.kayit_id} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={{ padding: "12px", color: "#64748b", fontWeight: "600" }}>{i + 1}</td>
                      <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: "600", fontSize: "13px" }}>{o.ogrenci?.ogrenci_no}</td>
                      <td style={{ padding: "12px", fontSize: "13px", whiteSpace: "nowrap", fontWeight: "500" }}>{o.ogrenci?.ad} {o.ogrenci?.soyad}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>{o.ogrenci?.sinif}. Sınıf</td>

                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {vizeMevcut
                          ? <span style={{ background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>{vizeMevcut.sinav_notu}</span>
                          : <span style={{ color: "#94a3b8" }}>-</span>}
                      </td>

                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {finalMevcut
                          ? <span style={{ background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>{finalMevcut.sinav_notu}</span>
                          : <span style={{ color: "#94a3b8" }}>-</span>}
                      </td>

                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {butMevcut
                          ? <span style={{ background: "#fffbeb", color: "#d97706", padding: "3px 10px", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>{butMevcut.sinav_notu}</span>
                          : <span style={{ color: "#94a3b8" }}>-</span>}
                      </td>

                      <td style={{ padding: "12px", fontWeight: "700", fontSize: "14px", color: hesap ? "#0f172a" : "#94a3b8" }}>
                        {hesap ? hesap.ham : "—"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {hesap ? <Badge color={hesap.renk}>{hesap.harf}</Badge> : "—"}
                      </td>

                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => setDuzenleModal({
                              ogrenciId: oId,
                              ad: o.ogrenci?.ad,
                              soyad: o.ogrenci?.soyad,
                              form: {
                                vize:  vizeMevcut?.sinav_notu?.toString() ?? "",
                                final: finalMevcut?.sinav_notu?.toString() ?? "",
                                but:   butMevcut?.sinav_notu?.toString() ?? "",
                              }
                            })}
                            style={{ background: "#eff6ff", border: "none", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", color: "#2563eb", fontSize: "12px", fontWeight: "600" }}>
                            Düzenle
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {duzenleModal && (
        <Modal
          open={!!duzenleModal}
          onClose={() => setDuzenleModal(null)}
          title={`Not Düzenle — ${duzenleModal.ad} ${duzenleModal.soyad}`}
          width="400px"
        >
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>Vize %40 + Final %60 · Bütünleme girersen final yerine geçer</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>Vize (0-100)</label>
              <input
                type="number" min="0" max="100"
                value={duzenleModal.form.vize}
                onChange={e => setDuzenleModal(prev => ({ ...prev, form: { ...prev.form, vize: e.target.value } }))}
                placeholder="Not girin"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>Final (0-100)</label>
              <input
                type="number" min="0" max="100"
                value={duzenleModal.form.final}
                onChange={e => setDuzenleModal(prev => ({ ...prev, form: { ...prev.form, final: e.target.value } }))}
                placeholder="Not girin"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>Bütünleme (0-100)</label>
              <input
                type="number" min="0" max="100"
                value={duzenleModal.form.but}
                onChange={e => setDuzenleModal(prev => ({ ...prev, form: { ...prev.form, but: e.target.value } }))}
                placeholder="Not girin"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {(duzenleModal.form.vize !== "" || duzenleModal.form.final !== "") && (() => {
            const h = harfHesapla(
              parseFloat(duzenleModal.form.vize) || 0,
              parseFloat(duzenleModal.form.final) || 0,
              parseFloat(duzenleModal.form.but) || 0
            );
            return (
              <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "12px", marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748b", fontSize: "13px" }}>Ortalama:</span>
                <span style={{ fontWeight: "700", fontSize: "16px" }}>{h.ham} <Badge color={h.renk}>{h.harf}</Badge></span>
              </div>
            );
          })()}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
            <Button variant="secondary" onClick={() => setDuzenleModal(null)}>İptal</Button>
            <Button onClick={() => kaydet(duzenleModal.ogrenciId, duzenleModal.form)} disabled={kaydediliyor === duzenleModal.ogrenciId}>
              {kaydediliyor === duzenleModal.ogrenciId ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function OgrenciEkle() {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [araText, setAraText]       = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [sonuc, setSonuc]           = useState(null);
  const [form, setForm] = useState({
    ad: "", soyad: "", tc_kimlik: "", ogrenci_no: "", sinif: 1,
    kayit_tarihi: new Date().toISOString().split("T")[0]
  });

  const yukle = () => {
    setLoading(true);
    api.get(`/ogrenciler?ara=${araText}`)
      .then(r => setOgrenciler(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { yukle(); }, [araText]);

  const kaydet = async () => {
    if (!form.ad || !form.soyad || !form.tc_kimlik || !form.ogrenci_no)
      return alert("Tüm alanlar zorunludur");
    if (String(form.tc_kimlik).length !== 11)
      return alert("TC kimlik 11 haneli olmalıdır");
    setKaydediliyor(true);
    try {
      const res = await api.post("/ogrenciler/ogretmen-ekle", form);
      setSonuc(res.data);
      setModal(false);
      setForm({ ad: "", soyad: "", tc_kimlik: "", ogrenci_no: "", sinif: 1, kayit_tarihi: new Date().toISOString().split("T")[0] });
      yukle();
    } catch (err) { alert(err.response?.data?.error || "Hata oluştu"); }
    finally { setKaydediliyor(false); }
  };


}