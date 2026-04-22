package main

import (
	"log"
	"os"

	"backend/config"
	"backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println(".env yüklenemedi (opsiyonel)")
	}

	config.ConnectDB()
	r := gin.Default()

	routes.SetupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5005"
	}

	log.Println("Server running on :" + port)
	r.Run(":" + port)
}