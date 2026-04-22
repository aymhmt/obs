package repositories

import (
	"backend/config"
	"backend/models"
)

func GetAllDersKayitlari() ([]models.DersKayit, error) {
	rows, err := config.DB.Query(`
		SELECT kayit_id, ogrenci_id, ders_id, durum, talep_tarihi, onay_tarihi
		FROM ders_kayitlari ORDER BY kayit_id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.DersKayit
	for rows.Next() {
		var k models.DersKayit
		err := rows.Scan(&k.KayitID, &k.OgrenciID, &k.DersID,
			&k.Durum, &k.TalepTarihi, &k.OnayTarihi)
		if err != nil {
			return nil, err
		}
		list = append(list, k)
	}
	return list, nil
}
