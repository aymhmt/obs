package repositories

import (
	"backend/config"
	"backend/models"
	"backend/utils"
)

func GetDersDetay(ogrenciID, dersID int) (*models.DersDetay, error) {
	row := config.DB.QueryRow(`
		SELECT d.ders_id, d.ders_kodu, d.ad, d.kredi, d.akts, d.tur, d.sinif_seviyesi,
		       COALESCE(o.ad, '') as ogretmen_ad,
		       COALESCE(o.soyad, '') as ogretmen_soyad
		FROM dersler d
		LEFT JOIN ogretmenler o ON d.ogretmen_id = o.ogretmen_id
		WHERE d.ders_id = $1
	`, dersID)

	var detay models.DersDetay
	err := row.Scan(
		&detay.DersID, &detay.DersKodu, &detay.Ad,
		&detay.Kredi, &detay.Akts, &detay.Tur, &detay.SinifSeviyesi,
		&detay.OgretmenAd, &detay.OgretmenSoyad,
	)
	if err != nil {
		return nil, err
	}

	rows, err := config.DB.Query(`
		SELECT n.id, st.ad, st.agirlik, n.sinav_notu
		FROM notlar n
		JOIN sinav_turleri st ON n.sinav_tur_id = st.tur_id
		WHERE n.ogrenci_id = $1 AND n.ders_id = $2
		ORDER BY st.agirlik DESC
	`, ogrenciID, dersID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tumNotlar []models.NotDetay
	var hasBut bool
	for rows.Next() {
		var n models.NotDetay
		if err := rows.Scan(&n.ID, &n.SinavTurAd, &n.Agirlik, &n.SinavNotu); err != nil {
			return nil, err
		}
		if n.SinavTurAd == "Bütünleme" {
			hasBut = true
		}
		tumNotlar = append(tumNotlar, n)
	}

	var toplam float64
	var toplamAgirlik float64
	for _, n := range tumNotlar {
		if hasBut && n.SinavTurAd == "Final" {
			n.AgirlikliNot = 0
			detay.Notlar = append(detay.Notlar, n)
			continue
		}
		n.AgirlikliNot = float64(n.SinavNotu) * n.Agirlik
		toplam += n.AgirlikliNot
		toplamAgirlik += n.Agirlik
		detay.Notlar = append(detay.Notlar, n)
	}

	if toplamAgirlik > 0 {
		detay.OrtalamaNot = toplam / toplamAgirlik
	}
	detay.HarfNotu = utils.HarfNotu(detay.OrtalamaNot)

	if detay.Notlar == nil {
		detay.Notlar = []models.NotDetay{}
	}

	return &detay, nil
}