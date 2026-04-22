package models

import "time"

type LoginRequest struct {
	KullaniciAdi string `json:"kullanici_adi" binding:"required"`
	Sifre        string `json:"sifre" binding:"required"`
}

type LoginResponse struct {
	Token string     `json:"token"`
	User  Yonetici   `json:"user"`
}

type OgrenciLoginRequest struct {
	OgrenciNo string `json:"ogrenci_no" binding:"required"`
	TCKimlik  string `json:"tc_kimlik" binding:"required"`
}

type OgrenciLoginResponse struct {
	Token   string  `json:"token"`
	Ogrenci Ogrenci `json:"ogrenci"`
}

type Fakulte struct {
	FakulteID int       `json:"fakulte_id"`
	Ad        string    `json:"ad"`
	CreatedAt time.Time `json:"created_at"`
}

type Bolum struct {
	BolumID   int       `json:"bolum_id"`
	FakulteID int       `json:"fakulte_id"`
	Ad        string    `json:"ad"`
	CreatedAt time.Time `json:"created_at"`
}

type Ogrenci struct {
	OgrenciID   int        `json:"ogrenci_id"`
	OgrenciNo   string     `json:"ogrenci_no"`
	Ad          string     `json:"ad"`
	Soyad       string     `json:"soyad"`
	TCKimlik    string     `json:"tc_kimlik,omitempty"`
	SifreHash   string     `json:"-"`
	KayitTarihi time.Time  `json:"kayit_tarihi"`
	Sinif       int        `json:"sinif"`
	FakulteID   int        `json:"fakulte_id"`
	BolumID     int        `json:"bolum_id"`
	CreatedAt   time.Time  `json:"created_at"`
}

type Ogretmen struct {
	OgretmenID   int       `json:"ogretmen_id"`
	BolumID      *int      `json:"bolum_id,omitempty"`
	Ad           string    `json:"ad"`
	Soyad        string    `json:"soyad"`
	KullaniciAdi string    `json:"kullanici_adi"`
	SifreHash    string    `json:"-"`
	FakulteID    *int      `json:"fakulte_id,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

type Ders struct {
	DersID       int       `json:"ders_id"`
	DersKodu     string    `json:"ders_kodu"`
	Ad           string    `json:"ad"`
	Kredi        float64   `json:"kredi"`
	Akts         float64   `json:"akts"`
	Tur          string    `json:"tur"`
	SinifSeviyesi int      `json:"sinif_seviyesi"`
	FakulteID    *int      `json:"fakulte_id,omitempty"`
	BolumID      *int      `json:"bolum_id,omitempty"`
	OgretmenID   *int      `json:"ogretmen_id,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

type DersKayit struct {
	KayitID    int        `json:"kayit_id"`
	OgrenciID  int        `json:"ogrenci_id"`
	DersID     int        `json:"ders_id"`
	Durum      string     `json:"durum"`
	TalepTarihi time.Time `json:"talep_tarihi"`
	OnayTarihi  *time.Time `json:"onay_tarihi,omitempty"`
}

type Not struct {
	ID         int       `json:"id"`
	OgrenciID  int       `json:"ogrenci_id"`
	DersID     int       `json:"ders_id"`
	SinavTurID int       `json:"sinav_tur_id"`
	SinavNotu  int       `json:"sinav_notu"`
	CreatedAt  time.Time `json:"created_at"`
}

type SinavTuru struct {
	TurID   int     `json:"tur_id"`
	Ad      string  `json:"ad"`
	Agirlik float64 `json:"agirlik"`
}

type Yonetici struct {
	YoneticiID   int       `json:"yonetici_id"`
	KullaniciAdi string    `json:"kullanici_adi"`
	Rol          string    `json:"rol"`
	SonGiris     *time.Time `json:"son_giris,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

type Duyuru struct {
	ID        int64     `json:"id"`
	Duyuru    string     `json:"duyuru"` 
	CreatedAt time.Time `json:"created_at"`
}

type DersDetay struct {
	DersID        int     `json:"ders_id"`
	DersKodu      string  `json:"ders_kodu"`
	Ad            string  `json:"ad"`
	Kredi         float64 `json:"kredi"`
	Akts          float64 `json:"akts"`
	Tur           string  `json:"tur"`
	SinifSeviyesi int     `json:"sinif_seviyesi"`
	OgretmenAd    string  `json:"ogretmen_ad"`
	OgretmenSoyad string  `json:"ogretmen_soyad"`
	Notlar        []NotDetay `json:"notlar"`
	HarfNotu      string  `json:"harf_notu"`
	OrtalamaNot   float64 `json:"ortalama_not"`
}

type NotDetay struct {
	ID           int     `json:"id"`
	SinavTurAd   string  `json:"sinav_tur_ad"`
	Agirlik      float64 `json:"agirlik"`
	SinavNotu    int     `json:"sinav_notu"`
	AgirlikliNot float64 `json:"agirlikli_not"`
}