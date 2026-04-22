package repositories

import (
	"backend/config"
	"backend/models"
)

func GetAllDersler() ([]models.Ders, error) {
	rows, err := config.DB.Query(`
		SELECT ders_id, ders_kodu, ad, kredi, akts, tur, sinif_seviyesi,
		       fakulte_id, bolum_id, ogretmen_id, created_at
		FROM dersler ORDER BY ders_id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Ders
	for rows.Next() {
		var d models.Ders
		err := rows.Scan(&d.DersID, &d.DersKodu, &d.Ad, &d.Kredi, &d.Akts,
			&d.Tur, &d.SinifSeviyesi, &d.FakulteID, &d.BolumID, &d.OgretmenID, &d.CreatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, d)
	}
	return list, nil
}

func GetDerslerByOgrenci(sinif int, fakulteID int, bolumID int) ([]models.Ders, error) {
	rows, err := config.DB.Query(`
		SELECT ders_id, ders_kodu, ad, kredi, akts, tur, sinif_seviyesi,
		       fakulte_id, bolum_id, ogretmen_id, created_at
		FROM dersler
		WHERE sinif_seviyesi = $1
		  AND (fakulte_id = $2 OR fakulte_id IS NULL)
		  AND (bolum_id = $3 OR bolum_id IS NULL)
		ORDER BY ders_id
	`, sinif, fakulteID, bolumID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Ders
	for rows.Next() {
		var d models.Ders
		err := rows.Scan(&d.DersID, &d.DersKodu, &d.Ad, &d.Kredi, &d.Akts,
			&d.Tur, &d.SinifSeviyesi, &d.FakulteID, &d.BolumID, &d.OgretmenID, &d.CreatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, d)
	}
	return list, nil
}