package repositories

import (
	"backend/config"
	"backend/models"
)

func GetAllDuyurular() ([]models.Duyuru, error) {
	rows, err := config.DB.Query(`SELECT id, created_at, duyuru::text FROM duyurular ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Duyuru
	for rows.Next() {
		var d models.Duyuru
		if err := rows.Scan(&d.ID, &d.CreatedAt, &d.Duyuru); err != nil {
			return nil, err
		}
		list = append(list, d)
	}
	return list, nil
}