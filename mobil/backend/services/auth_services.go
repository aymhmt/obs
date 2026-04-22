package services

import (
	"errors"

	"backend/models"
	"backend/repositories"
	"backend/utils"

	"golang.org/x/crypto/bcrypt"
)

func OgrenciLogin(req models.OgrenciLoginRequest) (*models.OgrenciLoginResponse, error) {
    ogrenci, sifreHash, err := repositories.GetOgrenciByNo(req.OgrenciNo)
    if err != nil {
        return nil, errors.New("öğrenci bulunamadı")
    }

    if err := bcrypt.CompareHashAndPassword([]byte(sifreHash), []byte(req.TCKimlik)); err != nil {
        return nil, errors.New("hatalı şifre")
    }

    token, err := utils.GenerateToken(ogrenci.OgrenciID, "ogrenci")
    if err != nil {
        return nil, err
    }

    return &models.OgrenciLoginResponse{Token: token, Ogrenci: *ogrenci}, nil
}