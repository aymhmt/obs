package routes

import (
	"backend/controllers"
	"backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")

	api.POST("/ogrenci-login", controllers.OgrenciLogin)

	protected := api.Group("/")
	protected.Use(middlewares.AuthRequired())
	{
		protected.GET("/ogrenciler", controllers.GetOgrenciler)
		protected.GET("/ogrenciler/:id", controllers.GetOgrenci)
		protected.GET("/dersler", controllers.GetDersler)
		protected.GET("/fakulteler", controllers.GetFakulteler)
		protected.GET("/bolumler", controllers.GetBolumler)
		protected.GET("/ders-kayitlari", controllers.GetDersKayitlari)
		protected.GET("/notlar", controllers.GetNotlar)
		protected.GET("/duyurular", controllers.GetDuyurular)
		protected.GET("/dersler/:id/detay", controllers.GetDersDetay)
	}
}