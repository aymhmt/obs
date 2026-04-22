package controllers

import (
	"net/http"
	"strconv"

	"backend/repositories"

	"github.com/gin-gonic/gin"
)

func GetDersDetay(c *gin.Context) {
	dersID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz ders ID"})
		return
	}

	ogrenciID, err := strconv.Atoi(c.Query("ogrenci_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ogrenci_id gerekli"})
		return
	}

	detay, err := repositories.GetDersDetay(ogrenciID, dersID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": detay})
}