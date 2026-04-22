package repositories

import (
	"backend/config"
	"backend/models"
)

func GetNotlarByOgrenci(ogrenciID int) ([]models.Not, error) {
	rows, err := config.DB.Query(`
		SELECT id, ogrenci_id, ders_id, sinav_tur_id, sinav_notu, created_at
		FROM notlar WHERE ogrenci_id=$1 ORDER BY id
	`, ogrenciID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Not
	for rows.Next() {
		var n models.Not
		if err := rows.Scan(&n.ID, &n.OgrenciID, &n.DersID,
			&n.SinavTurID, &n.SinavNotu, &n.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, n)
	}
	return list, nil
}
