import { useEffect, useState } from "react";
import { Card, PageHeader, Button, Table, Badge, Modal, Input, Select } from "../components/UI";
import api from "../api/axios";

export function Ogretmenler() {
  const [ogretmenler, setOgretmenler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [sonuc, setSonuc] = useState(null);
  const [fakulteler, setFakulteleler] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [form, setForm] = useState({ ad: "", soyad: "", unvan: "Dr. Öğr. Üyesi", fakulte_id: "", bolum_id: "", kullanici_adi: "", sifre: "" });
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const yukle = () => {
    setLoading(true);
    api.get("/ogretmenler")
      .then(r => setOgretmenler(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    yukle();
    api.get("/fakulteler").then(r => setFakulteleler(Array.isArray(r.data) ? r.data : [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.fakulte_id) { setBolumler([]); return; }
    api.get(`/bolumler?fakulte_id=${form.fakulte_id}`)
      .then(r => setBolumler(Array.isArray(r.data) ? r.data : []))
      .catch(console.error);
  }, [form.fakulte_id]);

  const kaydet = async () => {
    if (!form.ad || !form.soyad || !form.kullanici_adi || !form.sifre)
      return alert("Ad, soyad, kullanıcı adı ve şifre zorunludur");
    setKaydediliyor(true);
    try {
      const res = await api.post("/ogretmenler", {
        ...form,
        bolum_id: form.bolum_id ? Number(form.bolum_id) : null,
      });
      setSonuc(res.data);
      setModal(false);
      setForm({ ad: "", soyad: "", unvan: "Dr. Öğr. Üyesi", fakulte_id: "", bolum_id: "", kullanici_adi: "", sifre: "" });
      yukle();
    } catch (err) {
      alert(err.response?.data?.error || "Hata oluştu");
    } finally { setKaydediliyor(false); }
  };

  const sil = async (id) => {
    if (!confirm("Bu öğretmeni silmek istediğinizden emin misiniz?")) return;
    try { await api.delete(`/ogretmenler/${id}`); yukle(); }
    catch { alert("Silme işlemi başarısız"); }
  };

  const kolonlar = [
    { key: "unvan", label: "Ünvan", render: v => v || "-" },
    { key: "ad", label: "Ad Soyad", render: (_, r) => `${r.ad} ${r.soyad}` },
    { key: "kullanici_adi", label: "Kullanıcı Adı", render: v => v || "-" },
    { key: "bolum", label: "Bölüm", render: v => v?.ad || "-" },
    { key: "ogretmen_id", label: "İşlem", render: id => (
      <Button size="sm" variant="danger" onClick={() => sil(id)}>Sil</Button>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Öğretmenler"
        subtitle={`${ogretmenler.length} öğretim görevlisi`}
        action={<Button onClick={() => { setSonuc(null); setModal(true); }}>+ Yeni Öğretmen</Button>}
      />
      {sonuc && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
          <p style={{ fontWeight: "700", color: "#15803d", marginBottom: "10px" }}>✅ {sonuc.mesaj}</p>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "14px", border: "1px solid #bbf7d0" }}>
            <p style={{ fontSize: "13px", marginBottom: "6px" }}><strong>Öğretmene verilecek giriş bilgileri:</strong></p>
            <p style={{ fontSize: "14px" }}>👤 Kullanıcı adı: <strong style={{ fontFamily: "monospace" }}>{sonuc.giris_bilgisi?.kullanici_adi}</strong></p>
            <p style={{ fontSize: "14px", marginTop: "4px" }}>🔑 Şifre: <strong style={{ fontFamily: "monospace" }}>{sonuc.giris_bilgisi?.sifre}</strong></p>
          </div>
          <button onClick={() => setSonuc(null)} style={{ marginTop: "8px", background: "none", border: "none", color: "#64748b", fontSize: "12px", cursor: "pointer" }}>Kapat</button>
        </div>
      )}
      <Card><Table columns={kolonlar} data={ogretmenler} loading={loading} /></Card>
      <Modal open={modal} onClose={() => setModal(false)} title="Yeni Öğretmen Ekle" width="560px">
        <Select label="Ünvan" value={form.unvan} onChange={e => setForm({...form, unvan: e.target.value})}
          options={["Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi", "Öğr. Gör.", "Arş. Gör."].map(u => ({ value: u, label: u }))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Ad" value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} placeholder="Ahmet" />
          <Input label="Soyad" value={form.soyad} onChange={e => setForm({...form, soyad: e.target.value})} placeholder="Yılmaz" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Kullanıcı Adı" value={form.kullanici_adi} onChange={e => setForm({...form, kullanici_adi: e.target.value})} placeholder="ahmet.yilmaz" />
          <Input label="Şifre" type="password" value={form.sifre} onChange={e => setForm({...form, sifre: e.target.value})} placeholder="Güçlü bir şifre" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Select label="Fakülte" value={form.fakulte_id} onChange={e => setForm({...form, fakulte_id: e.target.value, bolum_id: ""})}
            options={[{ value: "", label: "Seçiniz" }, ...fakulteler.map(f => ({ value: f.fakulte_id, label: f.ad }))]} />
          <Select label="Bölüm" value={form.bolum_id} onChange={e => setForm({...form, bolum_id: e.target.value})}
            options={[{ value: "", label: form.fakulte_id ? "Seçiniz" : "Önce fakülte seçin" }, ...bolumler.map(b => ({ value: b.bolum_id, label: b.ad }))]}
            disabled={!form.fakulte_id} />
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
          <Button variant="secondary" onClick={() => setModal(false)}>İptal</Button>
          <Button onClick={kaydet} disabled={kaydediliyor}>{kaydediliyor ? "Kaydediliyor..." : "Kaydet"}</Button>
        </div>
      </Modal>
    </div>
  );
}
export function Dersler() {
  const [dersler, setDersler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [ogretmenler, setOgretmenler] = useState([]);
  const [fakulteler, setFakulteleler] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [araText, setAraText] = useState("");
  const [form, setForm] = useState({
    ders_kodu: "", ad: "", kredi: 3, akts: 6,
    tur: "Zorunlu", sinif_seviyesi: 1,
    ogretmen_id: "", fakulte_id: "", bolum_id: "",
  });
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const yukle = () => {
    setLoading(true);
    api.get(`/dersler?ara=${araText}`)
      .then(r => setDersler(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { yukle(); }, [araText]);

  useEffect(() => {
    api.get("/fakulteler").then(r => setFakulteleler(Array.isArray(r.data) ? r.data : [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.fakulte_id) { setBolumler([]); return; }
    api.get(`/bolumler?fakulte_id=${form.fakulte_id}`)
      .then(r => setBolumler(Array.isArray(r.data) ? r.data : []))
      .catch(console.error);
  }, [form.fakulte_id]);

  useEffect(() => {
  console.log("bolum_id değişti:", form.bolum_id);
  if (!form.bolum_id) { setOgretmenler([]); return; }
  api.get(`/ogretmenler?bolum_id=${form.bolum_id}`)
    .then(r => {
      console.log("ogretmenler response:", r.data);
      setOgretmenler(Array.isArray(r.data) ? r.data : []);
    })
    .catch(console.error);
}, [form.bolum_id]);

  const kaydet = async () => {
    if (!form.ders_kodu || !form.ad) return alert("Ders kodu ve adı zorunlu");
    if (!form.bolum_id) return alert("Lütfen bölüm seçiniz");
    setKaydediliyor(true);
    try {
      await api.post("/dersler", {
        ...form,
        bolum_id: Number(form.bolum_id),
        ogretmen_id: form.ogretmen_id ? Number(form.ogretmen_id) : null,
        fakulte_id: form.fakulte_id ? Number(form.fakulte_id) : null,
      });
      setModal(false);
      setForm({ ders_kodu: "", ad: "", kredi: 3, akts: 6, tur: "Zorunlu", sinif_seviyesi: 1, ogretmen_id: "", fakulte_id: "", bolum_id: "" });
      yukle();
    } catch (err) {
      alert(err.response?.data?.error || "Hata oluştu");
    } finally { setKaydediliyor(false); }
  };

  const sil = async (id) => {
    if (!confirm("Bu dersi silmek istediğinize emin misiniz?")) return;
    try { await api.delete(`/dersler/${id}`); yukle(); }
    catch { alert("Silme başarısız"); }
  };

  const kolonlar = [
    { key: "ders_kodu", label: "Ders Kodu" },
    { key: "ad", label: "Ders Adı" },
    { key: "bolum", label: "Bölüm", render: v => v?.ad || "-" },
    { key: "kredi", label: "Kredi" },
    { key: "akts", label: "AKTS" },
    { key: "sinif_seviyesi", label: "Sınıf", render: v => v ?? "-" },
    { key: "tur", label: "Tür", render: v => <Badge color={v === "Zorunlu" ? "blue" : "purple"}>{v}</Badge> },
    { key: "ogretmen", label: "Öğretmen", render: v => v ? `${v.unvan ? v.unvan + " " : ""}${v.ad} ${v.soyad}` : "-" },
    { key: "ders_id", label: "İşlem", render: (id) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button size="sm" variant="danger" onClick={() => sil(id)}>Sil</Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Ders Yönetimi" subtitle={`${dersler.length} ders`} action={<Button onClick={() => setModal(true)}>+ Yeni Ders</Button>} />
      <Card>
        <div style={{ marginBottom: "16px" }}>
          <input value={araText} onChange={e => setAraText(e.target.value)} placeholder="Ders adı veya kodu ile ara..."
            style={{ padding: "9px 14px", border: "1px solid var(--border)", borderRadius: "8px", width: "300px", fontSize: "14px", outline: "none" }} />
        </div>
        <Table columns={kolonlar} data={dersler} loading={loading} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Yeni Ders Ekle" width="580px">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Ders Kodu" value={form.ders_kodu} onChange={e => setForm({...form, ders_kodu: e.target.value})} placeholder="BMU101" />
          <Select label="Tür" value={form.tur} onChange={e => setForm({...form, tur: e.target.value})}
            options={["Zorunlu", "Seçmeli", "Ortak Seçmeli"].map(t => ({ value: t, label: t }))} />
        </div>
        <Input label="Ders Adı" value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} placeholder="Veri Yapıları ve Algoritmalar" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Kredi" type="number" value={form.kredi} onChange={e => setForm({...form, kredi: Number(e.target.value)})} />
          <Input label="AKTS" type="number" value={form.akts} onChange={e => setForm({...form, akts: Number(e.target.value)})} />
        </div>
        <Select label="Sınıf" value={String(form.sinif_seviyesi)} onChange={e => setForm({...form, sinif_seviyesi: Number(e.target.value)})}
          options={[1,2,3,4].map(s => ({ value: String(s), label: s + ". Sınıf" }))} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Select label="Fakülte *" value={form.fakulte_id}
            onChange={e => setForm({...form, fakulte_id: e.target.value, bolum_id: "", ogretmen_id: ""})}
            options={[{ value: "", label: "Fakülte seçiniz" }, ...fakulteler.map(f => ({ value: f.fakulte_id, label: f.ad }))]} />
          <Select label="Bölüm *" value={form.bolum_id}
            onChange={e => setForm({...form, bolum_id: e.target.value, ogretmen_id: ""})}
            options={[{ value: "", label: form.fakulte_id ? "Bölüm seçiniz" : "Önce fakülte seçin" }, ...bolumler.map(b => ({ value: b.bolum_id, label: b.ad }))]}
            disabled={!form.fakulte_id} />
        </div>

        <Select
          label="Öğretmen *"
          value={form.ogretmen_id}
          onChange={e => setForm({...form, ogretmen_id: e.target.value})}
          disabled={!form.bolum_id}
          options={[
            { value: "", label: form.bolum_id ? "Öğretmen seçiniz" : "Önce bölüm seçin" },
            ...ogretmenler.map(o => ({ value: o.ogretmen_id, label: `${o.unvan ? o.unvan + " " : ""}${o.ad} ${o.soyad}` }))
          ]}
        />

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setModal(false)}>İptal</Button>
          <Button onClick={kaydet} disabled={kaydediliyor}>{kaydediliyor ? "Kaydediliyor..." : "Kaydet"}</Button>
        </div>
      </Modal>
    </div>
  );
}

export function Ogrenciler() {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [sonuc, setSonuc] = useState(null);
  const [fakulteler, setFakulteleler] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [form, setForm] = useState({
    ad: "", soyad: "", ogrenci_no: "", tc_kimlik: "",
    sinif: 1, kayit_tarihi: "",
    fakulte_id: "", bolum_id: "",
  });
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const yukle = () => {
    setLoading(true);
    api.get("/ogrenciler")
      .then(r => { const d = r.data; setOgrenciler(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    yukle();
    api.get("/fakulteler").then(r => setFakulteleler(Array.isArray(r.data) ? r.data : [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.fakulte_id) { setBolumler([]); setForm(f => ({...f, bolum_id: ""})); return; }
    api.get(`/bolumler?fakulte_id=${form.fakulte_id}`)
      .then(r => setBolumler(Array.isArray(r.data) ? r.data : []))
      .catch(console.error);
  }, [form.fakulte_id]);

  const kaydet = async () => {
    console.log("GİDEN VERİ:", {
    ad: form.ad,
    soyad: form.soyad,
    ogrenci_no: form.ogrenci_no,
    tc_kimlik: form.tc_kimlik,
    sinif: Number(form.sinif),
    kayit_tarihi: form.kayit_tarihi || null,
    fakulte_id: Number(form.fakulte_id),
    bolum_id: Number(form.bolum_id),
  });
    if (!form.ad || !form.soyad || !form.ogrenci_no || !form.tc_kimlik)
      return alert("Ad, soyad, öğrenci no ve TC zorunludur");
    if (!form.fakulte_id) return alert("Lütfen fakülte seçiniz");
    if (!form.bolum_id) return alert("Lütfen bölüm seçiniz");
    setKaydediliyor(true);
    try {
      const res = await api.post("/ogrenciler", {
        ad: form.ad, soyad: form.soyad,
        ogrenci_no: form.ogrenci_no, tc_kimlik: form.tc_kimlik,
        sinif: Number(form.sinif),
        kayit_tarihi: form.kayit_tarihi || null,
        fakulte_id: Number(form.fakulte_id), bolum_id: Number(form.bolum_id),
      });
      setSonuc(res.data);
      setModal(false);
      setForm({ ad: "", soyad: "", ogrenci_no: "", tc_kimlik: "", sinif: 1, kayit_tarihi: "", fakulte_id: "", bolum_id: "" });
      yukle();
    } catch (err) {
      alert(err.response?.data?.error || "Hata oluştu");
    } finally { setKaydediliyor(false); }
  };

  const sil = async (id) => {
    if (!confirm("Bu öğrenciyi silmek istediğinizden emin misiniz?")) return;
    try { await api.delete(`/ogrenciler/${id}`); yukle(); }
    catch { alert("Silme işlemi başarısız"); }
  };

  const kolonlar = [
    { key: "ogrenci_no", label: "Öğrenci No" },
    { key: "ad", label: "Ad Soyad", render: (_, r) => `${r.ad} ${r.soyad}` },
    { key: "bolum", label: "Bölüm", render: v => v?.ad || "-" },
    { key: "fakulte", label: "Fakülte", render: v => v?.ad || "-" },
    { key: "sinif", label: "Sınıf", render: v => v ? `${v}. Sınıf` : "-" },
    { key: "kayit_tarihi", label: "Kayıt Tarihi", render: v => v ? new Date(v).toLocaleDateString("tr-TR") : "-" },
    { key: "ogrenci_id", label: "İşlem", render: id => (
      <Button size="sm" variant="danger" onClick={() => sil(id)}>Sil</Button>
    )},
  ];

  return (
    <div>
      <PageHeader title="Öğrenciler" subtitle={`${ogrenciler.length} öğrenci`}
        action={<Button onClick={() => { setSonuc(null); setModal(true); }}>+ Yeni Öğrenci</Button>} />
      {sonuc && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
          <p style={{ fontWeight: "700", color: "#15803d", marginBottom: "10px" }}>✅ {sonuc.mesaj}</p>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "14px", border: "1px solid #bbf7d0" }}>
            <p style={{ fontSize: "13px", marginBottom: "6px" }}><strong>Öğrenciye verilecek giriş bilgileri:</strong></p>
            <p style={{ fontSize: "14px" }}>👤 {sonuc.giris_bilgisi?.kullanici_adi}</p>
            <p style={{ fontSize: "14px", marginTop: "4px" }}>🔑 {sonuc.giris_bilgisi?.sifre}</p>
          </div>
          <button onClick={() => setSonuc(null)} style={{ marginTop: "8px", background: "none", border: "none", color: "#64748b", fontSize: "12px", cursor: "pointer" }}>Kapat</button>
        </div>
      )}
      <Card><Table columns={kolonlar} data={ogrenciler} loading={loading} /></Card>
      <Modal open={modal} onClose={() => setModal(false)} title="Yeni Öğrenci Ekle" width="580px">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Ad" value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} placeholder="Ayşe" />
          <Input label="Soyad" value={form.soyad} onChange={e => setForm({...form, soyad: e.target.value})} placeholder="Kaya" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Öğrenci No" value={form.ogrenci_no} onChange={e => setForm({...form, ogrenci_no: e.target.value})} placeholder="220101001" />
          <Input label="TC Kimlik No" value={form.tc_kimlik} onChange={e => setForm({...form, tc_kimlik: e.target.value})} placeholder="12345678901" />
        </div>
        <Select label="Fakülte *" value={form.fakulte_id}
          onChange={e => setForm({...form, fakulte_id: e.target.value, bolum_id: ""})}
          options={[{ value: "", label: "Fakülte seçiniz" }, ...fakulteler.map(f => ({ value: f.fakulte_id, label: f.ad }))]} />
        <Select label="Bölüm *" value={form.bolum_id}
          onChange={e => setForm({...form, bolum_id: e.target.value})}
          options={[{ value: "", label: form.fakulte_id ? "Bölüm seçiniz" : "Önce fakülte seçin" }, ...bolumler.map(b => ({ value: b.bolum_id, label: b.ad }))]}
          disabled={!form.fakulte_id} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Select label="Sınıf" value={String(form.sinif)} onChange={e => setForm({...form, sinif: Number(e.target.value)})}
            options={[1,2,3,4].map(s => ({ value: String(s), label: s + ". Sınıf" }))} />
          <Input label="Kayıt Tarihi" type="date" value={form.kayit_tarihi} onChange={e => setForm({...form, kayit_tarihi: e.target.value})} />
        </div>
        <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#854d0e" }}>
          💡 Giriş bilgileri: Kullanıcı adı = Öğrenci No, Şifre = TC Kimlik No
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
          <Button variant="secondary" onClick={() => setModal(false)}>İptal</Button>
          <Button onClick={kaydet} disabled={kaydediliyor}>{kaydediliyor ? "Kaydediliyor..." : "Kaydet"}</Button>
        </div>
      </Modal>
    </div>
  );
}

export function KayitOnaylari() {
  const [kayitlar, setKayitlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("Bekliyor");

  const yukle = () => {
    setLoading(true);
    api.get(`/kayitlar?durum=${filtre}`)
      .then(r => setKayitlar(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { yukle(); }, [filtre]);

  const durumGuncelle = async (kayitId, durum) => {
    try {
      await api.put(`/kayitlar/${kayitId}/durum`, { durum });
      yukle();
    } catch (err) {
      alert(err.response?.data?.error || "İşlem başarısız");
    }
  };

  const kolonlar = [
    { key: "ogrenci", label: "Öğrenci No", render: v => v?.ogrenci_no || "-" },
    { key: "ogrenci", label: "Öğrenci", render: v => v ? `${v.ad} ${v.soyad}` : "-" },
    { key: "ogrenci", label: "Sınıf", render: v => v?.sinif ? `${v.sinif}. Sınıf` : "-" },
    { key: "ders", label: "Ders Kodu", render: v => v?.ders_kodu || "-" },
    { key: "ders", label: "Ders", render: v => v?.ad || "-" },
    { key: "ders", label: "Kredi", render: v => v?.kredi ?? "-" },
    { key: "talep_tarihi", label: "Talep Tarihi", render: v => v ? new Date(v).toLocaleDateString("tr-TR") : "-" },
    { key: "durum", label: "Durum", render: v => (
      <Badge color={v === "Onaylı" ? "green" : v === "Reddedildi" ? "red" : "yellow"}>{v}</Badge>
    )},
    { key: "kayit_id", label: "İşlem", render: (id, row) => row.durum === "Bekliyor" ? (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button size="sm" onClick={() => durumGuncelle(id, "Onaylı")}>Onayla</Button>
        <Button size="sm" variant="danger" onClick={() => durumGuncelle(id, "Reddedildi")}>Reddet</Button>
      </div>
    ) : "-" },
  ];

  return (
    <div>
      <PageHeader title="Kayıt Onayları" subtitle="Ders kayıt taleplerini onaylayın veya reddedin" />
      <Card>
        <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
          {["Bekliyor", "Onaylı", "Reddedildi"].map(d => (
            <Button key={d} size="sm" variant={filtre === d ? "primary" : "secondary"} onClick={() => setFiltre(d)}>{d}</Button>
          ))}
        </div>
        <Table columns={kolonlar} data={kayitlar} loading={loading} />
      </Card>
    </div>
  );
}

