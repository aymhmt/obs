package controllers

import (
	"net/http"
	"strconv"

	"backend/repositories"
	"github.com/gin-gonic/gin"
)

func GetDersler(c *gin.Context) {
	sinifStr := c.Query("sinif")
	fakulteStr := c.Query("fakulte_id")
	bolumStr := c.Query("bolum_id")

	if sinifStr != "" && fakulteStr != "" && bolumStr != "" {
		sinif, _ := strconv.Atoi(sinifStr)
		fakulteID, _ := strconv.Atoi(fakulteStr)
		bolumID, _ := strconv.Atoi(bolumStr)

		list, err := repositories.GetDerslerByOgrenci(sinif, fakulteID, bolumID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": list})
		return
	}

	list, err := repositories.GetAllDersler()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}

func GetOgrenciler(c *gin.Context) {
	list, err := repositories.GetAllOgrenciler()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}

func GetOgrenci(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	o, err := repositories.GetOgrenciByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Öğrenci bulunamadı"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": o})
}

func GetFakulteler(c *gin.Context) {
	list, err := repositories.GetAllFakulteler()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}

func GetBolumler(c *gin.Context) {
	list, err := repositories.GetAllBolumler()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}

func GetDersKayitlari(c *gin.Context) {
	list, err := repositories.GetAllDersKayitlari()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}

func GetNotlar(c *gin.Context) {
	ogrenciID, _ := strconv.Atoi(c.Query("ogrenci_id"))
	list, err := repositories.GetNotlarByOgrenci(ogrenciID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}

func GetDuyurular(c *gin.Context) {
	list, err := repositories.GetAllDuyurular()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}
