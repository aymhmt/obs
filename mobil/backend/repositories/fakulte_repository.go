package repositories

import (
	"backend/config"
	"backend/models"
)

func GetAllFakulteler() ([]models.Fakulte, error) {
	rows, err := config.DB.Query(`SELECT fakulte_id, ad, created_at FROM fakulteler ORDER BY fakulte_id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Fakulte
	for rows.Next() {
		var f models.Fakulte
		if err := rows.Scan(&f.FakulteID, &f.Ad, &f.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, f)
	}
	return list, nil
}

func GetAllBolumler() ([]models.Bolum, error) {
	rows, err := config.DB.Query(`SELECT bolum_id, fakulte_id, ad, created_at FROM bolumler ORDER BY bolum_id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Bolum
	for rows.Next() {
		var b models.Bolum
		if err := rows.Scan(&b.BolumID, &b.FakulteID, &b.Ad, &b.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, b)
	}
	return list, nil
}