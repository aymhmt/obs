package repositories

import (
	"backend/config"
	"backend/models"
)

func GetOgrenciByNo(ogrenciNo string) (*models.Ogrenci, string, error) {
    row := config.DB.QueryRow(`
        SELECT ogrenci_id, ogrenci_no, ad, soyad, sinif, fakulte_id, bolum_id, sifre_hash, created_at
        FROM ogrenciler WHERE ogrenci_no = $1
    `, ogrenciNo)

    var o models.Ogrenci
    var sifreHash string
    err := row.Scan(&o.OgrenciID, &o.OgrenciNo, &o.Ad, &o.Soyad,
        &o.Sinif, &o.FakulteID, &o.BolumID, &sifreHash, &o.CreatedAt)
    if err != nil {
        return nil, "", err
    }
    return &o, sifreHash, nil
}