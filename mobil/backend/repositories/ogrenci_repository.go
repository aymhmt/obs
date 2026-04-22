package repositories

import (
	"backend/config"
	"backend/models"
)

func GetAllOgrenciler() ([]models.Ogrenci, error) {
	rows, err := config.DB.Query(`
		SELECT ogrenci_id, ogrenci_no, ad, soyad, kayit_tarihi, sinif, fakulte_id, bolum_id, created_at
		FROM ogrenciler ORDER BY ogrenci_id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Ogrenci
	for rows.Next() {
		var o models.Ogrenci
		err := rows.Scan(&o.OgrenciID, &o.OgrenciNo, &o.Ad, &o.Soyad,
			&o.KayitTarihi, &o.Sinif, &o.FakulteID, &o.BolumID, &o.CreatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, o)
	}
	return list, nil
}

func GetOgrenciByID(id int) (*models.Ogrenci, error) {
	row := config.DB.QueryRow(`
		SELECT ogrenci_id, ogrenci_no, ad, soyad, kayit_tarihi, sinif, fakulte_id, bolum_id, created_at
		FROM ogrenciler WHERE ogrenci_id = $1
	`, id)

	var o models.Ogrenci
	err := row.Scan(&o.OgrenciID, &o.OgrenciNo, &o.Ad, &o.Soyad,
		&o.KayitTarihi, &o.Sinif, &o.FakulteID, &o.BolumID, &o.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &o, nil
}
