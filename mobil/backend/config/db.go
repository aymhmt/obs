package config

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() {
	connStr := os.Getenv("DATABASE_URL")

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("DB bağlantı hatası:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("DB ping hatası:", err)
	}

	log.Println("Supabase DB connected ")
}